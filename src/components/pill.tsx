import React from 'react';
import { View } from 'react-native';
import { Text } from './text';

export type PillTone =
  | 'neutral'
  | 'amber'
  | 'green'
  | 'red'
  | 'violet'
  | 'danger';

// Фон и текст метки: цвет с прозрачностью фона, danger — сплошной красный (мошенничество).
// Классы целиком — иначе Uniwind их не найдёт при сборке
const TONES: Record<PillTone, [string, string]> = {
  neutral: ['bg-mist-200 dark:bg-mist-800', 'text-mist-600 dark:text-mist-400'],
  amber: ['bg-amber-500/15', 'text-amber-700 dark:text-amber-400'],
  green: ['bg-green-500/15', 'text-green-700 dark:text-green-400'],
  red: ['bg-red-500/15', 'text-red-700 dark:text-red-400'],
  violet: ['bg-violet-500/15', 'text-violet-700 dark:text-violet-400'],
  danger: ['bg-red-600', 'text-mist-50'],
};

/** Метка-«пилюля»: категория, лицензия, онлайн */
export const Pill: React.FC<{ children: React.ReactNode; tone?: PillTone }> = ({
  children,
  tone = 'neutral',
}) => {
  const [bg, fg] = TONES[tone];
  return (
    <View
      className={`flex-row items-center gap-1 px-1.5 py-0.5 rounded-md ${bg}`}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text size="xs" className={fg}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
