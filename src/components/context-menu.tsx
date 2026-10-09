import React from 'react';
import { StyleSheet, type GestureResponderEvent } from 'react-native';
import * as ContextMenuPrimitive from '@rn-primitives/context-menu';
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

// Контекстное меню на @rn-primitives/context-menu: открывается долгим нажатием (примитив) и правой
// кнопкой мыши (kit, на Windows), встаёт у точки нажатия. Пункты — те же, что у DropdownMenu.
// Нужен PopupHost в корне приложения

// Нативная версия примитива (RNW, тесты) или веб на Radix (там правую кнопку ловит сам Radix)
const native = isNativePrimitive(ContextMenuPrimitive.Content);

/**
 * Корень: держит открыто / закрыто. relativeTo="trigger" — меню у края области, а не у точки
 * нажатия (только натив)
 */
export const ContextMenu = ContextMenuPrimitive.Root;

// Правая кнопка в событиях указателя (W3C PointerEvent.button)
const SECONDARY_BUTTON = 2;

type PointerLike = {
  nativeEvent: { button?: number; pageX?: number; pageY?: number };
};

export interface ContextMenuTriggerProps {
  /** Область, на которой открывается меню */
  children: React.ReactNode;
  disabled?: boolean;
  /** Отдать нажатие своему элементу (он должен принимать ref и onLongPress) */
  asChild?: boolean;
  /** Долгое нажатие: меню уже открывается, это — узнать о нём */
  onLongPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
}

/**
 * Область, по которой открывается меню. Долгое нажатие — из примитива (сенсор и диктор). Правая
 * кнопка мыши — через onPointerDown: у Pressable в RN 0.81 нет onContextMenu, а события указателя
 * (W3C) RNW на Fabric отдаёт и для мыши, с номером кнопки и координатами окна
 */
export const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({
  children,
  disabled = false,
  asChild,
  onLongPress,
  accessibilityLabel,
}) => {
  const root = ContextMenuPrimitive.useRootContext();
  const onPointerDown = (event: PointerLike) => {
    const { button, pageX, pageY } = event.nativeEvent;
    if (
      !native ||
      disabled ||
      button !== SECONDARY_BUTTON ||
      pageX === undefined ||
      pageY === undefined
    ) {
      return;
    }
    root.setPressPosition({ pageX, pageY, width: 0, height: 0 });
    root.onOpenChange(true);
  };
  return (
    <ContextMenuPrimitive.Trigger
      asChild={asChild}
      disabled={disabled}
      onLongPress={onLongPress}
      aria-label={accessibilityLabel}
      // Не из типов Pressable: RN передаёт его во View как событие указателя
      {...({ onPointerDown } as object)}
    >
      {children}
    </ContextMenuPrimitive.Trigger>
  );
};

export interface ContextMenuContentProps {
  /** Сторона от точки нажатия; если там нет места, меню встанет напротив */
  side?: 'top' | 'bottom';
  /** Выравнивание относительно точки */
  align?: Align;
  /** Зазор от точки, DIP */
  sideOffset?: number;
  /** Ширина и раскладка классами Uniwind (w-64) */
  className?: string;
  /** Имя своего PortalHost, если меню рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

/** Окно меню у точки нажатия: rounded-xl p-1, пункты — rounded-lg */
export const ContextMenuContent: React.FC<ContextMenuContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 2,
  className,
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = ContextMenuPrimitive.useRootContext();
  // Якорь — точка нажатия (pressPosition примитива, нулевого размера) или вся область
  const style = useFloatingStyle(
    { triggerPosition: root.pressPosition, contentLayout: root.contentLayout },
    { side, align, offset: sideOffset, margin: 8, enabled: native },
  );
  useDismissLayer(root.open, () => root.onOpenChange(false), { skip: !native });
  return (
    <ContextMenuPrimitive.Portal hostName={portalHost}>
      <ContextMenuPrimitive.Overlay
        style={native ? StyleSheet.absoluteFill : undefined}
      >
        <ContextMenuPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          disablePositioningStyle={native}
          style={style}
          aria-label={accessibilityLabel}
        >
          <Appear>
            <MenuSurface className={className}>{children}</MenuSurface>
          </Appear>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Overlay>
    </ContextMenuPrimitive.Portal>
  );
};

const items = createMenuItems(ContextMenuPrimitive, native);

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
/** Пункты подменю: на нативе — в том же окне под пунктом, в вебе — отдельное окно */
export const ContextMenuSubContent = items.SubContent;
