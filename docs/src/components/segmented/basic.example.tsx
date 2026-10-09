import { useState } from 'react';
import { Segmented } from '@tugen/uikit/web';

const THEMES = [
  { value: 'system', label: 'Системная' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
] as const;

type Theme = (typeof THEMES)[number]['value'];

export default function Example() {
  const [theme, setTheme] = useState<Theme>('system');

  return (
    <Segmented
      options={THEMES}
      value={theme}
      onChange={setTheme}
      aria-label="Тема"
      className="w-full max-w-sm"
    />
  );
}
