import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import type { ViewStyle } from 'react-native';

// Общий слой всех всплывающих окон kit: и своих (Popup), и построенных на @rn-primitives
// (Popover, DropdownMenu, Select, Tooltip, Dialog…). Здесь три вещи:
// - размер области окон — его меряет PopupHost. @rn-primitives прижимает окна к размеру
//   экрана (Dimensions 'screen'), а на Windows это весь монитор, а не окно приложения;
// - стопка открытых окон: Escape (dismissPopup) закрывает верхнее, смена размера — все;
// - размещение окна у якоря: под ним, над ним, сбоку, в пределах области

export interface Size {
  width: number;
  height: number;
}

let host: Size = { width: 0, height: 0 };
const hostListeners = new Set<() => void>();
const subscribeHost = (listener: () => void) => {
  hostListeners.add(listener);
  return () => {
    hostListeners.delete(listener);
  };
};
const getHost = () => host;

/** Новый размер области окон (зовёт PopupHost). Открытые окна закрываются: якоря уехали */
export const setHostSize = (size: Size) => {
  if (size.width === host.width && size.height === host.height) {
    return;
  }
  const resized = host.width > 0 || host.height > 0;
  host = size;
  hostListeners.forEach(listener => listener());
  if (resized) {
    dismissAllLayers();
  }
};

/** Размер области окон: всё окно приложения. 0×0, пока PopupHost не измерен */
export const useHostSize = () =>
  useSyncExternalStore(subscribeHost, getHost, getHost);

interface Layer {
  id: number;
  close: () => void;
}

// Открытые окна по порядку открытия: последнее — сверху
let layers: Layer[] = [];
let nextLayerId = 1;

/**
 * Закрыть верхнее окно, как по Escape. true — было что закрывать. В RNW клавиши приходят фокусу,
 * поэтому Escape ловит корень приложения и зовёт эту функцию; в вебе PopupHost слушает сам
 */
export const dismissTopLayer = () => {
  const top = layers[layers.length - 1];
  top?.close();
  return top !== undefined;
};

/** Закрыть все окна сверху вниз */
export const dismissAllLayers = () => {
  [...layers].reverse().forEach(layer => layer.close());
};

/** Есть ли открытые окна */
export const hasOpenLayers = () => layers.length > 0;

/**
 * Какая версия примитива @rn-primitives подключена: нативная (dialog.js) или веб (dialog.web.js,
 * на Radix). Выбирает бандлер по платформе, поэтому смотрим на сам компонент — у нативных
 * displayName вида 'ContentNativePopover'. Веб-версия сама ставит окна и ловит Escape
 */
export const isNativePrimitive = (component: { displayName?: string }) =>
  !/Web/.test(component.displayName ?? '');

/**
 * Окно в стопке, пока open: dismissTopLayer закроет его, если оно верхнее. close держим по ссылке —
 * новая функция на каждый рендер не переставляет окно в стопке. skip — окно закрывается само
 * (веб-версия @rn-primitives: Radix ловит Escape)
 */
export const useDismissLayer = (
  open: boolean,
  close: () => void,
  { skip = false } = {},
) => {
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (!open || skip) {
      return;
    }
    const layer = { id: nextLayerId++, close: () => closeRef.current() };
    layers = [...layers, layer];
    return () => {
      layers = layers.filter(l => l.id !== layer.id);
    };
  }, [open, skip]);
};

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

/** Якорь окна, DIP относительно окна приложения — как отдают measure и measureInWindow */
export interface Anchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlaceOptions {
  /** Сторона якоря; если там не помещается, а напротив помещается — окно встаёт напротив */
  side?: Side;
  /** Выравнивание вдоль якоря */
  align?: Align;
  /** Зазор между якорем и окном */
  offset?: number;
  /** Сдвиг вдоль якоря */
  alignOffset?: number;
  /** Отступ от краёв области, ближе которого окно не подходит */
  margin?: number;
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(v, Math.max(min, max)));

const opposite: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/** Место окна size у якоря в области area: левый верхний угол и сторона, где оно встало */
export const placeFloating = (
  anchor: Anchor,
  size: Size,
  area: Size,
  {
    side = 'bottom',
    align = 'start',
    offset = 4,
    alignOffset = 0,
    margin = 0,
  }: PlaceOptions = {},
): { left: number; top: number; side: Side } => {
  const vertical = side === 'top' || side === 'bottom';
  // Место по главной оси для каждой стороны
  const at: Record<Side, number> = {
    bottom: anchor.y + anchor.height + offset,
    top: anchor.y - offset - size.height,
    right: anchor.x + anchor.width + offset,
    left: anchor.x - offset - size.width,
  };
  const fits = (s: Side) =>
    s === 'bottom'
      ? at.bottom + size.height <= area.height - margin
      : s === 'top'
      ? at.top >= margin
      : s === 'right'
      ? at.right + size.width <= area.width - margin
      : at.left >= margin;
  const placed = !fits(side) && fits(opposite[side]) ? opposite[side] : side;

  // Поперечная ось: выравнивание по якорю
  const [start, length, extent] = vertical
    ? [anchor.x, anchor.width, size.width]
    : [anchor.y, anchor.height, size.height];
  const cross =
    (align === 'start'
      ? start
      : align === 'center'
      ? start + length / 2 - extent / 2
      : start + length - extent) + alignOffset;

  const main = at[placed];
  const [left, top] = vertical ? [cross, main] : [main, cross];
  return {
    left: clamp(left, margin, area.width - size.width - margin),
    top: clamp(top, margin, area.height - size.height - margin),
    side: placed,
  };
};

/** Поля корня @rn-primitives, по которым окно встаёт у кнопки */
export interface PrimitivePosition {
  triggerPosition: {
    pageX: number;
    pageY: number;
    width: number;
    height: number;
  } | null;
  contentLayout: { width: number; height: number } | null;
}

const HIDDEN: ViewStyle = { position: 'absolute', opacity: 0, left: 0, top: 0 };

/**
 * Положение содержимого окна @rn-primitives: наше вместо встроенного (у того — размер экрана,
 * а не окна, и нет переворота на другую сторону). Передайте в Content
 * disablePositioningStyle и этот стиль. Пока размер окна не измерен, оно невидимо.
 * enabled = false — веб-версия примитива: Radix ставит окна сам, стиль пустой
 */
export const useFloatingStyle = (
  { triggerPosition, contentLayout }: PrimitivePosition,
  options: PlaceOptions & { enabled?: boolean },
): ViewStyle | undefined => {
  const area = useHostSize();
  const { side, align, offset, alignOffset, margin, enabled = true } = options;
  return useMemo(() => {
    if (!enabled) {
      return undefined;
    }
    if (!triggerPosition || !contentLayout) {
      return HIDDEN;
    }
    const { left, top } = placeFloating(
      {
        x: triggerPosition.pageX,
        y: triggerPosition.pageY,
        width: triggerPosition.width,
        height: triggerPosition.height,
      },
      contentLayout,
      area,
      { side, align, offset, alignOffset, margin },
    );
    return { position: 'absolute', left, top };
  }, [
    triggerPosition,
    contentLayout,
    area,
    side,
    align,
    offset,
    alignOffset,
    margin,
    enabled,
  ]);
};
