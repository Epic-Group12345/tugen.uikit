import React, { createContext, useContext } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { radiusProps, useInnerRadius } from '../radius';
import { cx } from './cx';
import { useFieldControl } from './field';
import { Text } from './text';

// Выбор одного варианта кружками на Radix RadioGroup: роли radiogroup / radio, стрелки и выбор —
// из примитива, вид — kit. Выбранное значение держим и в своём контексте: кружку нужно знать,
// выбран ли он, чтобы плавно проявить точку (Indicator Radix исчезает из разметки)

const FOCUS =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

const GroupContext = createContext<string | undefined>(undefined);

type NativeDivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'dir' | 'onChange'
>;

export interface RadioGroupProps extends NativeDivProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  /** Имя для отправки формы: Radix добавит скрытые <input type="radio"> */
  name?: string;
  required?: boolean;
  /** Направление стрелок: vertical — вверх / вниз (по умолчанию), horizontal — влево / вправо */
  orientation?: 'horizontal' | 'vertical';
  /** Раскладка вариантов: по умолчанию столбик с gap-1; в ряд — "flex-row gap-4" */
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** Группа вариантов: внутри RadioGroupItem или RadioRow */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  disabled: disabledProp,
  id: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className,
  children,
  ...props
}) => {
  const control = useFieldControl({
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  return (
    <GroupContext.Provider value={value}>
      <RadioGroupPrimitive.Root
        {...props}
        // Пустая строка у Radix — «ничего не выбрано»: undefined сделал бы группу неуправляемой
        value={value ?? ''}
        onValueChange={onValueChange}
        disabled={control.disabled}
        id={control.id}
        aria-labelledby={control['aria-labelledby']}
        aria-describedby={control['aria-describedby']}
        className={cx('flex', className ?? 'flex-col gap-1')}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </GroupContext.Provider>
  );
};

/** Кружок варианта без поведения: w-5 h-5, выбранный — синяя точка в центре */
export const RadioCircle: React.FC<{
  checked: boolean;
  className?: string;
}> = ({ checked, className }) => (
  <span
    aria-hidden
    className={cx(
      'flex items-center justify-center shrink-0 w-5 h-5 rounded-full border transition-colors duration-150',
      checked ? 'border-blue-500' : 'border-mist-300 dark:border-mist-700',
      className,
    )}
  >
    <span
      className={cx(
        'w-2.5 h-2.5 rounded-full bg-blue-500 transition-[opacity,transform] duration-150',
        checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
      )}
    />
  </span>
);

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'type'
>;

export interface RadioGroupItemProps extends NativeButtonProps {
  value: string;
  /**
   * Подпись рядом с кружком: тогда нажимается вся строка, а фон наведения скругляется по
   * правилу радиусов. Без неё — один кружок (тогда нужен aria-label)
   */
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Вариант группы: кружок, с children — строка «кружок + подпись» */
export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  children,
  className,
  style,
  ...props
}) => {
  const checked = useContext(GroupContext) === value;
  const rowRadius = radiusProps(useInnerRadius('lg'));
  const row = children !== undefined && children !== null;

  return (
    <RadioGroupPrimitive.Item
      {...props}
      value={value}
      style={row && rowRadius.style ? { ...rowRadius.style, ...style } : style}
      className={cx(
        FOCUS,
        'cursor-pointer select-none transition-colors hover:bg-mist-950/5 dark:hover:bg-mist-50/5 disabled:cursor-default disabled:opacity-50 disabled:pointer-events-none',
        row
          ? cx(
              'flex flex-row items-start gap-3 px-2 py-2 text-left',
              rowRadius.className,
            )
          : 'inline-flex rounded-full',
        className,
      )}
    >
      <RadioCircle checked={checked} className={row ? 'mt-0.5' : undefined} />
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
    </RadioGroupPrimitive.Item>
  );
};

export interface RadioRowProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

/** Вариант с подписью и пояснением, как CheckRow: нажимается вся строка */
export const RadioRow: React.FC<RadioRowProps> = ({
  value,
  label,
  description,
  disabled,
}) => (
  <RadioGroupItem value={value} disabled={disabled}>
    <Text>{label}</Text>
    {description ? (
      <Text size="xs" tone="muted">
        {description}
      </Text>
    ) : null}
  </RadioGroupItem>
);
