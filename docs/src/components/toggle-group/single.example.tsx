import { useState } from 'react';
import { Icons, ToggleGroup, ToggleGroupItem } from '@tugen/uikit/web';

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
        <ToggleGroupItem value="grid" icon={Icons.LayoutCellsLarge}>
          Плитка
        </ToggleGroupItem>
        <ToggleGroupItem value="list" icon={Icons.ListUl}>
          Список
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={setView}
        aria-label="Вид списка миров"
      >
        <ToggleGroupItem
          value="grid"
          icon={Icons.LayoutCellsLarge}
          aria-label="Плитка"
        />
        <ToggleGroupItem value="list" icon={Icons.ListUl} aria-label="Список" />
        <ToggleGroupItem
          value="rows"
          icon={Icons.LayoutRows3}
          aria-label="Строки"
        />
      </ToggleGroup>
    </div>
  );
}
