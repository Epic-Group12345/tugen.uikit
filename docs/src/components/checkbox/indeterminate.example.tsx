import { useState } from 'react';
import { Checkbox, CheckRow } from '@tugen/uikit/web';

const MODS = ['Sodium', 'Lithium', 'Iris'];

export default function Example() {
  const [selected, setSelected] = useState(['Sodium']);
  const all = selected.length === MODS.length;
  const some = selected.length > 0 && !all;

  const toggle = (mod: string, on: boolean) =>
    setSelected(list => (on ? [...list, mod] : list.filter(m => m !== mod)));

  return (
    <div className="flex w-full max-w-sm flex-col">
      <Checkbox
        checked={all}
        indeterminate={some}
        onCheckedChange={on => setSelected(on ? MODS : [])}
      >
        Все моды
      </Checkbox>
      <div className="flex flex-col pl-6">
        {MODS.map(mod => (
          <CheckRow
            key={mod}
            label={mod}
            checked={selected.includes(mod)}
            onChange={on => toggle(mod, on)}
          />
        ))}
      </div>
    </div>
  );
}
