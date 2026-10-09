import React, { createContext, useContext, useMemo } from 'react';
import source from '../tokens/tokens.json';

// Правило скругления вложенных элементов: внешний радиус = внутренний радиус + отступ между
// ними. Тогда края внутреннего элемента идут параллельно краям внешнего, а не «расходятся» в углу.
// Контейнер (меню, окно, дорожка переключателя) объявляет свой радиус и отступ через
// RadiusScope, а элементы, которые прилегают к его краям (пункты меню, сегменты, кнопки в углу
// окна), берут радиус из useInnerRadius — так правило держится само, а не пересчитывается руками

export type RadiusStep = keyof typeof source.radius;
export type SpaceStep = keyof typeof source.space;

/** Шкала скруглений, DIP: как rounded-* в Tailwind 4 */
export const RADIUS: Record<RadiusStep, number> = source.radius;
/** Шкала отступов, DIP: как p-* в Tailwind (шаг 4) */
export const SPACE: Record<SpaceStep, number> = source.space;

/** Радиус «круглого» элемента: всё, что не меньше, — rounded-full */
const FULL = RADIUS.full;

// Классы целиком — иначе Uniwind их не найдёт при сборке
export const RADIUS_CLASS: Record<RadiusStep, string> = {
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
};

export const PADDING_CLASS: Record<SpaceStep, string> = {
  '0': 'p-0',
  '0.5': 'p-0.5',
  '1': 'p-1',
  '1.5': 'p-1.5',
  '2': 'p-2',
  '2.5': 'p-2.5',
  '3': 'p-3',
  '3.5': 'p-3.5',
  '4': 'p-4',
  '5': 'p-5',
  '6': 'p-6',
  '8': 'p-8',
};

/** Радиус или отступ: шаг шкалы ('xl', '1') или число DIP */
export type RadiusValue = RadiusStep | number;
export type SpaceValue = SpaceStep | number;

export const toRadius = (value: RadiusValue) =>
  typeof value === 'number' ? value : RADIUS[value];
export const toSpace = (value: SpaceValue) =>
  typeof value === 'number' ? value : SPACE[value];

/**
 * Радиус элемента внутри контейнера: внешний минус отступ, не меньше нуля. Круглый контейнер
 * даёт круглый элемент: у капсулы радиус — половина высоты, и вложенная капсула тоже круглая
 */
export const innerRadius = (outer: RadiusValue, padding: SpaceValue) => {
  const r = toRadius(outer);
  return r >= FULL ? FULL : Math.max(0, r - toSpace(padding));
};

/** Радиус контейнера вокруг элемента: внутренний плюс отступ */
export const outerRadius = (inner: RadiusValue, padding: SpaceValue) => {
  const r = toRadius(inner);
  return r >= FULL ? FULL : r + toSpace(padding);
};

/** Шаг шкалы с этим радиусом, если он есть: 8 → 'lg' */
export const radiusStep = (px: number): RadiusStep | undefined => {
  if (px >= FULL) {
    return 'full';
  }
  return (Object.keys(RADIUS) as RadiusStep[]).find(k => RADIUS[k] === px);
};

/**
 * Скругление для элемента: класс Uniwind, если радиус есть на шкале, иначе стиль с числом —
 * радиус вне шкалы получается, когда отступ контейнера не из шага 4
 */
export const radiusProps = (px: number) => {
  const step = radiusStep(px);
  return step
    ? { className: RADIUS_CLASS[step], style: undefined }
    : { className: '', style: { borderRadius: px } };
};

interface Scope {
  /** Радиус контейнера, DIP */
  radius: number;
  /** Отступ от края контейнера до вложенных элементов, DIP */
  padding: number;
}

const ScopeContext = createContext<Scope | null>(null);

export interface RadiusScopeProps {
  /** Скругление контейнера */
  radius: RadiusValue;
  /** Отступ от края контейнера до вложенных элементов */
  padding: SpaceValue;
  children: React.ReactNode;
}

/**
 * Контейнер со скруглением radius и отступом padding: вложенные элементы получат радиус
 * radius − padding (useInnerRadius). Рамку не рисует — только объявляет размеры
 */
export const RadiusScope: React.FC<RadiusScopeProps> = ({
  radius,
  padding,
  children,
}) => {
  const r = toRadius(radius);
  const p = toSpace(padding);
  const value = useMemo(() => ({ radius: r, padding: p }), [r, p]);
  return (
    <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>
  );
};

/**
 * Радиус элемента, который прилегает к краям контейнера: из ближайшего RadiusScope по правилу
 * вложенности, а вне контейнера — fallback. Возвращает число DIP; класс — radiusProps
 */
export const useInnerRadius = (fallback: RadiusValue) => {
  const scope = useContext(ScopeContext);
  return scope ? innerRadius(scope.radius, scope.padding) : toRadius(fallback);
};

/** Есть ли вокруг контейнер с объявленным скруглением */
export const useRadiusScope = () => useContext(ScopeContext);
