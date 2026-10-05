import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

/** Смысл цвета текста (DESIGN.md: «Текст» и «Смысловые цвета») */
export type TextTone =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'faint'
  | 'info'
  | 'success'
  | 'danger'
  | 'warning'
  | 'special'
  | 'onAccent';

// Классы целиком — иначе Uniwind их не найдёт при сборке
export const TONE_CLASS: Record<TextTone, string> = {
  default: 'text-mist-950 dark:text-mist-50',
  secondary: 'text-mist-700 dark:text-mist-300',
  muted: 'text-mist-500 dark:text-mist-400',
  faint: 'text-mist-400 dark:text-mist-500',
  info: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  danger: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  special: 'text-violet-700 dark:text-violet-400',
  onAccent: 'text-mist-50',
};

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';

const SIZE_CLASS: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export type TextWeight = 'regular' | 'semibold' | 'bold';

const WEIGHT_CLASS: Record<TextWeight, string> = {
  regular: '',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

// Моноширинный — только технические строки (пути, коды): font-mono на RNW не даёт шрифта Windows
const MONO = { fontFamily: 'Consolas' };

export interface TextProps extends RNTextProps {
  /** Размер по шкале Tailwind: sm — основной текст, xs — подписи */
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  /** Моноширинный: технические строки, коды */
  mono?: boolean;
  /** Заглавными: подпись раздела настроек */
  uppercase?: boolean;
  /** Дополнительные классы Uniwind: раскладка (flex-1) или свой цвет */
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  size = 'sm',
  weight = 'regular',
  tone = 'default',
  mono = false,
  uppercase = false,
  className = '',
  style,
  ...props
}) => (
  <RNText
    {...props}
    className={`${SIZE_CLASS[size]} ${WEIGHT_CLASS[weight]} ${
      TONE_CLASS[tone]
    } ${uppercase ? 'uppercase' : ''} ${className}`}
    style={mono ? [MONO, style] : style}
  />
);
