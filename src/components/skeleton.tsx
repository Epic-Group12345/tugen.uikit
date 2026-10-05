import React, { useEffect } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { nativeDriver } from '../animation';

// Период пульсации, мс: от бледного к яркому и обратно
const PULSE_MS = 1400;

// Одна пульсация на все заглушки: мигают в такт, а не вразнобой, и в Composition — одна
// анимация на всё приложение. Нативная с самого начала (см. useFlipOffset в animation)
const pulse = new Animated.Value(0, { useNativeDriver: nativeDriver });
const pulseOpacity = pulse.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [0.45, 1, 0.45],
});
let pulseLoop: Animated.CompositeAnimation | null = null;
let mounted = 0;

// Пульсация идёт, пока на экране есть хоть одна заглушка: пустой бесконечный цикл держал бы
// видеокарту занятой зря
const usePulse = () => {
  useEffect(() => {
    mounted += 1;
    if (!pulseLoop) {
      pulseLoop = Animated.loop(
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: nativeDriver,
          isInteraction: false,
        }),
      );
      pulseLoop.start();
    }
    return () => {
      mounted -= 1;
      if (!mounted && pulseLoop) {
        pulseLoop.stop();
        pulseLoop = null;
        pulse.setValue(0);
      }
    };
  }, []);
};

export interface SkeletonProps {
  /** Размер классами (w-24 h-3) — под то, что появится на этом месте */
  className?: string;
  /** Скругление классом */
  rounded?: string;
  /** Размер стилем, когда он считается на ходу */
  style?: StyleProp<ViewStyle>;
}

/**
 * Заглушка на месте того, что ещё грузится: серый блок, мягко пульсирует. Вместо спиннера.
 * Классы — на обычном View: Animated.View из react-native Uniwind не оборачивает
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  rounded = 'rounded-md',
  style,
}) => {
  usePulse();
  return (
    <View className={className} style={style}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity: pulseOpacity }]}
      >
        <View className={`flex-1 bg-mist-200 dark:bg-mist-800 ${rounded}`} />
      </Animated.View>
    </View>
  );
};

// Ширина строк абзаца: последняя короче — как у настоящего текста
const LINE_WIDTHS = ['100%', '94%', '97%', '60%'] as const;
const lineStyle = (i: number, lines: number) => ({
  height: 12,
  width: i === lines - 1 ? LINE_WIDTHS[3] : LINE_WIDTHS[i % 3],
});

/** Абзац текста: lines полос, промежутки — под text-sm leading-6 */
export const SkeletonLines: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <View className="gap-3 py-1.5">
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton key={i} rounded="rounded-full" style={lineStyle(i, lines)} />
    ))}
  </View>
);
