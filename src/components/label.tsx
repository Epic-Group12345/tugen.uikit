import React, { useEffect, useRef } from 'react';
import * as LabelPrimitive from '@rn-primitives/label';
import { Text, type TextSize, type TextTone } from './text';

// Подпись к элементу формы на @rn-primitives/label. В вебе у <label for> браузер сам переводит
// нажатие на элемент, а в React Native (и на Windows) связи «подпись → элемент» нет. Поэтому
// элементы kit (флажок, переключатель, поле) регистрируют по своему nativeID действие —
// переключиться или взять фокус, — а Label по htmlFor его вызывает. htmlFor примитиву не отдаём:
// в вебе нажатие тогда дошло бы до элемента дважды (браузер + наш обработчик)

const targets = new Map<string, () => void>();

/**
 * Зарегистрировать действие элемента для подписи с htmlFor = id: флажок переключается, поле
 * берёт фокус. Без id ничего не делает
 */
export const useLabelTarget = (
  id: string | undefined,
  activate: () => void,
) => {
  // Последнее действие — через ref: регистрация не пересоздаётся на каждый рендер
  const latest = useRef(activate);
  latest.current = activate;
  useEffect(() => {
    if (!id) {
      return;
    }
    const run = () => latest.current();
    targets.set(id, run);
    return () => {
      if (targets.get(id) === run) {
        targets.delete(id);
      }
    };
  }, [id]);
};

/** Выполнить действие элемента с этим nativeID (как нажатие на его подпись) */
export const activateLabelTarget = (id: string) => {
  const run = targets.get(id);
  run?.();
  return run !== undefined;
};

export interface LabelProps {
  children: React.ReactNode;
  /** nativeID элемента, который подпись переключает или фокусирует */
  htmlFor?: string;
  /** nativeID самой подписи — его элемент получает в aria-labelledby */
  nativeID?: string;
  /** Своё действие по нажатию — вместо элемента по htmlFor */
  onPress?: () => void;
  /** Неактивная подпись приглушена и не нажимается */
  disabled?: boolean;
  size?: TextSize;
  tone?: TextTone;
  /** Дополнительные классы текста */
  className?: string;
}

/** Подпись поля или переключателя: text-sm, нажатие отдаётся связанному элементу */
export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  nativeID,
  onPress,
  disabled = false,
  size = 'sm',
  tone = 'default',
  className = '',
}) => (
  // Корень примитива без оформления: только поведение нажатия
  <LabelPrimitive.Root
    disabled={disabled}
    onPress={() => {
      if (onPress) {
        onPress();
      } else if (htmlFor) {
        activateLabelTarget(htmlFor);
      }
    }}
  >
    <LabelPrimitive.Text asChild nativeID={nativeID}>
      <Text
        size={size}
        tone={tone}
        className={`${disabled ? 'opacity-50' : ''} ${className}`}
      >
        {children}
      </Text>
    </LabelPrimitive.Text>
  </LabelPrimitive.Root>
);
