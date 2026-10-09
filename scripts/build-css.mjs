// Собирает css/tugen.css из tokens/tokens.json: переменные палитры и ролей (светлая и тёмная
// тема) и классы элементов для веба без React — страниц на Nim (tugen.webservices).
// Запуск: yarn css. Готовый файл лежит в git, CI проверяет, что он не отстал от токенов
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const tokens = JSON.parse(
  readFileSync(new URL('tokens/tokens.json', root), 'utf8'),
);

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
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${
    Number(alpha) / 100
  })`;
};

const roleVars = (theme, indent) =>
  Object.entries(tokens.themes[theme])
    .map(([role, ref]) => `${indent}--tg-${kebab(role)}: ${resolveColor(ref)};`)
    .join('\n');

// Цвета отдельных элементов, для которых в tokens.json нет общей роли: в компонентах RN они
// записаны классами Uniwind с парой dark: (подсказка — bg-mist-950 dark:bg-mist-50 и т. п.).
// Те же ссылки на палитру, что в классах компонента, — с парой для тёмной темы
const elementColors = {
  light: {
    // tooltip.tsx: bg-mist-950 dark:bg-mist-50, text-mist-50 dark:text-mist-950
    tooltip: 'mist.950',
    tooltipText: 'mist.50',
    // menu-parts.tsx: пункт меню в покое — text-mist-600 dark:text-mist-300
    menuItem: 'mist.600',
    // avatar.tsx: инициалы text-mist-600 dark:text-mist-300, «нет в сети» bg-mist-400 dark:bg-mist-600
    avatarText: 'mist.600',
    statusOffline: 'mist.400',
    // tabs.tsx: вертикальная вкладка — нажатие bg-mist-300 dark:bg-mist-800, плашка иконки
    // bg-mist-300 dark:bg-mist-800, иконка text-mist-600 dark:text-mist-400
    tabPress: 'mist.300',
    tabPlate: 'mist.300',
    tabIcon: 'mist.600',
    // toast.tsx: рамка уведомления по тону — border-blue-300 dark:border-blue-900 и т. п.
    toastInfo: 'blue.300',
    toastSuccess: 'green.300',
    toastWarning: 'amber.300',
    toastDanger: 'red.300',
  },
  dark: {
    tooltip: 'mist.50',
    tooltipText: 'mist.950',
    menuItem: 'mist.300',
    avatarText: 'mist.300',
    statusOffline: 'mist.600',
    tabPress: 'mist.800',
    tabPlate: 'mist.800',
    tabIcon: 'mist.400',
    toastInfo: 'blue.900',
    toastSuccess: 'green.900',
    toastWarning: 'amber.900',
    toastDanger: 'red.900',
  },
};

const elementVars = (theme, indent) =>
  Object.entries(elementColors[theme])
    .map(([name, ref]) => `${indent}--tg-${kebab(name)}: ${resolveColor(ref)};`)
    .join('\n');

const paletteVars = Object.entries(tokens.palette)
  .flatMap(([hue, group]) =>
    typeof group === 'string'
      ? [`  --tg-${hue}: ${group};`]
      : Object.entries(group).map(
          ([shade, hex]) => `  --tg-${hue}-${shade}: ${hex};`,
        ),
  )
  .join('\n');

const px = v => (v === 0 ? '0' : `${v}px`);
const scaleVars = (prefix, scale) =>
  Object.entries(scale)
    .map(([k, v]) => `  --tg-${prefix}-${k.replace('.', '_')}: ${px(v)};`)
    .join('\n');

const textVars = Object.entries(tokens.text)
  .map(
    ([k, [size, line]]) =>
      `  --tg-text-${k}: ${size}px;\n  --tg-leading-${k}: ${line}px;`,
  )
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
    return `.tg-pill--${tone} {\n  background: var(--tg-${kebab(
      'pill' + name,
    )});\n  color: var(--tg-${kebab('pill' + name + 'Text')});\n}`;
  })
  .join('\n');

// Тона сообщения и уведомления: фон, цвет заголовка и иконки, рамка. Фон сообщения — та же
// прозрачная заливка, что bg-blue-500/10 в alert.tsx (у жёлтого /15: светлый фон хуже читается)
const alertTones = {
  info: { background: 'blue.500/10', accent: 'info' },
  success: { background: 'green.500/10', accent: 'success' },
  warning: { background: 'amber.500/15', accent: 'warning' },
  danger: { background: 'red.500/10', accent: 'danger' },
  neutral: { background: null, accent: null },
};

const alertClasses = Object.entries(alertTones)
  .map(([tone, { background, accent }]) => {
    const bg = background ? resolveColor(background) : 'var(--tg-neutral)';
    const color = accent ? `var(--tg-${accent})` : 'var(--tg-text)';
    const icon = accent ? `var(--tg-${accent})` : 'var(--tg-text-muted)';
    return `.tg-alert--${tone} {\n  background: ${bg};\n}\n.tg-alert--${tone} .tg-alert__title {\n  color: ${color};\n}\n.tg-alert--${tone} .tg-alert__icon {\n  color: ${icon};\n}`;
  })
  .join('\n');

const toastClasses = ['info', 'success', 'warning', 'danger']
  .map(
    tone =>
      `.tg-toast--${tone} {\n  border-color: var(--tg-toast-${tone});\n}\n.tg-toast--${tone} .tg-toast__icon {\n  color: var(--tg-${tone});\n}`,
  )
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
${elementVars('light', '  ')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${roleVars('dark', '    ')}
${elementVars('dark', '    ')}
  }
}

:root[data-theme='dark'] {
  color-scheme: dark;
${roleVars('dark', '  ')}
${elementVars('dark', '  ')}
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

/* Правило радиусов: внешний радиус = внутренний + отступ (src/radius.tsx).
 * Контейнер задаёт свой радиус --tg-outer и отступ до содержимого --tg-pad, а из них —
 * --tg-inner. Он считается на самом контейнере, поэтому потомки наследуют уже готовое число,
 * и вложенный контейнер со своими --tg-outer / --tg-pad не портит его соседям. Элементы у края
 * (кнопки, пункты меню, сегменты, .tg-nested) берут var(--tg-inner, свой радиус): вне
 * контейнера у них обычное скругление. Пары как в RN: меню и popover xl + 4 → пункты lg,
 * окно, панель и уведомление 2xl + 8 → кнопки lg, дорожка сегментов lg + 2 → сегменты md.
 * Свой контейнер: class="tg-scope" style="--tg-outer: 16px; --tg-pad: 8px" */
.tg-scope,
.tg-menu,
.tg-popover,
.tg-dialog,
.tg-sheet,
.tg-toast,
.tg-alert,
.tg-segmented,
.tg-tabs__list,
.tg-accordion--card,
.tg-input--trailing,
.tg-tabs__trigger--vertical,
[class*='tg-pad--']:not(.tg-nested) {
  --tg-inner: max(0px, calc(var(--tg-outer) - var(--tg-pad)));
  padding: var(--tg-pad);
  border-radius: var(--tg-outer);
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
  border-radius: var(--tg-inner, var(--tg-radius-lg));
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
.tg-button--ghost,
.tg-button--outline {
  background: transparent;
  color: var(--tg-text-on-neutral);
}
.tg-button--ghost:hover,
.tg-button--outline:hover {
  background: var(--tg-hover);
}
.tg-button--ghost:active,
.tg-button--outline:active {
  background: var(--tg-press);
}
/* Рамка внутри размера, как border в RN: кнопка не становится крупнее соседних */
.tg-button--outline {
  box-shadow: inset 0 0 0 1px var(--tg-overlay-border);
}
/* Красная: удаление, необратимое действие — red-600 → 700 → 800 в обеих темах */
.tg-button--danger {
  background: var(--tg-red-600);
  color: var(--tg-text-on-accent);
}
.tg-button--danger:hover {
  background: var(--tg-red-700);
}
.tg-button--danger:active {
  background: var(--tg-red-800);
}
.tg-button--sm {
  padding: 6px 12px;
}
.tg-button--lg {
  padding: 10px 20px;
  font-size: var(--tg-text-base);
  line-height: var(--tg-leading-base);
}
.tg-button--grow {
  flex: 1;
}
.tg-button:disabled,
.tg-icon-button:disabled,
.tg-toggle:disabled,
.tg-check-row:has(:disabled),
.tg-field:disabled,
.tg-input:has(:disabled),
.tg-toggle-button:disabled,
.tg-segment:disabled,
.tg-tabs__trigger:disabled,
.tg-disclosure:disabled,
.tg-select:disabled,
.tg-menu__item:disabled,
.tg-checkbox:disabled,
.tg-radio:disabled,
.tg-label[aria-disabled='true'] {
  opacity: var(--tg-dimmed);
  pointer-events: none;
}

/* Кнопка-иконка: фон проявляется при наведении */
.tg-icon-button {
  display: inline-flex;
  padding: 6px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-lg));
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
.tg-button--lg svg {
  width: 16px;
  height: 16px;
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
  border-radius: var(--tg-inner, var(--tg-radius-lg));
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
.tg-checkbox:checked,
.tg-checkbox:indeterminate {
  border-color: var(--tg-accent);
  background: var(--tg-accent);
}
/* «Выбрано не всё»: черта вместо галочки (input.indeterminate = true) */
.tg-checkbox:indeterminate::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 8px;
  width: 10px;
  height: 2px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-text-on-accent);
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
/* Дорожка — контейнер правила радиусов: капсула → сегменты-капсулы, --rounded (lg + 2) → md.
 * Группа переключателей с выбором нескольких — те же классы и aria-pressed */
.tg-segmented {
  --tg-outer: var(--tg-radius-full);
  --tg-pad: 2px;
  display: flex;
  gap: 2px;
  background: var(--tg-neutral);
}
.tg-segmented--rounded {
  --tg-outer: var(--tg-radius-lg);
}
.tg-segmented--inline {
  display: inline-flex;
}
.tg-segment {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 12px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-md));
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
.tg-segment[aria-checked='true'],
.tg-segment[aria-pressed='true'] {
  background: var(--tg-segment-active);
  color: var(--tg-text);
  transition-duration: var(--tg-layout);
}
.tg-segment:active {
  background: var(--tg-segment-press);
}
.tg-segment--icon {
  display: inline-flex;
  flex: none;
  padding: 6px;
}
.tg-segment svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
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
  --tg-outer: var(--tg-radius-xl);
  --tg-pad: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 192px;
  border: 1px solid var(--tg-overlay-border);
  background: var(--tg-overlay);
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-lg));
  background: transparent;
  color: var(--tg-menu-item);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.tg-menu__item:hover,
.tg-menu__item:focus-visible,
.tg-menu__item[aria-checked='true'],
.tg-menu__item[aria-selected='true'],
.tg-menu__item[aria-expanded='true'] {
  color: var(--tg-text);
}
.tg-menu__item:focus-visible {
  outline: none;
  background: var(--tg-hover);
}
.tg-menu__item--destructive,
.tg-menu__item--destructive:hover {
  color: var(--tg-danger);
}
.tg-menu__item--inset {
  padding-left: 32px;
}
.tg-menu__item svg {
  flex: none;
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.tg-menu__text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Горячая клавиша справа: Ctrl+C */
.tg-menu__shortcut {
  color: var(--tg-text-faint);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
/* Галочка выбранного пункта: две стороны повёрнутого прямоугольника, как в MenuCheck */
.tg-menu__check {
  flex: none;
  width: 5px;
  height: 9px;
  margin: -2px 4px 0;
  border: solid var(--tg-text);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
/* Подпись группы пунктов */
.tg-menu__label {
  padding: 6px 8px;
  color: var(--tg-text-muted);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Линия между группами: во всю ширину окна, мимо его отступа */
.tg-menu__separator {
  height: 1px;
  margin: 2px calc(-1 * var(--tg-pad));
  border: 0;
  background: var(--tg-divider);
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
.tg-surface--window,
.tg-surface--page {
  --tg-outer: 0px;
}
.tg-card {
  --tg-outer: var(--tg-radius-xl);
  border-radius: var(--tg-outer);
  background: var(--tg-card);
}
.tg-overlay {
  --tg-outer: var(--tg-radius-xl);
  border: 1px solid var(--tg-overlay-border);
  border-radius: var(--tg-outer);
  background: var(--tg-overlay);
}
.tg-surface--neutral {
  --tg-outer: var(--tg-radius-lg);
  border-radius: var(--tg-outer);
  background: var(--tg-neutral);
}
/* Отступ поверхности до содержимого (Surface padding): с ним она — контейнер правила радиусов */
.tg-pad--0_5 {
  --tg-pad: var(--tg-space-0_5);
}
.tg-pad--1 {
  --tg-pad: var(--tg-space-1);
}
.tg-pad--2 {
  --tg-pad: var(--tg-space-2);
}
.tg-pad--3 {
  --tg-pad: var(--tg-space-3);
}
.tg-pad--4 {
  --tg-pad: var(--tg-space-4);
}
/* Вложенная поверхность (Surface nested): радиус по правилу из ближайшего контейнера */
.tg-nested {
  border-radius: var(--tg-inner, var(--tg-radius-lg));
}
/* Вложенная и сама с отступом: её радиус — внутренний радиус родителя, а детям --tg-inner
 * считается уже на них (на ней самой нельзя — --tg-outer и --tg-inner сослались бы друг на
 * друга). Работает на один уровень; глубже задайте --tg-outer явно */
.tg-nested[class*='tg-pad--'] {
  --tg-outer: var(--tg-inner, var(--tg-radius-lg));
  padding: var(--tg-pad);
  border-radius: var(--tg-outer);
}
:where(.tg-nested[class*='tg-pad--']) > :not([class*='tg-pad--']) {
  --tg-inner: max(0px, calc(var(--tg-outer) - var(--tg-pad)));
}
.tg-divider {
  height: 1px;
  border: 0;
  margin: 0;
  background: var(--tg-divider);
}
/* Вертикальная черта между элементами ряда (Divider orientation="vertical") */
.tg-divider--vertical {
  align-self: stretch;
  width: 1px;
  height: auto;
  margin: 4px 0;
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

/* Кнопка с состоянием «нажата»: <button class="tg-toggle-button" aria-pressed="true"> */
.tg-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-lg));
  background: transparent;
  color: var(--tg-text-muted);
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--tg-hover-out) ease-out, color var(--tg-hover-out) ease-out,
    transform var(--tg-press-out) ease-out;
}
.tg-toggle-button:hover {
  background: var(--tg-hover);
  color: var(--tg-text);
  transition-duration: var(--tg-hover-in);
}
.tg-toggle-button[aria-pressed='true'] {
  background: var(--tg-neutral);
  color: var(--tg-text);
  transition-duration: var(--tg-layout);
}
.tg-toggle-button:active {
  background: var(--tg-press);
  transform: scale(0.97);
  transition-duration: var(--tg-press-in);
}
.tg-toggle-button--icon {
  padding: 6px;
}
.tg-toggle-button svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}
.tg-toggle-button--icon svg {
  width: 16px;
  height: 16px;
}

/* Радиокнопка: <input type="radio" class="tg-radio">, в строке — как .tg-checkbox в .tg-check-row */
.tg-radio {
  appearance: none;
  position: relative;
  flex: none;
  width: 20px;
  height: 20px;
  margin: 2px 0 0;
  border: 1px solid var(--tg-track);
  border-radius: var(--tg-radius-full);
  cursor: pointer;
}
.tg-radio:checked {
  border-color: var(--tg-accent);
}
.tg-radio:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-accent);
}
.tg-checkbox:focus-visible,
.tg-radio:focus-visible,
.tg-toggle:focus-visible {
  outline: 2px solid var(--tg-focus);
  outline-offset: 2px;
}
/* Группа вариантов: строки .tg-check-row друг под другом */
.tg-radio-group {
  display: flex;
  flex-direction: column;
}

/* Подпись и поле формы: подпись, элемент, пояснение и ошибка (Field) */
.tg-label {
  color: var(--tg-text);
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
}
.tg-form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tg-form-field--horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tg-form-field__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.tg-form-field__description,
.tg-form-field__error {
  margin: 0;
  color: var(--tg-text-muted);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
.tg-form-field__error {
  color: var(--tg-danger);
}

/* Поле ввода с иконкой и кнопкой: <label class="tg-input"><svg/><input class="tg-input__control"></label>.
 * С кнопкой справа (.tg-input--trailing) поле — контейнер lg + 2: кнопка внутри md */
.tg-input {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 12px;
  border: 1px solid var(--tg-field-border);
  border-radius: var(--tg-radius-lg);
  background: var(--tg-field);
  color: var(--tg-text);
}
.tg-input:focus-within {
  border-color: var(--tg-focus);
}
.tg-input[aria-invalid='true'] {
  border-color: var(--tg-invalid);
}
.tg-input--trailing {
  --tg-outer: var(--tg-radius-lg);
  --tg-pad: 2px;
}
.tg-input__start {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.tg-input--trailing .tg-input__start {
  padding-left: 10px;
}
.tg-input__control {
  flex: 1;
  min-width: 0;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--tg-text);
  font: inherit;
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
  outline: none;
}
.tg-input--trailing .tg-input__control {
  padding: 6px 0;
}
.tg-input__control::placeholder {
  color: var(--tg-placeholder);
}
.tg-input__control--mono {
  font-family: var(--tg-font-mono);
}
.tg-input__icon {
  display: inline-flex;
  flex: none;
  color: var(--tg-text-muted);
}
.tg-input__icon svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

/* Выпадающий список: кнопка .tg-select и меню .tg-menu под ней */
.tg-select {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 12px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-lg));
  background: var(--tg-neutral);
  color: var(--tg-text);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--tg-hover-out) ease-out, transform var(--tg-press-out) ease-out;
}
.tg-select:hover,
.tg-select[aria-expanded='true'] {
  background: var(--tg-neutral-hover);
  transition-duration: var(--tg-hover-in);
}
.tg-select:active {
  background: var(--tg-segment-press);
  transform: scale(0.98);
}
.tg-select__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tg-select__value--placeholder {
  color: var(--tg-text-muted);
}
/* Уголок «вниз» из двух сторон рамки, как MenuChevron */
.tg-chevron {
  flex: none;
  width: 6px;
  height: 6px;
  margin: -3px 4px 0;
  border: solid var(--tg-text-muted);
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
}
.tg-chevron--right {
  margin-top: 0;
  transform: rotate(-45deg);
}

/* Окна у кнопки: якорь .tg-anchor, окно под ним; .tg-anchor--top — над ним */
.tg-anchor {
  position: relative;
  display: inline-flex;
}
.tg-anchor--block {
  display: flex;
}
.tg-anchor--block > :first-child {
  flex: 1;
}
.tg-floating {
  position: absolute;
  z-index: 50;
  top: calc(100% + 4px);
  left: 0;
}
.tg-floating--end {
  right: 0;
  left: auto;
}
.tg-floating--top {
  top: auto;
  bottom: calc(100% + 4px);
}
.tg-floating--stretch {
  right: 0;
}
/* Контекстное меню: у курсора, координаты ставит скрипт */
.tg-floating--fixed {
  position: fixed;
  top: auto;
}

/* Popover и карточка при наведении: окно с отступом 4 → вложенное lg */
.tg-popover {
  --tg-outer: var(--tg-radius-xl);
  --tg-pad: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 224px;
  border: 1px solid var(--tg-overlay-border);
  background: var(--tg-overlay);
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-popover__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px;
}
.tg-popover__title {
  margin: 0;
  font-weight: 600;
}
.tg-popover__text {
  margin: 0;
  color: var(--tg-text-secondary);
  font-size: var(--tg-text-xs);
  line-height: 20px;
}
.tg-popover__row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
.tg-popover__row > :first-child {
  color: var(--tg-text-muted);
}
.tg-popover__row > :last-child {
  font-weight: 600;
}

/* Подсказка: тёмная плашка в светлой теме и светлая в тёмной, без вложенных фигур */
.tg-tooltip {
  position: absolute;
  z-index: 60;
  bottom: calc(100% + 6px);
  left: 50%;
  width: max-content;
  max-width: 256px;
  padding: 4px 8px;
  border-radius: var(--tg-radius-lg);
  background: var(--tg-tooltip);
  color: var(--tg-tooltip-text);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
  pointer-events: none;
  transform: translateX(-50%);
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-tooltip--bottom {
  top: calc(100% + 6px);
  bottom: auto;
}

/* Модальное окно: затемнение на всё окно и окно по центру. 2xl + 8 → кнопки внутри lg */
.tg-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--tg-scrim);
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-backdrop--sheet {
  padding: 0;
}
.tg-dialog {
  --tg-outer: var(--tg-radius-2xl);
  --tg-pad: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 512px;
  max-height: 88vh;
  overflow: auto;
  border: 1px solid var(--tg-overlay-border);
  background: var(--tg-overlay);
  animation: tg-pop var(--tg-layout) cubic-bezier(0.33, 1, 0.68, 1);
}
.tg-dialog__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px 4px;
}
/* Место под крестик в углу, чтобы заголовок под него не заходил */
.tg-dialog__header--close {
  padding-right: 40px;
}
.tg-dialog__title {
  margin: 0;
  font-size: var(--tg-text-base);
  line-height: var(--tg-leading-base);
  font-weight: 600;
}
.tg-dialog__description {
  margin: 0;
  color: var(--tg-text-secondary);
  line-height: 20px;
}
.tg-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
}
.tg-dialog__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
}
.tg-dialog__close {
  position: absolute;
  top: 8px;
  right: 8px;
}
/* Боковая или нижняя панель: скруглена только со стороны окна */
.tg-sheet {
  --tg-outer: var(--tg-radius-2xl);
  --tg-pad: 8px;
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: auto;
  border: 1px solid var(--tg-overlay-border);
  background: var(--tg-overlay);
}
.tg-sheet--right,
.tg-sheet--left {
  top: 0;
  bottom: 0;
  width: 320px;
  max-width: 100%;
}
.tg-sheet--right {
  right: 0;
  border-right: 0;
  border-radius: var(--tg-outer) 0 0 var(--tg-outer);
  animation: tg-slide-left var(--tg-layout) cubic-bezier(0.33, 1, 0.68, 1);
}
.tg-sheet--left {
  left: 0;
  border-left: 0;
  border-radius: 0 var(--tg-outer) var(--tg-outer) 0;
  animation: tg-slide-right var(--tg-layout) cubic-bezier(0.33, 1, 0.68, 1);
}
.tg-sheet--bottom {
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 88vh;
  border-bottom: 0;
  border-radius: var(--tg-outer) var(--tg-outer) 0 0;
  animation: tg-slide-up var(--tg-layout) cubic-bezier(0.33, 1, 0.68, 1);
}
.tg-sheet__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 40px 8px 12px;
}
.tg-sheet__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
}
@keyframes tg-pop {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}
@keyframes tg-slide-left {
  from {
    transform: translateX(100%);
  }
}
@keyframes tg-slide-right {
  from {
    transform: translateX(-100%);
  }
}
@keyframes tg-slide-up {
  from {
    transform: translateY(100%);
  }
}

/* Вкладки: список-дорожка (lg + 2 → вкладки md), с полосой снизу или боковой столбик */
.tg-tabs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tg-tabs--vertical {
  flex-direction: row;
  align-items: flex-start;
}
.tg-tabs__list {
  --tg-outer: var(--tg-radius-lg);
  --tg-pad: 2px;
  display: flex;
  align-self: flex-start;
  gap: 2px;
  background: var(--tg-neutral);
}
.tg-tabs__list--fill {
  align-self: stretch;
}
.tg-tabs__list--fill > .tg-tabs__trigger {
  flex: 1;
}
.tg-tabs__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 12px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-md));
  background: transparent;
  color: var(--tg-text-muted);
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--tg-deselect) ease-out, color var(--tg-deselect) ease-out;
}
.tg-tabs__trigger svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
}
.tg-tabs__trigger:hover {
  background: var(--tg-segment-hover);
  color: var(--tg-text);
}
.tg-tabs__trigger[aria-selected='true'] {
  background: var(--tg-segment-active);
  color: var(--tg-text);
  transition-duration: var(--tg-layout);
}
.tg-tabs__trigger:active {
  background: var(--tg-segment-press);
}
.tg-tabs__trigger:focus-visible,
.tg-segment:focus-visible,
.tg-disclosure:focus-visible {
  outline: 2px solid var(--tg-focus);
  outline-offset: -2px;
}
/* С полосой: без дорожки, вкладки rounded-md с отступом снизу под полосу */
.tg-tabs__list--underline {
  gap: 4px;
  padding: 0;
  border-bottom: 1px solid var(--tg-divider);
  border-radius: 0;
  background: transparent;
}
.tg-tabs__list--underline > .tg-tabs__trigger {
  margin-bottom: 4px;
  padding: 6px 12px;
  border-radius: var(--tg-radius-md);
}
.tg-tabs__list--underline > .tg-tabs__trigger:hover,
.tg-tabs__list--underline > .tg-tabs__trigger[aria-selected='true'] {
  background: transparent;
}
.tg-tabs__list--underline > .tg-tabs__trigger:hover {
  background: var(--tg-hover);
}
.tg-tabs__list--underline > .tg-tabs__trigger:active {
  background: var(--tg-press);
}
.tg-tabs__list--underline > .tg-tabs__trigger[aria-selected='true']::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -5px;
  left: 0;
  height: 2px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-accent);
  animation: tg-appear var(--tg-layout) ease-out;
}
/* Боковой столбик, как вкладки лаунчера: пункт lg + 4 → плашка иконки sm */
.tg-tabs__list--vertical {
  flex-direction: column;
  align-self: stretch;
  min-width: 176px;
  padding: 0;
  border-radius: 0;
  background: transparent;
}
.tg-tabs__trigger--vertical {
  --tg-outer: var(--tg-radius-lg);
  --tg-pad: 4px;
  justify-content: flex-start;
  gap: 8px;
  padding-right: 8px;
}
.tg-tabs__trigger--vertical:hover,
.tg-tabs__trigger--vertical[aria-selected='true'] {
  background: var(--tg-neutral);
}
.tg-tabs__trigger--vertical:active {
  background: var(--tg-tab-press);
}
.tg-tabs__plate {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--tg-inner);
  background: var(--tg-tab-plate);
  color: var(--tg-tab-icon);
}
.tg-tabs__plate svg {
  width: 16px;
  height: 16px;
}
.tg-tabs__trigger--vertical[aria-selected='true'] .tg-tabs__plate {
  background: var(--tg-accent);
  color: var(--tg-text-on-accent);
}
/* Без плашки подпись не прилипает к краю */
.tg-tabs__trigger--vertical:not(:has(.tg-tabs__plate)) {
  padding: 8px 12px;
}
.tg-tabs__panel {
  min-width: 0;
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-tabs--vertical > .tg-tabs__panel {
  flex: 1;
}
.tg-tabs__panel[hidden] {
  display: none;
}

/* Раскрывающиеся строки: аккордеон (с линией или в карточке xl + 4 → строки lg) и Collapsible */
.tg-accordion {
  display: flex;
  flex-direction: column;
}
.tg-accordion__item {
  border-bottom: 1px solid var(--tg-divider);
}
.tg-accordion--card {
  --tg-outer: var(--tg-radius-xl);
  --tg-pad: 4px;
  gap: 2px;
  background: var(--tg-card);
}
.tg-accordion--card > .tg-accordion__item {
  border-bottom: 0;
}
.tg-disclosure {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-md));
  background: transparent;
  color: var(--tg-text);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--tg-hover-out) ease-out;
}
.tg-disclosure:hover {
  background: var(--tg-hover);
  transition-duration: var(--tg-hover-in);
}
.tg-disclosure:active {
  background: var(--tg-press);
}
.tg-disclosure > svg {
  flex: none;
  width: 16px;
  height: 16px;
  fill: var(--tg-text-muted);
}
.tg-disclosure__label {
  flex: 1;
  min-width: 0;
}
/* Шеврон «вниз»: поворачивается на 180° при раскрытии */
.tg-disclosure__chevron {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: transform var(--tg-layout) ease-out;
}
.tg-disclosure__chevron::before {
  content: '';
  width: 7px;
  height: 7px;
  margin-top: -4px;
  border: solid var(--tg-text-muted);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.tg-disclosure[aria-expanded='true'] .tg-disclosure__chevron {
  transform: rotate(180deg);
}
.tg-accordion__content {
  padding: 0 12px 12px;
  color: var(--tg-text-secondary);
  line-height: 20px;
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-collapsible__content {
  animation: tg-appear var(--tg-appear) ease-out;
}
.tg-accordion__content[hidden],
.tg-collapsible__content[hidden] {
  display: none;
}

/* Аватар: круг или квадрат со скруглением по размеру. Обводка — отступ 2 с фоном страницы,
 * её радиус — по тому же правилу наоборот: радиус аватара + 2 */
.tg-avatar {
  --tg-avatar-size: 32px;
  --tg-avatar-radius: var(--tg-radius-full);
  --tg-avatar-dot: 12px;
  position: relative;
  display: inline-flex;
  flex: none;
  align-self: flex-start;
}
.tg-avatar--sm {
  --tg-avatar-size: 24px;
  --tg-avatar-dot: 10px;
}
.tg-avatar--lg {
  --tg-avatar-size: 40px;
  --tg-avatar-dot: 14px;
}
.tg-avatar--rounded {
  --tg-avatar-radius: var(--tg-radius-md);
}
.tg-avatar--rounded.tg-avatar--sm {
  --tg-avatar-radius: var(--tg-radius-sm);
}
.tg-avatar--rounded.tg-avatar--lg {
  --tg-avatar-radius: var(--tg-radius-lg);
}
.tg-avatar__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--tg-avatar-size);
  height: var(--tg-avatar-size);
  overflow: hidden;
  border-radius: var(--tg-avatar-radius);
  background: var(--tg-neutral);
  color: var(--tg-avatar-text);
  font-size: var(--tg-text-sm);
  line-height: var(--tg-leading-sm);
  font-weight: 600;
}
.tg-avatar--sm .tg-avatar__box {
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
.tg-avatar--lg .tg-avatar__box {
  font-size: var(--tg-text-base);
  line-height: var(--tg-leading-base);
}
.tg-avatar__box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tg-avatar--ring {
  padding: 2px;
  border-radius: calc(var(--tg-avatar-radius) + 2px);
  background: var(--tg-page);
}
.tg-avatar__status {
  position: absolute;
  right: 0;
  bottom: 0;
  width: var(--tg-avatar-dot);
  height: var(--tg-avatar-dot);
  padding: 2px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-page);
}
/* У квадрата угол заполнен — точка чуть выступает за него */
.tg-avatar--rounded .tg-avatar__status {
  right: -2px;
  bottom: -2px;
}
.tg-avatar__status::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: var(--tg-radius-full);
  background: var(--tg-status-offline);
}
.tg-avatar__status--online::after {
  background: var(--tg-green-500);
}
.tg-avatar__status--away::after {
  background: var(--tg-amber-400);
}
.tg-avatar__status--busy::after {
  background: var(--tg-red-500);
}
/* Аватары внахлёст: каждый следующий заходит на предыдущий примерно на треть */
.tg-avatar-group {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
}
.tg-avatar-group > .tg-avatar + .tg-avatar {
  margin-left: -10px;
}
.tg-avatar-group > .tg-avatar--sm + .tg-avatar--sm {
  margin-left: -8px;
}
.tg-avatar-group > .tg-avatar--lg + .tg-avatar--lg {
  margin-left: -12px;
}
.tg-avatar-group .tg-avatar__box {
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}

/* Полоса прогресса: заливка едет сдвигом (transform), а не шириной */
.tg-progress {
  --tg-progress: 0;
  height: 6px;
  overflow: hidden;
  border-radius: var(--tg-radius-full);
  background: var(--tg-neutral);
}
.tg-progress__fill {
  width: 100%;
  height: 100%;
  border-radius: var(--tg-radius-full);
  background: var(--tg-accent);
  transform: translateX(calc(var(--tg-progress) * 1% - 100%));
  transition: transform var(--tg-layout) ease-out;
}
.tg-progress--play .tg-progress__fill {
  background: var(--tg-play);
}
.tg-progress--warning .tg-progress__fill {
  background: var(--tg-amber-500);
}
.tg-progress--danger .tg-progress__fill {
  background: var(--tg-red-500);
}
/* Без значения: бегунок 40% ширины пробегает дорожку */
.tg-progress--indeterminate .tg-progress__fill {
  width: 40%;
  transform: translateX(-100%);
  animation: tg-run 1200ms ease-in-out infinite;
}
@keyframes tg-run {
  to {
    transform: translateX(250%);
  }
}

/* Сообщение на странице: xl + 4 → кнопки справа lg; текст отступает дальше */
.tg-alert {
  --tg-outer: var(--tg-radius-xl);
  --tg-pad: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${resolveColor('blue.500/10')};
}
.tg-alert__body {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 8px 10px;
}
.tg-alert__icon {
  display: flex;
  flex: none;
  align-items: center;
  height: 20px;
  color: var(--tg-info);
}
.tg-alert__icon svg,
.tg-toast__icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
.tg-alert__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.tg-alert__title {
  margin: 0;
  color: var(--tg-info);
  font-weight: 600;
}
.tg-alert__description {
  margin: 0;
  color: var(--tg-text-secondary);
  font-size: var(--tg-text-xs);
  line-height: 20px;
}
.tg-alert__actions {
  display: flex;
  gap: 4px;
}
${alertClasses}

/* Уведомление: 2xl + 8 → кнопки внутри lg. Стопка — внизу справа или по центру */
.tg-toaster {
  position: fixed;
  z-index: 200;
  right: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: none;
}
.tg-toaster--center {
  left: 16px;
  align-items: center;
}
.tg-toast {
  --tg-outer: var(--tg-radius-2xl);
  --tg-pad: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 320px;
  max-width: 100%;
  border: 1px solid var(--tg-overlay-border);
  background: var(--tg-overlay);
  pointer-events: auto;
  animation: tg-rise var(--tg-layout) cubic-bezier(0.33, 1, 0.68, 1);
}
.tg-toast--closing {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--tg-layout) ease-in, transform var(--tg-layout) ease-in;
}
.tg-toast__icon {
  display: flex;
  align-self: flex-start;
  padding: 6px 0 0 8px;
  color: var(--tg-text-muted);
}
.tg-toast__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: 4px 8px;
}
.tg-toast__title {
  margin: 0;
  font-weight: 600;
}
.tg-toast__description {
  margin: 0;
  color: var(--tg-text-secondary);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
/* Крестик из двух повёрнутых линий: kit не зависит от набора иконок */
.tg-toast__close {
  position: relative;
  flex: none;
  align-self: flex-start;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--tg-inner, var(--tg-radius-lg));
  background: transparent;
  cursor: pointer;
}
.tg-toast__close:hover {
  background: var(--tg-hover);
}
.tg-toast__close:active {
  background: var(--tg-press);
}
.tg-toast__close::before,
.tg-toast__close::after {
  content: '';
  position: absolute;
  top: 13px;
  left: 8.5px;
  width: 11px;
  height: 1.5px;
  border-radius: var(--tg-radius-full);
  background: var(--tg-text-faint);
  transform: rotate(45deg);
}
.tg-toast__close::after {
  transform: rotate(-45deg);
}
${toastClasses}
@keyframes tg-rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

/* Клавиша: нижняя рамка толще — клавиша «стоит» на поверхности */
.tg-kbd {
  display: inline-flex;
  align-self: flex-start;
  padding: 2px 6px;
  border: 1px solid var(--tg-track);
  border-bottom-width: 2px;
  border-radius: var(--tg-radius-md);
  background: var(--tg-card);
  color: var(--tg-text-secondary);
  font-family: var(--tg-font-mono);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
}
.tg-kbd-combo {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 4px;
  color: var(--tg-text-muted);
  font-size: var(--tg-text-xs);
  line-height: var(--tg-leading-xs);
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
