import React from 'react';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { Text } from './text';

export interface EmptyStateProps {
  icon: IconComponent;
  title: string;
  text: string;
  /** Действие под пояснением */
  children?: React.ReactNode;
  className?: string;
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
  className,
}) => (
  <div
    className={cx(
      'flex flex-1 flex-col items-center justify-center p-6',
      className,
    )}
  >
    <div className="flex flex-col items-center gap-3 max-w-md">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-mist-100 dark:bg-mist-900">
        <Icon size={24} className="text-mist-500 dark:text-mist-400" />
      </div>
      <Text as="h3" size="base" weight="bold" className="text-center">
        {title}
      </Text>
      <Text as="p" tone="muted" className="text-center">
        {text}
      </Text>
      {children}
    </div>
  </div>
);
