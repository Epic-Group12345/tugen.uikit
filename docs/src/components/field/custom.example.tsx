import { useState } from 'react';
import { Field } from '@tugen/uikit/web';

export default function Example() {
  const [java, setJava] = useState('21');

  return (
    <Field
      label="Версия Java"
      description="Для 1.20.5 и новее нужна Java 21"
      className="w-full max-w-sm"
    >
      {({ invalid, ...control }) => (
        <select
          {...control}
          value={java}
          onChange={e => setJava(e.target.value)}
          className="rounded-lg border border-mist-200 bg-mist-100 px-3 py-2 text-sm text-mist-950 dark:border-mist-800 dark:bg-mist-900 dark:text-mist-50"
        >
          <option value="8">Java 8</option>
          <option value="17">Java 17</option>
          <option value="21">Java 21</option>
        </select>
      )}
    </Field>
  );
}
