import { useState } from 'react';
import { Field, RadioGroup, RadioRow } from '@tugen/uikit/web';

export default function Example() {
  const [channel, setChannel] = useState<string | undefined>('release');

  return (
    <Field
      label="Канал обновлений"
      description="Что ставить при запуске"
      className="w-full max-w-sm"
    >
      <RadioGroup value={channel} onValueChange={setChannel}>
        <RadioRow value="release" label="Release" description="Стабильные" />
        <RadioRow
          value="snapshot"
          label="Snapshot"
          description="Каждую неделю"
        />
        <RadioRow value="old" label="Old alpha" disabled />
      </RadioGroup>
    </Field>
  );
}
