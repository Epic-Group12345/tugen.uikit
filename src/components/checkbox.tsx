import React from 'react';
import { View } from 'react-native';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { StateLayers, usePressFeedback } from '../animation';
import { radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import { useFieldControl } from './field';
import type { IconComponent } from './icon';
import { useLabelTarget } from './label';

// Флажок на @rn-primitives/checkbox: role, aria-checked и переключение — из примитива, вид —
// kit. Классы Uniwind на компоненты примитива не ставятся — оформление на View внутри. Корню
// уходит collapsable={false} из usePressFeedback — иначе на Windows пропадёт наведение

const DIMMED = { opacity: motion.dimmed };

// Галочка из двух сторон повёрнутого прямоугольника: так kit не зависит от набора иконок
const CheckMark: React.FC = () => (
  <View
    style={{
      width: 5,
      height: 9,
      marginTop: -2,
      transform: [{ rotate: '45deg' }],
    }}
    className="border-r-2 border-b-2 border-mist-50"
  />
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
  className = '',
}) => {
  const filled = checked || indeterminate;
  return (
    <View
      className={`w-5 h-5 items-center justify-center rounded-md border ${
        filled
          ? 'bg-blue-500 border-blue-500'
          : 'border-mist-300 dark:border-mist-700'
      } ${className}`}
    >
      {indeterminate ? (
        <View className="w-2.5 h-0.5 rounded-full bg-mist-50" />
      ) : checked ? (
        CheckIcon ? (
          <CheckIcon size={12} className="text-mist-50" />
        ) : (
          <CheckMark />
        )
      ) : null}
    </View>
  );
};

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** «Частично»: выбрана часть вложенных — черта вместо галочки, aria-checked="mixed" */
  indeterminate?: boolean;
  /** Галочка выбранного (`Icons.Check` лаунчера). Без неё — своя из уголка */
  checkIcon?: IconComponent;
  /**
   * Подпись и пояснение рядом с квадратом: тогда нажимается вся строка, а фон наведения
   * скругляется по правилу радиусов (в меню — rounded-lg и т. п.)
   */
  children?: React.ReactNode;
  accessibilityLabel?: string;
  /** Для подписи Label htmlFor и Field; внутри Field ставится сам */
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Классы раскладки корня (flex-1, отступы) */
  className?: string;
}

/** Флажок; с children — строка «флажок + подпись», нажимается целиком */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled: disabledProp,
  indeterminate = false,
  checkIcon,
  children,
  accessibilityLabel,
  nativeID: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className = '',
}) => {
  const control = useFieldControl({
    nativeID: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  const { disabled, nativeID } = control;
  const { hover, handlers } = usePressFeedback({ disabled });
  // Строка у края меню или окна берёт радиус по правилу, сам квадрат — как у квадрата
  const rowRadius = radiusProps(useInnerRadius('lg'));
  const row = children !== undefined && children !== null;
  // «Частично» снимается нажатием: следующее состояние — выбран
  const next = indeterminate ? true : !checked;

  useLabelTarget(nativeID, () => {
    if (!disabled) {
      onCheckedChange(next);
    }
  });

  return (
    // Без asChild: нативный Root примитива теряет asChild и обернул бы наш Pressable своим —
    // два вложенных нажимаемых элемента. Поэтому пропсы поведения и наведения отдаём самому
    // Root (он передаёт их своему Pressable), а оформление — на View внутри
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={() => onCheckedChange(next)}
      disabled={disabled}
      {...handlers}
      nativeID={nativeID}
      accessibilityLabel={accessibilityLabel}
      aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']}
      aria-checked={indeterminate ? 'mixed' : checked}
      style={disabled ? DIMMED : undefined}
    >
      <View className={className}>
        <StateLayers
          className={row ? rowRadius.className : 'rounded-md'}
          style={row ? rowRadius.style : undefined}
          layers={[
            { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
          ]}
        />
        {row ? (
          <View className="flex-row items-start gap-3 px-2 py-2">
            <CheckboxBox
              checked={checked}
              indeterminate={indeterminate}
              checkIcon={checkIcon}
              className="mt-0.5"
            />
            <View className="flex-1 gap-0.5">{children}</View>
          </View>
        ) : (
          <CheckboxBox
            checked={checked}
            indeterminate={indeterminate}
            checkIcon={checkIcon}
          />
        )}
      </View>
    </CheckboxPrimitive.Root>
  );
};
