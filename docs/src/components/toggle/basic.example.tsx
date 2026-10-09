import { useState } from 'react';
import { Toggle } from '@tugen/uikit/web';

export default function Example() {
  const [music, setMusic] = useState(true);

  return (
    <div className="flex flex-row items-center gap-4">
      <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
      <Toggle value onChange={() => {}} disabled aria-label="Включено" />
      <Toggle
        value={false}
        onChange={() => {}}
        disabled
        aria-label="Выключено"
      />
    </div>
  );
}
