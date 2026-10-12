import { Button, IconButton, Icons } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button variant="play" size="lg" icon={Icons.Play}>
        Играть
      </Button>
      <Button icon={Icons.ArrowDownToLine}>Скачать</Button>
      <IconButton icon={Icons.Gear} aria-label="Настройки" />
      <IconButton icon={Icons.Ellipsis} aria-label="Ещё" />
      <IconButton icon={Icons.TrashBin} aria-label="Удалить" tone="danger" />
    </div>
  );
}
