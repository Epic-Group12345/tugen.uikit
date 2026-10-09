import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { TONE_CLASS, type TextTone } from '../tone';

export { TONE_CLASS, type TextTone };

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
