// @tugen/uikit/web — веб-слой kit для Vite + React (React DOM): те же токены, правило скругления и
// оформление, что у компонентов лаунчера, на Radix и Tailwind. Стили — @tugen/uikit/web.css

export * from '../tokens';
export * from '../radius';
export type { IconComponent } from '../components/icon';
export { cx } from './cx';
export { setTheme, type WebTheme } from './theme';
export * from './text';
export * from './button';
export * from './surfaces';
export * from './floating';
