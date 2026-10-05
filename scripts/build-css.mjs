// Собирает css/tugen.css из tokens/tokens.json: переменные палитры и ролей (светлая и тёмная
// тема) и классы элементов для веба без React — страниц на Nim (tugen.webservices).
// Запуск: yarn css. Готовый файл лежит в git, CI проверяет, что он не отстал от токенов
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('tokens/tokens.json', root), 'utf8'));

const kebab = s => s.replace(/[A-Z]/g, c => '-' + c.toLowerCase());

// Та же запись, что в src/tokens.ts: "mist.950" → hex, "mist.950/5" → rgba
const resolveColor = ref => {
  const [name, alpha] = ref.split('/');
  const [hue, shade] = name.split('.');
  const group = tokens.palette[hue];
  const hex = typeof group === 'string' ? group : group?.[shade];
  if (!hex) {
    throw new Error(`Нет цвета ${ref} в палитре TUGEN`);
  }
  if (alpha === undefined) {
    return hex;
  }
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Number(alpha) / 100})`;
};

const roleVars = (theme, indent) =>
  Object.entries(tokens.themes[theme])
    .map(([role, ref]) => `${indent}--tg-${kebab(role)}: ${resolveColor(ref)};`)
    .join('\n');

const paletteVars = Object.entries(tokens.palette)
  .flatMap(([hue, group]) =>
    typeof group === 'string'
      ? [`  --tg-${hue}: ${group};`]
      : Object.entries(group).map(([shade, hex]) => `  --tg-${hue}-${shade}: ${hex};`),
  )
  .join('\n');

const px = v => (v === 0 ? '0' : `${v}px`);
const scaleVars = (prefix, scale) =>
  Object.entries(scale)
    .map(([k, v]) => `  --tg-${prefix}-${k.replace('.', '_')}: ${px(v)};`)
    .join('\n');

const textVars = Object.entries(tokens.text)
  .map(([k, [size, line]]) => `  --tg-text-${k}: ${size}px;\n  --tg-leading-${k}: ${line}px;`)
  .join('\n');

const motionVars = Object.entries(tokens.motion)
  .map(([k, v]) => `  --tg-${kebab(k)}: ${k === 'dimmed' ? v : `${v}ms`};`)
  .join('\n');

const textClasses = Object.keys(tokens.text)
  .map(
    k =>
      `.tg-text--${k} {\n  font-size: var(--tg-text-${k});\n  line-height: var(--tg-leading-${k});\n}`,
  )
  .join('\n');

const toneClasses = Object.entries({
  secondary: 'text-secondary',
  muted: 'text-muted',
  faint: 'text-faint',
  info: 'info',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  special: 'special',
})
  .map(([tone, role]) => `.tg-text--${tone} {\n  color: var(--tg-${role});\n}`)
  .join('\n');

const pillClasses = ['neutral', 'amber', 'green', 'red', 'violet', 'danger']
  .map(tone => {
    const name = tone[0].toUpperCase() + tone.slice(1);
    return `.tg-pill--${tone} {\n  background: var(--tg-${kebab('pill' + name)});\n  color: var(--tg-${kebab('pill' + name + 'Text')});\n}`;
  })
  .join('\n');

const css = `/* TUGEN UI-kit для веба. Собрано из tokens/tokens.json командой yarn css — не править руками.
 * Тема — как в системе; data-theme="light" | "dark" на <html> задаёт её явно. */

:root {
  color-scheme: light dark;
${paletteVars}
${scaleVars('radius', tokens.radius)}
${scaleVars('space', tokens.space)}
${textVars}
  --tg-font-sans: ${tokens.font.sans};
  --tg-font-mono: ${tokens.font.mono};
${motionVars}
${roleVars('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${roleVars('dark', '    ')}
  }
}

:root[data-theme='dark'] {
  color-scheme: dark;
${roleVars('dark', '  ')}
}

:root[data-theme='light'] {
  color-scheme: light;
}

/* Основа: страница TUGEN */
.tg-root {
  margin: 0;
  min-height: 100vh;
  background: var(--tg-page);
  color: var(--tg-text);
  font-family: var(--tg-font-sans);
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
  -webkit-font-smoothing: antialiased;
}

.tg-root *,
.tg-root *::before,
.tg-root *::after {
  box-sizing: border-box;
}

/* Текст */
.tg-text {
  margin: 0;
  color: var(--tg-text);
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
}
${textClasses}
.tg-text--semibold {
  font-weight: 600;
}
.tg-text--bold {
  font-weight: 700;
}
.tg-text--mono {
  font-family: var(--tg-font-mono);
}
.tg-text--upper {
  text-transform: uppercase;
}
${toneClasses}

/* Кнопки: primary — главное действие, secondary — нейтральная, play — только запуск игры */
.tg-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 0;
  border-radius: var(--tg-radius-lg);
  font: inherit;
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
  white-space: nowrap;
  cursor: pointer;
  background: var(--tg-accent);
  color: var(--tg-text-on-accent);
  transition: background-color var(--tg-hover-out) ease-out, transform var(--tg-press-out) ease-out;
}
.tg-button:hover {
  background: var(--tg-accent-hover);
  transition-duration: var(--tg-hover-in);
}
.tg-button:active {
  background: var(--tg-accent-press);
  transform: scale(0.97);
  transition-duration: var(--tg-press-in);
}
.tg-button--secondary {
  background: var(--tg-neutral);
  color: var(--tg-text-on-neutral);
}
.tg-button--secondary:hover {
  background: var(--tg-neutral-hover);
}
.tg-button--secondary:active {
  background: var(--tg-neutral-press);
}
.tg-button--play {
  background: var(--tg-play);
}
.tg-button--play:hover {
  background: var(--tg-play-hover);
}
.tg-button--play:active {
  background: var(--tg-play-press);
}
.tg-button--sm {
  padding: 6px 12px;
}
.tg-button--grow {
  flex: 1;
}
.tg-button:disabled,
.tg-icon-button:disabled,
.tg-toggle:disabled,
.tg-check-row:has(:disabled),
.tg-field:disabled {
  opacity: var(--tg-dimmed);
  pointer-events: none;
}

/* Кнопка-иконка: фон проявляется при наведении */
.tg-icon-button {
  display: inline-flex;
  padding: 6px;
  border: 0;
  border-radius: var(--tg-radius-lg);
  background: transparent;
  color: var(--tg-text-muted);
  cursor: pointer;
  transition: background-color var(--tg-hover-out) ease-out, transform var(--tg-press-out) ease-out;
}
.tg-icon-button:hover {
  background: var(--tg-hover);
}
.tg-icon-button:active {
  background: var(--tg-press);
  transform: scale(0.9);
}
.tg-icon-button--danger {
  color: var(--tg-icon-danger);
}
.tg-icon-button--success {
  color: var(--tg-success);
}
.tg-icon-button svg,
.tg-button svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.tg-button svg {
  width: 14px;
  height: 14px;
}

/* Переключатель: <input type="checkbox" class="tg-toggle"> */
.tg-toggle {
  appearance: none;
  position: relative;
  flex: none;
  width: 36px;
  height: 20px;
  margin: 0;
  border-radius: var(--tg-radius-full);
  background: var(--tg-track);
  cursor: pointer;
  transition: background-color var(--tg-toggle) ease-out;
}
.tg-toggle::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-knob);
  transition: transform var(--tg-toggle) ease-in-out;
}
.tg-toggle:checked {
  background: var(--tg-accent);
}
.tg-toggle:checked::before {
  transform: translateX(16px);
}

/* Флажок с подписью: <label class="tg-check-row"><input type="checkbox" class="tg-checkbox">…</label> */
.tg-check-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px;
  border-radius: var(--tg-radius-lg);
  cursor: pointer;
  transition: background-color var(--tg-hover-out) ease-out;
}
.tg-check-row:hover {
  background: var(--tg-hover);
}
.tg-checkbox {
  appearance: none;
  position: relative;
  flex: none;
  width: 20px;
  height: 20px;
  margin: 2px 0 0;
  border: 1px solid var(--tg-track);
  border-radius: var(--tg-radius-md);
  cursor: pointer;
}
.tg-checkbox:checked {
  border-color: var(--tg-accent);
  background: var(--tg-accent);
}
.tg-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 9px;
  border: solid var(--tg-text-on-accent);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Поле ввода: aria-invalid="true" — красная рамка */
.tg-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--tg-field-border);
  border-radius: var(--tg-radius-lg);
  background: var(--tg-field);
  color: var(--tg-text);
  font: inherit;
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
  outline: none;
}
.tg-field::placeholder {
  color: var(--tg-placeholder);
}
.tg-field:focus {
  border-color: var(--tg-focus);
}
.tg-field[aria-invalid='true'] {
  border-color: var(--tg-invalid);
}
.tg-field--mono {
  font-family: var(--tg-font-mono);
}

/* Сегменты: <div class="tg-segmented" role="radiogroup"><button class="tg-segment" aria-checked="true"> */
.tg-segmented {
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-neutral);
}
.tg-segment {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 12px;
  border: 0;
  border-radius: var(--tg-radius-full);
  text-align: center;
  background: transparent;
  color: var(--tg-text-muted);
  font: inherit;
  cursor: pointer;
  transition: background-color var(--tg-deselect) ease-out, color var(--tg-deselect) ease-out;
}
.tg-segment:hover {
  background: var(--tg-segment-hover);
  color: var(--tg-text);
}
.tg-segment[aria-checked='true'] {
  background: var(--tg-segment-active);
  color: var(--tg-text);
  transition-duration: var(--tg-layout);
}
.tg-segment:active {
  background: var(--tg-segment-press);
}

/* Ползунок: <input type="range" class="tg-slider"> */
.tg-slider {
  appearance: none;
  width: 100%;
  height: 24px;
  margin: 0;
  background: transparent;
  cursor: pointer;
}
.tg-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-neutral);
}
.tg-slider::-moz-range-track {
  height: 4px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-neutral);
}
.tg-slider::-moz-range-progress {
  height: 4px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-slider-fill);
}
.tg-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  margin-top: -4px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-slider-fill);
}
.tg-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: 0;
  border-radius: var(--tg-radius-full);
  background: var(--tg-slider-fill);
}

/* Меню и выпадающий список: <div class="tg-menu" role="menu"><button class="tg-menu__item" role="menuitem"> */
.tg-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 192px;
  padding: 4px;
  border: 1px solid var(--tg-overlay-border);
  border-radius: var(--tg-radius-xl);
  background: var(--tg-overlay);
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--tg-radius-lg);
  background: transparent;
  color: var(--tg-text-secondary);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.tg-menu__item:hover,
.tg-menu__item[aria-checked='true'] {
  color: var(--tg-text);
}
.tg-menu__item:hover {
  background: var(--tg-hover);
}
.tg-menu__item:active {
  background: var(--tg-press);
}
@keyframes tg-appear {
  from {
    opacity: 0;
  }
}

/* Метки */
.tg-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: var(--tg-radius-md);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
${pillClasses}

/* Поверхности: уровни разделяются цветом и рамкой, без теней */
.tg-surface--window {
  background: var(--tg-window);
}
.tg-surface--page {
  background: var(--tg-page);
}
.tg-card {
  border-radius: var(--tg-radius-xl);
  background: var(--tg-card);
}
.tg-overlay {
  border: 1px solid var(--tg-overlay-border);
  border-radius: var(--tg-radius-xl);
  background: var(--tg-overlay);
}
.tg-divider {
  height: 1px;
  border: 0;
  margin: 0;
  background: var(--tg-divider);
}
.tg-card > .tg-divider {
  margin: 0 16px;
}
.tg-scrim {
  background: var(--tg-scrim);
}

/* Ряд элементов с промежутком: кнопки, метки */
.tg-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* Раздел и строки карточки */
.tg-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.tg-section__title {
  margin: 0;
  color: var(--tg-text-muted);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
  font-weight: 400;
  text-transform: uppercase;
}
.tg-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
}
.tg-row__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.tg-row__description {
  color: var(--tg-text-muted);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
.tg-row__controls {
  width: 224px;
  max-width: 100%;
}
.tg-row__controls--wide {
  width: 320px;
}

/* Пустое состояние */
.tg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 448px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}
.tg-empty__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--tg-radius-2xl);
  background: var(--tg-card);
  color: var(--tg-text-muted);
}
.tg-empty__icon svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
.tg-empty__title {
  margin: 0;
  font-size: var(--tg-text-base);
  line-height: var(--tg-leading-base);
  font-weight: 700;
}
.tg-empty__text {
  margin: 0;
  color: var(--tg-text-muted);
}

/* Заглушка загрузки: вместо спиннера */
.tg-skeleton {
  border-radius: var(--tg-radius-md);
  background: var(--tg-neutral);
  animation: tg-pulse 1400ms ease-in-out infinite;
}
@keyframes tg-pulse {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tg-root *,
  .tg-root *::before,
  .tg-root *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;

writeFileSync(new URL('css/tugen.css', root), css);
