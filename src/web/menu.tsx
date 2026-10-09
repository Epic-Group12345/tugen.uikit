import React, { useRef, useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { IconComponent } from '../components/icon';
import { IconButton } from './button';
import { cx } from './cx';
import { COLLISION_PADDING } from './floating';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  MenuCheck,
  MenuRow,
  MenuSurface,
  useMenuItemClass,
  type MenuImage,
} from './menu-parts';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from './select';

// Простые меню одной строкой: Dropdown (кнопка-иконка с меню) и Select (выбор из options) — на
// составных DropdownMenu и SelectRoot. Menu и useDropdownMenu — меню из списка у своей кнопки,
// как прежние Menu и useDropdownMenu лаунчера; оформление общее с остальными меню (menu-parts)

export interface MenuItem {
  label: string;
  icon?: IconComponent;
  /** Картинка вместо иконки (флаг и т. п.): адрес для <img> */
  image?: MenuImage;
  /** Выбранный пункт — с галочкой справа */
  selected?: boolean;
  /** Необратимое действие: красный текст */
  destructive?: boolean;
  disabled?: boolean;
  /** Пункт выбран: щелчок, Enter или пробел */
  onSelect: () => void;
}

const PlainItem: React.FC<{ item: MenuItem; onClick: () => void }> = ({
  item,
  onClick,
}) => {
  const tone = item.destructive
    ? 'destructive'
    : item.selected
    ? 'strong'
    : 'idle';
  const cls = useMenuItemClass({ kind: 'plain', tone });
  return (
    <button
      type="button"
      // У выбора из списка — пункт-вариант с aria-checked, у обычного — menuitem
      role={item.selected === undefined ? 'menuitem' : 'menuitemradio'}
      aria-checked={item.selected}
      disabled={item.disabled}
      className={cx(cls.className, 'cursor-pointer')}
      style={cls.style}
      onClick={onClick}
    >
      <MenuRow
        icon={item.icon}
        image={item.image}
        trailing={item.selected ? <MenuCheck /> : undefined}
      >
        {item.label}
      </MenuRow>
    </button>
  );
};

// Стрелки и Home / End переводят фокус между пунктами, как в меню на Radix
const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      'button:not(:disabled)',
    ),
  );
  if (!items.length) {
    return;
  }
  const at = items.indexOf(document.activeElement as HTMLButtonElement);
  const next: Record<string, number> = {
    ArrowDown: at < 0 ? 0 : (at + 1) % items.length,
    ArrowUp: at < 0 ? items.length - 1 : (at - 1 + items.length) % items.length,
    Home: 0,
    End: items.length - 1,
  };
  if (event.key in next) {
    event.preventDefault();
    items[next[event.key]].focus();
  }
};

export interface MenuProps {
  items: readonly MenuItem[];
  /** Наименьшая ширина: px или CSS (var(--radix-popover-trigger-width)) */
  minWidth?: number | string;
  onClose: () => void;
  'aria-label'?: string;
}

/** Меню из списка пунктов в окне меню. Новое лучше строить на DropdownMenu */
export const Menu: React.FC<MenuProps> = ({
  items,
  minWidth,
  onClose,
  'aria-label': label,
}) => (
  // Только прозрачность: меню может встать и под кнопкой, и над ней — сдвиг вышел бы не в ту сторону
  <MenuSurface
    role="menu"
    aria-label={label}
    className="animate-tg-fade-in"
    style={minWidth !== undefined ? { minWidth } : undefined}
    onKeyDown={moveFocus}
  >
    {items.map(item => (
      <PlainItem
        key={item.label}
        item={item}
        onClick={() => {
          onClose();
          item.onSelect();
        }}
      />
    ))}
  </MenuSurface>
);

/**
 * Меню из списка у своей кнопки: дайте кнопке ref={anchorRef} и onClick, а рядом отрисуйте
 * menu(items). matchWidth — меню не уже кнопки. Окно — Radix Popover с якорем на кнопке:
 * положение, Escape и щелчок мимо — из него
 */
export const useDropdownMenu = ({ matchWidth = false } = {}) => {
  const anchorRef = useRef<HTMLElement | null>(null);
  const [isOpen, setOpen] = useState(false);
  const close = () => setOpen(false);
  const onClick = () => setOpen(open => !open);
  const menu = (items: readonly MenuItem[]) => (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <PopoverPrimitive.Anchor virtualRef={anchorRef} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={COLLISION_PADDING}
          className="z-50 outline-none data-[state=closed]:animate-tg-fade-out"
          // Нажатие на свою кнопку — не «мимо»: иначе окно закроется и её onClick тут же откроет его
          onInteractOutside={event => {
            if (anchorRef.current?.contains(event.target as Node)) {
              event.preventDefault();
            }
          }}
          // Фокус — обратно на кнопку: у якоря-ссылки Radix не знает, куда его вернуть
          onCloseAutoFocus={event => {
            event.preventDefault();
            anchorRef.current?.focus();
          }}
          // Фокус на первый пункт, чтобы стрелки сразу работали
          onOpenAutoFocus={event => {
            event.preventDefault();
            (event.currentTarget as HTMLElement)
              ?.querySelector<HTMLButtonElement>('button:not(:disabled)')
              ?.focus();
          }}
        >
          <Menu
            items={items}
            minWidth={
              matchWidth ? 'var(--radix-popover-trigger-width)' : undefined
            }
            onClose={close}
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
  return { anchorRef, isOpen, onClick, close, menu };
};

export interface DropdownProps {
  icon: IconComponent;
  items: readonly MenuItem[];
  /** Подпись кнопки для экранного диктора: у неё видна только иконка */
  'aria-label': string;
}

/** Кнопка-иконка с выпадающим меню под ней */
export const Dropdown: React.FC<DropdownProps> = ({
  icon,
  items,
  'aria-label': label,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton icon={icon} aria-label={label} />
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
          onSelect={item.onSelect}
        >
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  icon?: IconComponent;
  image?: MenuImage;
}

export interface SelectProps<T extends string> {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Подпись, пока ни один вариант не выбран (value нет среди options) */
  placeholder?: string;
  disabled?: boolean;
  /** Растянуть по ширине родителя в ряду (flex-1) */
  grow?: boolean;
  'aria-label'?: string;
}

/**
 * Выбор одного варианта из выпадающего списка: кнопка показывает текущий, список — все.
 * Для длинных списков, где Segmented не помещается в ряд. Составной вариант для своих
 * раскладок — SelectRoot, SelectTrigger, SelectContent, SelectItem
 */
export const Select = <T extends string>({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  grow,
  'aria-label': label,
}: SelectProps<T>) => {
  // Без placeholder кнопка не бывает пустой: показывает первый вариант, как в лаунчере
  const current =
    options.find(option => option.value === value) ??
    (placeholder === undefined ? options[0] : undefined);
  const selected = current
    ? { value: current.value, label: current.label }
    : undefined;
  return (
    <SelectRoot
      value={selected}
      disabled={disabled}
      onValueChange={option => {
        if (option) {
          onChange(option.value as T);
        }
      }}
    >
      <SelectTrigger aria-label={label} grow={grow}>
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
