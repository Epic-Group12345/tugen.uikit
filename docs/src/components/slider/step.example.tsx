import { useState } from 'react';
import { Field, Slider } from '@tugen/uikit/web';

export default function Example() {
  const [memory, setMemory] = useState(4096);
  const [saved, setSaved] = useState(4096);

  return (
    <Field
      label={`Память: ${memory} МБ`}
      description={`Сохранено: ${saved} МБ`}
      className="w-full max-w-sm"
    >
      <Slider
        value={memory}
        min={1024}
        max={16384}
        step={512}
        onChange={setMemory}
        onCommit={setSaved}
      />
    </Field>
  );
}
