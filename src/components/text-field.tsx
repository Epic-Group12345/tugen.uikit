import React, { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { RadiusScope } from '../radius';
import { motion } from '../tokens';
import { useFieldControl } from './field';
import type { IconComponent } from './icon';
import { useLabelTarget } from './label';

const MONO = { fontFamily: 'Consolas' };
const DIMMED = { opacity: motion.dimmed };
// Строк по умолчанию у многострочного поля
const LINES = 3;
// Высота строки text-sm, DIP: из неё — минимальная высота многострочного поля
const LINE_HEIGHT = 20;

export interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
  /** Только цифры: размер окна, память */
  numeric?: boolean;
  /** Неверное значение — красная рамка. Внутри Field с ошибкой ставится само */
  invalid?: boolean;
  /** Моноширинный шрифт: пути и аргументы */
  mono?: boolean;
  /** Пароль: символы скрыты */
  secure?: boolean;
  /** Неактивное поле: приглушено, не редактируется */
  disabled?: boolean;
  /** Многострочное поле: описание, заметки */
  multiline?: boolean;
  /** Видимых строк многострочного поля */
  numberOfLines?: number;
  /** Иконка слева — у поиска */
  icon?: IconComponent;
  /** Что угодно слева от текста: префикс, значок */
  leading?: React.ReactNode;
  /**
   * Что угодно справа: единицы («МБ»), кнопка «Обзор», IconButton «очистить». Кнопка встаёт
   * у края поля и по правилу радиусов получает rounded-md (поле rounded-lg, отступ 0.5)
   */
  trailing?: React.ReactNode;
  onSubmit?: () => void;
  /** Поле потеряло фокус — сохранить набранное */
  onBlur?: () => void;
  accessibilityLabel?: string;
  /** Для подписи Label htmlFor и Field; внутри Field ставится сам */
  nativeID?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

// Поле с элементом справа — контейнер rounded-lg p-0.5: кнопка у его края берёт 8 − 2 = 6
// (rounded-md) из RadiusScope, а текст отступает внутри на прежние 12 (p-0.5 + pl-2.5)
const RADIUS = 'lg';
const PADDING = '0.5';

/** Поле ввода: рамка синеет в фокусе и краснеет у неверного значения */
export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  maxLength = 200,
  numeric = false,
  invalid: invalidProp,
  mono = false,
  secure = false,
  disabled: disabledProp,
  multiline = false,
  numberOfLines = LINES,
  icon: Icon,
  leading,
  trailing,
  onSubmit,
  onBlur,
  accessibilityLabel,
  nativeID: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
}) => {
  const [focused, setFocused] = useState(false);
  const input = useRef<TextInput>(null);
  const control = useFieldControl({
    nativeID: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
    invalid: invalidProp,
  });
  const { disabled, invalid, nativeID } = control;
  // Нажатие на подпись (Label htmlFor) ставит фокус в поле
  useLabelTarget(nativeID, () => {
    if (!disabled) {
      input.current?.focus();
    }
  });

  // Классы целиком — иначе Uniwind их не найдёт при сборке
  const border = invalid
    ? 'border-red-500'
    : focused
    ? 'border-blue-500'
    : 'border-mist-200 dark:border-mist-800';
  const hasTrailing = trailing !== undefined && trailing !== null;
  const align = multiline ? 'items-start' : 'items-center';

  const text = (
    <TextInput
      ref={input}
      value={value}
      onChangeText={next =>
        onChangeText(numeric ? next.replace(/\D/g, '') : next)
      }
      placeholder={placeholder}
      autoFocus={autoFocus}
      maxLength={maxLength}
      secureTextEntry={secure}
      editable={!disabled}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : undefined}
      textAlignVertical={multiline ? 'top' : undefined}
      keyboardType={numeric ? 'number-pad' : 'default'}
      nativeID={nativeID}
      accessibilityLabel={accessibilityLabel ?? placeholder}
      aria-labelledby={control['aria-labelledby']}
      aria-describedby={control['aria-describedby']}
      aria-invalid={control['aria-invalid']}
      aria-disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        onBlur?.();
      }}
      onSubmitEditing={multiline ? undefined : onSubmit}
      style={[
        mono && MONO,
        multiline && { minHeight: numberOfLines * LINE_HEIGHT },
      ]}
      className={`flex-1 text-sm text-mist-950 dark:text-mist-50 ${
        hasTrailing ? 'py-1.5' : 'py-2'
      }`}
      placeholderTextColorClassName="accent-mist-400 dark:accent-mist-500"
    />
  );
  const start = (
    <>
      {Icon && (
        <Icon
          size={14}
          className={`text-mist-500 dark:text-mist-400 ${
            multiline ? 'mt-2.5' : ''
          }`}
        />
      )}
      {leading}
    </>
  );

  if (!hasTrailing) {
    return (
      <View
        style={disabled ? DIMMED : undefined}
        className={`flex-row ${align} gap-2 px-3 rounded-lg border bg-mist-100 dark:bg-mist-900 ${border}`}
      >
        {start}
        {text}
      </View>
    );
  }
  return (
    <View
      style={disabled ? DIMMED : undefined}
      className={`flex-row ${align} gap-2 p-0.5 rounded-lg border bg-mist-100 dark:bg-mist-900 ${border}`}
    >
      <View className={`flex-1 flex-row ${align} gap-2 pl-2.5`}>
        {start}
        {text}
      </View>
      <RadiusScope radius={RADIUS} padding={PADDING}>
        {trailing}
      </RadiusScope>
    </View>
  );
};
