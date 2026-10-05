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
import { useTheme } from '../theme';
import { radius as radii } from '../tokens';

// Период пульсации, мс: от бледного к яркому и обратно
const PULSE_MS = 1400;

// Одна пульсация на все заглушки: мигают в такт, и в Composition — одна анимация на всё
const pulse = new Animated.Value(0, { useNativeDriver: nativeDriver });
const pulseOpacity = pulse.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [0.45, 1, 0.45],
});
let pulseLoop: Animated.CompositeAnimation | null = null;
let mounted = 0;

// Пульсация идёт, пока на экране есть хоть одна заглушка
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
  /** Размер — под то, что появится на этом месте */
  style?: StyleProp<ViewStyle>;
  radius?: number;
}

/** Заглушка на месте того, что ещё грузится: серый блок, мягко пульсирует. Вместо спиннера */
export const Skeleton: React.FC<SkeletonProps> = ({
  style,
  radius = radii.md,
}) => {
  const { colors } = useTheme();
  usePulse();
  return (
    <View style={style}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: pulseOpacity,
            backgroundColor: colors.neutral,
            borderRadius: radius,
          },
        ]}
      />
    </View>
  );
};

// Ширина строк абзаца: последняя короче — как у настоящего текста
const LINE_WIDTHS = ['100%', '94%', '97%'] as const;

/** Абзац текста: lines полос */
export const SkeletonLines: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <View style={{ gap: 12, paddingVertical: 6 }}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        radius={radii.full}
        style={{
          height: 12,
          width: i === lines - 1 ? '60%' : LINE_WIDTHS[i % 3],
        }}
      />
    ))}
  </View>
);
