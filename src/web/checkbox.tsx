import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { useFieldControl } from './field';
import { Text } from './text';

// Флажок на Radix Checkbox: <button role="checkbox">, aria-checked и переключение — из примитива,
// вид — kit. Квадрат рисуем сами по checked, а не через Indicator: Indicator исчезает из разметки,
// а галочке нужно плавно проявиться (opacity и scale)

/** Фокус с клавиатуры — как у кнопок */
const FOCUS =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

// Галочка своей линией: так kit не зависит от набора иконок
const CheckMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden
    className={className}
  >
    <path
      d="M2.5 6.2 5 8.6l4.5-5.2"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CheckboxBoxProps {
  checked: boolean;
  indeterminate?: boolean;
  checkIcon?: IconComponent;
  /** Дополнительные классы квадрата: отступ в строке (mt-0.5) */
  className?: string;
}

/**
 * Квадрат флажка без поведения: w-5 h-5 rounded-md, выбранный — синий. Для своих строк
 * и списков, где нажимается не сам флажок
 */
export const CheckboxBox: React.FC<CheckboxBoxProps> = ({
  checked,
  indeterminate = false,
  checkIcon: CheckIcon,
  className,
}) => {
  const filled = checked || indeterminate;
  // Значок появляется прозрачностью и масштабом — остальное оформление по классам
  const mark = cx(
    'col-start-1 row-start-1 text-mist-50 transition-[opacity,transform] duration-150',
    filled ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
  );
  return (
    <span
      aria-hidden
      className={cx(
        'grid place-items-center shrink-0 w-5 h-5 rounded-md border transition-colors duration-150',
        filled
          ? 'bg-blue-500 border-blue-500'
          : 'border-mist-300 dark:border-mist-700',
        className,
      )}
    >
      {indeterminate ? (
        <span className={cx(mark, 'w-2.5 h-0.5 rounded-full bg-mist-50')} />
      ) : CheckIcon ? (
        <CheckIcon size={12} className={mark} />
      ) : (
        <CheckMark className={mark} />
      )}
    </span>
  );
};

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'type'
>;

export interface CheckboxProps extends NativeButtonProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** «Частично»: выбрана часть вложенных — черта вместо галочки, aria-checked="mixed" */
  indeterminate?: boolean;
  /** Галочка выбранного (`Icons.Check` лаунчера). Без неё — своя */
  checkIcon?: IconComponent;
  /**
   * Подпись и пояснение рядом с квадратом: тогда нажимается вся строка, а фон наведения
   * скругляется по правилу радиусов (в меню — rounded-lg и т. п.)
   */
  children?: React.ReactNode;
  /** Имя и значение для отправки формы: Radix добавит скрытый <input type="checkbox"> */
  name?: string;
  value?: string;
  required?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Флажок; с children — строка «флажок + подпись», нажимается целиком */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled: disabledProp,
  indeterminate = false,
  checkIcon,
  children,
  id: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className,
  style,
  ...props
}) => {
  const control = useFieldControl({
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  const { disabled } = control;
  // Строка у края меню или окна берёт радиус по правилу, сам квадрат — как у квадрата
  const rowRadius = radiusProps(useInnerRadius('lg'));
  const row = children !== undefined && children !== null;

  return (
    <CheckboxPrimitive.Root
      {...props}
      // «Частично» Radix сам снимает нажатием: следующее состояние — выбран
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={next => onCheckedChange(next === true)}
      disabled={disabled}
      id={control.id}
      aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']}
      style={row && rowRadius.style ? { ...rowRadius.style, ...style } : style}
      className={cx(
        FOCUS,
        'cursor-pointer select-none transition-colors hover:bg-mist-950/5 dark:hover:bg-mist-50/5 disabled:cursor-default disabled:opacity-50 disabled:pointer-events-none',
        row
          ? cx(
              'flex flex-row items-start gap-3 px-2 py-2 text-left',
              rowRadius.className,
            )
          : 'inline-flex rounded-md',
        className,
      )}
    >
      <CheckboxBox
        checked={checked}
        indeterminate={indeterminate}
        checkIcon={checkIcon}
        className={row ? 'mt-0.5' : undefined}
      />
      {row ? (
        // Внутри <button> — только строчные элементы: span с flex вместо div
        <span className="flex flex-col flex-1 min-w-0 gap-0.5">
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text>{children}</Text>
          ) : (
            children
          )}
        </span>
      ) : null}
    </CheckboxPrimitive.Root>
  );
};
