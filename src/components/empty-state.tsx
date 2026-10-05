import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme';
import { radius } from '../tokens';
import type { IconComponent } from './icon';
import { Text } from './text';

export interface EmptyStateProps {
  icon: IconComponent;
  title: string;
  text: string;
  /** Действие под пояснением */
  children?: React.ReactNode;
}

/** Пустая страница: иконка в плашке, заголовок, пояснение и, если нужно, действие */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  text,
  children,
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <View style={{ alignItems: 'center', gap: 12, maxWidth: 448 }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: radius['2xl'],
            backgroundColor: colors.card,
          }}
        >
          <Icon size={24} color={colors.textMuted} />
        </View>
        <Text size="base" weight="bold">
          {title}
        </Text>
        <Text tone="muted" align="center">
          {text}
        </Text>
        {children}
      </View>
    </View>
  );
};
