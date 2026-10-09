import React, { createContext, useContext, useRef, useState } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import { TONE_CLASS } from '../tone';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { COLLISION_PADDING, FLOATING } from './floating';
import {
  MENU_GROUP,
  MENU_LABEL,
  MENU_LABEL_PAD,
  MENU_LAYOUT,
  MENU_PADDING,
  MENU_RADIUS,
  MENU_SEPARATOR,
  MenuCheck,
  MenuChevron,
  MenuGlyph,
  MenuRow,
  useMenuItemClass,
  type MenuImage,
} from './menu-parts';

// Выпадающий список на Radix Select (position="popper"): роли (combobox, listbox, option),
// клавиатура, поиск по буквам и возврат фокуса — из Radix; оформление — kit. Простой вариант
// одной строкой — Select с options из menu.tsx

/** Значение списка: { value, label } — как у SelectRoot лаунчера: подпись нужна кнопке */
export interface SelectValueOption {
  value: string;
  label: string;
}

export interface SelectRootProps {
  value?: SelectValueOption;
  defaultValue?: SelectValueOption;
  onValueChange?: (option: SelectValueOption | undefined) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Имя поля формы: Radix кладёт рядом скрытый <select> */
  name?: string;
  required?: boolean;
  children: React.ReactNode;
}

interface SelectState {
  value: SelectValueOption | undefined;
  disabled: boolean;
  /** Подписи вариантов: Radix отдаёт только строку value, а kit — { value, label } */
  labels: Map<string, string>;
}

const SelectContext = createContext<SelectState | null>(null);

const useSelect = () => {
  const state = useContext(SelectContext);
  if (!state) {
    throw new Error('Select*: компонент должен быть внутри SelectRoot');
  }
  return state;
};

/**
 * Корень: value / defaultValue / onValueChange ({ value, label }), disabled. Radix всегда получает
 * строку (пустая — «ничего не выбрано»): так value={undefined} снова показывает placeholder
 */
export const SelectRoot: React.FC<SelectRootProps> = all => {
  const {
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    children,
    ...props
  } = all;
  const [inner, setInner] = useState(defaultValue);
  // Управляемый — если value передан, даже undefined: тогда кнопка показывает placeholder
  const current = 'value' in all ? value : inner;
  const labels = useRef(new Map<string, string>()).current;
  return (
    <SelectContext.Provider value={{ value: current, disabled, labels }}>
      <SelectPrimitive.Root
        {...props}
        disabled={disabled}
        value={current?.value ?? ''}
        onValueChange={next => {
          const option = next
            ? { value: next, label: labels.get(next) ?? next }
            : undefined;
          setInner(option);
          onValueChange?.(option);
        }}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Обычно SelectValue; можно добавить иконку перед ним */
  children: React.ReactNode;
  /** Растянуть по ширине родителя в ряду (flex-1) */
  grow?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Кнопка списка: серый фон, шеврон справа; подсвечена при наведении и пока список открыт.
 * По ширине контейнера (w-full), как Pressable в колонке лаунчера: <button> сам не растягивается.
 * В ряду — grow или обёртка с шириной (w-56)
 */
export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  grow = false,
  className,
  style,
  ...props
}) => {
  // Кнопка у края окна или карточки — по правилу радиусов, иначе rounded-lg
  const rounded = radiusProps(useInnerRadius('lg'));
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={cx(
        'flex flex-row items-center gap-2 px-3 py-1.5 min-w-0 text-sm text-left bg-mist-200 dark:bg-mist-800 hover:bg-mist-300 dark:hover:bg-mist-700 data-[state=open]:bg-mist-300 dark:data-[state=open]:bg-mist-700 active:bg-mist-300 dark:active:bg-mist-600 select-none cursor-pointer outline-none transition-[background-color,transform,opacity] duration-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-default disabled:pointer-events-none',
        rounded.className,
        grow ? 'flex-1' : 'w-full',
        className,
      )}
      style={rounded.style ? { ...rounded.style, ...style } : style}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <MenuChevron />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

export interface SelectValueProps {
  /** Подпись, пока ничего не выбрано */
  placeholder: string;
  /** Иконка или картинка выбранного варианта перед подписью */
  icon?: IconComponent;
  image?: MenuImage;
}

/**
 * Подпись выбранного варианта в кнопке: label из значения, а не копия содержимого пункта —
 * как в лаунчере, кнопка показывает подпись, даже если у пункта своё содержимое
 */
export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
  icon,
  image,
}) => {
  const { value } = useSelect();
  return (
    <>
      {value && (
        <MenuGlyph icon={icon} image={image} className={TONE_CLASS.default} />
      )}
      <span
        className={cx(
          'flex-1 min-w-0 truncate',
          value ? TONE_CLASS.default : TONE_CLASS.muted,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {value?.label}
        </SelectPrimitive.Value>
      </span>
    </>
  );
};

export interface SelectContentProps {
  /** Сторона кнопки; если там нет места, список встанет напротив */
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  /** Зазор от кнопки, px */
  sideOffset?: number;
  /** Ширина и высота классами (max-h-80) */
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}

/** Окно списка: как меню (rounded-xl p-1), не уже кнопки и не выше свободного места */
export const SelectContent: React.FC<SelectContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  className,
  children,
  ...props
}) => (
  <SelectPrimitive.Portal>
    <RadiusScope radius={MENU_RADIUS} padding={MENU_PADDING}>
      <SelectPrimitive.Content
        {...props}
        position="popper"
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={COLLISION_PADDING}
        className={cx(
          FLOATING,
          MENU_LAYOUT,
          'min-w-[max(12rem,var(--radix-select-trigger-width))] max-h-[var(--radix-select-content-available-height)]',
          className,
        )}
      >
        {/* Viewport прокручивает длинный список; gap — между пунктами, как у окна меню */}
        <SelectPrimitive.Viewport className="flex flex-col gap-0.5">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </RadiusScope>
  </SelectPrimitive.Portal>
);

export interface SelectItemProps {
  value: string;
  /** Подпись: в пункте и в кнопке, когда пункт выбран */
  label: string;
  /** Своё содержимое пункта вместо подписи */
  children?: React.ReactNode;
  icon?: IconComponent;
  image?: MenuImage;
  disabled?: boolean;
  className?: string;
}

/** Вариант списка: role="option", галочка у выбранного */
export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  label,
  children,
  icon,
  image,
  disabled = false,
  className,
}) => {
  const { labels } = useSelect();
  // Radix держит пункты смонтированными и при закрытом окне — подпись известна до выбора
  labels.set(value, label);
  const item = useMenuItemClass({ className });
  return (
    <SelectPrimitive.Item
      {...item}
      value={value}
      disabled={disabled}
      textValue={label}
    >
      <MenuRow
        icon={icon}
        image={image}
        trailing={
          <SelectPrimitive.ItemIndicator asChild>
            <MenuCheck />
          </SelectPrimitive.ItemIndicator>
        }
      >
        <SelectPrimitive.ItemText>{children ?? label}</SelectPrimitive.ItemText>
      </MenuRow>
    </SelectPrimitive.Item>
  );
};

/** Группа вариантов с подписью SelectLabel */
export const SelectGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SelectPrimitive.Group className={MENU_GROUP}>
    {children}
  </SelectPrimitive.Group>
);

/** Подпись группы вариантов */
export const SelectLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SelectPrimitive.Label className={cx(MENU_LABEL, MENU_LABEL_PAD.plain)}>
    {children}
  </SelectPrimitive.Label>
);

/** Линия между группами */
export const SelectSeparator: React.FC = () => (
  <SelectPrimitive.Separator className={MENU_SEPARATOR} />
);
