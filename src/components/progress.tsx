import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, View, type LayoutChangeEvent } from 'react-native';
import * as ProgressPrimitive from '@rn-primitives/progress';
import { nativeDriver } from '../animation';
import { motion } from '../tokens';

// Полоса прогресса на @rn-primitives/progress: role progressbar, aria-valuenow / valuemax и
// accessibilityValue — из примитива. Заливка всегда во всю ширину дорожки и сдвигается влево
// translateX на долю «недобора»: ширину не анимируем (это не transform), а сдвиг идёт на
// нативном драйвере. Дорожка с overflow-hidden прячет уехавшую часть

export type ProgressTone = 'accent' | 'play' | 'warning' | 'danger';

// Классы целиком — иначе Uniwind их не найдёт при сборке
const FILL: Record<ProgressTone, string> = {
  accent: 'bg-blue-500',
  play: 'bg-green-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export interface ProgressProps {
  /** Значение 0..max; вне диапазона прижимается к краю */
  value?: number;
  max?: number;
  tone?: ProgressTone;
  /** Неизвестно, сколько осталось: бегущая полоса */
  indeterminate?: boolean;
  /** Ширина и отступы классами Uniwind; высота дорожки — h-1.5, можно заменить (h-1) */
  className?: string;
  /** Текст значения для экранного диктора: (value, max) → «3 из 10 файлов» */
  getValueLabel?: (value: number, max: number) => string;
  accessibilityLabel?: string;
}

/** Длительность изменения значения и круга бегущей полосы, мс */
const RUN_MS = 1200;
/** Доля ширины бегущей полосы */
const RUNNER = 0.4;

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  tone = 'accent',
  indeterminate = false,
  className = '',
  getValueLabel,
  accessibilityLabel,
}) => {
  const [width, setWidth] = useState(0);
  const clamped = Math.max(0, Math.min(max, value));
  const share = max > 0 ? clamped / max : 0;

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <ProgressPrimitive.Root
      value={indeterminate ? null : clamped}
      max={max}
      getValueLabel={getValueLabel}
      aria-label={accessibilityLabel}
      aria-busy={indeterminate || undefined}
      asChild
    >
      <View
        onLayout={onLayout}
        className={`h-1.5 rounded-full overflow-hidden bg-mist-200 dark:bg-mist-800 ${className}`}
      >
        {/* Пока ширина не измерена, заливку не показываем: без неё сдвиг был бы нулевым и полоса
            мелькнула бы полной */}
        {width > 0 ? (
          indeterminate ? (
            <Runner width={width} fill={FILL[tone]} />
          ) : (
            <Fill width={width} share={share} fill={FILL[tone]} />
          )
        ) : null}
      </View>
    </ProgressPrimitive.Root>
  );
};

const Fill: React.FC<{ width: number; share: number; fill: string }> = ({
  width,
  share,
  fill,
}) => {
  // Стартуем с текущего значения: при появлении полоса не «доезжает» от нуля
  const progress = useRef(new Animated.Value(share)).current;
  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: share,
      duration: motion.layout,
      easing: Easing.out(Easing.quad),
      useNativeDriver: nativeDriver,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [share, progress]);
  const style = useMemo(
    () => ({
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        },
      ],
    }),
    [progress, width],
  );
  return (
    <Animated.View
      style={[
        { position: 'absolute', top: 0, bottom: 0, left: 0, width },
        style,
      ]}
    >
      <ProgressPrimitive.Indicator asChild>
        <View className={`flex-1 rounded-full ${fill}`} />
      </ProgressPrimitive.Indicator>
    </Animated.View>
  );
};

/** Бегущая полоса: от левого края за правый по кругу, только translateX */
const Runner: React.FC<{ width: number; fill: string }> = ({ width, fill }) => {
  const run = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(run, {
        toValue: 1,
        duration: RUN_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: nativeDriver,
        isInteraction: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [run]);
  const runner = width * RUNNER;
  const style = useMemo(
    () => ({
      transform: [
        {
          translateX: run.interpolate({
            inputRange: [0, 1],
            outputRange: [-runner, width],
          }),
        },
      ],
    }),
    [run, runner, width],
  );
  return (
    <Animated.View
      style={[
        { position: 'absolute', top: 0, bottom: 0, left: 0, width: runner },
        style,
      ]}
    >
      <ProgressPrimitive.Indicator asChild>
        <View className={`flex-1 rounded-full ${fill}`} />
      </ProgressPrimitive.Indicator>
    </Animated.View>
  );
};
