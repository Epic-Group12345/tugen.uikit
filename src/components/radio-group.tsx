import React, { createContext, useContext } from 'react';
import { Pressable, View } from 'react-native';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import { StateLayers, usePressFeedback } from '../animation';
import { radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import { useFieldControl } from './field';
import { Text } from './text';

// Выбор одного варианта кружками на @rn-primitives/radio-group: role radiogroup / radio,
// aria-checked и выбор — из примитива, вид — kit (asChild на наших View / Pressable).
// Выбранное значение примитив наружу не отдаёт, а рамке кружка оно нужно — держим свой контекст

const DIMMED = { opacity: motion.dimmed };

interface GroupState {
  value: string | undefined;
  disabled: boolean;
}

const GroupContext = createContext<GroupState>({
  value: undefined,
  disabled: false,
});

export interface RadioGroupProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Раскладка вариантов: по умолчанию столбик с gap-1; в ряд — "flex-row gap-4" */
  className?: string;
  children: React.ReactNode;
}

/** Группа вариантов: внутри RadioGroupItem или RadioRow */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  disabled: disabledProp,
  accessibilityLabel,
  nativeID: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className = 'gap-1',
  children,
}) => {
  const control = useFieldControl({
    nativeID: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  const { disabled } = control;
  return (
    <GroupContext.Provider value={{ value, disabled }}>
      <RadioGroupPrimitive.Root
        asChild
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <View
          nativeID={control.nativeID}
          accessibilityLabel={accessibilityLabel}
          aria-labelledby={control['aria-labelledby']}
          aria-describedby={control['aria-describedby']}
          aria-disabled={disabled}
          className={className}
        >
          {children}
        </View>
      </RadioGroupPrimitive.Root>
    </GroupContext.Provider>
  );
};

/** Кружок варианта без поведения: w-5 h-5, выбранный — синяя точка в центре */
export const RadioCircle: React.FC<{
  checked: boolean;
  className?: string;
}> = ({ checked, className = '' }) => (
  <View
    className={`w-5 h-5 items-center justify-center rounded-full border ${
      checked ? 'border-blue-500' : 'border-mist-300 dark:border-mist-700'
    } ${className}`}
  >
    {checked && <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
  </View>
);

export interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  'aria-labelledby'?: string;
  /**
   * Подпись рядом с кружком: тогда нажимается вся строка, а фон наведения скругляется по
   * правилу радиусов. Без неё — один кружок
   */
  children?: React.ReactNode;
  className?: string;
}

/** Вариант группы: кружок, с children — строка «кружок + подпись» */
export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  disabled: disabledProp = false,
  accessibilityLabel,
  'aria-labelledby': labelledBy,
  children,
  className = '',
}) => {
  const group = useContext(GroupContext);
  const disabled = group.disabled || disabledProp;
  const checked = group.value === value;
  const { hover, handlers } = usePressFeedback({ disabled });
  const rowRadius = radiusProps(useInnerRadius('lg'));
  const row = children !== undefined && children !== null;

  return (
    <RadioGroupPrimitive.Item
      asChild
      value={value}
      disabled={disabledProp}
      aria-labelledby={labelledBy}
    >
      <Pressable
        {...handlers}
        accessibilityLabel={accessibilityLabel}
        aria-disabled={disabled}
        style={disabled ? DIMMED : undefined}
        className={className}
      >
        <StateLayers
          className={row ? rowRadius.className : 'rounded-full'}
          style={row ? rowRadius.style : undefined}
          layers={[
            { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
          ]}
        />
        {row ? (
          <View className="flex-row items-start gap-3 px-2 py-2">
            <RadioCircle checked={checked} className="mt-0.5" />
            <View className="flex-1 gap-0.5">{children}</View>
          </View>
        ) : (
          <RadioCircle checked={checked} />
        )}
      </Pressable>
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
