import { useState } from 'react';
import { Segmented } from '@tugen/uikit/web';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'system' | 'light' | 'dark';

export default function Example() {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <Segmented<Theme>
      options={[
        { value: 'system', label: 'Системная', icon: Monitor },
        { value: 'light', label: 'Светлая', icon: Sun },
        { value: 'dark', label: 'Тёмная', icon: Moon },
      ]}
      value={theme}
      onChange={setTheme}
      aria-label="Тема"
    />
  );
}
