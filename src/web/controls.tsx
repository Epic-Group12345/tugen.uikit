import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import type { IconComponent } from '../components/icon';
import { Checkbox } from './checkbox';
import { cx } from './cx';
import { useFieldControl } from './field';
import { Text } from './text';
import {
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupShape,
} from './toggle-group';

// Простые элементы настроек одной строкой: Toggle, Slider, Segmented, CheckRow — обёртки над
// Radix (Switch, Slider, ToggleGroup, Checkbox) с API лаунчера (value / onChange)

// Switch определён рядом с ToggleGroup; здесь — синоним, как в лаунчере
export { Switch, type SwitchProps } from './toggle-group';

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
  /** Для подписи <label htmlFor>; внутри Field ставится сам */
  id?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Переключатель «вкл / выкл» с API лаунчера: Switch с value / onChange */
export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  ...props
}) => <Switch {...props} checked={value} onCheckedChange={onChange} />;

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  /** Шаг стрелок и протягивания; по умолчанию 1 */
  step?: number;
  onChange: (value: number) => void;
  /** Отпустили ползунок — сохранить значение */
  onCommit?: (value: number) => void;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** id бегунка — у него роль slider; внутри Field ставится сам */
  id?: string;
  /** Имя для отправки формы: Radix добавит скрытый <input> */
  name?: string;
  /** Классы корня: ширина */
  className?: string;
}

/**
 * Ползунок: нажатие ставит значение, протягивание и стрелки меняют. Дорожка h-1 с заливкой
 * до значения и кружок 12; поведение и роль slider — из Radix Slider
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onCommit,
  disabled: disabledProp,
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  id: ownId,
  name,
  className,
}) => {
  const control = useFieldControl({
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  return (
    <SliderPrimitive.Root
      value={[value]}
      min={min}
      max={max}
      step={step}
      name={name}
      disabled={control.disabled}
      onValueChange={([next]) => onChange(next)}
      onValueCommit={onCommit ? ([next]) => onCommit(next) : undefined}
      className={cx(
        'relative flex flex-row items-center h-6 w-full touch-none select-none cursor-pointer data-[disabled]:cursor-default data-[disabled]:opacity-50',
        className,
      )}
    >
      <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-mist-200 dark:bg-mist-800 overflow-hidden">
        <SliderPrimitive.Range className="absolute h-full bg-mist-950 dark:bg-mist-50" />
      </SliderPrimitive.Track>
      {/* Имя и связи — бегунку: роль slider и фокус у него, а не у корня */}
      <SliderPrimitive.Thumb
        id={control.id}
        aria-label={ariaLabel}
        aria-labelledby={control['aria-labelledby']}
        aria-describedby={control['aria-describedby']}
        className="block w-3 h-3 rounded-full bg-mist-950 dark:bg-mist-50 transition-transform duration-100 hover:scale-125 active:scale-125 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      />
    </SliderPrimitive.Root>
  );
};

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: IconComponent;
}

export interface SegmentedProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Форма: pill (по умолчанию) — капсула, rounded — дорожка rounded-lg и сегменты rounded-md */
  shape?: ToggleGroupShape;
  disabled?: boolean;
  'aria-label'?: string;
  id?: string;
  /** Классы дорожки: ширина, self-start */
  className?: string;
}

/**
 * Выбор одного варианта из нескольких кнопками в ряд (переключатель темы в настройках):
 * ToggleGroup type="single" с растянутыми сегментами. Выбор не снимается повторным нажатием
 */
export const Segmented = <T extends string>({
  options,
  value,
  onChange,
  shape = 'pill',
  ...props
}: SegmentedProps<T>) => (
  <ToggleGroup
    {...props}
    type="single"
    value={value}
    onValueChange={next => {
      // Radix снимает выбор повторным нажатием (undefined) — у Segmented вариант есть всегда
      if (next !== undefined && next !== value) {
        onChange(next as T);
      }
    }}
    shape={shape}
  >
    {options.map(option => (
      <ToggleGroupItem
        key={option.value}
        value={option.value}
        icon={option.icon}
        grow
      >
        {option.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

export interface CheckRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Галочка выбранного: `Icons.Check` лаунчера. Без неё — своя */
  checkIcon?: IconComponent;
}

/** Флажок с подписью и пояснением: нажимается вся строка (наборы модов в новой сборке) */
export const CheckRow: React.FC<CheckRowProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled,
  checkIcon,
}) => (
  <Checkbox
    checked={checked}
    onCheckedChange={onChange}
    disabled={disabled}
    checkIcon={checkIcon}
  >
    <Text>{label}</Text>
    {description ? (
      <Text size="xs" tone="muted">
        {description}
      </Text>
    ) : null}
  </Checkbox>
);
