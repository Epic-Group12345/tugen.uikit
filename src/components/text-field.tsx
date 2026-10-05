import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { radius, text } from '../tokens';
import type { IconComponent } from './icon';
import { MONO_FONT } from './text';

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
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const border = invalid
    ? colors.invalid
    : focused
    ? colors.focus
    : colors.fieldBorder;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: border,
        backgroundColor: colors.field,
      }}
    >
      {Icon && <Icon size={14} color={colors.textMuted} />}
      <TextInput
        value={value}
        onChangeText={next =>
          onChangeText(numeric ? next.replace(/\D/g, '') : next)
        }
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
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
        style={[
          text.sm,
          { flex: 1, paddingVertical: 8, color: colors.text },
          mono && { fontFamily: MONO_FONT },
        ]}
      />
    </View>
  );
};
