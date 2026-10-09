import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import * as PopoverPrimitive from '@rn-primitives/popover';
import { useAppear } from '../animation';
import {
  isNativePrimitive,
  useDismissLayer,
  useFloatingStyle,
  type Align,
} from '../layers';
import { RadiusScope } from '../radius';
import { motion } from '../tokens';
import { Text } from './text';

// Всплывающая карточка у кнопки на @rn-primitives/popover: доступность (role, aria-expanded,
// возврат фокуса) и состояние — из примитива, а положение, Escape и оформление — kit.
// Нужен PopupHost в корне приложения

// Нативная версия примитива (RNW, тесты) или веб на Radix — от этого зависят положение и Escape
const native = isNativePrimitive(PopoverPrimitive.Content);

/** Корень: держит открыто / закрыто. Внутри — PopoverTrigger и PopoverContent */
export const Popover = PopoverPrimitive.Root;
/** Кнопка, которая открывает карточку. asChild — отдать нажатие своему элементу (Button) */
export const PopoverTrigger = PopoverPrimitive.Trigger;
/** Закрыть карточку изнутри. asChild — своей кнопкой */
export const PopoverClose = PopoverPrimitive.Close;

export interface PopoverContentProps {
  /** Сторона кнопки; если там нет места, карточка встанет напротив */
  side?: 'top' | 'bottom';
  /** Выравнивание вдоль кнопки */
  align?: Align;
  /** Зазор от кнопки, DIP */
  sideOffset?: number;
  /** Ширина и раскладка классами Uniwind (w-72, gap-2) */
  className?: string;
  /** Имя своего PortalHost, если окно рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

// Окно — как меню: rounded-xl и p-1. Кнопки и плашки у края окна по правилу радиусов получают
// 12 − 4 = 8 (rounded-lg) через RadiusScope; текст отступает дальше — в PopoverBody
const RADIUS = 'xl';
const PADDING = '1';

/** Карточка у кнопки: текст, строки «подпись — значение», небольшая форма */
export const PopoverContent: React.FC<PopoverContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  className = '',
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = PopoverPrimitive.useRootContext();
  const style = useFloatingStyle(root, {
    side,
    align,
    offset: sideOffset,
    margin: 8,
    enabled: native,
  });
  useDismissLayer(root.open, () => root.onOpenChange(false), { skip: !native });
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <PopoverPrimitive.Overlay
        style={native ? StyleSheet.absoluteFill : undefined}
      >
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          disablePositioningStyle={native}
          style={style}
          aria-label={accessibilityLabel}
        >
          <Appear>
            <RadiusScope radius={RADIUS} padding={PADDING}>
              <View
                className={`gap-1 p-1 rounded-xl border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900 ${className}`}
              >
                {typeof children === 'string' ? (
                  <PopoverBody>{children}</PopoverBody>
                ) : (
                  children
                )}
              </View>
            </RadiusScope>
          </Appear>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Overlay>
    </PopoverPrimitive.Portal>
  );
};

/**
 * Плавное появление всплывающего окна: только прозрачность — окно может встать с любой стороны
 * кнопки, и сдвиг вышел бы не туда
 */
export const Appear: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const shown = useAppear(motion.appear);
  return <Animated.View style={{ opacity: shown }}>{children}</Animated.View>;
};

/**
 * Текстовая часть карточки: заголовок и абзац с отступом от края. Строка — абзацем, иначе как есть
 */
export const PopoverBody: React.FC<{
  title?: string;
  children?: React.ReactNode;
}> = ({ title, children }) => (
  <View className="gap-1.5 px-2.5 py-2">
    {title ? <Text weight="semibold">{title}</Text> : null}
    {typeof children === 'string' ? (
      <Text size="xs" tone="secondary" className="leading-5">
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

/** Строка «подпись — значение» внутри PopoverBody */
export const PopoverRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View className="flex-row justify-between gap-3">
    <Text size="xs" tone="muted">
      {label}
    </Text>
    <Text size="xs" weight="semibold">
      {value}
    </Text>
  </View>
);
