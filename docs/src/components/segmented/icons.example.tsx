import { useState } from 'react';
import { Icons, Segmented } from '@tugen/uikit/web';

type Theme = 'system' | 'light' | 'dark';

export default function Example() {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <Segmented<Theme>
      options={[
        { value: 'system', label: 'Системная', icon: Icons.Display },
        { value: 'light', label: 'Светлая', icon: Icons.Sun },
        { value: 'dark', label: 'Тёмная', icon: Icons.Moon },
      ]}
      value={theme}
      onChange={setTheme}
      aria-label="Тема"
    />
  );
}
