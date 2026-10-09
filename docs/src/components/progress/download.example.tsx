import { useEffect, useState } from 'react';
import { Button, Progress, Text } from '@tugen/uikit/web';

const TOTAL = 42;

export default function Example() {
  // null — установка ещё не начиналась
  const [done, setDone] = useState<number | null>(null);
  const running = done !== null && done < TOTAL;

  useEffect(() => {
    if (done === null || done >= TOTAL) {
      return;
    }
    const id = setTimeout(() => setDone(Math.min(TOTAL, done + 3)), 300);
    return () => clearTimeout(id);
  }, [done]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex flex-row items-baseline justify-between">
        <Text>Установка «Выживание 1.21»</Text>
        <Text size="xs" tone="muted">
          {done ?? 0} из {TOTAL} модов
        </Text>
      </div>
      <Progress
        value={done ?? 0}
        max={TOTAL}
        aria-label="Установка сборки"
        getValueLabel={(value, max) => `${value} из ${max} модов`}
      />
      <Button
        variant="secondary"
        className="self-start"
        disabled={running}
        onClick={() => setDone(0)}
      >
        {done === TOTAL ? 'Установить заново' : 'Установить'}
      </Button>
    </div>
  );
}
