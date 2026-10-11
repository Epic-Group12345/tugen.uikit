import { useState } from 'react';
import { Row, Section, Select, Toggle } from '@tugen/uikit/web';

const RESOLUTIONS = [
  { value: 'auto', label: 'Как у окна лаунчера' },
  { value: '1280x720', label: '1280 × 720' },
  { value: '1920x1080', label: '1920 × 1080' },
] as const;

type Resolution = (typeof RESOLUTIONS)[number]['value'];

export default function Example() {
  const [music, setMusic] = useState(true);
  const [resolution, setResolution] = useState<Resolution>('auto');

  return (
    <Section title="Игра" className="w-full">
      <Row title="Музыка" description="Фоновая музыка в лаунчере">
        <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
      </Row>
      <Row title="Размер окна" description="При запуске игры">
        <Select
          options={RESOLUTIONS}
          value={resolution}
          onChange={setResolution}
          aria-label="Размер окна"
        />
      </Row>
    </Section>
  );
}
