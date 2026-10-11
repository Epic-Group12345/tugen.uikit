import { useState } from 'react';
import { Button, Field, Text, TextField } from '@tugen/uikit/web';

export default function Example() {
  const [memory, setMemory] = useState('4096');
  const [path, setPath] = useState('C:\\Users\\Steve\\.tugen');
  const [address, setAddress] = useState('play.example.net');

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Память">
        <TextField
          value={memory}
          onChangeText={setMemory}
          numeric
          mono
          trailing={
            <Text tone="muted" className="pr-2.5">
              МБ
            </Text>
          }
        />
      </Field>
      <Field label="Папка игры">
        <TextField
          value={path}
          onChangeText={setPath}
          mono
          trailing={
            <Button size="sm" variant="secondary">
              Обзор
            </Button>
          }
        />
      </Field>
      <Field label="Адрес сервера">
        <TextField
          value={address}
          onChangeText={setAddress}
          leading={<Text tone="muted">mc://</Text>}
        />
      </Field>
    </div>
  );
}
