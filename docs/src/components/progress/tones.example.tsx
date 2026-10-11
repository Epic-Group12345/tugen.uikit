import { Progress } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={40} aria-label="Загрузка модов" />
      <Progress value={72} tone="play" aria-label="Подготовка к запуску" />
      <Progress value={88} tone="warning" aria-label="Место на диске" />
      <Progress value={96} tone="danger" aria-label="Память" />
    </div>
  );
}
