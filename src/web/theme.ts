export type WebTheme = 'light' | 'dark' | 'system';

/**
 * Тема страницы: light / dark — класс на <html>, system — как в системе (prefers-color-scheme).
 * Классы dark: компонентов следуют за ней через вариант dark из web.css
 */
export const setTheme = (theme: WebTheme, root = document.documentElement) => {
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
};
