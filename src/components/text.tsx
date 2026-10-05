import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme';
import {
  text,
  weight as weights,
  type ColorRole,
  type TextSize,
} from '../tokens';

/** Смысл цвета текста — роль темы (DESIGN.md: «Текст» и «Смысловые цвета») */
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

export const TONE_ROLE: Record<TextTone, ColorRole> = {
  default: 'text',
  secondary: 'textSecondary',
  muted: 'textMuted',
  faint: 'textFaint',
  info: 'info',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  special: 'special',
  onAccent: 'textOnAccent',
};

export const MONO_FONT = 'Consolas';

export interface TextProps extends RNTextProps {
  /** Размер по шкале Tailwind: sm — основной текст, xs — подписи */
  size?: TextSize;
  weight?: keyof typeof weights;
  tone?: TextTone;
  /** Моноширинный: технические строки, коды */
  mono?: boolean;
  /** Заглавными: подпись раздела настроек */
  uppercase?: boolean;
  align?: 'auto' | 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
  size = 'sm',
  weight = 'regular',
  tone = 'default',
  mono = false,
  uppercase = false,
  align,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  return (
    <RNText
      {...props}
      style={[
        text[size],
        {
          color: colors[TONE_ROLE[tone]],
          fontWeight: weights[weight],
          textAlign: align,
        },
        mono && { fontFamily: MONO_FONT },
        uppercase && { textTransform: 'uppercase' },
        style,
      ]}
    />
  );
};
