import React, { useMemo } from 'react';
import {
  Animated,
  Image,
  Pressable,
  View,
  type ImageSourcePropType,
} from 'react-native';
import {
  StateLayers,
  useAppear,
  usePressFeedback,
  useAnimatedFlag,
} from '../animation';
import { motion } from '../tokens';
import { Popup, usePopupToggle } from '../popup';
import { IconButton } from './button';
import type { IconComponent } from './icon';
import { Text } from './text';

export interface MenuItem {
  label: string;
  icon?: IconComponent;
  /** Картинка вместо иконки (флаг и т. п.) */
  image?: ImageSourcePropType;
  /** Выбранный пункт — с галочкой справа */
  selected?: boolean;
  onPress: () => void;
}

// Отступ меню от кнопки, DIP
const MENU_OFFSET = 4;

const GLYPH = { width: 16, height: 16 };

/** Иконка или картинка пункта: 16×16 */
const Glyph: React.FC<{
  icon?: IconComponent;
  image?: ImageSourcePropType;
  className: string;
}> = ({ icon: Icon, image, className }) => {
  if (image) {
    return <Image source={image} style={GLYPH} />;
  }
  return Icon ? <Icon size={16} className={className} /> : null;
};

const Item: React.FC<{ item: MenuItem; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  const { hovered, hover, press, handlers } = usePressFeedback();
  const content =
    hovered || item.selected
      ? 'text-mist-950 dark:text-mist-50'
      : 'text-mist-600 dark:text-mist-300';
  return (
    <Pressable
      {...handlers}
      accessibilityRole="menuitem"
      aria-checked={item.selected}
      onPress={onPress}
    >
      <StateLayers
        className="rounded-lg"
        layers={[
          { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
          { className: 'bg-mist-950/10 dark:bg-mist-50/10', progress: press },
        ]}
      />
      <View className="flex-row items-center gap-2 px-2 py-1.5">
        <Glyph icon={item.icon} image={item.image} className={content} />
        <Text numberOfLines={1} className={`flex-1 ${content}`}>
          {item.label}
        </Text>
        {item.selected && <Check />}
      </View>
    </Pressable>
  );
};

/** Галочка выбранного пункта */
const Check: React.FC = () => (
  <View
    style={{
      width: 5,
      height: 9,
      marginHorizontal: 4,
      marginTop: -2,
      transform: [{ rotate: '45deg' }],
    }}
    className="border-r-2 border-b-2 border-mist-950 dark:border-mist-50"
  />
);

/** Шеврон «вниз» у выпадающего списка */
const Chevron: React.FC = () => (
  <View
    style={{
      width: 6,
      height: 6,
      marginHorizontal: 4,
      marginTop: -3,
      transform: [{ rotate: '45deg' }],
    }}
    className="border-r border-b border-mist-500 dark:border-mist-400"
  />
);

/** Меню: пункты в карточке-всплывашке. Обычно — через Dropdown и Select */
export const Menu: React.FC<{
  items: readonly MenuItem[];
  minWidth?: number;
  onClose: () => void;
}> = ({ items, minWidth, onClose }) => {
  // Только прозрачность: меню может встать и под кнопкой, и над ней — сдвиг вышел бы не в ту сторону
  const shown = useAppear(motion.appear);
  return (
    <Animated.View accessibilityRole="menu" style={{ opacity: shown }}>
      <View
        className="min-w-48 p-1 gap-0.5 rounded-xl border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900"
        style={minWidth ? { minWidth } : undefined}
      >
        {items.map(item => (
          <Item
            key={item.label}
            item={item}
            onPress={() => {
              onClose();
              item.onPress();
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
};

/**
 * Меню под кнопкой: оберните кнопку в <View ref={anchorRef} collapsable={false}>, передайте ей
 * onPressIn / onPress, а рядом отрисуйте menu(items). matchWidth — меню не уже кнопки
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

/** Кнопка-иконка с выпадающим меню под ней */
export const Dropdown: React.FC<{
  icon: IconComponent;
  items: readonly MenuItem[];
  accessibilityLabel?: string;
}> = ({ icon, items, accessibilityLabel }) => {
  const { anchorRef, onPressIn, onPress, menu } = useDropdownMenu();
  return (
    // Обёртка — чтобы измерить положение кнопки: IconButton ref не пробрасывает.
    // Popup внутри неё, а не рядом: сам он места не занимает, но в ряду с gap родитель
    // добавил бы для него отступ, и соседние кнопки сдвинулись бы на время открытия меню
    <View ref={anchorRef} collapsable={false}>
      <IconButton
        icon={icon}
        onPressIn={onPressIn}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      />
      {menu(items)}
    </View>
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
 * Для длинных списков, где Segmented не помещается в ряд (язык интерфейса)
 */
export const Select = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  accessibilityLabel,
}: SelectProps<T>) => {
  const { anchorRef, isOpen, onPressIn, onPress, menu } = useDropdownMenu({
    matchWidth: true,
  });
  const feedback = usePressFeedback({ scale: 0.98 });
  const hover = useAnimatedFlag(feedback.hovered || isOpen, {
    in: motion.hoverIn,
    out: motion.hoverOut,
  });
  const current =
    options.find(option => option.value === value) ??
    (placeholder === undefined ? options[0] : undefined);
  const items = useMemo(
    () =>
      options.map(option => ({
        label: option.label,
        icon: option.icon,
        image: option.image,
        selected: option.value === value,
        onPress: () => onChange(option.value),
      })),
    [options, value, onChange],
  );

  return (
    <View ref={anchorRef} collapsable={false}>
      <Pressable
        {...feedback.handlers}
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel}
        aria-expanded={isOpen}
        onPress={onPress}
        onPressIn={() => {
          feedback.handlers.onPressIn();
          onPressIn();
        }}
      >
        <Animated.View style={feedback.pressStyle}>
          <StateLayers
            className="rounded-lg"
            layers={[
              { className: 'bg-mist-200 dark:bg-mist-800' },
              { className: 'bg-mist-300 dark:bg-mist-700', progress: hover },
              {
                className: 'bg-mist-300 dark:bg-mist-600',
                progress: feedback.press,
              },
            ]}
          />
          <View className="flex-row items-center gap-2 px-3 py-1.5">
            {current && (
              <Glyph
                icon={current.icon}
                image={current.image}
                className="text-mist-950 dark:text-mist-50"
              />
            )}
            <Text
              numberOfLines={1}
              tone={current ? 'default' : 'muted'}
              className="flex-1"
            >
              {current?.label ?? placeholder}
            </Text>
            <Chevron />
          </View>
        </Animated.View>
      </Pressable>
      {menu(items)}
    </View>
  );
};
