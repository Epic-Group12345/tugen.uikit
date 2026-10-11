import { useState } from 'react';
import { Slider, Text } from '@tugen/uikit/web';

export default function Example() {
  const [volume, setVolume] = useState(40);

  return (
    <div className="flex w-full max-w-sm flex-row items-center gap-3">
      <Slider value={volume} onChange={setVolume} aria-label="Громкость" />
      <Text tone="muted" mono className="w-10 text-right">
        {volume}%
      </Text>
    </div>
  );
}
