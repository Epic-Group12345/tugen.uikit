import source from '../tokens/tokens.json';

// Токены TUGEN для React Native. Источник — tokens/tokens.json: из того же файла собирается
// css/tugen.css для веба, поэтому значения здесь и там всегда совпадают (проверяет тест)

export type ColorScheme = 'light' | 'dark';
export type PaletteName = keyof typeof source.palette;
export type ColorRole = keyof typeof source.themes.light;
export type ThemeColors = Record<ColorRole, string>;

export const palette = source.palette;

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Ссылка на цвет палитры → цвет, который понимают и React Native, и CSS: "mist.950" → "#0b0f10",
 * "mist.950/5" → "rgba(11, 15, 16, 0.05)" (как прозрачность в классах Tailwind)
 */
export const resolveColor = (ref: string): string => {
  const [name, alpha] = ref.split('/');
  const [hue, shade] = name.split('.');
  const group = (palette as Record<string, string | Record<string, string>>)[
    hue
  ];
  const hex = typeof group === 'string' ? group : group?.[shade];
  if (!hex) {
    throw new Error(`Нет цвета ${ref} в палитре TUGEN`);
  }
  if (alpha === undefined) {
    return hex;
  }
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha) / 100})`;
};

const resolveTheme = (refs: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(refs).map(([role, ref]) => [role, resolveColor(ref)]),
  ) as ThemeColors;

/** Цвета ролей по теме: themes.dark.text, themes.light.accent */
export const themes: Record<ColorScheme, ThemeColors> = {
  light: resolveTheme(source.themes.light),
  dark: resolveTheme(source.themes.dark),
};

/** Скругления, DIP: lg — кнопки и поля, xl — карточки и меню, 2xl — окна, full — круглое */
export const radius = source.radius;

/** Отступы, DIP — шаг Tailwind: space[4] = 16 (p-4) */
export const space = source.space;

export type TextSize = keyof typeof source.text;

/** Размер шрифта и высота строки, как text-* в Tailwind */
export const text = Object.fromEntries(
  Object.entries(source.text).map(([size, [fontSize, lineHeight]]) => [
    size,
    { fontSize, lineHeight },
  ]),
) as Record<TextSize, { fontSize: number; lineHeight: number }>;

/** Насыщенность: только semibold и bold, других не используем */
export const weight = source.weight as {
  regular: '400';
  semibold: '600';
  bold: '700';
};

/** Шрифты для веба (CSS font-family). В React Native — системный шрифт, mono — Consolas */
export const font = source.font;

/** Длительности, мс, и прозрачность неактивного элемента */
export const motion = source.motion;

/** Ширина окна, с которой начинаются режимы regular и wide, DIP */
export const breakpoints = source.breakpoints;

export type LayoutMode = 'compact' | 'regular' | 'wide';

export const layoutModeFor = (width: number): LayoutMode =>
  width >= breakpoints.wide
    ? 'wide'
    : width >= breakpoints.regular
    ? 'regular'
    : 'compact';
