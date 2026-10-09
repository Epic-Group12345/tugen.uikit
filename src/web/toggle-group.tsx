import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { useFieldControl } from './field';

// Кнопки с состоянием «нажата» на Radix Toggle, ToggleGroup и Switch: роли, aria-checked /
// aria-pressed, стрелки и выбор — из примитивов, вид — kit. Состояние оформляем по data-state
// примитива: так вид не расходится с тем, что слышит экранный диктор

// Общее у нажимаемых: фокус с клавиатуры, нажатие. Без disabled:opacity — приглушение ставим сами:
// Radix отдаёт disabled группы каждому сегменту, и дорожка с сегментами потускнели бы дважды
const PRESS =
  'inline-flex items-center justify-center select-none cursor-pointer transition-[background-color,transform,opacity] duration-100 active:scale-[0.98] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-default disabled:active:scale-100 disabled:pointer-events-none';

// Иконка и подпись одного цвета (currentColor): яркие у выбранного и при наведении
const CONTENT =
  'text-mist-500 dark:text-mist-400 hover:text-mist-950 dark:hover:text-mist-50 data-[state=on]:text-mist-950 dark:data-[state=on]:text-mist-50';

// ---------------------------------------------------------------------------------------------
// Switch

// Переключатель «вкл / выкл»: дорожка 36×20 с бегунком 16, включённый — синий. Бегунок едет
// translate-x на 36 − 16 − 2·2 = 16 (translate-x-4), цвет дорожки меняется за то же время.
// Наведение — затемнение псевдоэлементом поверх цвета, как слой наведения в лаунчере

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'type'
>;

export interface SwitchProps extends NativeButtonProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Имя и значение для отправки формы: Radix добавит скрытый <input type="checkbox"> */
  name?: string;
  value?: string;
  required?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Переключатель с API примитива (checked / onCheckedChange). Toggle — то же с value / onChange */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled: disabledProp,
  id: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className,
  ...props
}) => {
  const control = useFieldControl({
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  return (
    <SwitchPrimitive.Root
      {...props}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={control.disabled}
      id={control.id}
      aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']}
      className={cx(
        'relative inline-flex shrink-0 items-center w-9 h-5 p-0.5 rounded-full cursor-pointer outline-none',
        'bg-mist-300 dark:bg-mist-700 data-[state=checked]:bg-blue-500 transition-[background-color,transform] duration-[140ms] active:scale-[0.94]',
        'before:absolute before:inset-0 before:rounded-full before:transition-colors hover:before:bg-mist-950/10 dark:hover:before:bg-mist-50/10',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        'disabled:cursor-default disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none',
        className,
      )}
    >
      <SwitchPrimitive.Thumb className="relative block w-4 h-4 rounded-full bg-mist-50 transition-transform duration-[140ms] data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  );
};

// ---------------------------------------------------------------------------------------------
// ToggleButton

export interface ToggleButtonProps extends NativeButtonProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  icon?: IconComponent;
  /** Подпись; без неё — квадратная кнопка-иконка (тогда нужен aria-label) */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Кнопка с состоянием «нажата»: жирный шрифт, закреп, «показывать скрытые». Нажатая — с фоном.
 * У края контейнера радиус по правилу, иначе rounded-lg
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  pressed,
  onPressedChange,
  disabled = false,
  icon: Icon,
  children,
  className,
  style,
  ...props
}) => {
  const rounded = radiusProps(useInnerRadius('lg'));
  const label = children !== undefined && children !== null;
  return (
    <TogglePrimitive.Root
      {...props}
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      style={rounded.style ? { ...rounded.style, ...style } : style}
      className={cx(
        PRESS,
        CONTENT,
        'gap-1.5 disabled:opacity-50',
        'data-[state=off]:hover:bg-mist-950/5 dark:data-[state=off]:hover:bg-mist-50/5 data-[state=on]:bg-mist-200 dark:data-[state=on]:bg-mist-800 active:bg-mist-950/10 dark:active:bg-mist-50/10',
        label ? 'px-3 py-1.5 text-sm' : 'p-1.5',
        rounded.className,
        className,
      )}
    >
      {Icon && <Icon size={label ? 14 : 16} className="shrink-0" />}
      {label ? <span className="truncate">{children}</span> : null}
    </TogglePrimitive.Root>
  );
};

// ---------------------------------------------------------------------------------------------
// ToggleGroup

/** rounded — дорожка rounded-lg, сегменты rounded-md; pill — капсула, сегменты тоже капсулы */
export type ToggleGroupShape = 'rounded' | 'pill';

// Дорожка с отступом p-0.5: сегменты у её края по правилу радиусов — 8 − 2 = 6 (rounded-md),
// а в капсуле — капсулы. Радиус сегментам раздаёт RadiusScope
const TRACK_CLASS: Record<ToggleGroupShape, string> = {
  rounded:
    'flex flex-row gap-0.5 p-0.5 rounded-lg bg-mist-200 dark:bg-mist-800',
  pill: 'flex flex-row gap-0.5 p-0.5 rounded-full bg-mist-200 dark:bg-mist-800',
};
const TRACK_RADIUS = { rounded: 'lg', pill: 'full' } as const;
const TRACK_PADDING = '0.5';

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'dir' | 'onChange'
>;

interface ToggleGroupCommon extends NativeDivProps {
  disabled?: boolean;
  /** Форма дорожки и сегментов, по умолчанию rounded */
  shape?: ToggleGroupShape;
  /** Дополнительные классы дорожки: ширина, self-start */
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}

export type ToggleGroupProps = ToggleGroupCommon &
  (
    | {
        /** Выбор одного: повторное нажатие снимает выбор (value → undefined) */
        type: 'single';
        value: string | undefined;
        onValueChange: (value: string | undefined) => void;
      }
    | {
        /** Выбор нескольких */
        type: 'multiple';
        value: string[];
        onValueChange: (value: string[]) => void;
      }
  );

/** Группа кнопок-переключателей на общей дорожке: внутри ToggleGroupItem */
export const ToggleGroup: React.FC<ToggleGroupProps> = props => {
  const {
    type,
    value,
    onValueChange,
    disabled: disabledProp,
    shape = 'rounded',
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    className,
    children,
    ...rest
  } = props;
  const control = useFieldControl({
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  // Союз single | multiple Radix принимает целиком. «Ничего не выбрано» у него — пустая строка,
  // у kit — undefined, как в лаунчере
  const root =
    type === 'single'
      ? {
          type,
          value: (value as string | undefined) ?? '',
          onValueChange: (next: string) =>
            (onValueChange as (v: string | undefined) => void)(
              next === '' ? undefined : next,
            ),
        }
      : {
          type,
          value: value as string[],
          onValueChange: onValueChange as (v: string[]) => void,
        };

  return (
    <ToggleGroupPrimitive.Root
      {...rest}
      {...root}
      disabled={control.disabled}
      id={control.id}
      aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']}
      className={cx(
        TRACK_CLASS[shape],
        control.disabled && 'opacity-50',
        className,
      )}
    >
      <RadiusScope radius={TRACK_RADIUS[shape]} padding={TRACK_PADDING}>
        {children}
      </RadiusScope>
    </ToggleGroupPrimitive.Root>
  );
};

export interface ToggleGroupItemProps extends NativeButtonProps {
  value: string;
  icon?: IconComponent;
  /** Подпись; без неё — только иконка (тогда нужен aria-label) */
  children?: React.ReactNode;
  /** Растянуть: сегменты делят ширину дорожки */
  grow?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Сегмент группы: выбранный — светлая плашка на дорожке */
export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  disabled = false,
  icon: Icon,
  children,
  grow = false,
  className,
  style,
  ...props
}) => {
  // На дорожке — радиус по правилу (rounded-md или rounded-full), отдельно — rounded-md
  const rounded = radiusProps(useInnerRadius('md'));
  const label = children !== undefined && children !== null;
  return (
    <ToggleGroupPrimitive.Item
      {...props}
      value={value}
      disabled={disabled}
      style={rounded.style ? { ...rounded.style, ...style } : style}
      className={cx(
        PRESS,
        CONTENT,
        'gap-1.5 min-w-0',
        'data-[state=off]:hover:bg-mist-300 dark:data-[state=off]:hover:bg-mist-700 data-[state=on]:bg-mist-50 dark:data-[state=on]:bg-mist-700 active:bg-mist-300 dark:active:bg-mist-600',
        label ? 'px-3 py-1.5 text-sm' : 'p-1.5',
        // flex-auto, а не flex-1: у flex-1 основа 0, и в ряду по ширине содержимого (self-start)
        // браузер сжал бы сегменты до многоточия. С основой auto подпись получает своё место
        grow && 'flex-auto',
        disabled && 'opacity-50',
        rounded.className,
        className,
      )}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      {label ? <span className="truncate">{children}</span> : null}
    </ToggleGroupPrimitive.Item>
  );
};
