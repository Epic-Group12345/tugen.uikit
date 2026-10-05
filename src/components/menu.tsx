import React, { useMemo } from 'react';
import {
  Animated,
  Image,
  Pressable,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { StateLayers, useAnimatedFlag, usePressFeedback } from '../animation';
import { Popup, usePopupToggle } from '../popup';
import { useTheme } from '../theme';
import { motion, radius } from '../tokens';
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

const Glyph: React.FC<{
  icon?: IconComponent;
  image?: ImageSourcePropType;
  color: string;
}> = ({ icon: Icon, image, color }) => {
  if (image) {
    return <Image source={image} style={{ width: 16, height: 16 }} />;
  }
  return Icon ? <Icon size={16} color={color} /> : null;
};

// Галочка выбранного пункта из повёрнутого уголка: kit не зависит от набора иконок
const Check: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      width: 5,
      height: 9,
      marginHorizontal: 4,
      marginTop: -2,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderColor: color,
      transform: [{ rotate: '45deg' }],
    }}
  />
);

const Item: React.FC<{ item: MenuItem; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  const { colors } = useTheme();
  const { hovered, hover, press, handlers } = usePressFeedback();
  const content = hovered || item.selected ? colors.text : colors.textSecondary;
  return (
    <Pressable
      {...handlers}
      accessibilityRole="menuitem"
      aria-checked={item.selected}
      onPress={onPress}
    >
      <StateLayers
        radius={radius.lg}
        layers={[
          { color: colors.hover, progress: hover },
          { color: colors.press, progress: press },
        ]}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <Glyph icon={item.icon} image={item.image} color={content} />
        <Text numberOfLines={1} style={{ flex: 1, color: content }}>
          {item.label}
        </Text>
        {item.selected && <Check color={colors.text} />}
      </View>
    </Pressable>
  );
};

/** Меню: пункты в карточке-всплывашке. Само по себе — для своих Popup; обычно — Dropdown и Select */
export const Menu: React.FC<{
  items: readonly MenuItem[];
  minWidth?: number;
  onClose: () => void;
}> = ({ items, minWidth, onClose }) => {
  const { colors } = useTheme();
  const shown = useAnimatedFlag(true);
  return (
    <Animated.View
      accessibilityRole="menu"
      style={{
        opacity: shown,
        minWidth: Math.max(192, minWidth ?? 0),
        padding: 4,
        gap: 2,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.overlayBorder,
        backgroundColor: colors.overlay,
      }}
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

/** Кнопка-иконка с меню под ней */
export const Dropdown: React.FC<{
  icon: IconComponent;
  items: readonly MenuItem[];
  accessibilityLabel?: string;
}> = ({ icon, items, accessibilityLabel }) => {
  const { anchorRef, onPressIn, onPress, menu } = useDropdownMenu();
  return (
    // Обёртка — чтобы измерить положение кнопки; Popup внутри неё места не занимает
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

// Шеврон из повёрнутого уголка
const Chevron: React.FC<{ color: string }> = ({ color }) => (
  <View
    style={{
      width: 6,
      height: 6,
      marginHorizontal: 4,
      marginTop: -3,
      borderRightWidth: 1.5,
      borderBottomWidth: 1.5,
      borderColor: color,
      transform: [{ rotate: '45deg' }],
    }}
  />
);

/** Выбор одного варианта из выпадающего списка — там, где Segmented не помещается в ряд */
export const Select = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  accessibilityLabel,
}: SelectProps<T>) => {
  const { colors } = useTheme();
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
            radius={radius.lg}
            layers={[
              { color: colors.neutral },
              { color: colors.neutralHover, progress: hover },
              { color: colors.segmentPress, progress: feedback.press },
            ]}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            {current && (
              <Glyph
                icon={current.icon}
                image={current.image}
                color={colors.text}
              />
            )}
            <Text
              numberOfLines={1}
              tone={current ? 'default' : 'muted'}
              style={{ flex: 1 }}
            >
              {current?.label ?? placeholder}
            </Text>
            <Chevron color={colors.textMuted} />
          </View>
        </Animated.View>
      </Pressable>
      {menu(items)}
    </View>
  );
};
