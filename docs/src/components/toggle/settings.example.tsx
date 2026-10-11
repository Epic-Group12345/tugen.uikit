import { useState } from 'react';
import { Row, Section, Toggle } from '@tugen/uikit/web';

export default function Example() {
  const [music, setMusic] = useState(true);
  const [updates, setUpdates] = useState(false);

  return (
    <Section title="Лаунчер" className="w-full">
      <Row title="Музыка" description="Фоновая музыка в лаунчере">
        <div className="flex flex-row justify-end">
          <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
        </div>
      </Row>
      <Row title="Обновлять моды" description="Перед каждым запуском">
        <div className="flex flex-row justify-end">
          <Toggle
            value={updates}
            onChange={setUpdates}
            aria-label="Обновлять моды"
          />
        </div>
      </Row>
    </Section>
  );
}
