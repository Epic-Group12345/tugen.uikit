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
import { useTheme } from '../theme';
import { motion, radius } from '../tokens';
import type { IconComponent } from './icon';
import { Text } from './text';

const DIMMED = { opacity: motion.dimmed };

// Переключатель «вкл / выкл»: дорожка с бегунком, включённый — синий. Бегунок стоит на месте
// отступом, а едет FLIP-сдвигом, который в покое 0 (см. useFlipOffset). Цвет дорожки — слоями
// прозрачности, а не сменой цвета: иначе он прыгал бы раньше бегунка

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
  const { colors } = useTheme();
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
        style={[
          TRACK,
          { padding: PAD, borderRadius: radius.full, overflow: 'hidden' },
          pressStyle,
        ]}
      >
        <StateLayers
          radius={radius.full}
          layers={[
            { color: colors.track },
            { color: colors.accent, progress: on },
            { color: colors.press, progress: hover },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            {
              width: KNOB,
              height: KNOB,
              borderRadius: radius.full,
              backgroundColor: colors.knob,
            },
            knob,
          ]}
        />
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
 * Ползунок: нажатие ставит значение, протягивание меняет. Место касания берём от самой
 * дорожки: у заливки и кружка pointerEvents='none'
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  onChange,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
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
      style={{ height: 24, justifyContent: 'center' }}
    >
      <View
        pointerEvents="none"
        style={{
          height: 4,
          borderRadius: radius.full,
          backgroundColor: colors.neutral,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: width * share,
            height: '100%',
            backgroundColor: colors.sliderFill,
          }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: Math.max(0, width * share - THUMB / 2),
          width: THUMB,
          height: THUMB,
          borderRadius: radius.full,
          backgroundColor: colors.sliderFill,
        }}
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
  const { colors } = useTheme();
  const { hovered, hover, press, pressStyle, handlers } = usePressFeedback();
  const active = useAnimatedFlag(isActive, {
    in: motion.layout,
    out: motion.deselect,
  });
  // Иконка и подпись одного цвета: яркие у выбранного варианта и при наведении
  const content = isActive || hovered ? colors.text : colors.textMuted;

  return (
    <Pressable
      {...handlers}
      accessibilityRole="radio"
      aria-checked={isActive}
      onPress={onPress}
      style={{ flex: 1 }}
    >
      <Animated.View style={pressStyle}>
        <StateLayers
          radius={radius.full}
          layers={[
            { color: colors.segmentHover, progress: hover },
            { color: colors.segmentActive, progress: active },
            { color: colors.segmentPress, progress: press },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          {Icon && <Icon size={14} color={content} />}
          <Text numberOfLines={1} style={{ color: content }}>
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
}: SegmentedProps<T>) => {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      style={{
        flexDirection: 'row',
        gap: 2,
        padding: 2,
        borderRadius: radius.full,
        backgroundColor: colors.neutral,
      }}
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
};

export interface CheckRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

// Галочка из двух сторон повёрнутого прямоугольника: так kit не зависит от набора иконок
const CheckMark: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      width: 5,
      height: 9,
      marginTop: -2,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderColor: color,
      transform: [{ rotate: '45deg' }],
    }}
  />
);

/** Флажок с подписью и пояснением: нажимается вся строка */
export const CheckRow: React.FC<CheckRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  const { colors } = useTheme();
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
        radius={radius.lg}
        layers={[{ color: colors.hover, progress: hover }]}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            marginTop: 2,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: checked ? colors.accent : colors.track,
            backgroundColor: checked ? colors.accent : undefined,
          }}
        >
          {checked && <CheckMark color={colors.textOnAccent} />}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
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
