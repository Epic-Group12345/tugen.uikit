import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import {
  PADDING_CLASS,
  RadiusScope,
  radiusProps,
  toRadius,
  useInnerRadius,
  type RadiusStep,
  type SpaceStep,
} from '../radius';
import { cx } from './cx';
import { Text } from './text';

export type SurfaceKind = 'window' | 'page' | 'card' | 'overlay' | 'neutral';

// Уровни поверхностей (DESIGN.md: «Поверхности»): разделяются цветом и рамкой, не тенью.
// Классы целиком — иначе Tailwind их не найдёт при сборке
export const SURFACE: Record<SurfaceKind, string> = {
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

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ref?: React.Ref<HTMLDivElement>;
}

export const Surface: React.FC<SurfaceProps> = ({
  kind = 'card',
  radius,
  padding,
  nested = false,
  className,
  style,
  children,
  ...props
}) => {
  const own = toRadius(radius ?? DEFAULT_RADIUS[kind]);
  const inherited = useInnerRadius(own);
  const r = nested ? inherited : own;
  const rounded = radiusProps(r);
  const body = (
    <div
      {...props}
      className={cx(
        SURFACE[kind],
        rounded.className,
        padding && PADDING_CLASS[padding],
        className,
      )}
      style={rounded.style ? { ...rounded.style, ...style } : style}
    >
      {children}
    </div>
  );
  return padding ? (
    <RadiusScope radius={r} padding={padding}>
      {body}
    </RadiusScope>
  ) : (
    body
  );
};

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /** horizontal — линия h-px между строками; vertical — w-px между элементами ряда */
  orientation?: DividerOrientation;
  /** С отступами по краям, как между строками карточки */
  inset?: boolean;
  /**
   * Только оформление (по умолчанию): диктор его пропускает. false — смысловой разделитель
   * с ролью separator
   */
  decorative?: boolean;
  className?: string;
}

// Классы целиком — иначе Tailwind их не найдёт при сборке
const DIVIDER: Record<DividerOrientation, string> = {
  horizontal: 'h-px self-stretch shrink-0',
  vertical: 'w-px self-stretch shrink-0',
};

const DIVIDER_INSET: Record<DividerOrientation, string> = {
  horizontal: 'mx-4',
  vertical: 'my-1',
};

/** Разделитель на Radix Separator: роль и aria-orientation — из примитива */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  inset = false,
  decorative = true,
  className,
}) => (
  <SeparatorPrimitive.Root
    orientation={orientation}
    decorative={decorative}
    className={cx(
      DIVIDER[orientation],
      'bg-mist-200 dark:bg-mist-800',
      inset && DIVIDER_INSET[orientation],
      className,
    )}
  />
);

/** Карточка со строками через разделитель */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Surface kind="card" className={cx('flex flex-col', className)}>
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
  className?: string;
}> = ({ title, children, className }) => (
  <section className={cx('flex flex-col gap-2', className)}>
    <Text as="h2" size="xs" tone="muted" uppercase>
      {title}
    </Text>
    <Card>{children}</Card>
  </section>
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
  <div className="flex flex-row flex-wrap items-center justify-between gap-3 p-4">
    <div className="flex flex-row items-center gap-3 min-w-0 shrink">
      {leading}
      <div className="flex flex-col gap-0.5 min-w-0">
        <Text>{title}</Text>
        {description ? (
          <Text size="xs" tone="muted">
            {description}
          </Text>
        ) : null}
      </div>
    </div>
    {/* Элементы управления одной ширины, чтобы их края в карточке совпадали */}
    {children ? (
      <div className={cx(wide ? 'w-80' : 'w-56', 'max-w-full')}>{children}</div>
    ) : null}
  </div>
);
