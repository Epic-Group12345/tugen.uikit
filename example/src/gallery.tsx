import React, { useState } from 'react';
import { Button, Text, setTheme, type WebTheme } from '../../src/web';
import * as Sections from './sections';

// Витрина веб-слоя: все элементы на одной странице, переключатель темы сверху

const THEMES: { value: WebTheme; label: string }[] = [
  { value: 'system', label: 'Как в системе' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
];

export const Gallery: React.FC = () => {
  const [theme, setThemeState] = useState<WebTheme>('system');
  const pick = (next: WebTheme) => {
    setTheme(next);
    setThemeState(next);
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <Text as="h1" size="2xl" weight="bold">
            TUGEN UI-kit
          </Text>
          <Text tone="muted">Веб-слой: React DOM, Radix и Tailwind</Text>
        </div>
        <div className="flex flex-row gap-1">
          {THEMES.map(t => (
            <Button
              key={t.value}
              size="sm"
              variant={theme === t.value ? 'secondary' : 'ghost'}
              onClick={() => pick(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </header>
      {Object.entries(Sections).map(([name, Section]) => (
        <Section key={name} />
      ))}
    </main>
  );
};
