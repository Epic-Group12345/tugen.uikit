import React, { useMemo } from 'react';
import { PixelRatio, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useResolveClassNames } from 'uniwind';
import {
  dropRings,
  insetRings,
  makeGlass,
  type Glass,
  type GlassCorner,
  type GlassShadow,
  type GlassSide,
  type ShadowRing,
} from '../glass';

// Стекло слоями View (lib/glass, DESIGN.md «Статичное стекло») — один код для macOS и Windows.
// Бутерброд во весь элемент, слои друг на друге, без отступов:
// 1. GlassBase — внешняя тень (кольца в полосах вокруг элемента) и затемнение;
// 2. содержимое;
// 3, 4… GlassInner — внутренние тени поверх содержимого (рамки по краю и скруглению элемента).
// Кольца заданы отступами от краёв, без размеров: тени рисуются в том же кадре, что и элемент.
// Скругление у всех слоёв — скругление самого элемента: его класс (rounded-…) или style (useGlassRadius).
// Слои не ловят мышь. Тень и overflow: hidden — на разных View: react-native-macos падает на виде
// с обоими (pages/player/cover.tsx)

/**
 * Скругление элемента — для его слоёв стекла: из style, если задано там (он главнее класса, как у самого
 * View), иначе из класса rounded-… (rounded-full Uniwind отдаёт числом 99999 — React Native сам
 * уменьшает его до половины стороны)
 */
export const useGlassRadius = (className?: string, style?: StyleProp<ViewStyle>): number => {
  const resolved = useResolveClassNames(className ?? '') as ViewStyle;
  const own = StyleSheet.flatten(style)?.borderRadius;
  const radius = typeof own === 'number' ? own : resolved.borderRadius;
  return typeof radius === 'number' ? radius : 0;
};

/**
 * Элемент со слоями стекла — без своего скругления (style после класса): react-native-windows обрезает
 * детей вида со скруглением даже без overflow: hidden, и внешняя тень за краем пропадала. Скругление
 * берут сами слои (useGlassRadius — из класса или style до этой замены); фон элемента — слой заливки
 */
export const GLASS_HOST: ViewStyle = { borderRadius: 0 };

/**
 * Плавающая плашка (острова, карточки поверх страницы): заливка #17191A и тень из макета 0 0 4
 * neutral/950. Не boxShadow: Fabric в react-native-windows рисует его прямоугольником, и у скруглённых
 * углов плашки торчали тёмные углы тени
 */
export const GLASS_FLOATING: Glass = makeGlass({
  fill: '#17191A',
  drop: { x: 0, y: 0, blur: 4, spread: 0, color: '#0A0A0A', opacity: 1 },
});

interface GlassPartProps {
  glass: Glass;
  /** Скругление элемента в DIP (useGlassRadius) */
  radius: number;
}

/** Ширина кольца — физический пиксель: тоньше кольца не различить, толще — видны ступени */
const ringStep = () => 1 / PixelRatio.get();

const Rings: React.FC<{ rings: readonly ShadowRing[] }> = ({ rings }) => (
  <>
    {rings.map((ring, i) => (
      <View key={i} pointerEvents="none" style={[styles.ring, ring]} />
    ))}
  </>
);

/**
 * Полосы внешней тени снаружи сторон элемента, без размеров в DIP: полоса — в процентах от элемента
 * (до двух его размеров наружу), сверху и снизу шире на pad — захватывают углы. В полосе — рамка во весь
 * элемент (frame), кольца отсчитываются от неё. Полосы не задевают элемент — тень внутри него не видна
 */
const BAND: Record<GlassSide, (pad: number) => { band: ViewStyle; frame: ViewStyle }> = {
  top: pad => ({
    band: { bottom: '100%', height: '200%', left: -pad, right: -pad },
    frame: { top: '100%', height: '50%', left: pad, right: pad },
  }),
  bottom: pad => ({
    band: { top: '100%', height: '200%', left: -pad, right: -pad },
    frame: { bottom: '100%', height: '50%', left: pad, right: pad },
  }),
  left: () => ({
    band: { right: '100%', width: '200%', top: 0, bottom: 0 },
    frame: { left: '100%', width: '50%', top: 0, bottom: 0 },
  }),
  right: () => ({
    band: { left: '100%', width: '200%', top: 0, bottom: 0 },
    frame: { right: '100%', width: '50%', top: 0, bottom: 0 },
  }),
};

/**
 * Четверти элемента для щелей у углов: четверть обрезает (overflow: hidden, без скругления), рамка во
 * весь элемент (frame) — в процентах от четверти. Рамки вокруг элемента видны в ней только у угла
 */
const QUARTER: Record<GlassCorner, { quarter: ViewStyle; frame: ViewStyle }> = {
  topLeft: {
    quarter: { top: 0, left: 0, right: '50%', bottom: '50%' },
    frame: { top: 0, left: 0, width: '200%', height: '200%' },
  },
  topRight: {
    quarter: { top: 0, right: 0, left: '50%', bottom: '50%' },
    frame: { top: 0, right: 0, width: '200%', height: '200%' },
  },
  bottomLeft: {
    quarter: { bottom: 0, left: 0, right: '50%', top: '50%' },
    frame: { bottom: 0, left: 0, width: '200%', height: '200%' },
  },
  bottomRight: {
    quarter: { bottom: 0, right: 0, left: '50%', top: '50%' },
    frame: { bottom: 0, right: 0, width: '200%', height: '200%' },
  },
};

interface GlassDropProps {
  shadow: GlassShadow;
  radius: number;
}

/**
 * Внешняя тень (lib/glass, dropRings): огибает скругление и учитывает spread, внутри элемента её нет.
 * Полосы — снаружи сторон, четверти — щели у скруглённых углов внутри прямоугольника элемента
 */
const GlassDrop: React.FC<GlassDropProps> = ({ shadow, radius }) => {
  const drop = useMemo(() => dropRings(shadow, radius, ringStep()), [shadow, radius]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {drop.bands.map(({ side, rings }) => {
        const place = BAND[side](drop.pad);
        return (
          <View key={side} pointerEvents="none" style={[styles.band, place.band]}>
            <View pointerEvents="none" style={[styles.frame, place.frame]}>
              <Rings rings={rings} />
            </View>
          </View>
        );
      })}
      {drop.corners.map(({ corner, rings }) => (
        <View key={corner} pointerEvents="none" style={[styles.band, QUARTER[corner].quarter]}>
          <View pointerEvents="none" style={[styles.frame, QUARTER[corner].frame]}>
            <Rings rings={rings} />
          </View>
        </View>
      ))}
    </View>
  );
};

/** Слой 1: внешняя тень и затемнение — первым ребёнком, под содержимым */
export const GlassBase: React.FC<GlassPartProps> = ({ glass, radius }) => (
  <>
    {glass.drop ? <GlassDrop shadow={glass.drop} radius={radius} /> : null}
    {glass.fill ? (
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { borderRadius: radius, backgroundColor: glass.fill }]}
      />
    ) : null}
  </>
);

/**
 * Слои 3, 4…: внутренние тени — после содержимого, поверх него, по порядку. Рамки лежат по краю и
 * скруглению элемента — обрезка не нужна
 */
export const GlassInner: React.FC<GlassPartProps> = ({ glass, radius }) => {
  const rings = useMemo(() => {
    const step = ringStep();
    return glass.inner.flatMap(shadow => insetRings(shadow, radius, step));
  }, [glass.inner, radius]);
  if (rings.length === 0) {
    return null;
  }
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Rings rings={rings} />
    </View>
  );
};

const styles = StyleSheet.create({
  ring: { position: 'absolute' },
  band: { position: 'absolute', overflow: 'hidden' },
  frame: { position: 'absolute' },
});

/** Стекло без своего содержимого — все слои подряд (слои наведения и нажатия, подложки) */
export const GlassLayers: React.FC<GlassPartProps> = ({ glass, radius }) => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <GlassBase glass={glass} radius={radius} />
    <GlassInner glass={glass} radius={radius} />
  </View>
);

interface GlassViewProps extends ViewProps {
  // React 19: ref — обычный prop, уходит в View через ...rest
  ref?: React.Ref<View>;
  glass: Glass;
  /** Класс элемента — вместе со скруглением rounded-…, его же берут слои */
  className?: string;
}

/** View со стеклом-бутербродом: затемнение и тень, содержимое, внутренние тени поверх */
export const GlassView: React.FC<GlassViewProps> = ({ glass, className, style, children, ...rest }) => {
  const radius = useGlassRadius(className, style);
  return (
    <View {...rest} className={className} style={[style, GLASS_HOST]}>
      <GlassBase glass={glass} radius={radius} />
      {children}
      <GlassInner glass={glass} radius={radius} />
    </View>
  );
};
