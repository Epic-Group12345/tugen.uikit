import { Progress, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Text>Проверка файлов игры…</Text>
      <Progress indeterminate aria-label="Проверка файлов" />
    </div>
  );
}
