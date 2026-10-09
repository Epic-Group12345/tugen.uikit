import React from 'react';
import {
  Animated,
  Image,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import type * as DropdownMenuPrimitive from '@rn-primitives/dropdown-menu';
import { StateLayers, usePressFeedback } from '../animation';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from './icon';
import { Text, type TextProps } from './text';

// Общее оформление меню: окно, пункт, разделитель, подпись группы. Им пользуются все меню kit —
// DropdownMenu, ContextMenu, Select и старый Menu на Popup. Отдельный файл, а не menu.tsx:
// высокоуровневые Dropdown и Select в menu.tsx построены на DropdownMenu и SelectRoot, и общие
// части в menu.tsx замкнули бы импорты в кольцо (Metro предупреждает о каждом таком кольце)

// Окно меню — rounded-xl p-1: пункты у его края по правилу радиусов получают 12 − 4 = 8 (rounded-lg)
export const MENU_RADIUS = 'xl';
export const MENU_PADDING = '1';

export interface MenuSurfaceProps {
  /** Ширина и раскладка классами Uniwind (w-64, max-h-80) */
  className?: string;
  /** Измеренная ширина (меню не уже кнопки) — только стилем: класса для неё нет */
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Окно меню: рамка, фон и RadiusScope для пунктов */
export const MenuSurface: React.FC<MenuSurfaceProps> = ({
  className = '',
  style,
  children,
}) => (
  <RadiusScope radius={MENU_RADIUS} padding={MENU_PADDING}>
    <View
      className={`min-w-48 p-1 gap-0.5 rounded-xl border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900 ${className}`}
      style={style}
    >
      {children}
    </View>
  </RadiusScope>
);

const GLYPH = { width: 16, height: 16 };

/** Иконка или картинка пункта: 16×16 */
export const MenuGlyph: React.FC<{
  icon?: IconComponent;
  image?: ImageSourcePropType;
  className: string;
}> = ({ icon: Icon, image, className }) => {
  if (image) {
    return <Image source={image} style={GLYPH} />;
  }
  return Icon ? <Icon size={16} className={className} /> : null;
};

/** Галочка выбранного пункта */
export const MenuCheck: React.FC = () => (
  <View
    style={CHECK}
    className="border-r-2 border-b-2 border-mist-950 dark:border-mist-50"
  />
);

const CHECK: ViewStyle = {
  width: 5,
  height: 9,
  marginHorizontal: 4,
  marginTop: -2,
  transform: [{ rotate: '45deg' }],
};

export type ChevronDirection = 'down' | 'right';

// Поворот уголка из двух рамок: 45° смотрит вниз, −45° — вправо
const CHEVRON_ROTATE: Record<ChevronDirection, string> = {
  down: '45deg',
  right: '-45deg',
};

/** Уголок: «вниз» у выпадающего списка, «вправо» у пункта с подменю */
export const MenuChevron: React.FC<{ direction?: ChevronDirection }> = ({
  direction = 'down',
}) => (
  <View
    style={{
      width: 6,
      height: 6,
      marginHorizontal: 4,
      marginTop: direction === 'down' ? -3 : 0,
      transform: [{ rotate: CHEVRON_ROTATE[direction] }],
    }}
    className="border-r border-b border-mist-500 dark:border-mist-400"
  />
);

/** «Горячая клавиша» справа в пункте: Ctrl+C */
export const MenuShortcut: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Text size="xs" tone="faint" numberOfLines={1}>
    {children}
  </Text>
);

/** Состояние пункта: наведение и нажатие. handlers раздайте в Pressable пункта */
export const useMenuItemState = (disabled = false) => {
  const feedback = usePressFeedback({ disabled });
  // У края окна меню — по правилу радиусов, вне окна — rounded-lg
  const rounded = radiusProps(useInnerRadius('lg'));
  return { ...feedback, rounded };
};

export type MenuItemState = ReturnType<typeof useMenuItemState>;

export interface MenuRowProps {
  /** Подпись: строка — текстом пункта, иначе как есть */
  children?: React.ReactNode;
  icon?: IconComponent;
  /** Картинка вместо иконки (флаг и т. п.) */
  image?: ImageSourcePropType;
  /** Галочка справа: выбранный вариант, включённый флажок */
  checked?: boolean;
  /** Горячая клавиша справа */
  shortcut?: React.ReactNode;
  /** Что-то своё справа (уголок подменю) */
  trailing?: React.ReactNode;
  /** Необратимое действие: красный текст */
  destructive?: boolean;
  disabled?: boolean;
  /** Подсветить текст, как при наведении: открытое подменю */
  active?: boolean;
  /** Отступ слева под иконку — выровнять пункт без иконки с соседями */
  inset?: boolean;
}

const DIMMED = { opacity: 0.5 };

// Цвет текста и иконки пункта. Классы целиком — иначе Uniwind их не найдёт
const TONE = {
  idle: 'text-mist-600 dark:text-mist-300',
  strong: 'text-mist-950 dark:text-mist-50',
  destructive: 'text-red-600 dark:text-red-400',
} as const;

/**
 * Содержимое пункта: слои наведения и нажатия, иконка, подпись, горячая клавиша, галочка.
 * Кладётся внутрь Pressable пункта (примитива или своего), state — из useMenuItemState
 */
export const MenuRow: React.FC<MenuRowProps & { state: MenuItemState }> = ({
  state,
  children,
  icon,
  image,
  checked = false,
  shortcut,
  trailing,
  destructive = false,
  disabled = false,
  active = false,
  inset = false,
}) => {
  const tone = destructive
    ? TONE.destructive
    : state.hovered || checked || active
    ? TONE.strong
    : TONE.idle;
  return (
    <>
      <StateLayers
        className={state.rounded.className}
        style={state.rounded.style}
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
      <Animated.View style={disabled ? DIMMED : undefined}>
        <View
          className={`flex-row items-center gap-2 px-2 py-1.5 ${
            inset && !icon && !image ? 'pl-8' : ''
          }`}
        >
          <MenuGlyph icon={icon} image={image} className={tone} />
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text numberOfLines={1} className={`flex-1 ${tone}`}>
              {children}
            </Text>
          ) : (
            <View className="flex-1">{children}</View>
          )}
          {shortcut !== undefined && <MenuShortcut>{shortcut}</MenuShortcut>}
          {checked && <MenuCheck />}
          {trailing}
        </View>
      </Animated.View>
    </>
  );
};

/** Подпись группы пунктов */
export const MenuLabelText: React.FC<
  TextProps & { children: React.ReactNode; inset?: boolean }
> = ({ children, inset = false, ...props }) => (
  <Text
    {...props}
    size="xs"
    weight="semibold"
    tone="muted"
    numberOfLines={1}
    className={inset ? 'pl-8 pr-2 py-1.5' : 'px-2 py-1.5'}
  >
    {children}
  </Text>
);

/** Линия между группами: во всю ширину окна, мимо его отступа. Пропсы — роль от примитива */
export const MenuSeparatorLine: React.FC<ViewProps> = props => (
  <View {...props} className="h-px -mx-1 my-0.5 bg-mist-200 dark:bg-mist-800" />
);

// Пункты на примитиве меню. У @rn-primitives/dropdown-menu и context-menu одинаковые пункты, группы
// и подменю — разные только корень, кнопка и окно. Поэтому пункты собираются один раз для любого из
// двух примитивов: DropdownMenuItem и ContextMenuItem выглядят и ведут себя одинаково
type MenuPrimitive = Pick<
  typeof DropdownMenuPrimitive,
  | 'Item'
  | 'CheckboxItem'
  | 'RadioGroup'
  | 'RadioItem'
  | 'Group'
  | 'Label'
  | 'Separator'
  | 'Sub'
  | 'SubTrigger'
  | 'SubContent'
  | 'useSubContext'
>;

/** Общие пропсы пункта меню */
export interface MenuItemBaseProps
  extends Omit<MenuRowProps, 'checked' | 'trailing' | 'active'> {
  /** Закрыть меню после выбора (по умолчанию да) */
  closeOnSelect?: boolean;
  /** Подпись для экранного диктора и поиска по буквам, если children — не строка */
  textValue?: string;
}

export interface MenuItemProps extends MenuItemBaseProps {
  /** Галочка справа: текущий вариант в обычном пункте (для групп — RadioItem) */
  selected?: boolean;
  /** Пункт выбран: нажатие или Enter */
  onSelect?: () => void;
}

export interface MenuCheckboxItemProps extends MenuItemBaseProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface MenuRadioGroupProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export interface MenuRadioItemProps extends MenuItemBaseProps {
  value: string;
}

export interface MenuSubTriggerProps
  extends Omit<MenuItemBaseProps, 'closeOnSelect' | 'shortcut'> {}

export interface MenuSubContentProps {
  /** Классы окна подменю (в вебе оно отдельное, у пункта) */
  className?: string;
  children: React.ReactNode;
}

const textOf = (children: React.ReactNode, textValue?: string) =>
  textValue ?? (typeof children === 'string' ? children : undefined);

/**
 * native — подключена нативная версия примитива (RNW, тесты): она раскрывает подменю внутри того же
 * окна, а веб на Radix — отдельным окном рядом
 */
export const createMenuItems = (P: MenuPrimitive, native: boolean) => {
  const RadioValue = React.createContext<string | undefined>(undefined);

  const Item: React.FC<MenuItemProps> = ({
    onSelect,
    selected = false,
    closeOnSelect = true,
    textValue,
    disabled = false,
    ...row
  }) => {
    const state = useMenuItemState(disabled);
    return (
      <P.Item
        {...state.handlers}
        onPress={onSelect}
        closeOnPress={closeOnSelect}
        disabled={disabled}
        textValue={textOf(row.children, textValue)}
      >
        <MenuRow
          {...row}
          checked={selected}
          disabled={disabled}
          state={state}
        />
      </P.Item>
    );
  };

  const CheckboxItem: React.FC<MenuCheckboxItemProps> = ({
    checked,
    onCheckedChange,
    closeOnSelect = true,
    textValue,
    disabled = false,
    ...row
  }) => {
    const state = useMenuItemState(disabled);
    return (
      <P.CheckboxItem
        {...state.handlers}
        checked={checked}
        onCheckedChange={onCheckedChange}
        closeOnPress={closeOnSelect}
        disabled={disabled}
        textValue={textOf(row.children, textValue)}
      >
        <MenuRow {...row} checked={checked} disabled={disabled} state={state} />
      </P.CheckboxItem>
    );
  };

  // Своё значение группы рядом с примитивом: пункту нужно знать, выбран ли он, ещё до индикатора —
  // от этого цвет текста
  const RadioGroup: React.FC<MenuRadioGroupProps> = ({
    value,
    onValueChange,
    children,
  }) => (
    <RadioValue.Provider value={value}>
      <P.RadioGroup value={value} onValueChange={onValueChange}>
        {children}
      </P.RadioGroup>
    </RadioValue.Provider>
  );

  const RadioItem: React.FC<MenuRadioItemProps> = ({
    value,
    closeOnSelect = true,
    textValue,
    disabled = false,
    ...row
  }) => {
    const state = useMenuItemState(disabled);
    const checked = React.useContext(RadioValue) === value;
    return (
      <P.RadioItem
        {...state.handlers}
        value={value}
        closeOnPress={closeOnSelect}
        disabled={disabled}
        textValue={textOf(row.children, textValue)}
      >
        <MenuRow {...row} checked={checked} disabled={disabled} state={state} />
      </P.RadioItem>
    );
  };

  const Label: React.FC<{ children: React.ReactNode; inset?: boolean }> = ({
    children,
    inset,
  }) => (
    <P.Label asChild>
      <MenuLabelText inset={inset}>{children}</MenuLabelText>
    </P.Label>
  );

  const Separator: React.FC = () => (
    <P.Separator asChild>
      <MenuSeparatorLine />
    </P.Separator>
  );

  const Group: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <P.Group asChild>
      <View className="gap-0.5">{children}</View>
    </P.Group>
  );

  const SubTrigger: React.FC<MenuSubTriggerProps> = ({
    textValue,
    disabled = false,
    ...row
  }) => {
    const state = useMenuItemState(disabled);
    const { open } = P.useSubContext();
    return (
      <P.SubTrigger
        {...state.handlers}
        disabled={disabled}
        textValue={textOf(row.children, textValue)}
      >
        <MenuRow
          {...row}
          disabled={disabled}
          active={open}
          state={state}
          trailing={
            // Внутри окна подменю раскрывается вниз — уголок поворачивается за ним
            <MenuChevron direction={native && open ? 'down' : 'right'} />
          }
        />
      </P.SubTrigger>
    );
  };

  const SubContent: React.FC<MenuSubContentProps> = ({
    className = '',
    children,
  }) => (
    <P.SubContent>
      {native ? (
        // Пункты подменю — под своим пунктом, с отступом слева: правым краем они по-прежнему у края
        // окна, поэтому радиус у них тот же
        <View className={`gap-0.5 pl-3 ${className}`}>{children}</View>
      ) : (
        <MenuSurface className={className}>{children}</MenuSurface>
      )}
    </P.SubContent>
  );

  return {
    Item,
    CheckboxItem,
    RadioGroup,
    RadioItem,
    Label,
    Separator,
    Group,
    Sub: P.Sub,
    SubTrigger,
    SubContent,
  };
};
