import { useState } from 'react';
import { Segmented } from '@tugen/uikit/web';

type Side = 'client' | 'server' | 'both';

export default function Example() {
  const [side, setSide] = useState<Side>('client');

  return (
    <div className="flex flex-col items-center gap-3">
      <Segmented<Side>
        options={[
          { value: 'client', label: 'Клиент' },
          { value: 'server', label: 'Сервер' },
          { value: 'both', label: 'Оба' },
        ]}
        value={side}
        onChange={setSide}
        shape="rounded"
        aria-label="Где работает мод"
      />
      <Segmented<Side>
        options={[
          { value: 'client', label: 'Клиент' },
          { value: 'server', label: 'Сервер' },
          { value: 'both', label: 'Оба' },
        ]}
        value={side}
        onChange={setSide}
        shape="rounded"
        disabled
        aria-label="Где работает мод"
      />
    </div>
  );
}
