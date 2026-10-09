import React from 'react';
import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import { TONE_CLASS } from '../tone';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { COLLISION_PADDING, FLOATING } from './floating';

// Общее оформление меню веб-слоя: окно, пункт, разделитель, подпись группы — для DropdownMenu,
// ContextMenu, Select и простого Menu. Как menu-parts лаунчера, но наведение — классами
// data-[highlighted]: (Radix ставит его и мышью, и стрелками), а не слоями StateLayers

// Окно меню — rounded-xl p-1: пункты у его края по правилу радиусов получают 12 − 4 = 8 (rounded-lg)
export const MENU_RADIUS = 'xl';
export const MENU_PADDING = '1';

/** Окно меню без цвета и рамки: раскладка, отступ и скругление. Цвет и появление — FLOATING */
export const MENU_LAYOUT = 'flex flex-col p-1 gap-0.5 rounded-xl';

/** Картинка пункта (флаг и т. п.): адрес для <img> вместо ImageSourcePropType лаунчера */
export type MenuImage = string;

export interface MenuSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Окно меню без Radix (простой Menu): рамка, фон и RadiusScope для пунктов. В окнах на Radix
 * те же классы стоят на самом Content — его не обернуть лишним div: Radix ставит туда роль и фокус
 */
export const MenuSurface: React.FC<MenuSurfaceProps> = ({
  className,
  children,
  ...props
}) => (
  <RadiusScope radius={MENU_RADIUS} padding={MENU_PADDING}>
    <div
      {...props}
      className={cx(
        MENU_LAYOUT,
        'min-w-48 border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900',
        className,
      )}
    >
      {children}
    </div>
  </RadiusScope>
);

/** Иконка или картинка пункта: 16×16. Цвет иконка берёт у пункта (currentColor) */
export const MenuGlyph: React.FC<{
  icon?: IconComponent;
  image?: MenuImage;
  className?: string;
}> = ({ icon: Icon, image, className }) => {
  if (image) {
    return (
      <img
        src={image}
        width={16}
        height={16}
        alt=""
        className="size-4 shrink-0 object-contain"
      />
    );
  }
  return Icon ? <Icon size={16} className={cx('shrink-0', className)} /> : null;
};

/** Галочка выбранного пункта */
export const MenuCheck: React.FC = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    aria-hidden
    className="shrink-0 text-mist-950 dark:text-mist-50"
  >
    <path
      d="M3.5 8.5l3 3 6-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type ChevronDirection = 'down' | 'right';

// Классы целиком — иначе Tailwind их не найдёт при сборке
const CHEVRON_ROTATE: Record<ChevronDirection, string> = {
  down: '',
  right: '-rotate-90',
};

/** Уголок: «вниз» у выпадающего списка, «вправо» у пункта с подменю */
export const MenuChevron: React.FC<{
  direction?: ChevronDirection;
  className?: string;
}> = ({ direction = 'down', className }) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 16 16"
    aria-hidden
    className={cx(
      'shrink-0 text-mist-500 dark:text-mist-400',
      CHEVRON_ROTATE[direction],
      className,
    )}
  >
    <path
      d="M4 6l4 4 4-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** «Горячая клавиша» справа в пункте: Ctrl+C */
export const MenuShortcut: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <span className={cx('ml-auto text-xs truncate', TONE_CLASS.faint, className)}>
    {children}
  </span>
);

/** Как подсвечивается пункт: radix — по data-highlighted, plain — свой пункт на <button> */
export type MenuItemKind = 'radix' | 'plain';

// Общее у пунктов: раскладка ряда, неактивное состояние. Цвет при наведении меняется плавно,
// как слои лаунчера; transform и opacity не трогаем — пункт не прыгает
const ITEM =
  'relative flex flex-row items-center gap-2 py-1.5 w-full text-sm text-left outline-none select-none cursor-default transition-[background-color,color] duration-100 data-[disabled]:opacity-50 data-[disabled]:pointer-events-none disabled:opacity-50 disabled:pointer-events-none';

// Наведение и нажатие. Классы целиком — иначе Tailwind их не найдёт при сборке
const HIGHLIGHT: Record<MenuItemKind, string> = {
  radix:
    'data-[highlighted]:bg-mist-950/5 dark:data-[highlighted]:bg-mist-50/5 active:bg-mist-950/10 dark:active:bg-mist-50/10',
  plain:
    'hover:bg-mist-950/5 dark:hover:bg-mist-50/5 focus-visible:bg-mist-950/5 dark:focus-visible:bg-mist-50/5 active:bg-mist-950/10 dark:active:bg-mist-50/10',
};

export type MenuItemTone = 'idle' | 'strong' | 'destructive';

// Цвет текста и иконки: обычный пункт светлее и темнеет при наведении, у выбранного (галочка,
// открытое подменю) — сразу тёмный. checked и open ставит Radix у флажков, вариантов и подменю
const TONE: Record<MenuItemTone, string> = {
  idle: 'text-mist-600 dark:text-mist-300 hover:text-mist-950 dark:hover:text-mist-50 focus-visible:text-mist-950 dark:focus-visible:text-mist-50 data-[highlighted]:text-mist-950 dark:data-[highlighted]:text-mist-50 data-[state=checked]:text-mist-950 dark:data-[state=checked]:text-mist-50 data-[state=open]:text-mist-950 dark:data-[state=open]:text-mist-50',
  strong: 'text-mist-950 dark:text-mist-50',
  destructive: 'text-red-600 dark:text-red-400',
};

// Отступы: inset — место слева под иконку, чтобы пункт без неё встал вровень с соседями
const PAD = { plain: 'px-2', inset: 'pl-8 pr-2' } as const;

/** Классы и стиль пункта: скругление по правилу радиусов (у края окна) или rounded-lg */
export const useMenuItemClass = ({
  kind = 'radix',
  tone = 'idle',
  inset = false,
  className,
}: {
  kind?: MenuItemKind;
  tone?: MenuItemTone;
  inset?: boolean;
  className?: string;
}) => {
  const rounded = radiusProps(useInnerRadius('lg'));
  return {
    className: cx(
      ITEM,
      HIGHLIGHT[kind],
      TONE[tone],
      inset ? PAD.inset : PAD.plain,
      rounded.className,
      className,
    ),
    style: rounded.style,
  };
};

export interface MenuRowProps {
  /** Подпись: строка — текстом пункта, иначе как есть */
  children?: React.ReactNode;
  icon?: IconComponent;
  /** Картинка вместо иконки (флаг и т. п.) */
  image?: MenuImage;
  /** Горячая клавиша справа */
  shortcut?: React.ReactNode;
  /** Галочка, уголок подменю — справа */
  trailing?: React.ReactNode;
}

/** Содержимое пункта: иконка, подпись, горячая клавиша, галочка */
export const MenuRow: React.FC<MenuRowProps> = ({
  children,
  icon,
  image,
  shortcut,
  trailing,
}) => (
  <>
    <MenuGlyph icon={icon} image={image} />
    <span className="flex-1 min-w-0 truncate">{children}</span>
    {shortcut !== undefined && <MenuShortcut>{shortcut}</MenuShortcut>}
    {trailing}
  </>
);

/** Подпись группы пунктов */
export const MENU_LABEL = cx(
  'text-xs font-semibold truncate py-1.5 select-none',
  TONE_CLASS.muted,
);
export const MENU_LABEL_PAD = PAD;

/** Линия между группами: во всю ширину окна, мимо его отступа */
export const MENU_SEPARATOR = 'h-px -mx-1 my-0.5 bg-mist-200 dark:bg-mist-800';

/** Группа пунктов */
export const MENU_GROUP = 'flex flex-col gap-0.5';

// Пункты на Radix. У @radix-ui/react-dropdown-menu и react-context-menu одинаковые пункты, группы
// и подменю — разные только корень, кнопка и окно. Пункты собираются один раз для любого из них
type MenuPrimitive = Pick<
  typeof DropdownMenuPrimitive,
  | 'Item'
  | 'CheckboxItem'
  | 'RadioGroup'
  | 'RadioItem'
  | 'ItemIndicator'
  | 'Group'
  | 'Label'
  | 'Separator'
  | 'Portal'
  | 'Sub'
  | 'SubTrigger'
  | 'SubContent'
>;

/** Общие пропсы пункта меню */
export interface MenuItemBaseProps extends Omit<MenuRowProps, 'trailing'> {
  /** Необратимое действие: красный текст */
  destructive?: boolean;
  disabled?: boolean;
  /** Отступ слева под иконку — выровнять пункт без иконки с соседями */
  inset?: boolean;
  /** Закрыть меню после выбора (по умолчанию да) */
  closeOnSelect?: boolean;
  /** Подпись для поиска по буквам, если children — не строка */
  textValue?: string;
  className?: string;
}

export interface MenuItemProps extends MenuItemBaseProps {
  /** Галочка справа: текущий вариант в обычном пункте (для групп — RadioItem) */
  selected?: boolean;
  /** Пункт выбран: нажатие, Enter или пробел */
  onSelect?: (event: Event) => void;
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
  /** Ширина и раскладка классами (w-64) */
  className?: string;
  children: React.ReactNode;
}

const toneOf = (destructive: boolean, strong = false): MenuItemTone =>
  destructive ? 'destructive' : strong ? 'strong' : 'idle';

/** closeOnSelect={false}: Radix оставляет меню открытым, если отменить событие выбора */
const keepOpen = (closeOnSelect: boolean) =>
  closeOnSelect ? undefined : (event: Event) => event.preventDefault();

export const createMenuItems = (P: MenuPrimitive) => {
  const Item: React.FC<MenuItemProps> = ({
    onSelect,
    selected = false,
    closeOnSelect = true,
    destructive = false,
    disabled = false,
    inset = false,
    textValue,
    className,
    ...row
  }) => {
    const item = useMenuItemClass({
      tone: toneOf(destructive, selected),
      inset: inset && !row.icon && !row.image,
      className,
    });
    return (
      <P.Item
        {...item}
        disabled={disabled}
        textValue={textValue}
        onSelect={event => {
          onSelect?.(event);
          keepOpen(closeOnSelect)?.(event);
        }}
      >
        <MenuRow {...row} trailing={selected ? <MenuCheck /> : undefined} />
      </P.Item>
    );
  };

  const CheckboxItem: React.FC<MenuCheckboxItemProps> = ({
    checked,
    onCheckedChange,
    closeOnSelect = true,
    destructive = false,
    disabled = false,
    inset = false,
    textValue,
    className,
    ...row
  }) => {
    const item = useMenuItemClass({
      tone: toneOf(destructive),
      inset: inset && !row.icon && !row.image,
      className,
    });
    return (
      <P.CheckboxItem
        {...item}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onSelect={keepOpen(closeOnSelect)}
        disabled={disabled}
        textValue={textValue}
      >
        <MenuRow
          {...row}
          trailing={
            <P.ItemIndicator asChild>
              <MenuCheck />
            </P.ItemIndicator>
          }
        />
      </P.CheckboxItem>
    );
  };

  const RadioGroup: React.FC<MenuRadioGroupProps> = ({
    value,
    onValueChange,
    children,
  }) => (
    <P.RadioGroup
      value={value}
      onValueChange={onValueChange}
      className={MENU_GROUP}
    >
      {children}
    </P.RadioGroup>
  );

  const RadioItem: React.FC<MenuRadioItemProps> = ({
    value,
    closeOnSelect = true,
    destructive = false,
    disabled = false,
    inset = false,
    textValue,
    className,
    ...row
  }) => {
    const item = useMenuItemClass({
      tone: toneOf(destructive),
      inset: inset && !row.icon && !row.image,
      className,
    });
    return (
      <P.RadioItem
        {...item}
        value={value}
        onSelect={keepOpen(closeOnSelect)}
        disabled={disabled}
        textValue={textValue}
      >
        <MenuRow
          {...row}
          trailing={
            <P.ItemIndicator asChild>
              <MenuCheck />
            </P.ItemIndicator>
          }
        />
      </P.RadioItem>
    );
  };

  const Label: React.FC<{ children: React.ReactNode; inset?: boolean }> = ({
    children,
    inset = false,
  }) => (
    <P.Label className={cx(MENU_LABEL, inset ? PAD.inset : PAD.plain)}>
      {children}
    </P.Label>
  );

  const Separator: React.FC = () => <P.Separator className={MENU_SEPARATOR} />;

  const Group: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <P.Group className={MENU_GROUP}>{children}</P.Group>
  );

  const SubTrigger: React.FC<MenuSubTriggerProps> = ({
    destructive = false,
    disabled = false,
    inset = false,
    textValue,
    className,
    ...row
  }) => {
    const item = useMenuItemClass({
      tone: toneOf(destructive),
      inset: inset && !row.icon && !row.image,
      className,
    });
    return (
      <P.SubTrigger {...item} disabled={disabled} textValue={textValue}>
        <MenuRow {...row} trailing={<MenuChevron direction="right" />} />
      </P.SubTrigger>
    );
  };

  // Подменю — отдельное окно у своего пункта. alignOffset −5 (p-1 и рамка): первый пункт подменю
  // встаёт вровень со своим пунктом
  const SubContent: React.FC<MenuSubContentProps> = ({
    className,
    children,
  }) => (
    <P.Portal>
      <RadiusScope radius={MENU_RADIUS} padding={MENU_PADDING}>
        <P.SubContent
          sideOffset={4}
          alignOffset={-5}
          collisionPadding={COLLISION_PADDING}
          className={cx(FLOATING, MENU_LAYOUT, 'min-w-48', className)}
        >
          {children}
        </P.SubContent>
      </RadiusScope>
    </P.Portal>
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
