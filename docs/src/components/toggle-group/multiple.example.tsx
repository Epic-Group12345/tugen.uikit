import { useState } from 'react';
import { Text, ToggleGroup, ToggleGroupItem } from '@tugen/uikit/web';

export default function Example() {
  const [loaders, setLoaders] = useState(['fabric']);

  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup
        type="multiple"
        shape="pill"
        value={loaders}
        onValueChange={setLoaders}
        aria-label="Загрузчики"
      >
        <ToggleGroupItem value="fabric">Fabric</ToggleGroupItem>
        <ToggleGroupItem value="forge">Forge</ToggleGroupItem>
        <ToggleGroupItem value="quilt">Quilt</ToggleGroupItem>
        <ToggleGroupItem value="neoforge" disabled>
          NeoForge
        </ToggleGroupItem>
      </ToggleGroup>
      <Text size="xs" tone="muted">
        Показаны моды для: {loaders.join(', ') || 'всех загрузчиков'}
      </Text>
    </div>
  );
}
