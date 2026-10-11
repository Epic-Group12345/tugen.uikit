import { useState } from 'react';
import { ToggleButton } from '@tugen/uikit/web';
import { Eye, Pin } from 'lucide-react';

export default function Example() {
  const [pinned, setPinned] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex flex-row items-center gap-2">
      <ToggleButton pressed={pinned} onPressedChange={setPinned} icon={Pin}>
        {pinned ? 'Закреплено' : 'Закрепить'}
      </ToggleButton>
      <ToggleButton
        pressed={hidden}
        onPressedChange={setHidden}
        icon={Eye}
        aria-label="Показывать скрытые сборки"
      />
    </div>
  );
}
