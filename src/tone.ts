// Цвета текста по смыслу — общие для компонентов лаунчера и веб-слоя: один словарь классов

/** Смысл цвета текста (DESIGN.md: «Текст» и «Смысловые цвета») */
export type TextTone =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'faint'
  | 'info'
  | 'success'
  | 'danger'
  | 'warning'
  | 'special'
  | 'onAccent';

// Классы целиком — иначе Uniwind и Tailwind их не найдёт при сборке
export const TONE_CLASS: Record<TextTone, string> = {
  default: 'text-mist-950 dark:text-mist-50',
  secondary: 'text-mist-700 dark:text-mist-300',
  muted: 'text-mist-500 dark:text-mist-400',
  faint: 'text-mist-400 dark:text-mist-500',
  info: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  danger: 'text-red-600 dark:text-red-400',
  warning: 'text-amber-600 dark:text-amber-400',
  special: 'text-violet-700 dark:text-violet-400',
  onAccent: 'text-mist-50',
};
