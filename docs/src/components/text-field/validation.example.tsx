import { useState } from 'react';
import { Field, TextField } from '@tugen/uikit/web';

export default function Example() {
  const [memory, setMemory] = useState('512');
  const error =
    memory !== '' && Number(memory) < 1024 ? 'Не меньше 1024 МБ' : undefined;

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Память, МБ" error={error}>
        <TextField value={memory} onChangeText={setMemory} numeric mono />
      </Field>
      <Field label="Пароль сервера" disabled>
        <TextField value="secret" onChangeText={() => {}} secure />
      </Field>
    </div>
  );
}
