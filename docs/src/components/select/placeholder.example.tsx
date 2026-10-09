import { useState } from 'react';
import { Select } from '@tugen/uikit/web';

const LOADERS = [
  { value: 'vanilla', label: 'Без модов' },
  { value: 'fabric', label: 'Fabric' },
  { value: 'forge', label: 'Forge' },
  { value: 'neoforge', label: 'NeoForge' },
];

const MEMORY = [
  { value: '4', label: '4 ГБ' },
  { value: '6', label: '6 ГБ' },
  { value: '8', label: '8 ГБ' },
];

export default function Example() {
  const [loader, setLoader] = useState('');
  const [memory, setMemory] = useState('4');
  return (
    <div className="flex w-full max-w-sm flex-row gap-2">
      <Select
        options={LOADERS}
        value={loader}
        onChange={setLoader}
        placeholder="Загрузчик"
        aria-label="Загрузчик модов"
        grow
      />
      <Select
        options={MEMORY}
        value={memory}
        onChange={setMemory}
        disabled={!loader}
        aria-label="Память"
        grow
      />
    </div>
  );
}
