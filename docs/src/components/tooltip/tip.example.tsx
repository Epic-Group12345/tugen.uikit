import { IconButton, Icons, Tip } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row gap-1">
      <Tip label="Открыть папку">
        <IconButton icon={Icons.FolderOpen} aria-label="Открыть папку" />
      </Tip>
      <Tip label="Проверить файлы">
        <IconButton
          icon={Icons.ArrowsRotateRight}
          aria-label="Проверить файлы"
        />
      </Tip>
      <Tip label="Настройки сборки">
        <IconButton icon={Icons.Gear} aria-label="Настройки сборки" />
      </Tip>
      <Tip label="Удалить сборку" side="bottom">
        <IconButton
          icon={Icons.TrashBin}
          aria-label="Удалить сборку"
          tone="danger"
        />
      </Tip>
    </div>
  );
}
