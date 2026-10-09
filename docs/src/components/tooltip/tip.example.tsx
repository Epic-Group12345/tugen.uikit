import { IconButton, Tip } from '@tugen/uikit/web';
import { FolderOpen, RefreshCw, Settings, Trash2 } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex flex-row gap-1">
      <Tip label="Открыть папку">
        <IconButton icon={FolderOpen} aria-label="Открыть папку" />
      </Tip>
      <Tip label="Проверить файлы">
        <IconButton icon={RefreshCw} aria-label="Проверить файлы" />
      </Tip>
      <Tip label="Настройки сборки">
        <IconButton icon={Settings} aria-label="Настройки сборки" />
      </Tip>
      <Tip label="Удалить сборку" side="bottom">
        <IconButton icon={Trash2} aria-label="Удалить сборку" tone="danger" />
      </Tip>
    </div>
  );
}
