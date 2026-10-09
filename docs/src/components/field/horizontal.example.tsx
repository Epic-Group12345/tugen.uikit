import { useState } from 'react';
import { Field, Toggle } from '@tugen/uikit/web';

export default function Example() {
  const [close, setClose] = useState(true);
  const [snapshots, setSnapshots] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field
        label="Закрывать лаунчер"
        description="Когда игра запустилась"
        orientation="horizontal"
      >
        <Toggle value={close} onChange={setClose} />
      </Field>
      <Field
        label="Снапшоты"
        description="Нет в вашей редакции"
        orientation="horizontal"
        disabled
      >
        <Toggle value={snapshots} onChange={setSnapshots} />
      </Field>
    </div>
  );
}
