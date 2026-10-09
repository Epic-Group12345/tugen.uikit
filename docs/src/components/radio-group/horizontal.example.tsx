import { useState } from 'react';
import { Label, RadioGroup, RadioGroupItem } from '@tugen/uikit/web';

const SIZES = [
  { value: 'small', label: 'Мелкий' },
  { value: 'normal', label: 'Обычный' },
  { value: 'large', label: 'Крупный' },
];

export default function Example() {
  const [size, setSize] = useState<string | undefined>('normal');

  return (
    <RadioGroup
      value={size}
      onValueChange={setSize}
      orientation="horizontal"
      aria-label="Размер интерфейса"
      className="flex-row gap-4"
    >
      {SIZES.map(option => (
        <div key={option.value} className="flex flex-row items-center gap-2">
          <RadioGroupItem id={`size-${option.value}`} value={option.value} />
          <Label htmlFor={`size-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
