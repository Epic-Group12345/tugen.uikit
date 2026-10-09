import React, { createContext, useContext, useId, useMemo } from 'react';
import { cx } from './cx';
import { Label } from './label';
import { Text } from './text';

// Поле формы: подпись, элемент управления, пояснение и ошибка. Связи раздаёт контекст, как
// в лаунчере, только вместо nativeID — id DOM: подпись <label htmlFor> указывает на элемент,
// пояснение и ошибка попадают в его aria-describedby. Элементы kit (TextField, Checkbox, Switch,
// RadioGroup, ToggleGroup, Slider) берут связи сами, любой другой — через children-функцию

/** Что Field сообщает элементу внутри */
export interface FieldContextValue {
  /** id элемента: на него указывает подпись */
  controlId: string;
  /** id подписи — для aria-labelledby; нет подписи — undefined */
  labelId?: string;
  /** id пояснения и ошибки через пробел — для aria-describedby */
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
  id?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  disabled?: boolean;
  invalid?: boolean;
}

/**
 * Готовые пропсы элемента внутри Field. disabled и invalid — для логики: на свой элемент их
 * не раскладывают целиком (`invalid` не атрибут DOM), а берут нужное
 */
export interface FieldControlProps {
  id?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  disabled: boolean;
  invalid: boolean;
}

/**
 * Связать элемент с ближайшим Field: id, aria-labelledby, aria-describedby, disabled и invalid.
 * Явные пропсы элемента важнее контекста
 */
export const useFieldControl = (
  own: FieldControlOptions = {},
): FieldControlProps => {
  const field = useField();
  const invalid = own.invalid ?? field?.invalid ?? false;
  return {
    id: own.id ?? field?.controlId,
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
  /** Свой id элемента; иначе — сгенерированный */
  id?: string;
  /** Классы раскладки корня */
  className?: string;
  /** Элемент управления. Функция получает готовые пропсы связи — для любого элемента */
  children: React.ReactNode | ((control: FieldControlProps) => React.ReactNode);
}

// Классы целиком — иначе Tailwind их не найдёт при сборке
const ROOT: Record<FieldOrientation, string> = {
  vertical: 'flex flex-col gap-1.5',
  horizontal: 'flex flex-row items-center justify-between gap-3',
};

/** Поле формы с подписью, пояснением и ошибкой; связи доступности ставит само */
export const Field: React.FC<FieldProps> = ({
  label,
  description,
  error,
  disabled = false,
  orientation = 'vertical',
  id: ownId,
  className,
  children,
}) => {
  const id = useId();
  const controlId = ownId ?? `${id}-control`;
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
    <Label htmlFor={controlId} id={labelId} disabled={disabled}>
      {label}
    </Label>
  ) : null;
  const descriptionNode = description ? (
    <Text as="p" id={descriptionId} size="xs" tone="muted">
      {description}
    </Text>
  ) : null;
  // aria-live: ошибка, появившаяся после проверки, зачитывается сразу
  const errorNode = hasError ? (
    <Text as="p" id={errorId} size="xs" tone="danger" aria-live="polite">
      {error}
    </Text>
  ) : null;

  return (
    <FieldContext.Provider value={value}>
      <div className={cx(ROOT[orientation], className)}>
        {orientation === 'horizontal' ? (
          <>
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              {labelNode}
              {descriptionNode}
              {errorNode}
            </div>
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
      </div>
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
