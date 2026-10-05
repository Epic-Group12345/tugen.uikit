import React from 'react';
import { View } from 'react-native';
import type { IconComponent } from './icon';
import { Text } from './text';

export interface EmptyStateProps {
  icon: IconComponent;
  title: string;
  text: string;
  /** Действие под пояснением */
  children?: React.ReactNode;
}

/**
 * Пустая страница: иконка в плашке, заголовок, пояснение и, если нужно, действие. Для разделов,
 * которых ещё нет («Скины — скоро») и где пока пусто («Чаты»)
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  text,
  children,
}) => (
  <View className="flex-1 items-center justify-center p-6">
    <View className="items-center gap-3 max-w-md">
      <View className="items-center justify-center w-14 h-14 rounded-2xl bg-mist-100 dark:bg-mist-900">
        <Icon size={24} className="text-mist-500 dark:text-mist-400" />
      </View>
      <Text size="base" weight="bold">
        {title}
      </Text>
      <Text tone="muted" className="text-center">
        {text}
      </Text>
      {children}
    </View>
  </View>
);
