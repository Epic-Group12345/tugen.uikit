// @tugen/uikit/web — веб-слой kit для Vite + React (React DOM): те же токены, правило скругления и
// оформление, что у компонентов лаунчера, на Radix и Tailwind. Стили — @tugen/uikit/web.css

export * from '../tokens';
export * from '../radius';
export type { IconComponent } from '../components/icon';
export { cx } from './cx';
export { setTheme, type WebTheme } from './theme';

// Иконки — набор Gravity UI: Icons.Gear, каталог для поиска — ICON_CATALOG
export * as Icons from './icons';
export { ICON_CATALOG } from './icon-catalog';
export type { IconInfo, IconName, IconProps, WebIcon } from './glyph';
export * from './text';
export * from './button';
export * from './surfaces';
export * from './floating';

// Окна, подсказки, уведомления
export * from './dialog';
export * from './sheet';
export * from './popover';
export * from './hover-card';
export * from './tooltip';
export * from './toast';
export * from './popup';

// Меню и списки
export * from './menu-parts';
export * from './dropdown-menu';
export * from './context-menu';
export * from './select';
export {
  Dropdown,
  Menu,
  Select,
  useDropdownMenu,
  type DropdownProps,
  type MenuItem,
  type MenuProps,
  type SelectOption,
  type SelectProps,
} from './menu';

// Формы
export * from './label';
export * from './field';
export * from './text-field';
export * from './checkbox';
export * from './radio-group';
export * from './toggle-group';
export {
  CheckRow,
  Segmented,
  Slider,
  Toggle,
  type CheckRowProps,
  type SegmentOption,
  type SegmentedProps,
  type SliderProps,
  type ToggleProps,
} from './controls';

// Отображение
export * from './pill';
export * from './skeleton';
export * from './empty-state';
export * from './kbd';
export * from './alert';
export * from './progress';
export * from './avatar';
export * from './tabs';
export * from './accordion';
export * from './collapsible';
