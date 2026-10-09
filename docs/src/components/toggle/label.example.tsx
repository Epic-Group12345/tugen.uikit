import { useState } from 'react';
import { Field, Label, Toggle } from '@tugen/uikit/web';

export default function Example() {
  const [sounds, setSounds] = useState(false);
  const [close, setClose] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-row items-center justify-between gap-3">
        <Label htmlFor="sounds">Звуки интерфейса</Label>
        <Toggle id="sounds" value={sounds} onChange={setSounds} />
      </div>
      <Field
        label="Закрывать лаунчер"
        description="Когда игра запустилась"
        orientation="horizontal"
      >
        <Toggle value={close} onChange={setClose} />
      </Field>
    </div>
  );
}
