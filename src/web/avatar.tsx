import React, { createContext, useContext } from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { outerRadius, radiusProps, toRadius, type RadiusStep } from '../radius';
import type { TextSize } from '../tokens';
import { cx } from './cx';
import { Text } from './text';

// Аватар на Radix Avatar: картинка, пока грузится и если не загрузилась — инициалы (примитив сам
// переключает Image и Fallback по состоянию загрузки). Точка статуса в углу — где человек, как
// в чатах лаунчера. В группе аватары идут внахлёст с обводкой цветом фона

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarShape = 'circle' | 'rounded';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

// Классы целиком — иначе Tailwind их не найдёт при сборке
const BOX: Record<AvatarSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

// Скругление квадратного аватара растёт с размером (как avatarRadius лаунчера): одна форма
// в списке, карточке и чате
const ROUNDED: Record<AvatarSize, RadiusStep> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const INITIALS_SIZE: Record<AvatarSize, TextSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'base',
};

const DOT_SIZE: Record<AvatarSize, string> = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
};

const STATUS: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  away: 'bg-amber-400',
  busy: 'bg-red-500',
  offline: 'bg-mist-400 dark:bg-mist-600',
};

// У круга угол «пустой» — точка встаёт на край круга; у квадрата чуть выступает за угол
const DOT_PLACE: Record<AvatarShape, string> = {
  circle: 'right-0 bottom-0',
  rounded: '-right-0.5 -bottom-0.5',
};

/** Обводка по умолчанию — цвет фона страницы */
const RING = 'bg-mist-50 dark:bg-mist-950';
/** Толщина обводки, px (p-0.5) */
const RING_WIDTH = 2;

const AvatarContext = createContext<{ size: AvatarSize }>({ size: 'md' });

interface GroupContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  ringClassName: string;
}
const GroupContext = createContext<GroupContextValue | null>(null);

/** Инициалы имени: первые буквы двух первых слов — «Алекс Стив» → «АС» */
export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]!.toUpperCase())
    .join('') || '?';

/** Радиус аватара в px */
const avatarRadius = (size: AvatarSize, shape: AvatarShape) =>
  shape === 'circle' ? toRadius('full') : toRadius(ROUNDED[size]);

export interface AvatarProps {
  /** Имя: подпись для экранного диктора и инициалы, если картинки нет */
  alt: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Адрес картинки; без children Avatar сам рисует AvatarImage и AvatarFallback */
  src?: string;
  /** Точка в углу: где человек */
  status?: AvatarStatus;
  /**
   * Обводка цветом фона (в AvatarGroup — всегда). По правилу радиусов её внешний радиус —
   * радиус аватара плюс толщина: обводка идёт параллельно краю
   */
  ring?: boolean;
  /** Цвет обводки и края точки — под фон, на котором аватар: "bg-mist-100 dark:bg-mist-900" */
  ringClassName?: string;
  /** Свои AvatarImage и AvatarFallback */
  children?: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  alt,
  size: sizeProp,
  shape: shapeProp,
  src,
  status,
  ring: ringProp,
  ringClassName: ringClassProp,
  children,
  className,
}) => {
  const group = useContext(GroupContext);
  const size = sizeProp ?? group?.size ?? 'md';
  const shape = shapeProp ?? group?.shape ?? 'circle';
  const ring = ringProp ?? !!group;
  const ringClassName = ringClassProp ?? group?.ringClassName ?? RING;
  const inner = avatarRadius(size, shape);
  const rounded = radiusProps(inner);

  const avatar = (
    // Подпись — у корня: картинка или инициалы внутри только её показывают
    <AvatarPrimitive.Root
      role="img"
      aria-label={alt}
      className={cx(
        'flex shrink-0 items-center justify-center overflow-hidden bg-mist-200 dark:bg-mist-800',
        BOX[size],
        rounded.className,
      )}
      style={rounded.style}
    >
      {children ?? (
        <>
          {src ? <AvatarImage src={src} /> : null}
          <AvatarFallback>{initials(alt)}</AvatarFallback>
        </>
      )}
    </AvatarPrimitive.Root>
  );

  // Обводка — отступ p-0.5 с фоном: внешний радиус = внутренний + 2 (вне шкалы — числом)
  const outer = radiusProps(outerRadius(inner, RING_WIDTH));
  return (
    <AvatarContext.Provider value={{ size }}>
      <span
        className={cx('relative inline-flex shrink-0 self-start', className)}
      >
        {ring ? (
          <span
            className={cx('flex p-0.5', ringClassName, outer.className)}
            style={outer.style}
          >
            {avatar}
          </span>
        ) : (
          avatar
        )}
        {status ? (
          // Край точки — тем же приёмом, что обводка: отступ p-0.5 с фоном, а не border-*, чтобы
          // приложение передавало один класс фона
          <span
            role="img"
            aria-label={status}
            className={cx(
              'absolute flex p-0.5 rounded-full',
              DOT_PLACE[shape],
              DOT_SIZE[size],
              ringClassName,
            )}
          >
            <span className={cx('flex-1 rounded-full', STATUS[status])} />
          </span>
        ) : null}
      </span>
    </AvatarContext.Provider>
  );
};

export type AvatarImageProps = AvatarPrimitive.AvatarImageProps;

/** Картинка аватара: видна, когда загрузилась. Подпись уже у Avatar — здесь alt пустой */
export const AvatarImage: React.FC<AvatarImageProps> = ({
  alt = '',
  className,
  ...props
}) => (
  <AvatarPrimitive.Image
    {...props}
    alt={alt}
    className={cx('w-full h-full object-cover', className)}
  />
);

/** Замена картинке: строка — инициалами по размеру аватара, иначе как есть (иконка группы) */
export const AvatarFallback: React.FC<{
  children?: React.ReactNode;
  /** Показать замену не сразу: пока быстрая картинка грузится, инициалы не мелькают */
  delayMs?: number;
}> = ({ children, delayMs }) => {
  const { size } = useContext(AvatarContext);
  return (
    <AvatarPrimitive.Fallback
      delayMs={delayMs}
      className="flex w-full h-full items-center justify-center"
    >
      {typeof children === 'string' ? (
        <Text
          size={INITIALS_SIZE[size]}
          weight="semibold"
          truncate
          className="text-mist-600 dark:text-mist-300"
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </AvatarPrimitive.Fallback>
  );
};

export interface AvatarGroupProps {
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Сколько аватаров показать; остальные — плашкой «+N» */
  max?: number;
  /** Цвет обводки — под фон, на котором группа */
  ringClassName?: string;
  /** Подпись группы для экранного диктора */
  'aria-label'?: string;
  className?: string;
  children: React.ReactNode;
}

// Нахлёст: каждый следующий аватар заходит на предыдущий примерно на треть
const OVERLAP: Record<AvatarSize, string> = {
  sm: '-ml-2',
  md: '-ml-2.5',
  lg: '-ml-3',
};

/** Аватары внахлёст: участники сервера, друзья в игре */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  size = 'md',
  shape = 'circle',
  max,
  ringClassName = RING,
  'aria-label': ariaLabel,
  className,
  children,
}) => {
  const items = React.Children.toArray(children);
  const shown = max !== undefined ? items.slice(0, max) : items;
  const rest = items.length - shown.length;
  const inner = avatarRadius(size, shape);
  const plate = radiusProps(inner);
  const outer = radiusProps(outerRadius(inner, RING_WIDTH));
  return (
    <GroupContext.Provider value={{ size, shape, ringClassName }}>
      <div
        role="group"
        aria-label={ariaLabel}
        className={cx('flex flex-row items-center self-start', className)}
      >
        {shown.map((child, i) => (
          <span key={i} className={cx('flex', i > 0 && OVERLAP[size])}>
            {child}
          </span>
        ))}
        {rest > 0 ? (
          <span
            className={cx(
              'flex p-0.5',
              shown.length > 0 && OVERLAP[size],
              ringClassName,
              outer.className,
            )}
            style={outer.style}
          >
            <span
              className={cx(
                'flex items-center justify-center bg-mist-200 dark:bg-mist-800',
                BOX[size],
                plate.className,
              )}
              style={plate.style}
            >
              <Text
                size="xs"
                weight="semibold"
                className="text-mist-600 dark:text-mist-300"
              >
                {`+${rest}`}
              </Text>
            </span>
          </span>
        ) : null}
      </div>
    </GroupContext.Provider>
  );
};
