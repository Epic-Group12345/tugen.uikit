import React from 'react';
import type { TextSize } from '../tokens';
import { TONE_CLASS, type TextTone } from '../tone';
import { cx } from './cx';

// Текст веб-слоя: те же размеры, насыщенность и цвета, что у Text лаунчера (DESIGN.md: «Текст»)

export type { TextTone };
export type TextWeight = 'regular' | 'semibold' | 'bold';

// Классы целиком — иначе Tailwind их не найдёт при сборке
const SIZE_CLASS: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const WEIGHT_CLASS: Record<TextWeight, string> = {
  regular: '',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

type TextTag = 'span' | 'p' | 'div' | 'label' | 'h1' | 'h2' | 'h3' | 'h4';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Тег: span по умолчанию, p — абзац, h1…h4 — заголовки */
  as?: TextTag;
  /** Размер по шкале Tailwind: sm — основной текст, xs — подписи */
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  /** Моноширинный: технические строки, коды */
  mono?: boolean;
  /** Заглавными: подпись раздела настроек */
  uppercase?: boolean;
  /** Одной строкой с многоточием (numberOfLines={1} лаунчера) */
  truncate?: boolean;
}

export const Text: React.FC<TextProps & { ref?: React.Ref<HTMLElement> }> = ({
  as: Tag = 'span',
  size = 'sm',
  weight = 'regular',
  tone = 'default',
  mono = false,
  uppercase = false,
  truncate = false,
  className,
  ...props
}) => (
  <Tag
    {...(props as React.HTMLAttributes<HTMLElement>)}
    className={cx(
      SIZE_CLASS[size],
      WEIGHT_CLASS[weight],
      TONE_CLASS[tone],
      mono && 'font-mono',
      uppercase && 'uppercase',
      truncate && 'truncate',
      className,
    )}
  />
);
