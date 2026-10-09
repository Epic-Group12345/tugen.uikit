import { useState } from 'react';
import { Row, Section, Slider, Toggle } from '@tugen/uikit/web';

export default function Example() {
  const [music, setMusic] = useState(false);
  const [volume, setVolume] = useState(60);

  return (
    <Section title="Звук" className="w-full">
      <Row title="Музыка" description="Фоновая музыка в лаунчере">
        <div className="flex flex-row justify-end">
          <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
        </div>
      </Row>
      <Row title="Громкость" description={`${volume}%`}>
        <Slider
          value={volume}
          onChange={setVolume}
          disabled={!music}
          aria-label="Громкость"
        />
      </Row>
    </Section>
  );
}
