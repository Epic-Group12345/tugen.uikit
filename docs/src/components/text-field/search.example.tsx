import { useState } from 'react';
import { IconButton, Icons, TextField } from '@tugen/uikit/web';

export default function Example() {
  const [query, setQuery] = useState('sodium');

  return (
    <TextField
      value={query}
      onChangeText={setQuery}
      icon={Icons.Magnifier}
      type="search"
      placeholder="Поиск модов"
      aria-label="Поиск модов"
      className="w-full max-w-sm"
      trailing={
        query ? (
          <IconButton
            icon={Icons.Xmark}
            aria-label="Очистить"
            onClick={() => setQuery('')}
          />
        ) : null
      }
    />
  );
}
