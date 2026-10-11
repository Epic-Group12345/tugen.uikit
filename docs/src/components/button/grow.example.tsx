import { Button } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-row gap-2">
      <Button variant="secondary" grow>
        Отмена
      </Button>
      <Button grow>Установить</Button>
    </div>
  );
}
