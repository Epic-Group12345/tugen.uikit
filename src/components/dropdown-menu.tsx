import React from 'react';
import { StyleSheet } from 'react-native';
import * as DropdownMenuPrimitive from '@rn-primitives/dropdown-menu';
import {
  isNativePrimitive,
  useDismissLayer,
  useFloatingStyle,
  type Align,
} from '../layers';
import { Appear } from './popover';
import {
  MenuShortcut,
  MenuSurface,
  createMenuItems,
  type MenuCheckboxItemProps,
  type MenuItemProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuSubContentProps,
  type MenuSubTriggerProps,
} from './menu-parts';

// Меню у кнопки на @rn-primitives/dropdown-menu: роли (menu, menuitem, checkbox, radio), состояние
// и возврат фокуса — из примитива; положение, Escape и оформление — kit, как у Popover.
// Нужен PopupHost в корне приложения

// Нативная версия примитива (RNW, тесты) или веб на Radix — от этого зависят положение и Escape
const native = isNativePrimitive(DropdownMenuPrimitive.Content);

/** Корень: держит открыто / закрыто. onOpenChange — узнать об открытии */
export const DropdownMenu = DropdownMenuPrimitive.Root;
/** Кнопка, которая открывает меню. asChild — отдать нажатие своему элементу с ref */
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export interface DropdownMenuContentProps {
  /** Сторона кнопки; если там нет места, меню встанет напротив */
  side?: 'top' | 'bottom';
  /** Выравнивание вдоль кнопки */
  align?: Align;
  /** Зазор от кнопки, DIP */
  sideOffset?: number;
  /** Меню не уже кнопки */
  matchTriggerWidth?: boolean;
  /** Ширина и раскладка классами Uniwind (w-64) */
  className?: string;
  /** Имя своего PortalHost, если меню рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

/** Окно меню: rounded-xl p-1, пункты внутри — rounded-lg по правилу радиусов */
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  matchTriggerWidth = false,
  className,
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = DropdownMenuPrimitive.useRootContext();
  const style = useFloatingStyle(root, {
    side,
    align,
    offset: sideOffset,
    margin: 8,
    enabled: native,
  });
  useDismissLayer(root.open, () => root.onOpenChange(false), { skip: !native });
  const width =
    matchTriggerWidth && native && root.triggerPosition
      ? { minWidth: root.triggerPosition.width }
      : undefined;
  return (
    <DropdownMenuPrimitive.Portal hostName={portalHost}>
      <DropdownMenuPrimitive.Overlay
        style={native ? StyleSheet.absoluteFill : undefined}
      >
        <DropdownMenuPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          disablePositioningStyle={native}
          style={style}
          aria-label={accessibilityLabel}
        >
          <Appear>
            <MenuSurface className={className} style={width}>
              {children}
            </MenuSurface>
          </Appear>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Overlay>
    </DropdownMenuPrimitive.Portal>
  );
};

const items = createMenuItems(DropdownMenuPrimitive, native);

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
/**
 * Пункты подменю. На нативе (RNW) раскрываются в том же окне под своим пунктом — так делает
 * примитив: второе окно сбоку на Windows легко ушло бы за край. В вебе — отдельное окно рядом
 */
export const DropdownMenuSubContent = items.SubContent;
