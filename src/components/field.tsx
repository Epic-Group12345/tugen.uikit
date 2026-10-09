import React, { createContext, useContext, useId, useMemo } from 'react';
import { View } from 'react-native';
import { Label } from './label';
import { Text } from './text';

// Поле формы: подпись, элемент управления, пояснение и ошибка. Связи для экранного диктора
// (aria-labelledby, aria-describedby) и для нажатия на подпись (nativeID) Field раздаёт через
// контекст: элементы kit (TextField, Checkbox, Switch, RadioGroup, ToggleGroup) берут их сами,
// а любой другой элемент — через children-функцию или useFieldControl

/** Что Field сообщает элементу внутри */
export interface FieldContextValue {
  /** nativeID элемента: на него указывает подпись */
  controlId: string;
  /** nativeID подписи — для aria-labelledby; нет подписи — undefined */
  labelId?: string;
  /** nativeID пояснения и ошибки через пробел — для aria-describedby */
  describedBy?: string;
  /** Есть ошибка */
  invalid: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Контекст ближайшего Field (или null вне его) */
export const useField = () => useContext(FieldContext);

/** Пропсы связи, которые элемент может задать сам: они важнее Field */
export interface FieldControlOptions {
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  disabled?: boolean;
  invalid?: boolean;
}

/** Готовые пропсы элемента внутри Field: свои значения элемента + то, что дал Field */
export interface FieldControlProps {
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  disabled: boolean;
  invalid: boolean;
}

/**
 * Связать элемент с ближайшим Field: nativeID, aria-labelledby, aria-describedby, disabled и
 * invalid. Явные пропсы элемента важнее контекста
 */
export const useFieldControl = (
  own: FieldControlOptions = {},
): FieldControlProps => {
  const field = useField();
  const invalid = own.invalid ?? field?.invalid ?? false;
  return {
    nativeID: own.nativeID ?? field?.controlId,
    'aria-labelledby': own['aria-labelledby'] ?? field?.labelId,
    'aria-describedby': own['aria-describedby'] ?? field?.describedBy,
    'aria-invalid': invalid || undefined,
    disabled: own.disabled ?? field?.disabled ?? false,
    invalid,
  };
};

export type FieldOrientation = 'vertical' | 'horizontal';

export interface FieldProps {
  /** Подпись над элементом (или слева — в horizontal) */
  label?: React.ReactNode;
  /** Пояснение под элементом: text-xs, приглушённое */
  description?: React.ReactNode;
  /** Ошибка: красный text-xs, элемент получает invalid. false / пусто — ошибки нет */
  error?: React.ReactNode;
  /** Неактивное поле: подпись приглушена, элемент получает disabled */
  disabled?: boolean;
  /**
   * vertical — подпись сверху (поля ввода); horizontal — подпись и пояснение слева, элемент
   * справа (переключатели, флажки)
   */
  orientation?: FieldOrientation;
  /** Свой nativeID элемента; иначе — сгенерированный */
  nativeID?: string;
  /** Классы раскладки корня */
  className?: string;
  /** Элемент управления. Функция получает готовые пропсы связи — для любого элемента */
  children: React.ReactNode | ((control: FieldControlProps) => React.ReactNode);
}

const ROOT: Record<FieldOrientation, string> = {
  vertical: 'gap-1.5',
  horizontal: 'flex-row items-center justify-between gap-3',
};

/** Поле формы с подписью, пояснением и ошибкой; связи доступности ставит само */
export const Field: React.FC<FieldProps> = ({
  label,
  description,
  error,
  disabled = false,
  orientation = 'vertical',
  nativeID,
  className = '',
  children,
}) => {
  const id = useId();
  const controlId = nativeID ?? `${id}-control`;
  const labelId = label ? `${id}-label` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;
  const hasError = error !== undefined && error !== null && error !== false;
  const errorId = hasError ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const value = useMemo<FieldContextValue>(
    () => ({
      controlId,
      labelId,
      describedBy,
      invalid: hasError,
      disabled,
    }),
    [controlId, labelId, describedBy, hasError, disabled],
  );

  const labelNode = label ? (
    <Label htmlFor={controlId} nativeID={labelId} disabled={disabled}>
      {label}
    </Label>
  ) : null;
  const descriptionNode = description ? (
    <Text nativeID={descriptionId} size="xs" tone="muted">
      {description}
    </Text>
  ) : null;
  const errorNode = hasError ? (
    <Text nativeID={errorId} size="xs" tone="danger" aria-live="polite">
      {error}
    </Text>
  ) : null;

  return (
    <FieldContext.Provider value={value}>
      <View className={`${ROOT[orientation]} ${className}`}>
        {orientation === 'horizontal' ? (
          <>
            <View className="flex-1 gap-0.5">
              {labelNode}
              {descriptionNode}
              {errorNode}
            </View>
            <FieldControl>{children}</FieldControl>
          </>
        ) : (
          <>
            {labelNode}
            <FieldControl>{children}</FieldControl>
            {descriptionNode}
            {errorNode}
          </>
        )}
      </View>
    </FieldContext.Provider>
  );
};

// Отдельный компонент — чтобы children-функция получила пропсы из уже установленного контекста
const FieldControl: React.FC<{ children: FieldProps['children'] }> = ({
  children,
}) => {
  const control = useFieldControl();
  return <>{typeof children === 'function' ? children(control) : children}</>;
};
