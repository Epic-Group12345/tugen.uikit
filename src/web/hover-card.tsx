import React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { RadiusScope } from '../radius';
import { cx } from './cx';
import { COLLISION_PADDING, FLOATING, SIDE_OFFSET } from './floating';
import { TOOLTIP_DELAY } from './tooltip';

// Карточка при наведении на Radix HoverCard: наведение с задержкой, отложенное закрытие (курсор
// можно перевести с элемента на карточку), положение и Escape — из Radix, оформление — kit

/** Через сколько закрывается карточка, когда курсор ушёл, мс */
export const HOVER_CARD_CLOSE_DELAY = 300;

export type HoverCardProps = React.ComponentProps<
  typeof HoverCardPrimitive.Root
>;

/** Корень карточки. Внутри — HoverCardTrigger и HoverCardContent */
export const HoverCard: React.FC<HoverCardProps> = ({
  openDelay = TOOLTIP_DELAY,
  closeDelay = HOVER_CARD_CLOSE_DELAY,
  ...props
}) => (
  <HoverCardPrimitive.Root
    {...props}
    openDelay={openDelay}
    closeDelay={closeDelay}
  />
);

/** Элемент, над которым появляется карточка (по умолчанию <a>). asChild — своим элементом */
export const HoverCardTrigger = HoverCardPrimitive.Trigger;

export interface HoverCardContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
    'asChild' | 'side'
  > {
  /** Сторона элемента; если там нет места, карточка встанет напротив */
  side?: 'top' | 'bottom';
  /** Ширина и раскладка классами Tailwind (w-72, gap-2) */
  className?: string;
  /** Куда рисовать карточку вместо document.body */
  container?: HTMLElement | null;
  ref?: React.Ref<HTMLDivElement>;
}

// Как PopoverContent: rounded-xl p-1, кнопки и плашки у края — 12 − 4 = 8 (rounded-lg)
const RADIUS = 'xl';
const PADDING = '1';

/** Карточка у элемента: профиль, превью ссылки, подробности */
export const HoverCardContent: React.FC<HoverCardContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = SIDE_OFFSET,
  collisionPadding = COLLISION_PADDING,
  className,
  container,
  children,
  ...props
}) => (
  <HoverCardPrimitive.Portal container={container}>
    <HoverCardPrimitive.Content
      {...props}
      side={side}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cx(FLOATING, 'flex flex-col gap-1 p-1 rounded-xl', className)}
    >
      <RadiusScope radius={RADIUS} padding={PADDING}>
        {children}
      </RadiusScope>
    </HoverCardPrimitive.Content>
  </HoverCardPrimitive.Portal>
);
