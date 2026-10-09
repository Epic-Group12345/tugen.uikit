import React, { useEffect, useRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cx } from './cx';

// Полоса прогресса на Radix Progress: role progressbar, aria-valuenow / valuemax и data-state —
// из примитива. Заливка всегда во всю ширину дорожки и сдвигается влево translateX на долю
// «недобора» (проценты translateX — от своей ширины, поэтому мерить дорожку не нужно). Ширину не
// анимируем — только transform; дорожка с overflow-hidden прячет уехавшую часть

export type ProgressTone = 'accent' | 'play' | 'warning' | 'danger';

// Классы целиком — иначе Tailwind их не найдёт при сборке
const FILL: Record<ProgressTone, string> = {
  accent: 'bg-blue-500',
  play: 'bg-green-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export interface ProgressProps {
  /** Значение 0..max; вне диапазона прижимается к краю */
  value?: number;
  max?: number;
  tone?: ProgressTone;
  /** Неизвестно, сколько осталось: бегущая полоса */
  indeterminate?: boolean;
  /** Ширина и отступы классами; высота дорожки — h-1.5, можно заменить (h-1) */
  className?: string;
  /** Текст значения для экранного диктора: (value, max) → «3 из 10 файлов» */
  getValueLabel?: (value: number, max: number) => string;
  'aria-label'?: string;
}

/** Круг бегущей полосы, мс */
const RUN_MS = 1200;

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  tone = 'accent',
  indeterminate = false,
  className,
  getValueLabel,
  'aria-label': ariaLabel,
}) => {
  const clamped = Math.max(0, Math.min(max, value));
  const share = max > 0 ? clamped / max : 0;
  return (
    <ProgressPrimitive.Root
      value={indeterminate ? null : clamped}
      max={max}
      getValueLabel={getValueLabel}
      aria-label={ariaLabel}
      aria-busy={indeterminate || undefined}
      className={cx(
        'relative h-1.5 rounded-full overflow-hidden bg-mist-200 dark:bg-mist-800',
        className,
      )}
    >
      {indeterminate ? (
        <Runner fill={FILL[tone]} />
      ) : (
        <ProgressPrimitive.Indicator
          // Значение меняется плавно (180 мс, motion.layout); при появлении — сразу на месте
          className={cx(
            'absolute inset-0 rounded-full transition-transform duration-180 ease-out',
            FILL[tone],
          )}
          style={{ transform: `translateX(${(share - 1) * 100}%)` }}
        />
      )}
    </ProgressPrimitive.Root>
  );
};

/**
 * Бегущая полоса шириной 40% дорожки: от левого края за правый по кругу, только translateX.
 * Через Web Animations, а не keyframes: так не нужен отдельный @keyframes в tugen.css
 * (−100% — полоса левее дорожки, 250% — правее: дорожка в 2,5 раза шире полосы)
 */
const Runner: React.FC<{ fill: string }> = ({ fill }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    // В jsdom Web Animations нет; при «уменьшить движение» полоса стоит посередине
    if (!el || typeof el.animate !== 'function') {
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = 'translateX(75%)';
      return;
    }
    const run = el.animate(
      [{ transform: 'translateX(-100%)' }, { transform: 'translateX(250%)' }],
      { duration: RUN_MS, easing: 'ease-in-out', iterations: Infinity },
    );
    return () => run.cancel();
  }, []);
  return (
    <ProgressPrimitive.Indicator
      ref={ref}
      className={cx('absolute inset-y-0 left-0 w-2/5 rounded-full', fill)}
    />
  );
};
