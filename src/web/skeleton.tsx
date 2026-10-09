import React from 'react';
import { cx } from './cx';

export interface SkeletonProps {
  /** Размер классами (w-24 h-3) — под то, что появится на этом месте */
  className?: string;
  /** Скругление классом */
  rounded?: string;
  /** Размер стилем, когда он считается на ходу */
  style?: React.CSSProperties;
}

/**
 * Заглушка на месте того, что ещё грузится: серый блок, мягко пульсирует прозрачностью
 * (animate-tg-shimmer). Вместо спиннера. Диктору не видна — пусть занятость объявляет контейнер
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'rounded-md',
  style,
}) => (
  <div
    aria-hidden
    className={cx(
      'bg-mist-200 dark:bg-mist-800 animate-tg-shimmer',
      rounded,
      className,
    )}
    style={style}
  />
);

// Ширина строк абзаца: последняя короче — как у настоящего текста
const LINE_WIDTHS = ['100%', '94%', '97%', '60%'] as const;
const lineWidth = (i: number, lines: number) =>
  i === lines - 1 ? LINE_WIDTHS[3] : LINE_WIDTHS[i % 3];

/** Абзац текста: lines полос, промежутки — под text-sm leading-6 */
export const SkeletonLines: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => (
  <div aria-hidden className={cx('flex flex-col gap-3 py-1.5', className)}>
    {Array.from({ length: lines }, (_, i) => (
      // Ширина в процентах вычисляется — стилем, высота h-3 — классом
      <Skeleton
        key={i}
        rounded="rounded-full"
        className="h-3"
        style={{ width: lineWidth(i, lines) }}
      />
    ))}
  </div>
);
