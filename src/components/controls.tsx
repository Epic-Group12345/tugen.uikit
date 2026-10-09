import React, { useRef, useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import { Checkbox } from './checkbox';
import type { IconComponent } from './icon';
import { Text } from './text';
import {
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupShape,
} from './toggle-group';

// Простые элементы настроек одной строкой: Toggle, Segmented, CheckRow — обёртки над
// компонентами на @rn-primitives (Switch, ToggleGroup, Checkbox) с API лаунчера (value / onChange)

// Switch определён рядом с ToggleGroup (там же примитивы toggle и switch); здесь — синоним
export { Switch, type SwitchProps } from './toggle-group';

export interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  /** Для подписи Label htmlFor и Field; внутри Field ставится сам */
  nativeID?: string;
}

/** Переключатель «вкл / выкл» с API лаунчера: Switch с value / onChange */
export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  disabled,
  accessibilityLabel,
  nativeID,
}) => (
  <Switch
    checked={value}
    onCheckedChange={onChange}
    disabled={disabled}
    accessibilityLabel={accessibilityLabel}
    nativeID={nativeID}
  />
);

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  accessibilityLabel?: string;
}

const THUMB = 12;

/**
 * Ползунок: нажатие ставит значение, протягивание меняет. Дорожка с заливкой до значения и
 * кружок. Место касания берём от самой дорожки: у заливки и кружка pointerEvents='none'
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  onChange,
  accessibilityLabel,
}) => {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const share =
    max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;

  const pick = (e: GestureResponderEvent) => {
    const w = widthRef.current;
    if (w > 0) {
      const x = Math.max(0, Math.min(w, e.nativeEvent.locationX));
      onChange(min + (x / w) * (max - min));
    }
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: Math.round(value) }}
      onLayout={e => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={pick}
      onResponderMove={pick}
      className="h-6 justify-center"
    >
      <View
        pointerEvents="none"
        className="h-1 rounded-full bg-mist-200 dark:bg-mist-800 overflow-hidden"
      >
        <View
          style={{ width: width * share }}
          className="h-full bg-mist-950 dark:bg-mist-50"
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          left: Math.max(0, width * share - THUMB / 2),
          width: THUMB,
          height: THUMB,
        }}
        className="absolute rounded-full bg-mist-950 dark:bg-mist-50"
      />
    </View>
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
  accessibilityLabel?: string;
}

/**
 * Выбор одного варианта из нескольких кнопками в ряд (переключатель темы в настройках):
 * ToggleGroup type="single" с сегментами равной ширины. Выбор не снимается повторным нажатием
 */
export const Segmented = <T extends string>({
  options,
  value,
  onChange,
  shape = 'pill',
  disabled,
  accessibilityLabel,
}: SegmentedProps<T>) => (
  <ToggleGroup
    type="single"
    value={value}
    onValueChange={next => {
      // Примитив снимает выбор повторным нажатием (undefined) — у Segmented вариант есть всегда
      if (next !== undefined && next !== value) {
        onChange(next as T);
      }
    }}
    shape={shape}
    disabled={disabled}
    accessibilityLabel={accessibilityLabel}
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
  /** Галочка выбранного: `Icons.Check` лаунчера. Без неё — своя из уголка */
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
