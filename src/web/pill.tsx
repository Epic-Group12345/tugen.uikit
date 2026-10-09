import React from 'react';
import { cx } from './cx';

export type PillTone =
  | 'neutral'
  | 'amber'
  | 'green'
  | 'red'
  | 'violet'
  | 'danger';

// Фон и текст метки: цвет с прозрачностью фона, danger — сплошной красный (мошенничество).
// Классы целиком — иначе Tailwind их не найдёт при сборке
const TONES: Record<PillTone, string> = {
  neutral: 'bg-mist-200 dark:bg-mist-800 text-mist-600 dark:text-mist-400',
  amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  green: 'bg-green-500/15 text-green-700 dark:text-green-400',
  red: 'bg-red-500/15 text-red-700 dark:text-red-400',
  violet: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  danger: 'bg-red-600 text-mist-50',
};

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
}

/** Метка-«пилюля»: категория, лицензия, онлайн */
export const Pill: React.FC<PillProps> = ({
  tone = 'neutral',
  className,
  ...props
}) => (
  <span
    {...props}
    className={cx(
      // inline-flex: метка стоит в строке текста и не растягивается в колонке
      'inline-flex flex-row items-center gap-1 self-start px-1.5 py-0.5 rounded-md text-xs whitespace-nowrap',
      TONES[tone],
      className,
    )}
  />
);
