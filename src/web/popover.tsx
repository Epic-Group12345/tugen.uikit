import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { RadiusScope } from '../radius';
import { cx } from './cx';
import { COLLISION_PADDING, FLOATING, SIDE_OFFSET } from './floating';
import { Text } from './text';

// Всплывающая карточка у кнопки на Radix Popover: доступность (роль, aria-expanded, возврат
// фокуса), положение, Escape и нажатие мимо — из Radix, оформление — kit, как у лаунчера

/** Корень: держит открыто / закрыто. Внутри — PopoverTrigger и PopoverContent */
export const Popover = PopoverPrimitive.Root;
/** Кнопка, которая открывает карточку. asChild — отдать нажатие своему элементу (Button) */
export const PopoverTrigger = PopoverPrimitive.Trigger;
/** Закрыть карточку изнутри. asChild — своей кнопкой */
export const PopoverClose = PopoverPrimitive.Close;

export interface PopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    'asChild' | 'side'
  > {
  /** Сторона кнопки; если там нет места, карточка встанет напротив */
  side?: 'top' | 'bottom';
  /** Ширина и раскладка классами Tailwind (w-72, gap-2) */
  className?: string;
  /** Куда рисовать карточку вместо document.body */
  container?: HTMLElement | null;
  ref?: React.Ref<HTMLDivElement>;
}

// Окно — как меню: rounded-xl и p-1. Кнопки и плашки у края окна по правилу радиусов получают
// 12 − 4 = 8 (rounded-lg) через RadiusScope; текст отступает дальше — в PopoverBody
const RADIUS = 'xl';
const PADDING = '1';

/** Карточка у кнопки: текст, строки «подпись — значение», небольшая форма. Строка — абзацем */
export const PopoverContent: React.FC<PopoverContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = SIDE_OFFSET,
  collisionPadding = COLLISION_PADDING,
  className,
  container,
  children,
  ...props
}) => (
  <PopoverPrimitive.Portal container={container}>
    <PopoverPrimitive.Content
      {...props}
      side={side}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cx(FLOATING, 'flex flex-col gap-1 p-1 rounded-xl', className)}
    >
      <RadiusScope radius={RADIUS} padding={PADDING}>
        {typeof children === 'string' ? (
          <PopoverBody>{children}</PopoverBody>
        ) : (
          children
        )}
      </RadiusScope>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
);

/**
 * Текстовая часть карточки: заголовок и абзац с отступом от края. Строка — абзацем, иначе как есть
 */
export const PopoverBody: React.FC<{
  title?: string;
  children?: React.ReactNode;
}> = ({ title, children }) => (
  <div className="flex flex-col gap-1.5 px-2.5 py-2">
    {title ? <Text weight="semibold">{title}</Text> : null}
    {typeof children === 'string' ? (
      <Text as="p" size="xs" tone="secondary" className="leading-5">
        {children}
      </Text>
    ) : (
      children
    )}
  </div>
);

/** Строка «подпись — значение» внутри PopoverBody */
export const PopoverRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex flex-row justify-between gap-3">
    <Text size="xs" tone="muted">
      {label}
    </Text>
    <Text size="xs" weight="semibold">
      {value}
    </Text>
  </div>
);
