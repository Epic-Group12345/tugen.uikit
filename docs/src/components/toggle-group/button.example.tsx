import { useState } from 'react';
import { Icons, ToggleButton } from '@tugen/uikit/web';

export default function Example() {
  const [pinned, setPinned] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex flex-row items-center gap-2">
      <ToggleButton
        pressed={pinned}
        onPressedChange={setPinned}
        icon={Icons.Pin}
      >
        {pinned ? 'Закреплено' : 'Закрепить'}
      </ToggleButton>
      <ToggleButton
        pressed={hidden}
        onPressedChange={setHidden}
        icon={Icons.Eye}
        aria-label="Показывать скрытые сборки"
      />
    </div>
  );
}
