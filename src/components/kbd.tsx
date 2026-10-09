import React from 'react';
import { View } from 'react-native';
import { Text } from './text';

// Клавиша в подсказках: «Ctrl + K», Esc в меню. Нижняя рамка толще — клавиша «стоит» на
// поверхности. Подписи передаёт приложение: на macOS это ⌘, на Windows — Ctrl

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className = '' }) => (
  <View
    className={`self-start px-1.5 py-0.5 rounded-md border border-b-2 border-mist-300 dark:border-mist-700 bg-mist-100 dark:bg-mist-900 ${className}`}
  >
    <Text size="xs" mono tone="secondary">
      {children}
    </Text>
  </View>
);

export interface KbdComboProps {
  /** Клавиши по порядку: ['Ctrl', 'K'] */
  keys: readonly string[];
  /** Знак между клавишами */
  separator?: string;
  className?: string;
}

/** Сочетание клавиш: Ctrl + K */
export const KbdCombo: React.FC<KbdComboProps> = ({
  keys,
  separator = '+',
  className = '',
}) => (
  <View
    accessibilityLabel={keys.join(` ${separator} `)}
    className={`flex-row items-center gap-1 self-start ${className}`}
  >
    {keys.map((key, i) => (
      <React.Fragment key={`${i}-${key}`}>
        {i > 0 && (
          <Text size="xs" tone="muted">
            {separator}
          </Text>
        )}
        <Kbd>{key}</Kbd>
      </React.Fragment>
    ))}
  </View>
);
