import { Pill, Surface, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <Surface kind="card" className="flex w-full max-w-sm flex-col gap-2 p-4">
      <div className="flex flex-row items-center gap-2">
        <Text weight="semibold">Сервер «Островок»</Text>
        <Pill tone="violet">Буст</Pill>
      </div>
      <Text size="xs" tone="muted">
        Ванильное выживание · 1.21.1
      </Text>
      <div className="flex flex-row flex-wrap gap-1.5">
        <Pill>Выживание</Pill>
        <Pill>Без приватов</Pill>
        <Pill tone="green">128 в сети</Pill>
      </div>
    </Surface>
  );
}
