import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  View,
  type GestureResponderEvent,
} from 'react-native';
import {
  StateLayers,
  useAnimatedFlag,
  useFlipOffset,
  usePressFeedback,
} from '../animation';
import { motion } from '../tokens';
import type { IconComponent } from './icon';
import { Text } from './text';

const DIMMED = { opacity: motion.dimmed };

// Переключатель «вкл / выкл»: дорожка с бегунком, включённый — синий. Бегунок стоит на месте
// раскладкой (отступом), а едет FLIP-сдвигом, который в покое 0: сдвиг из флага (0…1) держал бы
// в props JS-копию стартового значения, а RNW складывает её с нативной (см. lib/animation).
// Цвет дорожки — слоями прозрачности, а не сменой класса: иначе он прыгал бы раньше бегунка

const TRACK = { width: 36, height: 20 };
const KNOB = 16;
const PAD = 2;
const TRAVEL = TRACK.width - KNOB - PAD * 2;

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  disabled = false,
  accessibilityLabel,
}) => {
  const { hover, pressStyle, handlers } = usePressFeedback({
    disabled,
    scale: 0.94,
  });
  const on = useAnimatedFlag(value, { in: motion.toggle });
  const shift = useFlipOffset(value ? TRAVEL : 0, motion.toggle);
  const knob = useMemo(
    () => ({
      marginLeft: value ? TRAVEL : 0,
      transform: [{ translateX: shift }],
    }),
    [value, shift],
  );
  return (
    <Pressable
      {...handlers}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      aria-checked={value}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={disabled ? DIMMED : undefined}
    >
      <Animated.View
        style={[TRACK, pressStyle]}
        className="rounded-full p-0.5 overflow-hidden"
      >
        <StateLayers
          className="rounded-full"
          layers={[
            { className: 'bg-mist-300 dark:bg-mist-700' },
            { className: 'bg-blue-500', progress: on },
            { className: 'bg-mist-950/10 dark:bg-mist-50/10', progress: hover },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[{ width: KNOB, height: KNOB }, knob]}
        >
          <View className="flex-1 rounded-full bg-mist-50" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  accessibilityLabel?: string;
}

const THUMB = 12;

/**
 * Ползунок: нажатие ставит значение, протягивание меняет. Дорожка с заливкой до значения и
 * кружок. Место касания берём от самой дорожки: у заливки и кружка pointerEvents='none'
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  onChange,
  accessibilityLabel,
}) => {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const share =
    max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;

  const pick = (e: GestureResponderEvent) => {
    const w = widthRef.current;
    if (w > 0) {
      const x = Math.max(0, Math.min(w, e.nativeEvent.locationX));
      onChange(min + (x / w) * (max - min));
    }
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: Math.round(value) }}
      onLayout={e => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={pick}
      onResponderMove={pick}
      className="h-6 justify-center"
    >
      <View
        pointerEvents="none"
        className="h-1 rounded-full bg-mist-200 dark:bg-mist-800 overflow-hidden"
      >
        <View
          style={{ width: width * share }}
          className="h-full bg-mist-950 dark:bg-mist-50"
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          left: Math.max(0, width * share - THUMB / 2),
          width: THUMB,
          height: THUMB,
        }}
        className="absolute rounded-full bg-mist-950 dark:bg-mist-50"
      />
    </View>
  );
};

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: IconComponent;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const Segment: React.FC<{
  label: string;
  icon?: IconComponent;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, icon: Icon, isActive, onPress }) => {
  const { hovered, hover, press, pressStyle, handlers } = usePressFeedback();
  const active = useAnimatedFlag(isActive, {
    in: motion.layout,
    out: motion.deselect,
  });
  // Иконка и подпись одного цвета: яркие у выбранного варианта и при наведении
  const content =
    isActive || hovered
      ? 'text-mist-950 dark:text-mist-50'
      : 'text-mist-500 dark:text-mist-400';

  return (
    <Pressable
      {...handlers}
      accessibilityRole="radio"
      aria-checked={isActive}
      onPress={onPress}
      className="flex-1"
    >
      <Animated.View style={pressStyle}>
        <StateLayers
          className="rounded-full"
          layers={[
            { className: 'bg-mist-300 dark:bg-mist-700', progress: hover },
            { className: 'bg-mist-50 dark:bg-mist-700', progress: active },
            { className: 'bg-mist-300 dark:bg-mist-600', progress: press },
          ]}
        />
        <View className="flex-row items-center justify-center gap-1.5 px-3 py-1.5">
          {Icon && <Icon size={14} className={content} />}
          <Text numberOfLines={1} className={content}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

/** Выбор одного варианта из нескольких кнопками в ряд (переключатель темы в настройках) */
export const Segmented = <T extends string>({
  options,
  value,
  onChange,
}: SegmentedProps<T>) => (
  <View
    accessibilityRole="radiogroup"
    className="flex-row gap-0.5 p-0.5 rounded-full bg-mist-200 dark:bg-mist-800"
  >
    {options.map(option => (
      <Segment
        key={option.value}
        label={option.label}
        icon={option.icon}
        isActive={option.value === value}
        onPress={() => onChange(option.value)}
      />
    ))}
  </View>
);

export interface CheckRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Галочка выбранного: `Icons.Check` лаунчера. Без неё — своя из уголка */
  checkIcon?: IconComponent;
}

// Галочка из двух сторон повёрнутого прямоугольника: так kit не зависит от набора иконок
const CheckMark: React.FC = () => (
  <View
    style={{
      width: 5,
      height: 9,
      marginTop: -2,
      transform: [{ rotate: '45deg' }],
    }}
    className="border-r-2 border-b-2 border-mist-50"
  />
);

/** Флажок с подписью и пояснением: нажимается вся строка (наборы модов в новой сборке) */
export const CheckRow: React.FC<CheckRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  checkIcon: CheckIcon,
}) => {
  const { hover, handlers } = usePressFeedback({ disabled });
  return (
    <Pressable
      {...handlers}
      accessibilityRole="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={disabled ? DIMMED : undefined}
    >
      <StateLayers
        className="rounded-lg"
        layers={[
          { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
        ]}
      />
      <View className="flex-row items-start gap-3 px-2 py-2">
        <View
          className={`mt-0.5 w-5 h-5 items-center justify-center rounded-md border ${
            checked
              ? 'bg-blue-500 border-blue-500'
              : 'border-mist-300 dark:border-mist-700'
          }`}
        >
          {checked &&
            (CheckIcon ? (
              <CheckIcon size={12} className="text-mist-50" />
            ) : (
              <CheckMark />
            ))}
        </View>
        <View className="flex-1 gap-0.5">
          <Text>{label}</Text>
          {description ? (
            <Text size="xs" tone="muted">
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
