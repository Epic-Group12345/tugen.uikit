import { useState } from 'react';
import { Checkbox } from '@tugen/uikit/web';

export default function Example() {
  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex flex-row items-center gap-6">
      <Checkbox
        checked={hidden}
        onCheckedChange={setHidden}
        aria-label="Показывать скрытые файлы"
      />
      <Checkbox
        checked={false}
        onCheckedChange={() => {}}
        disabled
        aria-label="Недоступно"
      />
      <Checkbox checked={hidden} onCheckedChange={setHidden}>
        Показывать скрытые файлы
      </Checkbox>
    </div>
  );
}
