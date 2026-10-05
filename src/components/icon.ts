import type React from 'react';

/**
 * Иконка для элементов kit: любой компонент с size и color. Набор иконок kit не навязывает —
 * подходят Icons.* лаунчера, @gravity-ui/icons и свои SVG мини-приложения
 */
export type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
}>;
