import { useState } from 'react';
import { Field, TextField } from '@tugen/uikit/web';

export default function Example() {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Имя сборки" description="Видно в списке слева">
        <TextField
          value={name}
          onChangeText={setName}
          placeholder="Моя сборка"
        />
      </Field>
      <Field label="Заметки">
        <TextField
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Что поменял в сборке"
        />
      </Field>
    </div>
  );
}
