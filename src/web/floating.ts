// Общее оформление всплывающих окон веб-слоя: меню, списки, поповеры, подсказки. Поверхность
// overlay (цвет и рамка, без тени — DESIGN.md: «Поверхности») и появление opacity + scale

/** Поверхность всплывающего окна: rounded-xl p-1 — пункты внутри получают rounded-lg по правилу */
export const FLOATING =
  'z-50 border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900 outline-none origin-[var(--radix-popper-transform-origin)] data-[state=open]:animate-tg-pop-in data-[state=closed]:animate-tg-pop-out data-[state=delayed-open]:animate-tg-pop-in';

/** Затемнение под модальным окном */
export const SCRIM =
  'fixed inset-0 z-50 bg-mist-950/50 data-[state=open]:animate-tg-fade-in data-[state=closed]:animate-tg-fade-out';

/** Отступ окна от кнопки, px */
export const SIDE_OFFSET = 6;
/** Отступ окна от края страницы, px */
export const COLLISION_PADDING = 8;
