import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import type { IconComponent } from './icon';

const MONO = { fontFamily: 'Consolas' };

export interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
  /** Только цифры: размер окна, память */
  numeric?: boolean;
  /** Неверное значение — красная рамка */
  invalid?: boolean;
  /** Моноширинный шрифт: пути и аргументы */
  mono?: boolean;
  /** Пароль: символы скрыты */
  secure?: boolean;
  /** Иконка слева — у поиска */
  icon?: IconComponent;
  onSubmit?: () => void;
  /** Поле потеряло фокус — сохранить набранное */
  onBlur?: () => void;
  accessibilityLabel?: string;
}

/** Поле ввода: рамка синеет в фокусе и краснеет у неверного значения */
export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  maxLength = 200,
  numeric = false,
  invalid = false,
  mono = false,
  secure = false,
  icon: Icon,
  onSubmit,
  onBlur,
  accessibilityLabel,
}) => {
  const [focused, setFocused] = useState(false);
  // Классы целиком — иначе Uniwind их не найдёт при сборке
  const border = invalid
    ? 'border-red-500'
    : focused
    ? 'border-blue-500'
    : 'border-mist-200 dark:border-mist-800';
  return (
    <View
      className={`flex-row items-center gap-2 px-3 rounded-lg border bg-mist-100 dark:bg-mist-900 ${border}`}
    >
      {Icon && <Icon size={14} className="text-mist-500 dark:text-mist-400" />}
      <TextInput
        value={value}
        onChangeText={next =>
          onChangeText(numeric ? next.replace(/\D/g, '') : next)
        }
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={maxLength}
        secureTextEntry={secure}
        keyboardType={numeric ? 'number-pad' : 'default'}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        onSubmitEditing={onSubmit}
        style={mono ? MONO : undefined}
        className="flex-1 py-2 text-sm text-mist-950 dark:text-mist-50"
        placeholderTextColorClassName="accent-mist-400 dark:accent-mist-500"
      />
    </View>
  );
};
