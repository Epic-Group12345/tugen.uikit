import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import type { TextSize } from '../tokens';
import { TONE_CLASS, type TextTone } from '../tone';
import { cx } from './cx';

// Подпись к элементу формы на Radix Label: это настоящий <label htmlFor>, нажатие на него браузер
// сам отдаёт полю, флажку или переключателю (у Radix это <button>, а кнопку подпись тоже нажимает).
// Своего реестра «подпись → элемент», как в лаунчере, здесь не нужно

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

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Неактивная подпись приглушена */
  disabled?: boolean;
  size?: TextSize;
  tone?: TextTone;
  ref?: React.Ref<HTMLLabelElement>;
}

/** Подпись поля или переключателя: text-sm, нажатие отдаётся элементу с id = htmlFor */
export const Label: React.FC<LabelProps> = ({
  disabled = false,
  size = 'sm',
  tone = 'default',
  className,
  ...props
}) => (
  <LabelPrimitive.Root
    {...props}
    aria-disabled={disabled || undefined}
    className={cx(
      SIZE_CLASS[size],
      TONE_CLASS[tone],
      'select-none',
      disabled && 'opacity-50 pointer-events-none',
      className,
    )}
  />
);
