import { useState } from 'react';
import { RadioGroup, RadioGroupItem, Text } from '@tugen/uikit/web';

export default function Example() {
  const [loader, setLoader] = useState<string | undefined>('fabric');

  return (
    <RadioGroup
      value={loader}
      onValueChange={setLoader}
      aria-label="Загрузчик модов"
      className="w-full max-w-sm flex-col gap-1"
    >
      <RadioGroupItem value="vanilla">Без модов</RadioGroupItem>
      <RadioGroupItem value="fabric">
        <Text>Fabric</Text>
        <Text size="xs" tone="muted">
          Лёгкий, быстро выходит на новых версиях
        </Text>
      </RadioGroupItem>
      <RadioGroupItem value="forge">
        <Text>Forge</Text>
        <Text size="xs" tone="muted">
          Большие сборки и старые моды
        </Text>
      </RadioGroupItem>
    </RadioGroup>
  );
}
