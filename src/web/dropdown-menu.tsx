import React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { RadiusScope } from '../radius';
import { cx } from './cx';
import { COLLISION_PADDING, FLOATING } from './floating';
import {
  MENU_LAYOUT,
  MENU_PADDING,
  MENU_RADIUS,
  MenuShortcut,
  createMenuItems,
  type MenuCheckboxItemProps,
  type MenuItemProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuSubContentProps,
  type MenuSubTriggerProps,
} from './menu-parts';

// Меню у кнопки на Radix DropdownMenu: роли (menu, menuitem, menuitemcheckbox, menuitemradio),
// клавиатура, положение и возврат фокуса — из Radix; оформление — kit, как у DropdownMenu лаунчера

/** Корень: держит открыто / закрыто. onOpenChange — узнать об открытии */
export const DropdownMenu = DropdownMenuPrimitive.Root;
/** Кнопка, которая открывает меню. asChild — отдать нажатие своему элементу с ref (Button) */
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export type DropdownMenuAlign = 'start' | 'center' | 'end';

export interface DropdownMenuContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Сторона кнопки; если там нет места, меню встанет напротив */
  side?: 'top' | 'bottom';
  /** Выравнивание вдоль кнопки */
  align?: DropdownMenuAlign;
  /** Зазор от кнопки, px */
  sideOffset?: number;
  /** Меню не уже кнопки */
  matchTriggerWidth?: boolean;
  /** Ширина и раскладка классами (w-64) */
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

// Наименьшая ширина: 12rem, как у лаунчера, или ширина кнопки. Классы целиком
const MIN_WIDTH = {
  own: 'min-w-48',
  trigger: 'min-w-[max(12rem,var(--radix-dropdown-menu-trigger-width))]',
} as const;

/** Окно меню: rounded-xl p-1, пункты внутри — rounded-lg по правилу радиусов */
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  matchTriggerWidth = false,
  className,
  children,
  ...props
}) => (
  <DropdownMenuPrimitive.Portal>
    <RadiusScope radius={MENU_RADIUS} padding={MENU_PADDING}>
      <DropdownMenuPrimitive.Content
        {...props}
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={COLLISION_PADDING}
        className={cx(
          FLOATING,
          MENU_LAYOUT,
          matchTriggerWidth ? MIN_WIDTH.trigger : MIN_WIDTH.own,
          // Длинное меню не выходит за край страницы, а прокручивается
          'max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto',
          className,
        )}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </RadiusScope>
  </DropdownMenuPrimitive.Portal>
);

const items = createMenuItems(DropdownMenuPrimitive);

export type DropdownMenuItemProps = MenuItemProps;
export type DropdownMenuCheckboxItemProps = MenuCheckboxItemProps;
export type DropdownMenuRadioGroupProps = MenuRadioGroupProps;
export type DropdownMenuRadioItemProps = MenuRadioItemProps;
export type DropdownMenuSubTriggerProps = MenuSubTriggerProps;
export type DropdownMenuSubContentProps = MenuSubContentProps;

/** Пункт: иконка, подпись, горячая клавиша; destructive — красный. onSelect закрывает меню */
export const DropdownMenuItem = items.Item;
/** Пункт-флажок: галочка справа, когда checked */
export const DropdownMenuCheckboxItem = items.CheckboxItem;
/** Группа взаимоисключающих пунктов: value и onValueChange */
export const DropdownMenuRadioGroup = items.RadioGroup;
/** Вариант в DropdownMenuRadioGroup: галочка у выбранного */
export const DropdownMenuRadioItem = items.RadioItem;
/** Подпись группы пунктов */
export const DropdownMenuLabel = items.Label;
/** Линия между группами */
export const DropdownMenuSeparator = items.Separator;
/** Группа пунктов (для диктора — role="group") */
export const DropdownMenuGroup = items.Group;
/** Горячая клавиша справа; у пункта то же самое — проп shortcut */
export const DropdownMenuShortcut = MenuShortcut;
/** Подменю: внутри — DropdownMenuSubTrigger и DropdownMenuSubContent */
export const DropdownMenuSub = items.Sub;
/** Пункт, который раскрывает подменю */
export const DropdownMenuSubTrigger = items.SubTrigger;
/** Пункты подменю: отдельное окно рядом со своим пунктом */
export const DropdownMenuSubContent = items.SubContent;
