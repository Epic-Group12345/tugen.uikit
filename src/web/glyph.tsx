import React from 'react';
import type { IconComponent } from '../components/icon';
import type * as Icons from './icons';

// Иконки веб-слоя — набор Gravity UI (@gravity-ui/icons). Компоненты Gravity принимают пропсы <svg>
// (width, height) и рисуют currentColor; glyph приводит их к IconComponent kit: size и className,
// а цвет берётся из класса text-*, который передаёт элемент kit, — как у Icons лаунчера

type GravityIcon = React.FC<React.SVGProps<SVGSVGElement>>;

export interface IconProps {
  /** Сторона в пикселях; сетка иконок — 16, поэтому резче всего 16, 32, 48 */
  size?: number;
  /** Классы Tailwind: цвет — text-*, по умолчанию цвет соседнего текста */
  className?: string;
  /**
   * Подпись для экранного диктора, если иконка — единственное содержимое (без неё иконка
   * считается украшением и скрыта от диктора)
   */
  'aria-label'?: string;
}

/** Иконка веб-слоя: компонент с size и className — подходит в icon у Button, Tabs, Pill… */
export type WebIcon = IconComponent & React.FC<IconProps>;

/** Имя иконки набора: 'Gear' — то же, что Icons.Gear */
export type IconName = keyof typeof Icons;

/** Иконка в каталоге: имя (Icons.<имя>), компонент, категории и ключевые слова Gravity UI */
export interface IconInfo {
  name: IconName;
  /** Та же иконка, что Icons.<имя> */
  icon: WebIcon;
  categories: readonly string[];
  keywords: readonly string[];
}

export const glyph = (Svg: GravityIcon): WebIcon => {
  const Icon: React.FC<IconProps> = ({
    size = 16,
    className,
    'aria-label': label,
  }) => (
    <Svg
      width={size}
      height={size}
      className={className}
      // Иконка без подписи — украшение: диктор читает текст рядом с ней
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable={false}
    />
  );
  return Icon;
};
