import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { motion } from './tokens';

// Анимации kit — только opacity и transform на нативном драйвере: в RNW они идут в Windows
// Composition, не завися от JS-потока. Цвета не анимируются: их меняют слои с прозрачностью
// (StateLayers). В вебе нативного драйвера нет — react-native-web предупреждал бы о нём

export const nativeDriver = Platform.OS !== 'web';

interface FlagTiming {
  /** Длительность включения, мс */
  in?: number;
  /** Длительность выключения, мс (по умолчанию как in) */
  out?: number;
}

/** Плавный флаг: Animated.Value, который едет к 1, когда on = true, и к 0 — когда false */
export const useAnimatedFlag = (
  on: boolean,
  {
    in: durationIn = motion.appear,
    out: durationOut = durationIn,
  }: FlagTiming = {},
) => {
  const value = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(value, {
      toValue: on ? 1 : 0,
      duration: on ? durationIn : durationOut,
      easing: Easing.out(Easing.quad),
      useNativeDriver: nativeDriver,
      // Не регистрировать в InteractionManager: иначе каждое наведение откладывало бы
      // задачи runAfterInteractions
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [on, value, durationIn, durationOut]);

  return value;
};

/** Плавное появление при монтировании: для меню, окон и уведомлений */
export const useAppear = (duration = motion.appear) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);
  return useAnimatedFlag(visible, { in: duration });
};

/**
 * Значение нативной анимации сдвига: только натив, JS-копия всегда 0. RNW складывает transform
 * из props с нативной анимацией, а в props уходит JS-копия значения — после setValue(v) любая
 * перерисовка сдвинула бы вид ещё раз. Держим её нулём
 */
const setNativeOnly = (value: Animated.Value, v: number) => {
  value.setValue(v);
  if (nativeDriver) {
    (value as unknown as { _value: number })._value = 0;
  }
};

const flipEasing = Easing.inOut(Easing.cubic);

/**
 * Переезд вида на новое место в раскладке (приём FLIP): раскладка меняется сразу, а вид сдвигаем
 * на прежнее место и плавно возвращаем к нулю. В покое сдвиг 0: RNW ищет, куда попала мышь, по
 * раскладке без transform. position — координата вида по одной оси
 */
export const useFlipOffset = (position: number, duration = motion.layout) => {
  // Нативное с самого начала: иначе setValue до первого запуска ушёл бы по JS-пути в props
  const offset = useRef(
    new Animated.Value(0, { useNativeDriver: nativeDriver }),
  ).current;
  const previous = useRef(position);
  const running = useRef<{ from: number; start: number } | null>(null);

  useLayoutEffect(() => {
    const delta = position - previous.current;
    previous.current = position;
    if (delta === 0) {
      return;
    }
    // Текущий сдвиг считаем сами: из натива значение приходит только асинхронно (в RNW — никогда)
    let current = 0;
    if (running.current) {
      const t = Math.min(1, (Date.now() - running.current.start) / duration);
      current = running.current.from * (1 - flipEasing(t));
    }
    offset.stopAnimation();
    const run = { from: current - delta, start: Date.now() };
    running.current = run;
    setNativeOnly(offset, run.from);

    Animated.timing(offset, {
      toValue: 0,
      duration,
      easing: flipEasing,
      useNativeDriver: nativeDriver,
      isInteraction: false,
    }).start(({ finished }) => {
      if (finished && running.current === run) {
        running.current = null;
      }
    });
  }, [position, duration, offset]);

  return offset;
};

/**
 * Наведение и нажатие для Pressable: hover: в Uniwind нет, а active: не анимируется, поэтому
 * состояния — вручную. handlers раздаём в Pressable, hover / press — плавные флаги для
 * StateLayers, pressStyle — лёгкое «вдавливание» (scale), одно на компонент
 */
export const usePressFeedback = ({ disabled = false, scale = 0.97 } = {}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const hover = useAnimatedFlag(hovered && !disabled, {
    in: motion.hoverIn,
    out: motion.hoverOut,
  });
  const press = useAnimatedFlag(pressed && !disabled, {
    in: motion.pressIn,
    out: motion.pressOut,
  });
  const pressStyle = useMemo(
    () => ({
      transform: [
        {
          scale: press.interpolate({
            inputRange: [0, 1],
            outputRange: [1, scale],
          }),
        },
      ],
    }),
    [press, scale],
  );

  return {
    hovered: hovered && !disabled,
    pressed: pressed && !disabled,
    hover,
    press,
    pressStyle,
    handlers: {
      // Без своего оформления Fabric «сплющивает» Pressable, и на Windows пропадает наведение
      collapsable: false,
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      onPressIn: () => setPressed(true),
      onPressOut: () => setPressed(false),
    },
  };
};

export interface StateLayer {
  /** Классы Uniwind слоя, например "bg-mist-200 dark:bg-mist-800" */
  className: string;
  /** Прозрачность слоя (0..1); без неё слой виден всегда — это базовый фон */
  progress?: Animated.Value | Animated.AnimatedInterpolation<number>;
}

/**
 * Фон из слоёв-состояний: каждый слой залит своим цветом из классов, а плавно меняется только
 * его прозрачность. Так цвета остаются в Uniwind (включая dark:), а переходы анимируются.
 * Слои лежат по порядку: последний — сверху. Родитель задаёт размер (слои — absolute)
 */
export const StateLayers: React.FC<{
  layers: StateLayer[];
  className?: string;
}> = ({ layers, className = '' }) => (
  <>
    {layers.map((layer, i) => (
      <Animated.View
        key={i}
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          layer.progress !== undefined && { opacity: layer.progress },
        ]}
      >
        {/* Классы — на обычном View: Animated.View из react-native Uniwind не оборачивает */}
        <View className={`flex-1 ${className} ${layer.className}`} />
      </Animated.View>
    ))}
  </>
);
