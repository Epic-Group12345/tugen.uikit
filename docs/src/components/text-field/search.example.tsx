import { useState } from 'react';
import { IconButton, TextField } from '@tugen/uikit/web';
import { Search, X } from 'lucide-react';

export default function Example() {
  const [query, setQuery] = useState('sodium');

  return (
    <TextField
      value={query}
      onChangeText={setQuery}
      icon={Search}
      type="search"
      placeholder="Поиск модов"
      aria-label="Поиск модов"
      className="w-full max-w-sm"
      trailing={
        query ? (
          <IconButton
            icon={X}
            aria-label="Очистить"
            onClick={() => setQuery('')}
          />
        ) : null
      }
    />
  );
}
