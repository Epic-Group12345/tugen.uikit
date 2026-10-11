import { Button, Surface, Text } from '@tugen/uikit/web';
import { Play } from 'lucide-react';

export default function Example() {
  return (
    <Surface
      kind="overlay"
      radius="3xl"
      padding="3"
      className="flex w-full max-w-sm flex-col gap-3"
    >
      <Surface kind="neutral" nested className="flex flex-col gap-0.5 p-4">
        <Text weight="semibold">Выживание 1.21</Text>
        <Text size="xs" tone="muted">
          Fabric · 42 мода · 1,3 ГБ
        </Text>
      </Surface>
      <Button variant="play" size="lg" icon={Play} grow>
        Играть
      </Button>
    </Surface>
  );
}
