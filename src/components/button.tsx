import React, { useMemo } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { StateLayers, useAnimatedFlag, usePressFeedback } from '../animation';
import type { IconComponent } from './icon';
import { Text } from './text';

export type ButtonVariant = 'primary' | 'secondary' | 'play';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps {
  children?: React.ReactNode;
  onPress?: () => void;
  /** Момент нажатия, до отпускания — нужен кнопке, которая открывает меню (useDropdownMenu) */
  onPressIn?: () => void;
  /** primary — синяя, одно главное действие на экране; secondary — нейтральная; play — зелёная, только запуск игры */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  /** Неактивная кнопка приглушена и не нажимается */
  disabled?: boolean;
  /** Растянуть по ширине родителя (в ряду — flex-1) */
  grow?: boolean;
  accessibilityLabel?: string;
}

// Слои фона по варианту: обычный → наведение → нажатие. Классы целиком — иначе Uniwind их не найдёт
const LAYERS: Record<ButtonVariant, [string, string, string]> = {
  primary: ['bg-blue-500', 'bg-blue-600', 'bg-blue-700'],
  play: ['bg-green-600', 'bg-green-700', 'bg-green-800'],
  secondary: [
    'bg-mist-200 dark:bg-mist-800',
    'bg-mist-300 dark:bg-mist-700',
    'bg-mist-400 dark:bg-mist-600',
  ],
};

const CONTENT: Record<ButtonVariant, string> = {
  primary: 'text-mist-50',
  play: 'text-mist-50',
  secondary: 'text-mist-900 dark:text-mist-100',
};

const PADDING: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
};

const DIMMED = { opacity: 0.5 };

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
  const { hover, press, pressStyle, handlers } = usePressFeedback({ disabled });
  const [base, hovered, pressed] = LAYERS[variant];

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
      className={grow ? 'flex-1' : undefined}
    >
      <Animated.View style={[pressStyle, disabled && DIMMED]}>
        <StateLayers
          className="rounded-lg"
          layers={[
            { className: base },
            { className: hovered, progress: hover },
            { className: pressed, progress: press },
          ]}
        />
        <View
          className={`flex-row items-center justify-center gap-1.5 ${PADDING[size]}`}
        >
          {Icon && <Icon size={14} className={CONTENT[variant]} />}
          <Text numberOfLines={1} className={CONTENT[variant]}>
            {children}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export type IconTone = 'default' | 'danger' | 'success';

// Классы целиком — иначе Uniwind их не найдёт при сборке
const ICON_TONE: Record<IconTone, string> = {
  default: 'text-mist-500 dark:text-mist-400',
  danger: 'text-red-500 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
};

export interface IconButtonProps {
  icon: IconComponent;
  onPress?: () => void;
  /** Момент нажатия, до отпускания */
  onPressIn?: () => void;
  /** Неактивная кнопка приглушена и не нажимается */
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
  const { hover, press, handlers } = usePressFeedback({ disabled });
  const dim = useAnimatedFlag(disabled, { in: 150 });
  // Интерполяции — одни на кнопку: новые на каждый рендер (а он на каждое наведение)
  // заставляли бы нативный драйвер пересоздавать узлы анимации
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
          className="rounded-lg"
          layers={[
            { className: 'bg-mist-100/0 dark:bg-mist-900/0' },
            { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
            { className: 'bg-mist-950/10 dark:bg-mist-50/10', progress: press },
          ]}
        />
        <View className="p-1.5">
          <Icon size={16} className={ICON_TONE[tone]} />
        </View>
      </Animated.View>
    </Pressable>
  );
};
