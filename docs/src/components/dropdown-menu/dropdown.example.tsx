import { useState } from 'react';
import { Dropdown, Icons } from '@tugen/uikit/web';

export default function Example() {
  const [pinned, setPinned] = useState(false);
  return (
    <Dropdown
      icon={Icons.Ellipsis}
      aria-label="Действия с миром"
      items={[
        { label: 'Играть', icon: Icons.Play, onSelect: () => {} },
        { label: 'Переименовать', icon: Icons.Pencil, onSelect: () => {} },
        {
          label: 'Закрепить',
          selected: pinned,
          onSelect: () => setPinned(!pinned),
        },
        { label: 'Резервная копия', disabled: true, onSelect: () => {} },
        {
          label: 'Удалить',
          icon: Icons.TrashBin,
          destructive: true,
          onSelect: () => {},
        },
      ]}
    />
  );
}
