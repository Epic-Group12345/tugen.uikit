import React from 'react';
import { RadiusScope } from '../radius';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { useFieldControl } from './field';

// Строк по умолчанию у многострочного поля
const LINES = 3;

// Свойства <input>, которые kit задаёт по-своему: значение и ввод — value / onChangeText,
// отправка — onSubmit по Enter (у <input> onSubmit — событие формы), размер — не атрибут size
type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'size' | 'onSubmit' | 'type' | 'children'
>;

export interface TextFieldProps extends NativeInputProps {
  value?: string;
  /** Новый текст (с фильтром numeric). onChange с событием тоже вызывается — для библиотек форм */
  onChangeText?: (text: string) => void;
  /** Только цифры: размер окна, память */
  numeric?: boolean;
  /** Неверное значение — красная рамка. Внутри Field с ошибкой ставится само */
  invalid?: boolean;
  /** Моноширинный шрифт: пути и аргументы */
  mono?: boolean;
  /** Пароль: символы скрыты */
  secure?: boolean;
  /** Тип <input> для остальных случаев: email, search, url */
  type?: 'text' | 'email' | 'search' | 'url' | 'tel';
  /** Многострочное поле (<textarea>): описание, заметки */
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
  /** Enter в однострочном поле */
  onSubmit?: () => void;
  /** Классы и стиль рамки поля (не самого <input>): ширина, отступы */
  className?: string;
  /** <input>, а у multiline — <textarea> */
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}

// Поле с элементом справа — контейнер rounded-lg p-0.5: кнопка у его края берёт 8 − 2 = 6
// (rounded-md) из RadiusScope, а текст отступает внутри на прежние 12 (p-0.5 + pl-2.5)
const RADIUS = 'lg';
const PADDING = '0.5';

/** Поле ввода: рамка синеет в фокусе и краснеет у неверного значения */
export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  onChange,
  maxLength = 200,
  numeric = false,
  invalid: invalidProp,
  mono = false,
  secure = false,
  type = 'text',
  disabled: disabledProp,
  multiline = false,
  numberOfLines = LINES,
  icon: Icon,
  leading,
  trailing,
  onSubmit,
  onKeyDown,
  id: ownId,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  className,
  style,
  ref,
  ...props
}) => {
  const control = useFieldControl({
    id: ownId,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    disabled: disabledProp,
    invalid: invalidProp,
  });
  const { disabled, invalid } = control;

  // Классы целиком — иначе Tailwind их не найдёт при сборке. Фокус — focus-within рамки, а не
  // состоянием: так рамка синеет и когда фокус у кнопки внутри поля
  const border = invalid
    ? 'border-red-500'
    : 'border-mist-200 dark:border-mist-800 focus-within:border-blue-500';
  const hasTrailing = trailing !== undefined && trailing !== null;
  const align = multiline ? 'items-start' : 'items-center';

  const shared = {
    ...props,
    id: control.id,
    value,
    maxLength,
    disabled,
    'aria-labelledby': control['aria-labelledby'],
    'aria-describedby': control['aria-describedby'],
    'aria-invalid': control['aria-invalid'],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>,
    ) => {
      if (numeric) {
        // Фильтр прямо в поле: иначе неуправляемое поле (библиотека форм) показало бы буквы
        const digits = e.target.value.replace(/\D/g, '');
        if (digits !== e.target.value) {
          e.target.value = digits;
        }
      }
      onChange?.(e);
      onChangeText?.(e.target.value);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      // isComposing: Enter, которым подтверждают набор IME, — не отправка
      if (
        !multiline &&
        onSubmit &&
        e.key === 'Enter' &&
        !e.nativeEvent.isComposing &&
        !e.defaultPrevented
      ) {
        onSubmit();
      }
    },
    className: cx(
      'flex-1 min-w-0 bg-transparent outline-none text-sm text-mist-950 dark:text-mist-50 placeholder:text-mist-400 dark:placeholder:text-mist-500 disabled:cursor-default',
      hasTrailing ? 'py-1.5' : 'py-2',
      multiline && 'resize-none',
      mono && 'font-mono',
    ),
  };

  const text = multiline ? (
    <textarea
      {...(shared as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      ref={ref as React.Ref<HTMLTextAreaElement>}
      rows={numberOfLines}
    />
  ) : (
    <input
      {...shared}
      ref={ref as React.Ref<HTMLInputElement>}
      type={secure ? 'password' : type}
      inputMode={numeric ? 'numeric' : props.inputMode}
    />
  );
  const start = (
    <>
      {Icon && (
        <Icon
          size={14}
          className={cx(
            'shrink-0 text-mist-500 dark:text-mist-400',
            multiline && 'mt-2.5',
          )}
        />
      )}
      {leading}
    </>
  );
  const frame = cx(
    'flex flex-row gap-2 rounded-lg border bg-mist-100 dark:bg-mist-900 transition-colors',
    align,
    border,
    disabled && 'opacity-50',
    className,
  );

  if (!hasTrailing) {
    return (
      <div className={cx(frame, 'px-3')} style={style}>
        {start}
        {text}
      </div>
    );
  }
  return (
    <div className={cx(frame, 'p-0.5')} style={style}>
      <div className={cx('flex flex-row flex-1 min-w-0 gap-2 pl-2.5', align)}>
        {start}
        {text}
      </div>
      <RadiusScope radius={RADIUS} padding={PADDING}>
        {trailing}
      </RadiusScope>
    </div>
  );
};
