import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { RadiusScope } from '../radius';
import type { IconComponent } from '../components/icon';
import { Button, IconButton, type ButtonProps } from './button';
import { cx } from './cx';
import { SCRIM } from './floating';
import { Text } from './text';

// Модальные окна веб-слоя на Radix Dialog и AlertDialog: состояние, роль dialog / alertdialog,
// фокус внутри окна, Escape и возврат фокуса на кнопку — из Radix; затемнение, место окна,
// появление и оформление — kit, как у DialogContent лаунчера

// Окно — rounded-2xl p-2: кнопки и плашки у его отступа по правилу радиусов получают
// 16 − 8 = 8 (rounded-lg), текстовые блоки отступают дальше своим px-3 py-2
const RADIUS = '2xl';
const PADDING = '2';

// Окно лежит внутри затемнения (так советует Radix для окна с прокруткой): затемнение
// центрирует его, а гаснет вместе с ним — как общий слой ModalFrame в лаунчере. Нажатие мимо
// окна Radix ловит сам (onPointerDownOutside)
const BACKDROP = cx(SCRIM, 'flex items-center justify-center p-6');

// Высота окна — не больше 88% окна браузера, лишнее прокручивается
const WINDOW =
  'relative flex flex-col max-h-[88vh] overflow-y-auto rounded-2xl p-2 border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900 outline-none data-[state=open]:animate-tg-pop-in data-[state=closed]:animate-tg-pop-out';

/** Крестик из двух черт: кнопка закрытия, если приложение не дало свою иконку */
const Cross: IconComponent = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    aria-hidden
  >
    <path
      d="M3.5 3.5l9 9M12.5 3.5l-9 9"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

// ---------------------------------------------------------------- Dialog

/** Корень окна: open / defaultOpen / onOpenChange. Внутри — DialogTrigger и DialogContent */
export const Dialog = DialogPrimitive.Root;
/** Кнопка, которая открывает окно. asChild — своим элементом: <DialogTrigger asChild><Button …/></DialogTrigger> */
export const DialogTrigger = DialogPrimitive.Trigger;
/** Закрыть окно изнутри. asChild — своей кнопкой: <DialogClose asChild><Button …/></DialogClose> */
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    'asChild' | 'forceMount'
  > {
  /** Ширина окна классами Tailwind; по умолчанию «w-full max-w-lg» */
  className?: string;
  /** Кнопка закрытия в правом верхнем углу */
  showClose?: boolean;
  /** Иконка кнопки закрытия; без неё — крестик kit */
  closeIcon?: IconComponent;
  /** Подпись кнопки закрытия для экранного диктора — на языке приложения */
  closeLabel?: string;
  /** Куда рисовать окно вместо document.body */
  container?: HTMLElement | null;
  ref?: React.Ref<HTMLDivElement>;
}

/** Окно поверх страницы: нажатие на затемнение и Escape закрывают его */
export const DialogContent: React.FC<DialogContentProps> = ({
  className = 'w-full max-w-lg',
  showClose = false,
  closeIcon,
  closeLabel = 'Закрыть',
  container,
  children,
  ...props
}) => (
  <DialogPrimitive.Portal container={container}>
    <DialogPrimitive.Overlay className={BACKDROP}>
      <DialogPrimitive.Content {...props} className={cx(WINDOW, className)}>
        <RadiusScope radius={RADIUS} padding={PADDING}>
          {children}
          {showClose && (
            <div className="absolute top-2 right-2">
              <DialogPrimitive.Close asChild>
                <IconButton icon={closeIcon ?? Cross} aria-label={closeLabel} />
              </DialogPrimitive.Close>
            </div>
          )}
        </RadiusScope>
      </DialogPrimitive.Content>
    </DialogPrimitive.Overlay>
  </DialogPrimitive.Portal>
);

interface PartProps {
  className?: string;
  children: React.ReactNode;
}

/** Шапка окна: заголовок и пояснение с отступом текста от края */
export const DialogHeader: React.FC<PartProps> = ({ className, children }) => (
  <div className={cx('flex flex-col gap-1 px-3 pt-2 pb-1', className)}>
    {children}
  </div>
);

/** Заголовок окна: aria-labelledby окна — из Radix */
export const DialogTitle: React.FC<PartProps> = ({ className, children }) => (
  <DialogPrimitive.Title asChild>
    <Text as="h2" size="base" weight="semibold" className={className}>
      {children}
    </Text>
  </DialogPrimitive.Title>
);

/** Пояснение под заголовком: aria-describedby окна — из Radix */
export const DialogDescription: React.FC<PartProps> = ({
  className,
  children,
}) => (
  <DialogPrimitive.Description asChild>
    <Text as="p" tone="secondary" className={cx('leading-5', className)}>
      {children}
    </Text>
  </DialogPrimitive.Description>
);

/** Текстовая часть окна: отступает от края дальше кнопок (px-3 py-2). Строка — абзацем */
export const DialogBody: React.FC<PartProps> = ({ className, children }) => (
  <div className={cx('flex flex-col gap-2 px-3 py-2', className)}>
    {typeof children === 'string' ? (
      <Text as="p" tone="secondary" className="leading-5">
        {children}
      </Text>
    ) : (
      children
    )}
  </div>
);

/**
 * Ряд кнопок внизу окна, справа. Кнопки стоят у отступа окна и по правилу радиусов получают
 * rounded-lg (16 − 8) из RadiusScope окна
 */
export const DialogFooter: React.FC<PartProps> = ({ className, children }) => (
  <div
    className={cx('flex flex-row flex-wrap justify-end gap-2 pt-2', className)}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------- AlertDialog

/** Корень окна-подтверждения: open / defaultOpen / onOpenChange */
export const AlertDialog = AlertDialogPrimitive.Root;
/** Кнопка, которая открывает подтверждение. asChild — своим элементом */
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export interface AlertDialogContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
    'asChild' | 'forceMount'
  > {
  /** Ширина окна классами Tailwind; по умолчанию «w-full max-w-lg» */
  className?: string;
  /** Куда рисовать окно вместо document.body */
  container?: HTMLElement | null;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Окно-подтверждение: оформление как у DialogContent, но нажатие на затемнение его не закрывает —
 * ответить нужно кнопкой. Escape закрывает, как отмена
 */
export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  className = 'w-full max-w-lg',
  container,
  children,
  ...props
}) => (
  <AlertDialogPrimitive.Portal container={container}>
    <AlertDialogPrimitive.Overlay className={BACKDROP}>
      <AlertDialogPrimitive.Content
        {...props}
        className={cx(WINDOW, className)}
      >
        <RadiusScope radius={RADIUS} padding={PADDING}>
          {children}
        </RadiusScope>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Overlay>
  </AlertDialogPrimitive.Portal>
);

/** Шапка подтверждения */
export const AlertDialogHeader = DialogHeader;
/** Ряд кнопок подтверждения: справа, rounded-lg по правилу радиусов */
export const AlertDialogFooter = DialogFooter;

/** Заголовок подтверждения: aria-labelledby окна — из Radix */
export const AlertDialogTitle: React.FC<PartProps> = ({
  className,
  children,
}) => (
  <AlertDialogPrimitive.Title asChild>
    <Text as="h2" size="base" weight="semibold" className={className}>
      {children}
    </Text>
  </AlertDialogPrimitive.Title>
);

/** Пояснение подтверждения */
export const AlertDialogDescription: React.FC<PartProps> = ({
  className,
  children,
}) => (
  <AlertDialogPrimitive.Description asChild>
    <Text as="p" tone="secondary" className={cx('leading-5', className)}>
      {children}
    </Text>
  </AlertDialogPrimitive.Description>
);

export type AlertDialogButtonProps = ButtonProps;

/**
 * Главная кнопка подтверждения: кнопка kit (по умолчанию primary; для «Удалить» — danger),
 * после onClick окно закрывается
 */
export const AlertDialogAction: React.FC<AlertDialogButtonProps> = ({
  variant = 'primary',
  ...props
}) => (
  // Slot Radix склеивает свой onClick (закрыть окно) с onClick кнопки
  <AlertDialogPrimitive.Action asChild>
    <Button {...props} variant={variant} />
  </AlertDialogPrimitive.Action>
);

/** Отмена: нейтральная кнопка kit, закрывает окно. Radix ставит на неё фокус при открытии */
export const AlertDialogCancel: React.FC<AlertDialogButtonProps> = ({
  variant = 'secondary',
  ...props
}) => (
  <AlertDialogPrimitive.Cancel asChild>
    <Button {...props} variant={variant} />
  </AlertDialogPrimitive.Cancel>
);
