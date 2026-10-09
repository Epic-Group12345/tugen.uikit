import { useState } from 'react';
import { CheckRow, Surface } from '@tugen/uikit/web';

export default function Example() {
  const [sodium, setSodium] = useState(true);
  const [lithium, setLithium] = useState(false);

  return (
    <Surface
      kind="neutral"
      radius="xl"
      padding="1"
      className="flex w-full max-w-sm flex-col"
    >
      <CheckRow
        label="Sodium"
        description="Быстрый рендер"
        checked={sodium}
        onChange={setSodium}
      />
      <CheckRow
        label="Lithium"
        description="Оптимизация сервера"
        checked={lithium}
        onChange={setLithium}
      />
      <CheckRow
        label="Iris"
        description="Нет для этой версии"
        checked={false}
        onChange={() => {}}
        disabled
      />
    </Surface>
  );
}
