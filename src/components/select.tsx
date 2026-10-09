import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import * as SelectPrimitive from '@rn-primitives/select';
import { StateLayers, useAnimatedFlag, usePressFeedback } from '../animation';
import {
  isNativePrimitive,
  useDismissLayer,
  useFloatingStyle,
  type Align,
} from '../layers';
import { radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import type { IconComponent } from './icon';
import {
  MenuChevron,
  MenuGlyph,
  MenuLabelText,
  MenuRow,
  MenuSeparatorLine,
  MenuSurface,
  useMenuItemState,
} from './menu-parts';
import { Appear } from './popover';
import { Text } from './text';

// Выпадающий список на @rn-primitives/select: роли (combobox, option), выбранное значение и возврат
// фокуса — из примитива; положение, Escape и оформление — kit. Простой вариант одной строкой —
// Select с options из menu.tsx. Нужен PopupHost в корне приложения

// Нативная версия примитива (RNW, тесты) или веб на Radix — от этого зависят положение и Escape
const native = isNativePrimitive(SelectPrimitive.Content);

/** Значение списка: { value, label } — подпись нужна кнопке, пока окно закрыто */
export type SelectValueOption = SelectPrimitive.Option;
export type SelectRootProps = SelectPrimitive.RootProps;

/** Корень: value / defaultValue / onValueChange ({ value, label }), disabled */
export const SelectRoot = SelectPrimitive.Root;

export interface SelectTriggerProps {
  /** Обычно SelectValue; можно добавить иконку перед ним */
  children: React.ReactNode;
  disabled?: boolean;
  /** Растянуть по ширине родителя (в ряду — flex-1) */
  grow?: boolean;
  accessibilityLabel?: string;
}

const DIMMED = { opacity: 0.5 };

/** Кнопка списка: серый фон, шеврон справа; подсвечена при наведении и пока список открыт */
export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  disabled,
  grow = false,
  accessibilityLabel,
}) => {
  const root = SelectPrimitive.useRootContext();
  const off = disabled ?? root.disabled ?? false;
  const feedback = usePressFeedback({ disabled: off, scale: 0.98 });
  const hover = useAnimatedFlag(feedback.hovered || root.open, {
    in: motion.hoverIn,
    out: motion.hoverOut,
  });
  // Кнопка у края окна или карточки — по правилу радиусов, иначе rounded-lg
  const rounded = radiusProps(useInnerRadius('lg'));
  return (
    <SelectPrimitive.Trigger
      {...feedback.handlers}
      disabled={off}
      aria-label={accessibilityLabel}
      style={grow ? GROW : undefined}
    >
      <Animated.View style={[feedback.pressStyle, off && DIMMED]}>
        <StateLayers
          className={rounded.className}
          style={rounded.style}
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
          {children}
          <MenuChevron />
        </View>
      </Animated.View>
    </SelectPrimitive.Trigger>
  );
};

const GROW = { flexGrow: 1, flexShrink: 1 };

export interface SelectValueProps {
  /** Подпись, пока ничего не выбрано */
  placeholder: string;
  /** Иконка или картинка выбранного варианта перед подписью */
  icon?: IconComponent;
  image?: ImageSourcePropType;
}

/**
 * Подпись выбранного варианта в кнопке. Своя, а не Value примитива: тот рисует Text из
 * react-native без классов kit
 */
export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
  icon,
  image,
}) => {
  const { value } = SelectPrimitive.useRootContext();
  return (
    <>
      {value && (
        <MenuGlyph
          icon={icon}
          image={image}
          className="text-mist-950 dark:text-mist-50"
        />
      )}
      <Text
        numberOfLines={1}
        tone={value ? 'default' : 'muted'}
        className="flex-1"
      >
        {value?.label ?? placeholder}
      </Text>
    </>
  );
};

export interface SelectContentProps {
  /** Сторона кнопки; если там нет места, список встанет напротив */
  side?: 'top' | 'bottom';
  align?: Align;
  /** Зазор от кнопки, DIP */
  sideOffset?: number;
  /** Ширина и высота классами Uniwind (max-h-80) */
  className?: string;
  /** Имя своего PortalHost, если список рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

/** Окно списка: как меню (rounded-xl p-1), не уже кнопки */
export const SelectContent: React.FC<SelectContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  className,
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = SelectPrimitive.useRootContext();
  const style = useFloatingStyle(root, {
    side,
    align,
    offset: sideOffset,
    margin: 8,
    enabled: native,
  });
  useDismissLayer(root.open, () => root.onOpenChange(false), { skip: !native });
  // Ширина кнопки известна только после measure — стилем: класса для неё нет
  const width =
    native && root.triggerPosition
      ? { minWidth: root.triggerPosition.width }
      : undefined;
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <SelectPrimitive.Overlay
        style={native ? StyleSheet.absoluteFill : undefined}
      >
        <SelectPrimitive.Content
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
        </SelectPrimitive.Content>
      </SelectPrimitive.Overlay>
    </SelectPrimitive.Portal>
  );
};

export interface SelectItemProps {
  value: string;
  /** Подпись: в пункте и в кнопке, когда пункт выбран */
  label: string;
  /** Своё содержимое пункта вместо подписи */
  children?: React.ReactNode;
  icon?: IconComponent;
  image?: ImageSourcePropType;
  disabled?: boolean;
}

/** Вариант списка: role="option", галочка у выбранного */
export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  label,
  children,
  icon,
  image,
  disabled = false,
}) => {
  const root = SelectPrimitive.useRootContext();
  const state = useMenuItemState(disabled);
  return (
    <SelectPrimitive.Item
      {...state.handlers}
      value={value}
      label={label}
      disabled={disabled}
    >
      <MenuRow
        icon={icon}
        image={image}
        checked={root.value?.value === value}
        disabled={disabled}
        state={state}
      >
        {children ?? label}
      </MenuRow>
    </SelectPrimitive.Item>
  );
};

/** Группа вариантов с подписью SelectLabel */
export const SelectGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SelectPrimitive.Group asChild>
    <View className="gap-0.5">{children}</View>
  </SelectPrimitive.Group>
);

/** Подпись группы вариантов */
export const SelectLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SelectPrimitive.Label asChild>
    <MenuLabelText>{children}</MenuLabelText>
  </SelectPrimitive.Label>
);

/** Линия между группами */
export const SelectSeparator: React.FC = () => (
  <SelectPrimitive.Separator asChild>
    <MenuSeparatorLine />
  </SelectPrimitive.Separator>
);
