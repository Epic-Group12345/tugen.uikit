import React from 'react';
import { Text } from '../../../src/web';

// Общее для разделов витрины: заголовок блока и ряд примеров

export const Block: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="flex flex-col gap-2">
    <Text as="h2" size="xs" tone="muted" uppercase>
      {title}
    </Text>
    <div className="flex flex-col gap-4 rounded-xl bg-mist-100 dark:bg-mist-900 p-4">
      {children}
    </div>
  </section>
);

export const Line: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-row flex-wrap items-center gap-2">{children}</div>
);

/** Простая иконка для примеров: kit не навязывает набор, иконка — компонент с size и className */
export const Dot: React.FC<{ size?: number; className?: string }> = ({
  size = 16,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    aria-hidden
  >
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);
