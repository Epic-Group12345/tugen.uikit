import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@tugen/uikit/web';
import { LayoutGrid, List, Rows3 } from 'lucide-react';

export default function Example() {
  const [view, setView] = useState<string | undefined>('grid');

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={setView}
        aria-label="Вид списка миров"
      >
        <ToggleGroupItem value="grid" icon={LayoutGrid}>
          Плитка
        </ToggleGroupItem>
        <ToggleGroupItem value="list" icon={List}>
          Список
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={setView}
        aria-label="Вид списка миров"
      >
        <ToggleGroupItem value="grid" icon={LayoutGrid} aria-label="Плитка" />
        <ToggleGroupItem value="list" icon={List} aria-label="Список" />
        <ToggleGroupItem value="rows" icon={Rows3} aria-label="Строки" />
      </ToggleGroup>
    </div>
  );
}
