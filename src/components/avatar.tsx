import React, { createContext, useContext } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import * as AvatarPrimitive from '@rn-primitives/avatar';
import { outerRadius, radiusProps, toRadius, type RadiusStep } from '../radius';
import { Text, type TextSize } from './text';

// Аватар на @rn-primitives/avatar: картинка, пока грузится и если не загрузилась — инициалы
// (примитив сам переключает Image и Fallback по состоянию загрузки). Точка статуса в углу —
// где человек, как в чатах лаунчера. В группе аватары идут внахлёст с обводкой цветом фона

export type AvatarSize = 'sm' | 'md' | 'lg';
export type AvatarShape = 'circle' | 'rounded';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

// Классы целиком — иначе Uniwind их не найдёт при сборке
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
/** Толщина обводки, DIP (p-0.5) */
const RING_WIDTH = 2;

interface AvatarContextValue {
  size: AvatarSize;
}
const AvatarContext = createContext<AvatarContextValue>({ size: 'md' });

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

/** Радиус аватара в DIP */
const avatarRadius = (size: AvatarSize, shape: AvatarShape) =>
  shape === 'circle' ? toRadius('full') : toRadius(ROUNDED[size]);

export interface AvatarProps {
  /** Имя: подпись для экранного диктора и инициалы, если картинки нет */
  alt: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Картинка; без children Avatar сам рисует AvatarImage и AvatarFallback */
  source?: ImageSourcePropType;
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
  source,
  status,
  ring: ringProp,
  ringClassName: ringClassProp,
  children,
  className = '',
}) => {
  const group = useContext(GroupContext);
  const size = sizeProp ?? group?.size ?? 'md';
  const shape = shapeProp ?? group?.shape ?? 'circle';
  const ring = ringProp ?? !!group;
  const ringClassName = ringClassProp ?? group?.ringClassName ?? RING;
  const inner = avatarRadius(size, shape);
  const rounded = radiusProps(inner);

  const avatar = (
    <AvatarPrimitive.Root alt={alt} asChild>
      <View
        className={`${BOX[size]} items-center justify-center overflow-hidden bg-mist-200 dark:bg-mist-800 ${rounded.className}`}
        style={rounded.style}
      >
        {children ?? (
          <>
            {source ? <AvatarImage source={source} /> : null}
            <AvatarFallback>{initials(alt)}</AvatarFallback>
          </>
        )}
      </View>
    </AvatarPrimitive.Root>
  );

  // Обводка — отступ p-0.5 с фоном: внешний радиус = внутренний + 2 (вне шкалы — числом)
  const outer = radiusProps(outerRadius(inner, RING_WIDTH));
  return (
    <AvatarContext.Provider value={{ size }}>
      <View className={`self-start ${className}`}>
        {ring ? (
          <View
            className={`p-0.5 ${ringClassName} ${outer.className}`}
            style={outer.style}
          >
            {avatar}
          </View>
        ) : (
          avatar
        )}
        {status ? (
          // Край точки — тем же приёмом, что обводка: отступ p-0.5 с фоном, а не border-*, чтобы
          // приложение передавало один класс фона
          <View
            accessibilityLabel={status}
            className={`absolute ${DOT_PLACE[shape]} ${DOT_SIZE[size]} p-0.5 rounded-full ${ringClassName}`}
          >
            <View className={`flex-1 rounded-full ${STATUS[status]}`} />
          </View>
        ) : null}
      </View>
    </AvatarContext.Provider>
  );
};

export type AvatarImageProps = Omit<AvatarPrimitive.ImageProps, 'asChild'>;

/** Картинка аватара: видна, когда загрузилась */
export const AvatarImage: React.FC<AvatarImageProps> = ({
  style,
  ...props
}) => (
  <AvatarPrimitive.Image
    {...props}
    style={StyleSheet.flatten([{ width: '100%', height: '100%' }, style])}
  />
);

/** Замена картинке: строка — инициалами по размеру аватара, иначе как есть (иконка группы) */
export const AvatarFallback: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { size } = useContext(AvatarContext);
  return (
    <AvatarPrimitive.Fallback asChild>
      <View className="w-full h-full items-center justify-center">
        {typeof children === 'string' ? (
          <Text
            size={INITIALS_SIZE[size]}
            weight="semibold"
            numberOfLines={1}
            className="text-mist-600 dark:text-mist-300"
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
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
  accessibilityLabel?: string;
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
  accessibilityLabel,
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
      <View
        accessibilityLabel={accessibilityLabel}
        className="flex-row items-center self-start"
      >
        {shown.map((child, i) => (
          <View key={i} className={i > 0 ? OVERLAP[size] : ''}>
            {child}
          </View>
        ))}
        {rest > 0 ? (
          <View
            className={`${
              shown.length > 0 ? OVERLAP[size] : ''
            } p-0.5 ${ringClassName} ${outer.className}`}
            style={outer.style}
          >
            <View
              className={`${BOX[size]} items-center justify-center bg-mist-200 dark:bg-mist-800 ${plate.className}`}
              style={plate.style}
            >
              <Text
                size="xs"
                weight="semibold"
                className="text-mist-600 dark:text-mist-300"
              >
                {`+${rest}`}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </GroupContext.Provider>
  );
};
