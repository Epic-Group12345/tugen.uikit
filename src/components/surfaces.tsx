import React from 'react';
import { View } from 'react-native';
import { Text } from './text';

export type SurfaceKind = 'window' | 'page' | 'card' | 'overlay' | 'neutral';

// Уровни поверхностей (DESIGN.md: «Поверхности»): разделяются цветом и рамкой, не тенью.
// Классы целиком — иначе Uniwind их не найдёт при сборке
const SURFACE: Record<SurfaceKind, string> = {
  window: 'bg-mist-100 dark:bg-mist-900',
  page: 'bg-mist-50 dark:bg-mist-950',
  card: 'rounded-xl bg-mist-100 dark:bg-mist-900',
  overlay:
    'rounded-xl border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900',
  neutral: 'rounded-lg bg-mist-200 dark:bg-mist-800',
};

export interface SurfaceProps {
  /** Уровень поверхности: окно, страница, карточка, всплывающее окно или меню */
  kind?: SurfaceKind;
  /** Дополнительные классы Uniwind: раскладка и отступы */
  className?: string;
  children?: React.ReactNode;
}

export const Surface: React.FC<SurfaceProps> = ({
  kind = 'card',
  className = '',
  children,
}) => <View className={`${SURFACE[kind]} ${className}`}>{children}</View>;

/** Разделитель h-px; inset — с отступами по краям, как между строками карточки */
export const Divider: React.FC<{ inset?: boolean }> = ({ inset = false }) => (
  <View
    className={`h-px bg-mist-200 dark:bg-mist-800 ${inset ? 'mx-4' : ''}`}
  />
);

/** Карточка со строками через разделитель */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Surface kind="card" className={className}>
    {React.Children.toArray(children).map((child, i) => (
      <React.Fragment key={i}>
        {i > 0 && <Divider inset />}
        {child}
      </React.Fragment>
    ))}
  </Surface>
);

/** Раздел: подпись заглавными и под ней карточка */
export const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <View className="gap-2">
    <Text size="xs" tone="muted" uppercase>
      {title}
    </Text>
    <Card>{children}</Card>
  </View>
);

export interface RowProps {
  title: string;
  description?: string;
  /** Слева от подписи: логотип, аватар */
  leading?: React.ReactNode;
  /** Ширина элементов управления справа; wide — для полей с путём и аргументами */
  wide?: boolean;
  /** Элементы управления справа */
  children?: React.ReactNode;
}

/** Строка карточки: подпись слева, элементы управления справа одной ширины */
export const Row: React.FC<RowProps> = ({
  title,
  description,
  leading,
  wide = false,
  children,
}) => (
  <View className="flex-row flex-wrap items-center justify-between gap-3 p-4">
    <View className="flex-row items-center gap-3 flex-shrink">
      {leading}
      <View className="gap-0.5 flex-shrink">
        <Text>{title}</Text>
        {description ? (
          <Text size="xs" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
    {/* Элементы управления одной ширины, чтобы их края в карточке совпадали */}
    {children ? (
      <View className={`${wide ? 'w-80' : 'w-56'} max-w-full`}>{children}</View>
    ) : null}
  </View>
);
