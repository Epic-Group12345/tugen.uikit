import React, { useMemo } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { StateLayers, useAnimatedFlag, usePressFeedback } from '../animation';
import { useTheme } from '../theme';
import { motion, radius, type ColorRole } from '../tokens';
import type { IconComponent } from './icon';
import { Text } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'play';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  /** Момент нажатия, до отпускания — нужен кнопке, которая открывает меню */
  onPressIn?: () => void;
  /** primary — синяя, одно главное действие на экране; secondary — нейтральная; play — зелёная, только запуск игры */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  /** Неактивная кнопка приглушена и не нажимается */
  disabled?: boolean;
  /** Растянуть по ширине родителя (в ряду — flex: 1) */
  grow?: boolean;
  accessibilityLabel?: string;
}

// Слои фона: обычный → наведение → нажатие (на шаг темнее)
const LAYERS: Record<ButtonVariant, [ColorRole, ColorRole, ColorRole]> = {
  primary: ['accent', 'accentHover', 'accentPress'],
  play: ['play', 'playHover', 'playPress'],
  secondary: ['neutral', 'neutralHover', 'neutralPress'],
};

const CONTENT: Record<ButtonVariant, ColorRole> = {
  primary: 'textOnAccent',
  play: 'textOnAccent',
  secondary: 'textOnNeutral',
};

const PADDING: Record<
  ButtonSize,
  { paddingHorizontal: number; paddingVertical: number }
> = {
  sm: { paddingHorizontal: 12, paddingVertical: 6 },
  md: { paddingHorizontal: 16, paddingVertical: 8 },
};

const ROW = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
} as const;

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  onPressIn,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  grow = false,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const { hover, press, pressStyle, handlers } = usePressFeedback({ disabled });
  const [base, hovered, pressed] = LAYERS[variant];
  const content = colors[CONTENT[variant]];

  return (
    <Pressable
      {...handlers}
      onPressIn={() => {
        handlers.onPressIn();
        onPressIn?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      aria-disabled={disabled}
      onPress={onPress}
      disabled={disabled}
      style={grow ? { flex: 1 } : undefined}
    >
      <Animated.View
        style={[pressStyle, disabled && { opacity: motion.dimmed }]}
      >
        <StateLayers
          radius={radius.lg}
          layers={[
            { color: colors[base] },
            { color: colors[hovered], progress: hover },
            { color: colors[pressed], progress: press },
          ]}
        />
        <View style={[ROW, PADDING[size]]}>
          {Icon && <Icon size={14} color={content} />}
          <Text numberOfLines={1} style={{ color: content }}>
            {children}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export type IconTone = 'default' | 'danger' | 'success';

const ICON_TONE: Record<IconTone, ColorRole> = {
  default: 'textMuted',
  danger: 'iconDanger',
  success: 'success',
};

export interface IconButtonProps {
  icon: IconComponent;
  onPress?: () => void;
  onPressIn?: () => void;
  disabled?: boolean;
  /** Курсор навёлся на кнопку или ушёл с неё */
  onHoverChange?: (hovered: boolean) => void;
  /** danger — красная (выключенный микрофон, «завершить»), success — зелёная (включено) */
  tone?: IconTone;
  accessibilityLabel?: string;
}

/** Квадратная кнопка-иконка без фона: фон проявляется при наведении */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onPress,
  onPressIn,
  disabled = false,
  onHoverChange,
  tone = 'default',
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const { hover, press, handlers } = usePressFeedback({ disabled });
  const dim = useAnimatedFlag(disabled, { in: 150 });
  // Интерполяции — одни на кнопку: новые на каждый рендер заставляли бы нативный драйвер
  // пересоздавать узлы анимации
  const style = useMemo(
    () => ({
      opacity: dim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }),
      transform: [
        {
          scale: press.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.9],
          }),
        },
      ],
    }),
    [dim, press],
  );

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      aria-disabled={disabled}
      onHoverIn={() => {
        handlers.onHoverIn();
        onHoverChange?.(true);
      }}
      onHoverOut={() => {
        handlers.onHoverOut();
        onHoverChange?.(false);
      }}
      onPressIn={() => {
        handlers.onPressIn();
        onPressIn?.();
      }}
    >
      <Animated.View style={style}>
        <StateLayers
          radius={radius.lg}
          layers={[
            { color: colors.hover, progress: hover },
            { color: colors.press, progress: press },
          ]}
        />
        <View style={{ padding: 6 }}>
          <Icon size={16} color={colors[ICON_TONE[tone]]} />
        </View>
      </Animated.View>
    </Pressable>
  );
};
