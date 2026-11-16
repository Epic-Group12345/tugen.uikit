import React, { useEffect, useRef } from 'react';
import { Animated as RNAnimated, Easing, View } from 'react-native';

// Движение компонентов Reusables на RN Animated — по правилам kit: только прозрачность на нативном драйвере.
// Заменяет react-native-reanimated, которого в kit нет. Пресеты появления и исчезновения (FadeIn и др.)
// здесь — описания с теми же цепочками методов (duration, delay, reduceMotion); анимируется прозрачность.
// Сдвиги Up/Down и раскладку по LinearTransition не считаем: значения сразу конечные. Хуки useSharedValue,
// useDerivedValue, withTiming сохраняют API.

export interface Preset {
  readonly name: string;
  readonly ms: number;
  duration(ms: number): Preset;
  delay(ms: number): Preset;
  reduceMotion(mode: unknown): Preset;
  springify(): Preset;
  withInitialValues(values: unknown): Preset;
}

const preset = (name: string, ms = 140): Preset => ({
  name,
  ms,
  duration: d => preset(name, d),
  delay: () => preset(name, ms),
  reduceMotion: () => preset(name, ms),
  springify: () => preset(name, ms),
  withInitialValues: () => preset(name, ms),
});

export const FadeIn = preset('FadeIn');
export const FadeOut = preset('FadeOut');
export const FadeInUp = preset('FadeInUp');
export const FadeInDown = preset('FadeInDown');
export const FadeOutUp = preset('FadeOutUp');
export const LinearTransition = preset('LinearTransition', 200);
export const ReduceMotion = { Never: 'never', System: 'system', Always: 'always' } as const;

export interface MotionProps {
  entering?: Preset;
  exiting?: Preset;
  layout?: Preset;
}

/** Появление по прозрачности: отметка «войти» стартует с нуля, остальное — сразу */
const useFadeIn = (entering: Preset | undefined) => {
  const opacity = useRef(new RNAnimated.Value(entering ? 0 : 1)).current;
  useEffect(() => {
    if (!entering) return;
    RNAnimated.timing(opacity, {
      toValue: 1,
      duration: entering.ms,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [entering, opacity]);
  return opacity;
};

/** Компонент с появлением: обёртка с прозрачностью вокруг исходного компонента (View, Pressable…) */
export function createAnimatedComponent<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P & MotionProps> {
  const Animated = React.forwardRef<unknown, P & MotionProps>(
    ({ entering, exiting: _exiting, layout: _layout, ...rest }, ref) => {
      const opacity = useFadeIn(entering);
      return (
        <RNAnimated.View style={{ opacity }}>
          <Component {...(rest as P)} ref={ref as never} />
        </RNAnimated.View>
      );
    },
  );
  Animated.displayName = 'AnimatedComponent';
  return Animated as unknown as React.ComponentType<P & MotionProps>;
}

const MotionView = createAnimatedComponent(View);

export const Animated = {
  View: MotionView,
  Text: RNAnimated.Text,
  createAnimatedComponent,
};

export default Animated;

/** Раскладка — только обёртка: порог «не анимировать вход у первого кадра» здесь не нужен */
export const LayoutAnimationConfig: React.FC<{ skipEntering?: boolean; children?: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

export const useSharedValue = <T,>(initial: T) => ({ value: initial });
export const useDerivedValue = <T,>(fn: () => T, _deps?: unknown) => ({ value: fn() });
export const useAnimatedStyle = <T,>(fn: () => T, _deps?: unknown): T => fn();
export const withTiming = <T,>(value: T, _config?: unknown) => value;
export const withSpring = <T,>(value: T, _config?: unknown) => value;
export const withRepeat = <T,>(value: T, _repeats?: number, _reverse?: boolean) => value;

/** Экстраполяция интерполяции: в kit значения конечные, поэтому режим только назван */
export const Extrapolation = { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" } as const;

/** Линейная интерполяция значения по отрезкам; без анимации (значение задано сразу) */
export const interpolate = (value: number, input: readonly number[], output: readonly number[], _extrapolation?: unknown): number => {
  if (input.length < 2 || output.length < 2) return output[0] ?? 0;
  const t = Math.min(Math.max(value, input[0]), input[input.length - 1]);
  const span = input[1] - input[0] || 1;
  return output[0] + ((t - input[0]) / span) * (output[1] - output[0]);
};
