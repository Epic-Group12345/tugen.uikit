import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  PADDING_CLASS,
  RadiusScope,
  radiusProps,
  toRadius,
  useInnerRadius,
  type RadiusStep,
  type SpaceStep,
} from '../radius';
import { Text } from './text';

export type SurfaceKind = 'window' | 'page' | 'card' | 'overlay' | 'neutral';

// Уровни поверхностей (DESIGN.md: «Поверхности»): разделяются цветом и рамкой, не тенью.
// Классы целиком — иначе Uniwind их не найдёт при сборке
const SURFACE: Record<SurfaceKind, string> = {
  window: 'bg-mist-100 dark:bg-mist-900',
  page: 'bg-mist-50 dark:bg-mist-950',
  card: 'bg-mist-100 dark:bg-mist-900',
  overlay:
    'border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900',
  neutral: 'bg-mist-200 dark:bg-mist-800',
};

// Скругление уровня по умолчанию: окно и страница — без него
const DEFAULT_RADIUS: Record<SurfaceKind, RadiusStep> = {
  window: 'none',
  page: 'none',
  card: 'xl',
  overlay: 'xl',
  neutral: 'lg',
};

export interface SurfaceProps {
  /** Уровень поверхности: окно, страница, карточка, всплывающее окно или меню */
  kind?: SurfaceKind;
  /** Скругление вместо обычного для уровня */
  radius?: RadiusStep;
  /**
   * Отступ до содержимого. С ним поверхность становится контейнером правила радиусов:
   * вложенные Surface nested, кнопки и пункты получат radius − padding
   */
  padding?: SpaceStep;
  /**
   * Вложенная поверхность: скругление по правилу из ближайшего контейнера (внешний радиус
   * минус его отступ), а не своё. Плашка в карточке, картинка в окне
   */
  nested?: boolean;
  /** Дополнительные классы Uniwind: раскладка и отступы по осям */
  className?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const Surface: React.FC<SurfaceProps> = ({
  kind = 'card',
  radius,
  padding,
  nested = false,
  className = '',
  style,
  children,
}) => {
  const own = toRadius(radius ?? DEFAULT_RADIUS[kind]);
  const inherited = useInnerRadius(own);
  const r = nested ? inherited : own;
  const rounded = radiusProps(r);
  const body = (
    <View
      className={`${SURFACE[kind]} ${rounded.className} ${
        padding ? PADDING_CLASS[padding] : ''
      } ${className}`}
      style={rounded.style ? [rounded.style, style] : style}
    >
      {children}
    </View>
  );
  return padding ? (
    <RadiusScope radius={r} padding={padding}>
      {body}
    </RadiusScope>
  ) : (
    body
  );
};

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
