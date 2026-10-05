import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { radius, type ColorRole } from '../tokens';
import { Text } from './text';

export type SurfaceKind = 'window' | 'page' | 'card' | 'overlay' | 'neutral';

const SURFACE: Record<SurfaceKind, ColorRole> = {
  window: 'window',
  page: 'page',
  card: 'card',
  overlay: 'overlay',
  neutral: 'neutral',
};

const RADIUS: Record<SurfaceKind, number> = {
  window: 0,
  page: 0,
  card: radius.xl,
  overlay: radius.xl,
  neutral: radius.lg,
};

export interface SurfaceProps {
  /** Уровень поверхности (DESIGN.md: «Поверхности»). Уровни разделяются цветом и рамкой, не тенью */
  kind?: SurfaceKind;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Поверхность: окно, страница, карточка на странице, всплывающее окно или меню */
export const Surface: React.FC<SurfaceProps> = ({
  kind = 'card',
  children,
  style,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        { backgroundColor: colors[SURFACE[kind]], borderRadius: RADIUS[kind] },
        kind === 'overlay' && {
          borderWidth: 1,
          borderColor: colors.overlayBorder,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

/** Разделитель h-px; inset — с отступами по краям, как между строками карточки */
export const Divider: React.FC<{ inset?: boolean }> = ({ inset = false }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: 1,
        marginHorizontal: inset ? 16 : 0,
        backgroundColor: colors.divider,
      }}
    />
  );
};

/** Карточка со строками через разделитель */
export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Surface kind="card">
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
  <View style={{ gap: 8 }}>
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
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: 16,
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexShrink: 1,
      }}
    >
      {leading}
      <View style={{ gap: 2, flexShrink: 1 }}>
        <Text>{title}</Text>
        {description ? (
          <Text size="xs" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
    {children ? (
      // Одна ширина, чтобы края элементов в карточке совпадали
      <View style={{ width: wide ? 320 : 224, maxWidth: '100%' }}>
        {children}
      </View>
    ) : null}
  </View>
);
