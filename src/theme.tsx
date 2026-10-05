import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { themes, type ColorScheme, type ThemeColors } from './tokens';

interface UIKitTheme {
  scheme: ColorScheme;
  colors: ThemeColors;
}

const ThemeContext = createContext<ColorScheme | null>(null);

interface ThemeProviderProps {
  /**
   * Тема, которую выбрал игрок. Без неё — тема системы. Лаунчер передаёт свою: Appearance в RNW
   * не узнаёт о смене темы Windows, поэтому полагаться на useColorScheme там нельзя
   */
  scheme?: ColorScheme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  scheme,
  children,
}) => {
  const system = useColorScheme();
  const resolved = scheme ?? (system === 'dark' ? 'dark' : 'light');
  return (
    <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>
  );
};

/** Текущая тема и цвета её ролей: const { colors } = useTheme(); colors.textMuted */
export const useTheme = (): UIKitTheme => {
  const provided = useContext(ThemeContext);
  const system = useColorScheme();
  const scheme = provided ?? (system === 'dark' ? 'dark' : 'light');
  return useMemo(() => ({ scheme, colors: themes[scheme] }), [scheme]);
};
