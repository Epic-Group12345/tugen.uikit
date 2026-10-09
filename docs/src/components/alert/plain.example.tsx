import { Alert } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert tone="neutral">
        Сборка создана из каталога: моды обновляются вместе с ней.
      </Alert>
      <Alert
        tone="warning"
        title="Игра запущена — настройки применятся после перезапуска"
      />
    </div>
  );
}
