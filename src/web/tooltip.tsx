import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cx } from './cx';
import { COLLISION_PADDING, SIDE_OFFSET } from './floating';

// Подсказка веб-слоя на Radix Tooltip: роль tooltip, наведение с задержкой, фокус с клавиатуры,
// Escape и положение — из Radix, оформление — kit (тёмная плашка, как у TooltipContent лаунчера)

/** Задержка перед появлением подсказки при наведении, мс */
export const TOOLTIP_DELAY = 500;

export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;

/**
 * Корень подсказки. Внутри — TooltipTrigger и TooltipContent. Свой Provider Radix — чтобы
 * подсказка работала без обёртки в корне приложения, как в лаунчере
 */
export const Tooltip: React.FC<TooltipProps> = ({
  delayDuration = TOOLTIP_DELAY,
  ...props
}) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration}>
    <TooltipPrimitive.Root {...props} delayDuration={delayDuration} />
  </TooltipPrimitive.Provider>
);

/** Элемент, у которого подсказка. asChild — отдать всё своему элементу (Button, IconButton) */
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    'asChild' | 'side'
  > {
  /** Сторона элемента; если там нет места, подсказка встанет напротив */
  side?: 'top' | 'bottom';
  /** Ширина и раскладка классами Tailwind */
  className?: string;
  /** Куда рисовать подсказку вместо document.body */
  container?: HTMLElement | null;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Тёмная плашка с коротким текстом: rounded-lg px-2 py-1, вложенных фигур нет. Мышь сквозь неё
 * проходит — иначе плашка над кнопкой забирала бы наведение и подсказка мигала
 */
export const TooltipContent: React.FC<TooltipContentProps> = ({
  side = 'top',
  align = 'center',
  sideOffset = SIDE_OFFSET,
  collisionPadding = COLLISION_PADDING,
  className,
  container,
  ...props
}) => (
  <TooltipPrimitive.Portal container={container}>
    <TooltipPrimitive.Content
      {...props}
      side={side}
      align={align}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cx(
        'z-50 max-w-64 rounded-lg px-2 py-1 bg-mist-950 dark:bg-mist-50 text-xs text-mist-50 dark:text-mist-950 pointer-events-none select-none origin-[var(--radix-popper-transform-origin)] data-[state=delayed-open]:animate-tg-pop-in data-[state=instant-open]:animate-tg-pop-in data-[state=closed]:animate-tg-pop-out',
        className,
      )}
    />
  </TooltipPrimitive.Portal>
);

export interface TipProps {
  /** Текст подсказки */
  label: string;
  side?: 'top' | 'bottom';
  /** Задержка появления, мс */
  delay?: number;
  /** Элемент с подсказкой: ему уходят ref и обработчики наведения (Button, IconButton) */
  children: React.ReactNode;
}

/** Подсказка одной строкой: <Tip label="Настройки"><IconButton …/></Tip> */
export const Tip: React.FC<TipProps> = ({
  label,
  side = 'top',
  delay = TOOLTIP_DELAY,
  children,
}) => (
  <Tooltip delayDuration={delay}>
    <TooltipTrigger asChild>
      {/* asChild нужен элемент: текст оборачиваем в span */}
      {React.isValidElement(children) ? children : <span>{children}</span>}
    </TooltipTrigger>
    <TooltipContent side={side}>{label}</TooltipContent>
  </Tooltip>
);
