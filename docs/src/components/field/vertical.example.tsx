import { useState } from 'react';
import { Field, TextField } from '@tugen/uikit/web';

export default function Example() {
  const [name, setName] = useState('Выживание 1.21');
  const [args, setArgs] = useState('-XX:+UseG1GC -Xmx');

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Имя сборки" description="Видно в списке слева">
        <TextField value={name} onChangeText={setName} />
      </Field>
      <Field label="Аргументы JVM" error="Не указан размер памяти после -Xmx">
        <TextField value={args} onChangeText={setArgs} mono />
      </Field>
    </div>
  );
}
