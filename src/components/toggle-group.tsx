import React, { useMemo } from 'react';
import { Animated, Pressable, View } from 'react-native';
import * as SwitchPrimitive from '@rn-primitives/switch';
import * as TogglePrimitive from '@rn-primitives/toggle';
import * as ToggleGroupPrimitive from '@rn-primitives/toggle-group';
import {
  StateLayers,
  useAnimatedFlag,
  useFlipOffset,
  usePressFeedback,
} from '../animation';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import { useFieldControl } from './field';
import type { IconComponent } from './icon';
import { useLabelTarget } from './label';
import { Text } from './text';

// Кнопки с состоянием «нажата» на @rn-primitives/toggle, toggle-group и switch: role, aria-checked
// и логика выбора — из примитивов, вид — kit. Примитивы отдают поведение нашим Pressable через
// asChild: классы Uniwind на компонентах примитивов не работают, а Pressable kit держит
// collapsable={false} (наведение на Windows)

const DIMMED = { opacity: motion.dimmed };

// Иконка и подпись одного цвета: яркие у выбранного и при наведении
const contentClass = (active: boolean) =>
  active
    ? 'text-mist-950 dark:text-mist-50'
    : 'text-mist-500 dark:text-mist-400';

// ---------------------------------------------------------------------------------------------
// Switch

// Переключатель «вкл / выкл»: дорожка с бегунком, включённый — синий. Бегунок стоит на месте
// раскладкой (отступом), а едет FLIP-сдвигом, который в покое 0: сдвиг из флага (0…1) держал бы
// в props JS-копию стартового значения, а RNW складывает её с нативной (см. useFlipOffset).
// Цвет дорожки — слоями прозрачности, а не сменой класса: иначе он прыгал бы раньше бегунка

const TRACK = { width: 36, height: 20 };
const KNOB = 16;
const PAD = 2;
const TRAVEL = TRACK.width - KNOB - PAD * 2;

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /** Для подписи Label htmlFor и Field; внутри Field ставится сам */
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

/** Переключатель с API примитива (checked / onCheckedChange). Toggle — то же с value / onChange */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled: disabledProp,
  accessibilityLabel,
  nativeID: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
}) => {
  const control = useFieldControl({
    nativeID: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
  });
  const { disabled, nativeID } = control;
  const { hover, pressStyle, handlers } = usePressFeedback({
    disabled,
    scale: 0.94,
  });
  const on = useAnimatedFlag(checked, { in: motion.toggle });
  const shift = useFlipOffset(checked ? TRAVEL : 0, motion.toggle);
  const knob = useMemo(
    () => ({
      marginLeft: checked ? TRAVEL : 0,
      transform: [{ translateX: shift }],
    }),
    [checked, shift],
  );
  useLabelTarget(nativeID, () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  });

  return (
    <SwitchPrimitive.Root
      asChild
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    >
      <Pressable
        {...handlers}
        nativeID={nativeID}
        accessibilityLabel={accessibilityLabel}
        aria-labelledby={control['aria-labelledby']}
        aria-describedby={control['aria-describedby']}
        style={disabled ? DIMMED : undefined}
      >
        <Animated.View style={[TRACK, pressStyle]}>
          <View className="flex-1 rounded-full p-0.5 overflow-hidden">
            <StateLayers
              className="rounded-full"
              layers={[
                { className: 'bg-mist-300 dark:bg-mist-700' },
                { className: 'bg-blue-500', progress: on },
                {
                  className: 'bg-mist-950/10 dark:bg-mist-50/10',
                  progress: hover,
                },
              ]}
            />
            <SwitchPrimitive.Thumb asChild>
              <Animated.View
                pointerEvents="none"
                style={[{ width: KNOB, height: KNOB }, knob]}
              >
                <View className="flex-1 rounded-full bg-mist-50" />
              </Animated.View>
            </SwitchPrimitive.Thumb>
          </View>
        </Animated.View>
      </Pressable>
    </SwitchPrimitive.Root>
  );
};

// ---------------------------------------------------------------------------------------------
// ToggleButton

export interface ToggleButtonProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  disabled?: boolean;
  icon?: IconComponent;
  /** Подпись; без неё — квадратная кнопка-иконка (тогда нужен accessibilityLabel) */
  children?: React.ReactNode;
  accessibilityLabel?: string;
  nativeID?: string;
  className?: string;
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
  accessibilityLabel,
  nativeID,
  className = '',
}) => {
  const feedback = usePressFeedback({ disabled });
  const on = useAnimatedFlag(pressed, { in: motion.layout });
  const rounded = radiusProps(useInnerRadius('lg'));
  const content = contentClass(pressed || feedback.hovered);
  const label = children !== undefined && children !== null;
  useLabelTarget(nativeID, () => {
    if (!disabled) {
      onPressedChange(!pressed);
    }
  });

  return (
    <TogglePrimitive.Root
      asChild
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
    >
      <Pressable
        {...feedback.handlers}
        nativeID={nativeID}
        accessibilityLabel={accessibilityLabel}
        className={className}
      >
        <Animated.View style={[feedback.pressStyle, disabled && DIMMED]}>
          <StateLayers
            className={rounded.className}
            style={rounded.style}
            layers={[
              {
                className: 'bg-mist-950/5 dark:bg-mist-50/5',
                progress: feedback.hover,
              },
              { className: 'bg-mist-200 dark:bg-mist-800', progress: on },
              {
                className: 'bg-mist-950/10 dark:bg-mist-50/10',
                progress: feedback.press,
              },
            ]}
          />
          <View
            className={`flex-row items-center justify-center gap-1.5 ${
              label ? 'px-3 py-1.5' : 'p-1.5'
            }`}
          >
            {Icon && <Icon size={label ? 14 : 16} className={content} />}
            {label ? (
              <Text numberOfLines={1} className={content}>
                {children}
              </Text>
            ) : null}
          </View>
        </Animated.View>
      </Pressable>
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
  rounded: 'flex-row gap-0.5 p-0.5 rounded-lg bg-mist-200 dark:bg-mist-800',
  pill: 'flex-row gap-0.5 p-0.5 rounded-full bg-mist-200 dark:bg-mist-800',
};
const TRACK_RADIUS = { rounded: 'lg', pill: 'full' } as const;
const TRACK_PADDING = '0.5';

interface ToggleGroupCommon {
  disabled?: boolean;
  /** Форма дорожки и сегментов, по умолчанию rounded */
  shape?: ToggleGroupShape;
  accessibilityLabel?: string;
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  /** Дополнительные классы дорожки: ширина, self-start */
  className?: string;
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
    shape = 'rounded',
    accessibilityLabel,
    className = '',
    children,
  } = props;
  const control = useFieldControl({
    nativeID: props.nativeID,
    'aria-labelledby': props['aria-labelledby'],
    'aria-describedby': props['aria-describedby'],
    disabled: props.disabled,
  });
  // Союз single | multiple примитив принимает целиком — собираем его без лишних пропсов kit
  const root =
    props.type === 'single'
      ? {
          type: 'single' as const,
          value: props.value,
          onValueChange: props.onValueChange,
        }
      : {
          type: 'multiple' as const,
          value: props.value,
          onValueChange: props.onValueChange,
        };

  return (
    <ToggleGroupPrimitive.Root asChild disabled={control.disabled} {...root}>
      <View
        nativeID={control.nativeID}
        accessibilityLabel={accessibilityLabel}
        aria-labelledby={control['aria-labelledby']}
        aria-describedby={control['aria-describedby']}
        style={control.disabled ? DIMMED : undefined}
        className={`${TRACK_CLASS[shape]} ${className}`}
      >
        <RadiusScope radius={TRACK_RADIUS[shape]} padding={TRACK_PADDING}>
          {children}
        </RadiusScope>
      </View>
    </ToggleGroupPrimitive.Root>
  );
};

export interface ToggleGroupItemProps {
  value: string;
  disabled?: boolean;
  icon?: IconComponent;
  /** Подпись; без неё — только иконка (тогда нужен accessibilityLabel) */
  children?: React.ReactNode;
  accessibilityLabel?: string;
  /** Растянуть: сегменты делят ширину дорожки поровну */
  grow?: boolean;
}

/** Сегмент группы: выбранный — светлая плашка на дорожке */
export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  disabled = false,
  icon: Icon,
  children,
  accessibilityLabel,
  grow = false,
}) => {
  const root = ToggleGroupPrimitive.useRootContext();
  const isActive = ToggleGroupPrimitive.utils.getIsSelected(root.value, value);
  const off = disabled || !!root.disabled;
  const { hovered, hover, press, pressStyle, handlers } = usePressFeedback({
    disabled: off,
  });
  const active = useAnimatedFlag(isActive, {
    in: motion.layout,
    out: motion.deselect,
  });
  // На дорожке — радиус по правилу (rounded-md или rounded-full), отдельно — rounded-md
  const rounded = radiusProps(useInnerRadius('md'));
  const content = contentClass(isActive || hovered);
  const label = children !== undefined && children !== null;

  return (
    <ToggleGroupPrimitive.Item asChild value={value} disabled={disabled}>
      <Pressable
        {...handlers}
        accessibilityLabel={accessibilityLabel}
        aria-disabled={off}
        style={disabled ? DIMMED : undefined}
        className={grow ? 'flex-1' : undefined}
      >
        <Animated.View style={pressStyle}>
          <StateLayers
            className={rounded.className}
            style={rounded.style}
            layers={[
              { className: 'bg-mist-300 dark:bg-mist-700', progress: hover },
              { className: 'bg-mist-50 dark:bg-mist-700', progress: active },
              { className: 'bg-mist-300 dark:bg-mist-600', progress: press },
            ]}
          />
          <View
            className={`flex-row items-center justify-center gap-1.5 ${
              label ? 'px-3 py-1.5' : 'p-1.5'
            }`}
          >
            {Icon && <Icon size={14} className={content} />}
            {label ? (
              <Text numberOfLines={1} className={content}>
                {children}
              </Text>
            ) : null}
          </View>
        </Animated.View>
      </Pressable>
    </ToggleGroupPrimitive.Item>
  );
};
