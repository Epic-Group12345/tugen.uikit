import { useState } from 'react';
import { Dropdown } from '@tugen/uikit/web';
import { Ellipsis, Pencil, Play, Trash2 } from 'lucide-react';

export default function Example() {
  const [pinned, setPinned] = useState(false);
  return (
    <Dropdown
      icon={Ellipsis}
      aria-label="Действия с миром"
      items={[
        { label: 'Играть', icon: Play, onSelect: () => {} },
        { label: 'Переименовать', icon: Pencil, onSelect: () => {} },
        {
          label: 'Закрепить',
          selected: pinned,
          onSelect: () => setPinned(!pinned),
        },
        { label: 'Резервная копия', disabled: true, onSelect: () => {} },
        {
          label: 'Удалить',
          icon: Trash2,
          destructive: true,
          onSelect: () => {},
        },
      ]}
    />
  );
}
