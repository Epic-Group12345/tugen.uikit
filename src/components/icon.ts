import type React from 'react';

/**
 * Иконка для элементов kit: компонент с размером и классами Uniwind — как `Icons.<Имя>` лаунчера
 * (`components/icons`). Цвет иконки берётся из класса `text-*`, который передаёт элемент kit,
 * поэтому он совпадает с цветом соседнего текста
 */
export type IconComponent = React.ComponentType<{
  size?: number;
  className?: string;
}>;
