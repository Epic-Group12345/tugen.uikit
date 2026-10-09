import { useState } from 'react';
import { Select } from '@tugen/uikit/web';

const LANGUAGES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
  { value: 'de', label: 'Deutsch' },
] as const;

type Language = (typeof LANGUAGES)[number]['value'];

export default function Example() {
  const [language, setLanguage] = useState<Language>('ru');
  return (
    <div className="flex w-full max-w-xs flex-col">
      <Select
        options={LANGUAGES}
        value={language}
        onChange={setLanguage}
        aria-label="Язык интерфейса"
      />
    </div>
  );
}
