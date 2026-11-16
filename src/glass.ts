// «Статичное стекло» (DESIGN.md) из обычных View — один код для macOS и Windows, без своей нативки и без
// SVG. Бутерброд слоёв во весь элемент, друг на друге, без отступов:
// 1. затемнение и внешняя тень (Drop shadow);
// 2. содержимое;
// 3, 4… — внутренние тени (Inner shadow), по слою на тень, поверх содержимого.
//
// Не boxShadow: Fabric в react-native-windows рисует внешнюю тень прямоугольником и без spread, а inset
// не рисует вовсе. Поэтому тень — вложенные слои View одного цвета: у внутренней — рамки (borderWidth),
// у внешней — заливки, со скруглением. Слой задан отступами от краёв элемента, а не размерами — его
// рисует сам React Native в том же кадре, что и элемент, без onLayout. Фигура, раздутая на d, —
// скруглённый прямоугольник с радиусом r + d, поэтому тень огибает углы, как inset boxShadow на macOS.
//
// Профиль — ровно CSS: размытие — гаусс с σ = blur / 2. Внешняя тень: фигура — элемент, раздутый на spread
// и сдвинутый на offset; непрозрачность на расстоянии d снаружи от её края — opacity · Φ(−d / σ); внутри
// элемента тень обрезана, как в Figma без «Show behind transparent areas» (components/ui/glass — полосами
// вокруг элемента). Внутренняя тень красит всё вне «дыры» — элемента, сжатого на spread и сдвинутого на
// offset, со скруглением r − spread: opacity · Φ(d / σ); за краем элемента её обрезает слой со скруглением

/** Тень в единицах Figma: смещение, размытие и spread в DIP, цвет #RRGGBB и непрозрачность 0…1 */
export interface GlassShadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

/** Стекло как в Figma: заливка, внешняя тень, внутренние тени */
export interface GlassSpec {
  /** Цвет заливки (затемнения); нет — прозрачное */
  fill?: string;
  drop?: GlassShadow;
  inner?: readonly GlassShadow[];
}

/** Стекло, готовое к отрисовке (components/ui/glass) */
export interface Glass {
  /** Слой 1: заливка */
  fill?: string;
  /** Слой 1: внешняя тень (dropRings) */
  drop?: GlassShadow;
  /** Слои после содержимого: по слою на внутреннюю тень (insetRings) */
  inner: readonly GlassShadow[];
}

// Колец на тень не больше: у широкой тени кольцо шире физического пикселя, соседние почти одного цвета
const MAX_RINGS = 24;
// Гаусс дальше 3σ — меньше 0,2%
const SIGMAS = 3;
// Кольцо прозрачнее этого не рисуем — на экране его не видно
const MIN_ALPHA = 0.004;

/** Функция ошибок — приближение Абрамовица и Стиган 7.1.26, погрешность меньше 1,5·10⁻⁷ */
const erf = (x: number): number => {
  const sign = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign * (1 - poly * Math.exp(-a * a));
};

/** Доля нормального распределения левее z */
export const normalCdf = (z: number): number => 0.5 * (1 + erf(z / Math.SQRT2));

const round = (value: number, digits = 1000) => Math.round(value * digits) / digits;

/** #RRGGBB и непрозрачность → rgba(…) */
export const rgba = (hex: string, opacity: number): string => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  const alpha = round(Math.max(0, Math.min(1, opacity)));
  if (!m) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const [r, g, b] = [m[1], m[2], m[3]].map(part => parseInt(part, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Слой тени — стиль View: отступы внешнего края от краёв элемента (минус — наружу) и скругление внешнего
 * края; у внутренней тени — рамка по сторонам (border…Width, borderColor), у внешней — заливка.
 * Скругление больше половины стороны React Native уменьшает сам — как у элемента с rounded-full
 */
export interface ShadowRing {
  top: number;
  right: number;
  bottom: number;
  left: number;
  borderRadius: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
}

/** Отступы фигуры тени от краёв элемента и её скругление */
interface Shape {
  top: number;
  right: number;
  bottom: number;
  left: number;
  radius: number;
}

/** Фигура, раздутая на d: отступы и скругление внешнего края слоя */
const grown = (shape: Shape, d: number) => ({
  top: round(shape.top - d),
  right: round(shape.right - d),
  bottom: round(shape.bottom - d),
  left: round(shape.left - d),
  borderRadius: shape.radius > 0 ? round(Math.max(0, shape.radius + d)) : 0,
});

/**
 * Границы слоёв вокруг края фигуры: от −3σ до +3σ с шагом step (не мельче, чтобы слоёв было не больше
 * MAX_RINGS), и целевая непрозрачность в середине каждого промежутка
 */
const profile = (sigma: number, step: number, alpha: (d: number) => number) => {
  const reach = SIGMAS * sigma;
  const width = Math.max(step, (2 * reach) / MAX_RINGS);
  const count = Math.ceil((2 * reach) / width);
  return Array.from({ length: count }, (_, i) => {
    const from = -reach + i * width;
    return { from, to: from + width, alpha: Math.min(alpha(from + width / 2), 0.999) };
  });
};

/**
 * Слои вкладываются, а не стыкуются: React Native округляет края каждого View к пикселю отдельно, и
 * стыкованные кольца в пиксель шириной на дробной позиции то сливались, то оставляли пустой пиксель.
 * Вложенные слои одного цвета перекрываются; непрозрачность слоя подобрана так, чтобы наложение дало
 * нужную: где лежат слои с суммарной A_prev и нужна A, новый слой — 1 − (1 − A) / (1 − A_prev)
 */
const layerAlpha = (target: number, below: number) => 1 - (1 - target) / (1 - below);

/**
 * Внутренняя тень элемента со скруглением radius. Слой k — рамка во весь элемент (по его краю и
 * скруглению) толщиной до границы k у каждой стороны: чем дальше от дыры, тем больше рамок накрывает
 * точку и тем плотнее тень. Рамки не выходят за элемент: react-native-windows рисует вид, вылезший за
 * родителя с overflow: hidden и скруглением, вдвое плотнее. Скругление внутреннего края рамки React
 * Native считает сам (радиус минус толщина) — у дыры со смещением оно чуть отличается от CSS, на кромке
 * в 2–4 DIP это не видно. step — физический пиксель (1 / PixelRatio)
 */
export const insetRings = (shadow: GlassShadow, radius: number, step: number): ShadowRing[] => {
  if (shadow.opacity <= 0) {
    return [];
  }
  const sigma = Math.max(shadow.blur / 2, 0.01);
  // Насколько край дыры отстоит внутрь от каждого края элемента
  const hole = {
    top: shadow.spread + shadow.y,
    right: shadow.spread - shadow.x,
    bottom: shadow.spread - shadow.y,
    left: shadow.spread + shadow.x,
  };
  const bands = profile(sigma, step, d => shadow.opacity * normalCdf(d / sigma));
  const out: ShadowRing[] = [];
  let below = 0;
  for (const band of bands) {
    // Рамка до границы band.from: у стороны — от края элемента до неё, не меньше нуля
    const widths = {
      borderTopWidth: round(Math.max(0, hole.top - band.from)),
      borderRightWidth: round(Math.max(0, hole.right - band.from)),
      borderBottomWidth: round(Math.max(0, hole.bottom - band.from)),
      borderLeftWidth: round(Math.max(0, hole.left - band.from)),
    };
    if (band.alpha <= below || Object.values(widths).every(width => width === 0)) {
      continue;
    }
    const opacity = layerAlpha(band.alpha, below);
    // Слишком прозрачный слой пропускаем: его долю доберёт следующий
    if (opacity < MIN_ALPHA) {
      continue;
    }
    below = band.alpha;
    out.push({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: radius,
      ...widths,
      borderColor: rgba(shadow.color, opacity),
    });
  }
  return out;
};

export type GlassSide = 'top' | 'right' | 'bottom' | 'left';

/** Внешняя тень: слои для полосы у одной стороны элемента (снаружи неё) */
export interface DropBand {
  side: GlassSide;
  rings: ShadowRing[];
}

/** Внешняя тень: на сколько DIP она выходит за элемент, и слои по полосам у сторон */
export interface DropRings {
  pad: number;
  bands: DropBand[];
  /** Щели у скруглённых углов внутри прямоугольника элемента — полосы их не закрывают */
  corners: DropCorner[];
}

export type GlassCorner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

/** Внешняя тень в щели у угла: рамки вокруг элемента, видные только в четверти элемента у этого угла */
export interface DropCorner {
  corner: GlassCorner;
  rings: ShadowRing[];
}

/** Углы и направление наружу по диагонали угла */
const CORNERS: readonly { corner: GlassCorner; nx: number; ny: number }[] = [
  { corner: 'topLeft', nx: -1, ny: -1 },
  { corner: 'topRight', nx: 1, ny: -1 },
  { corner: 'bottomLeft', nx: -1, ny: 1 },
  { corner: 'bottomRight', nx: 1, ny: 1 },
];

/**
 * Тень в щели у угла: между дугой скругления и углом прямоугольника элемента. Слой — рамка вокруг
 * элемента, раздутого на t (скругление r + t, толщина t): её внутренний край — ровно контур элемента,
 * внутрь она не заходит, а React Native сам ужимает скругление у rounded-full. Рамки вкладываются, как
 * заливки внешней тени. Плотность — тени на диагонали угла: точка в t снаружи дуги элемента отстоит от
 * дуги фигуры тени на t − spread − offset · n (n — диагональ наружу; точно до членов порядка offset² / r)
 */
const cornerRings = (
  shadow: GlassShadow,
  radius: number,
  step: number,
  sigma: number,
  nx: number,
  ny: number,
): ShadowRing[] => {
  const along = (shadow.x * nx + shadow.y * ny) / Math.SQRT2;
  const alpha = (t: number) => shadow.opacity * normalCdf(-(t - shadow.spread - along) / sigma);
  // Щель у угла глубиной r(√2 − 1) по диагонали; у rounded-full радиус неизвестен — до конца тени
  const depth = Math.min(radius * (Math.SQRT2 - 1), SIGMAS * sigma + Math.abs(along) + Math.abs(shadow.spread));
  const count = Math.min(MAX_RINGS, Math.ceil(depth / step) + 1);
  const width = (depth + step) / count;
  const out: ShadowRing[] = [];
  let below = 0;
  // Снаружи внутрь: самая широкая рамка — первой
  for (let i = count; i >= 1; i--) {
    const t = i * width;
    const target = Math.min(alpha(t - width / 2), 0.999);
    if (target <= below) {
      continue;
    }
    const opacity = layerAlpha(target, below);
    if (opacity < MIN_ALPHA) {
      continue;
    }
    below = target;
    const edge = round(-t);
    const thick = round(t);
    out.push({
      top: edge,
      right: edge,
      bottom: edge,
      left: edge,
      borderRadius: round(radius + t),
      borderTopWidth: thick,
      borderRightWidth: thick,
      borderBottomWidth: thick,
      borderLeftWidth: thick,
      borderColor: rgba(shadow.color, opacity),
    });
  }
  return out;
};

const SIDES: readonly GlassSide[] = ['top', 'right', 'bottom', 'left'];

/**
 * Внешняя тень элемента со скруглением radius. Слой k — залитая фигура, раздутая до границы k: ближе к
 * фигуре точку накрывает больше слоёв, тень плотнее. Слои разложены по полосам снаружи сторон элемента —
 * в полосу попадают только те, что выходят за эту сторону; внутри элемента тени нет (components/ui/glass).
 * step — физический пиксель
 */
export const dropRings = (shadow: GlassShadow, radius: number, step: number): DropRings => {
  const sigma = Math.max(shadow.blur / 2, 0.01);
  const reach = SIGMAS * sigma;
  const pad = Math.ceil(Math.max(Math.abs(shadow.x), Math.abs(shadow.y)) + Math.max(0, shadow.spread) + reach + 1);
  if (shadow.opacity <= 0) {
    return { pad, bands: [], corners: [] };
  }
  // Фигура: элемент, раздутый на spread и сдвинутый на offset; скругление по CSS — радиус плюс spread
  const shape: Shape = {
    top: shadow.y - shadow.spread,
    right: -shadow.x - shadow.spread,
    bottom: -shadow.y - shadow.spread,
    left: shadow.x - shadow.spread,
    radius: radius > 0 ? Math.max(0, radius + shadow.spread) : 0,
  };
  const bands = profile(sigma, step, d => shadow.opacity * normalCdf(-d / sigma));
  // Снаружи внутрь: самый дальний слой — первым, каждый следующий добавляет до нужной плотности
  const all: ShadowRing[] = [];
  let below = 0;
  for (const band of [...bands].reverse()) {
    if (band.alpha <= below) {
      continue;
    }
    const opacity = layerAlpha(band.alpha, below);
    // Слишком прозрачный слой пропускаем: его долю доберёт следующий
    if (opacity < MIN_ALPHA) {
      continue;
    }
    below = band.alpha;
    // Фигуры, схлопнувшиеся от сжатия, не рисуем: их место накрыто внешними слоями
    all.push({ ...grown(shape, band.to), backgroundColor: rgba(shadow.color, opacity) });
  }
  const sides = SIDES.map(side => ({ side, rings: all.filter(ring => ring[side] < 0) })).filter(
    band => band.rings.length > 0,
  );
  const corners =
    radius > 0
      ? CORNERS.map(({ corner, nx, ny }) => ({
          corner,
          rings: cornerRings(shadow, radius, step, sigma, nx, ny),
        })).filter(corner => corner.rings.length > 0)
      : [];
  return { pad, bands: sides, corners };
};

/** Стекло из параметров макета; объявлять на уровне модуля */
export const makeGlass = (spec: GlassSpec): Glass => ({
  fill: spec.fill,
  drop: spec.drop,
  inner: (spec.inner ?? []).filter(shadow => shadow.opacity > 0),
});

/** Затемнение стекла кнопок: #17191A, 35% */
export const GLASS_FILL = 'rgba(23, 25, 26, 0.35)';

/**
 * Кромки кнопки из макета — две внутренние тени: яркая у верха (0 2 2 −1) и слабая у низа (0 −1 3 −2).
 * top и bottom — их цвета, opacity — общая непрозрачность (60% в покое, 100% при наведении)
 */
export const buttonRims = (top: string, bottom: string, opacity: number): GlassShadow[] => [
  { x: 0, y: 2, blur: 2, spread: -1, color: top, opacity },
  { x: 0, y: -1, blur: 3, spread: -2, color: bottom, opacity },
];

/** Внешняя тень кнопки из макета: 0 3 8 −4 */
export const buttonDrop = (color: string, opacity: number): GlassShadow => ({
  x: 0,
  y: 3,
  blur: 8,
  spread: -4,
  color,
  opacity,
});
