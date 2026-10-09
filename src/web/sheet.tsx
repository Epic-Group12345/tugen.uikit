import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { RadiusScope } from '../radius';
import { cx } from './cx';
import { SCRIM } from './floating';
import { Text } from './text';

// Боковая панель (шторка) веб-слоя на Radix Dialog: модальная, как Dialog, но прилегает к краю
// окна браузера и выезжает из-за него. Скруглены только внутренние углы — те, что смотрят
// в страницу; по краю окна панель идёт вровень с ним

// Панель — rounded-2xl p-2, как окно: кнопки у её отступа по правилу радиусов получают
// 16 − 8 = 8 (rounded-lg), текст отступает дальше своим px-3 py-2
const RADIUS = '2xl';
const PADDING = '2';

export type SheetSide = 'left' | 'right' | 'bottom';

// Классы целиком — иначе Tailwind их не найдёт при сборке. Рамка и скругление — только с
// внутренней стороны панели
const PANEL: Record<SheetSide, string> = {
  right: 'rounded-l-2xl border-l border-y border-mist-200 dark:border-mist-800',
  left: 'rounded-r-2xl border-r border-y border-mist-200 dark:border-mist-800',
  bottom:
    'rounded-t-2xl border-t border-x border-mist-200 dark:border-mist-800',
};

// Где панель стоит в окне; снизу — не выше 90% окна
const PLACE: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0',
  left: 'inset-y-0 left-0',
  bottom: 'inset-x-0 bottom-0 max-h-[90vh]',
};

// Выезд из-за своего края и уход обратно
const MOTION: Record<SheetSide, string> = {
  right:
    'data-[state=open]:animate-tg-slide-in-right data-[state=closed]:animate-tg-slide-out-right',
  left: 'data-[state=open]:animate-tg-slide-in-left data-[state=closed]:animate-tg-slide-out-left',
  bottom:
    'data-[state=open]:animate-tg-slide-in-bottom data-[state=closed]:animate-tg-slide-out-bottom',
};

// Ширина боковой панели по умолчанию; нижняя — по содержимому
const SIZE: Record<SheetSide, string> = {
  right: 'w-80 max-w-full',
  left: 'w-80 max-w-full',
  bottom: '',
};

/** Корень панели: open / defaultOpen / onOpenChange */
export const Sheet = DialogPrimitive.Root;
/** Кнопка, которая открывает панель. asChild — своим элементом */
export const SheetTrigger = DialogPrimitive.Trigger;
/** Закрыть панель изнутри. asChild — своей кнопкой */
export const SheetClose = DialogPrimitive.Close;

export interface SheetContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    'asChild' | 'forceMount'
  > {
  /** Край окна, к которому прилегает панель */
  side?: SheetSide;
  /** Ширина (сбоку) или высота (снизу) и раскладка классами Tailwind */
  className?: string;
  /** Куда рисовать панель вместо document.body */
  container?: HTMLElement | null;
  ref?: React.Ref<HTMLDivElement>;
}

/** Панель у края окна: нажатие на затемнение и Escape закрывают её */
export const SheetContent: React.FC<SheetContentProps> = ({
  side = 'right',
  className,
  container,
  children,
  ...props
}) => (
  <DialogPrimitive.Portal container={container}>
    <DialogPrimitive.Overlay className={SCRIM} />
    <DialogPrimitive.Content
      {...props}
      className={cx(
        'fixed z-50 flex flex-col gap-1 p-2 overflow-y-auto bg-mist-50 dark:bg-mist-900 outline-none',
        PLACE[side],
        PANEL[side],
        MOTION[side],
        className ?? SIZE[side],
      )}
    >
      <RadiusScope radius={RADIUS} padding={PADDING}>
        {children}
      </RadiusScope>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

interface PartProps {
  className?: string;
  children: React.ReactNode;
}

/** Шапка панели: заголовок и пояснение с отступом текста */
export const SheetHeader: React.FC<PartProps> = ({ className, children }) => (
  <div className={cx('flex flex-col gap-1 px-3 py-2', className)}>
    {children}
  </div>
);

/** Заголовок панели: aria-labelledby панели — из Radix */
export const SheetTitle: React.FC<PartProps> = ({ className, children }) => (
  <DialogPrimitive.Title asChild>
    <Text as="h2" size="base" weight="semibold" className={className}>
      {children}
    </Text>
  </DialogPrimitive.Title>
);

/** Пояснение под заголовком панели */
export const SheetDescription: React.FC<PartProps> = ({
  className,
  children,
}) => (
  <DialogPrimitive.Description asChild>
    <Text as="p" tone="secondary" className={cx('leading-5', className)}>
      {children}
    </Text>
  </DialogPrimitive.Description>
);

/** Ряд кнопок внизу панели, справа: rounded-lg по правилу радиусов (16 − 8) */
export const SheetFooter: React.FC<PartProps> = ({ className, children }) => (
  <div
    className={cx(
      'mt-auto flex flex-row flex-wrap justify-end gap-2',
      className,
    )}
  >
    {children}
  </div>
);
