import React from 'react';
import { cx } from './cx';

// Клавиша в подсказках: «Ctrl + K», Esc в меню. Нижняя рамка толще — клавиша «стоит» на
// поверхности. Подписи передаёт приложение: на macOS это ⌘, на Windows — Ctrl

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className }) => (
  <kbd
    className={cx(
      'inline-flex self-start px-1.5 py-0.5 rounded-md border border-b-2 border-mist-300 dark:border-mist-700 bg-mist-100 dark:bg-mist-900 font-mono text-xs text-mist-700 dark:text-mist-300',
      className,
    )}
  >
    {children}
  </kbd>
);

export interface KbdComboProps {
  /** Клавиши по порядку: ['Ctrl', 'K'] */
  keys: readonly string[];
  /** Знак между клавишами */
  separator?: string;
  className?: string;
}

/** Сочетание клавиш: Ctrl + K. Диктор читает его одной фразой из aria-label */
export const KbdCombo: React.FC<KbdComboProps> = ({
  keys,
  separator = '+',
  className,
}) => (
  <span
    role="group"
    aria-label={keys.join(` ${separator} `)}
    className={cx(
      'inline-flex flex-row items-center gap-1 self-start',
      className,
    )}
  >
    {keys.map((key, i) => (
      <React.Fragment key={`${i}-${key}`}>
        {i > 0 && (
          <span
            aria-hidden
            className="text-xs text-mist-500 dark:text-mist-400"
          >
            {separator}
          </span>
        )}
        <Kbd>{key}</Kbd>
      </React.Fragment>
    ))}
  </span>
);
