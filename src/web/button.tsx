import React from 'react';
import { radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';

// Кнопки веб-слоя: те же варианты и размеры, что у Button лаунчера. Наведение и нажатие — классами
// hover: и active: с плавной сменой цвета (в лаунчере это слои StateLayers). Все свойства <button>
// проходят насквозь, вместе с ref: так кнопка работает триггером Radix через asChild

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'play'
  | 'ghost'
  | 'outline'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Фон по варианту: обычный, наведение, нажатие. Классы целиком — иначе Tailwind их не найдёт
const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-mist-50',
  play: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-mist-50',
  secondary:
    'bg-mist-200 dark:bg-mist-800 hover:bg-mist-300 dark:hover:bg-mist-700 active:bg-mist-400 dark:active:bg-mist-600 text-mist-900 dark:text-mist-100',
  ghost:
    'bg-transparent hover:bg-mist-950/5 dark:hover:bg-mist-50/5 active:bg-mist-950/10 dark:active:bg-mist-50/10 text-mist-900 dark:text-mist-100',
  outline:
    'border border-mist-200 dark:border-mist-800 hover:bg-mist-950/5 dark:hover:bg-mist-50/5 active:bg-mist-950/10 dark:active:bg-mist-50/10 text-mist-900 dark:text-mist-100',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-mist-50',
};

const SIZE: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 14, lg: 16 };

/** Общее у кнопок: фокус с клавиатуры, нажатие, неактивное состояние */
export const PRESSABLE =
  'inline-flex items-center justify-center select-none cursor-pointer transition-[background-color,transform,opacity] duration-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-default disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * primary — синяя, одно главное действие на экране; secondary — нейтральная; play — зелёная,
   * только запуск игры; ghost — без фона, фон при наведении; outline — с рамкой; danger — красная,
   * необратимое действие (удалить)
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconComponent;
  /** Растянуть по ширине родителя (в ряду — flex-1) */
  grow?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  grow = false,
  type = 'button',
  className,
  style,
  children,
  ...props
}) => {
  // У края окна, меню или уведомления радиус — по правилу вложенности, иначе rounded-lg
  const rounded = radiusProps(useInnerRadius('lg'));
  return (
    <button
      type={type}
      {...props}
      className={cx(
        PRESSABLE,
        'gap-1.5 whitespace-nowrap',
        VARIANT[variant],
        SIZE[size],
        rounded.className,
        grow && 'flex-1',
        className,
      )}
      style={rounded.style ? { ...rounded.style, ...style } : style}
    >
      {Icon && <Icon size={ICON_SIZE[size]} className="shrink-0" />}
      {children !== undefined && children !== null && (
        <span className="truncate">{children}</span>
      )}
    </button>
  );
};

export type IconTone = 'default' | 'danger' | 'success';

// Классы целиком — иначе Tailwind их не найдёт при сборке
const ICON_TONE: Record<IconTone, string> = {
  default: 'text-mist-500 dark:text-mist-400',
  danger: 'text-red-500 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
};

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconComponent;
  /** Подпись для экранного диктора: у кнопки видна только иконка */
  'aria-label': string;
  /** danger — красная (выключенный микрофон, «завершить»), success — зелёная (включено) */
  tone?: IconTone;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Квадратная кнопка-иконка без фона: фон проявляется при наведении */
export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  tone = 'default',
  type = 'button',
  className,
  style,
  ...props
}) => {
  const rounded = radiusProps(useInnerRadius('lg'));
  return (
    <button
      type={type}
      {...props}
      className={cx(
        PRESSABLE,
        'p-1.5 active:scale-90 hover:bg-mist-950/5 dark:hover:bg-mist-50/5 active:bg-mist-950/10 dark:active:bg-mist-50/10',
        ICON_TONE[tone],
        rounded.className,
        className,
      )}
      style={rounded.style ? { ...rounded.style, ...style } : style}
    >
      <Icon size={16} />
    </button>
  );
};
