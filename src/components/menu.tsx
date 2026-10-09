import React, { useMemo } from 'react';
import {
  Animated,
  Pressable,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { StateLayers, useAppear, usePressFeedback } from '../animation';
import { motion } from '../tokens';
import { Popup, usePopupToggle } from '../popup';
import { radiusProps, useInnerRadius } from '../radius';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import type { IconComponent } from './icon';
import { MenuRow, MenuSurface, useMenuItemState } from './menu-parts';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from './select';

// Простые меню одной строкой: Dropdown (кнопка-иконка с меню) и Select (выбор из options) — на
// составных DropdownMenu и SelectRoot. Menu и useDropdownMenu — прежние, на Popup: ими пользуется
// лаунчер; оформление у них общее с остальными меню (menu-parts)

export interface MenuItem {
  label: string;
  icon?: IconComponent;
  /** Картинка вместо иконки (флаг и т. п.) */
  image?: ImageSourcePropType;
  /** Выбранный пункт — с галочкой справа */
  selected?: boolean;
  /** Необратимое действие: красный текст */
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

// Отступ меню от кнопки, DIP
const MENU_OFFSET = 4;

const LegacyItem: React.FC<{ item: MenuItem; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  const state = useMenuItemState(item.disabled);
  return (
    <Pressable
      {...state.handlers}
      accessibilityRole="menuitem"
      aria-checked={item.selected}
      aria-disabled={item.disabled}
      disabled={item.disabled}
      onPress={onPress}
    >
      <MenuRow
        icon={item.icon}
        image={item.image}
        checked={item.selected}
        destructive={item.destructive}
        disabled={item.disabled}
        state={state}
      >
        {item.label}
      </MenuRow>
    </Pressable>
  );
};

/** Меню на Popup: пункты в карточке-всплывашке. Новое лучше строить на DropdownMenu */
export const Menu: React.FC<{
  items: readonly MenuItem[];
  minWidth?: number;
  onClose: () => void;
}> = ({ items, minWidth, onClose }) => {
  // Только прозрачность: меню может встать и под кнопкой, и над ней — сдвиг вышел бы не в ту сторону
  const shown = useAppear(motion.appear);
  return (
    <Animated.View accessibilityRole="menu" style={{ opacity: shown }}>
      <MenuSurface style={minWidth ? { minWidth } : undefined}>
        {items.map(item => (
          <LegacyItem
            key={item.label}
            item={item}
            onPress={() => {
              onClose();
              item.onPress();
            }}
          />
        ))}
      </MenuSurface>
    </Animated.View>
  );
};

/**
 * Меню под кнопкой на Popup: оберните кнопку в <View ref={anchorRef} collapsable={false}>,
 * передайте ей onPressIn / onPress, а рядом отрисуйте menu(items). matchWidth — меню не уже кнопки
 */
export const useDropdownMenu = ({ matchWidth = false } = {}) => {
  const { anchorRef, anchor, isOpen, onPressIn, onPress, close, onDismiss } =
    usePopupToggle();
  const menu = (items: readonly MenuItem[]) =>
    anchor && (
      <Popup anchor={anchor} offset={MENU_OFFSET} onDismiss={onDismiss}>
        <Menu
          items={items}
          minWidth={matchWidth ? anchor.width : undefined}
          onClose={close}
        />
      </Popup>
    );
  return { anchorRef, isOpen, onPressIn, onPress, menu };
};

/**
 * Вид кнопки-иконки, как у IconButton. Свой, а не IconButton через asChild: кнопке меню нужен ref
 * для measure, а IconButton его не пробрасывает
 */
const IconTriggerFace: React.FC<{
  icon: IconComponent;
  state: ReturnType<typeof usePressFeedback>;
}> = ({ icon: Icon, state }) => {
  const rounded = radiusProps(useInnerRadius('lg'));
  const style = useMemo(
    () => ({
      transform: [
        {
          scale: state.press.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.9],
          }),
        },
      ],
    }),
    [state.press],
  );
  return (
    <Animated.View style={style}>
      <StateLayers
        className={rounded.className}
        style={rounded.style}
        layers={[
          {
            className: 'bg-mist-950/5 dark:bg-mist-50/5',
            progress: state.hover,
          },
          {
            className: 'bg-mist-950/10 dark:bg-mist-50/10',
            progress: state.press,
          },
        ]}
      />
      <View className="p-1.5">
        <Icon size={16} className="text-mist-500 dark:text-mist-400" />
      </View>
    </Animated.View>
  );
};

/** Кнопка-иконка с выпадающим меню под ней */
export const Dropdown: React.FC<{
  icon: IconComponent;
  items: readonly MenuItem[];
  accessibilityLabel?: string;
}> = ({ icon, items, accessibilityLabel }) => {
  const state = usePressFeedback();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...state.handlers} aria-label={accessibilityLabel}>
        <IconTriggerFace icon={icon} state={state} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map(item => (
          <DropdownMenuItem
            key={item.label}
            icon={item.icon}
            image={item.image}
            selected={item.selected}
            destructive={item.destructive}
            disabled={item.disabled}
            onSelect={item.onPress}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  icon?: IconComponent;
  image?: ImageSourcePropType;
}

export interface SelectProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Подпись, пока ни один вариант не выбран (value нет среди options) */
  placeholder?: string;
  accessibilityLabel?: string;
}

/**
 * Выбор одного варианта из выпадающего списка: кнопка показывает текущий, меню — все.
 * Для длинных списков, где Segmented не помещается в ряд (язык интерфейса). Составной вариант
 * для своих раскладок — SelectRoot, SelectTrigger, SelectContent, SelectItem
 */
export const Select = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  accessibilityLabel,
}: SelectProps<T>) => {
  // Без placeholder кнопка не бывает пустой: показывает первый вариант, как прежде
  const current =
    options.find(option => option.value === value) ??
    (placeholder === undefined ? options[0] : undefined);
  const selected = current
    ? { value: current.value, label: current.label }
    : undefined;
  return (
    <SelectRoot
      value={selected}
      onValueChange={option => {
        if (option) {
          onChange(option.value as T);
        }
      }}
    >
      <SelectTrigger accessibilityLabel={accessibilityLabel}>
        <SelectValue
          placeholder={placeholder ?? ''}
          icon={current?.icon}
          image={current?.image}
        />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
            label={option.label}
            icon={option.icon}
            image={option.image}
          />
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
