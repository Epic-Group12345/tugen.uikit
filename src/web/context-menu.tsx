import React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
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

// Контекстное меню на Radix ContextMenu: правая кнопка мыши и долгое касание, меню встаёт у точки
// нажатия. Пункты — те же, что у DropdownMenu

/** Корень: держит открыто / закрыто. onOpenChange — узнать об открытии */
export const ContextMenu = ContextMenuPrimitive.Root;

export interface ContextMenuTriggerProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Область, на которой открывается меню */
  children: React.ReactNode;
  disabled?: boolean;
  /** Отдать нажатие своему элементу (он должен принимать ref и события) */
  asChild?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}

/**
 * Область, по которой открывается меню. Без asChild Radix рисует <span> — строчный, поэтому
 * область-блок лучше передать своим элементом через asChild
 */
export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = props => (
  <ContextMenuPrimitive.Trigger {...props} />
);

export interface ContextMenuContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Ширина и раскладка классами (w-64) */
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

/** Окно меню у точки нажатия: rounded-xl p-1, пункты — rounded-lg */
export const ContextMenuContent: React.FC<ContextMenuContentProps> = ({
  className,
  children,
  ...props
}) => (
  <ContextMenuPrimitive.Portal>
    <RadiusScope radius={MENU_RADIUS} padding={MENU_PADDING}>
      <ContextMenuPrimitive.Content
        {...props}
        collisionPadding={COLLISION_PADDING}
        className={cx(
          FLOATING,
          MENU_LAYOUT,
          'min-w-48 max-h-[var(--radix-context-menu-content-available-height)] overflow-y-auto',
          className,
        )}
      >
        {children}
      </ContextMenuPrimitive.Content>
    </RadiusScope>
  </ContextMenuPrimitive.Portal>
);

const items = createMenuItems(ContextMenuPrimitive);

export type ContextMenuItemProps = MenuItemProps;
export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps;
export type ContextMenuRadioGroupProps = MenuRadioGroupProps;
export type ContextMenuRadioItemProps = MenuRadioItemProps;
export type ContextMenuSubTriggerProps = MenuSubTriggerProps;
export type ContextMenuSubContentProps = MenuSubContentProps;

/** Пункт: иконка, подпись, горячая клавиша; destructive — красный. onSelect закрывает меню */
export const ContextMenuItem = items.Item;
/** Пункт-флажок: галочка справа, когда checked */
export const ContextMenuCheckboxItem = items.CheckboxItem;
/** Группа взаимоисключающих пунктов: value и onValueChange */
export const ContextMenuRadioGroup = items.RadioGroup;
/** Вариант в ContextMenuRadioGroup: галочка у выбранного */
export const ContextMenuRadioItem = items.RadioItem;
/** Подпись группы пунктов */
export const ContextMenuLabel = items.Label;
/** Линия между группами */
export const ContextMenuSeparator = items.Separator;
/** Группа пунктов */
export const ContextMenuGroup = items.Group;
/** Горячая клавиша справа; у пункта то же самое — проп shortcut */
export const ContextMenuShortcut = MenuShortcut;
/** Подменю: внутри — ContextMenuSubTrigger и ContextMenuSubContent */
export const ContextMenuSub = items.Sub;
/** Пункт, который раскрывает подменю */
export const ContextMenuSubTrigger = items.SubTrigger;
/** Пункты подменю: отдельное окно рядом со своим пунктом */
export const ContextMenuSubContent = items.SubContent;
