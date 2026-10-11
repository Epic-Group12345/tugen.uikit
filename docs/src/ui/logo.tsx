import React from 'react';
import { cx, palette } from '@tugen/uikit/web';

// Логотип TUGEN: знак (синий квадрат со скруглением и буквой T) и надпись. Рабочий вариант: знак
// повторяет значок сайта, а надпись набрана шрифтом сайта. Финальные файлы придут с брендбуком

export type LogoTone = 'color' | 'light' | 'dark';

/** Цвет знака и буквы по варианту: на светлом фоне, на тёмном, одноцветный на фото */
const MARK: Record<LogoTone, { fill: string; letter: string }> = {
  color: { fill: palette.blue[500], letter: palette.white },
  light: { fill: palette.mist[50], letter: palette.mist[950] },
  dark: { fill: palette.mist[950], letter: palette.mist[50] },
};

const WORD: Record<LogoTone, string> = {
  color: 'text-mist-950 dark:text-mist-50',
  light: 'text-mist-50',
  dark: 'text-mist-950',
};

/** Знак 32 × 32: радиус 8 — четверть стороны, как у плашек иконок в лаунчере */
const markShapes = (tone: LogoTone) => {
  const { fill, letter } = MARK[tone];
  return `<rect width="32" height="32" rx="8" fill="${fill}"/><rect x="9" y="9" width="14" height="4" rx="1" fill="${letter}"/><rect x="14" y="9" width="4" height="14" rx="1" fill="${letter}"/>`;
};

export const markSvg = (tone: LogoTone = 'color', size = 32) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">${markShapes(
    tone,
  )}</svg>`;

/** Знак с надписью — для файла. Надпись — текстом: без шрифта сайта браузер возьмёт системный */
export const logoSvg = (tone: LogoTone = 'color') => {
  const text = tone === 'light' ? palette.mist[50] : palette.mist[950];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="152" height="32" viewBox="0 0 152 32">${markShapes(
    tone,
  )}<text x="42" y="24" font-family="'Ubuntu Sans', 'Segoe UI', sans-serif" font-size="22" font-weight="700" letter-spacing="1.5" fill="${text}">TUGEN</text></svg>`;
};

export const Mark: React.FC<{ tone?: LogoTone; size?: number }> = ({
  tone = 'color',
  size = 32,
}) => (
  <span
    aria-hidden
    className="flex shrink-0"
    // Тот же SVG, что уходит в файл: превью и скачанный знак не разойдутся
    dangerouslySetInnerHTML={{ __html: markSvg(tone, size) }}
  />
);

export const Logo: React.FC<{
  tone?: LogoTone;
  size?: 'md' | 'lg';
  className?: string;
}> = ({ tone = 'color', size = 'md', className }) => (
  <span
    role="img"
    aria-label="TUGEN"
    className={cx(
      'flex flex-row items-center',
      size === 'lg' ? 'gap-3' : 'gap-2',
      className,
    )}
  >
    <Mark tone={tone} size={size === 'lg' ? 48 : 24} />
    <span
      className={cx(
        'font-bold tracking-wider',
        size === 'lg' ? 'text-4xl' : 'text-base',
        WORD[tone],
      )}
    >
      TUGEN
    </span>
  </span>
);
