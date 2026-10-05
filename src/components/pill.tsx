import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { radius, type ColorRole } from '../tokens';
import { Text } from './text';

export type PillTone =
  | 'neutral'
  | 'amber'
  | 'green'
  | 'red'
  | 'violet'
  | 'danger';

// Фон и текст метки: цвет с прозрачностью фона, danger — сплошной красный (мошенничество)
const TONES: Record<PillTone, [ColorRole, ColorRole]> = {
  neutral: ['pillNeutral', 'pillNeutralText'],
  amber: ['pillAmber', 'pillAmberText'],
  green: ['pillGreen', 'pillGreenText'],
  red: ['pillRed', 'pillRedText'],
  violet: ['pillViolet', 'pillVioletText'],
  danger: ['pillDanger', 'pillDangerText'],
};

/** Метка-«пилюля»: категория, лицензия, онлайн */
export const Pill: React.FC<{ children: React.ReactNode; tone?: PillTone }> = ({
  children,
  tone = 'neutral',
}) => {
  const { colors } = useTheme();
  const [bg, fg] = TONES[tone];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: radius.md,
        backgroundColor: colors[bg],
      }}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text size="xs" style={{ color: colors[fg] }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
