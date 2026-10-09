import { Button, IconButton } from '@tugen/uikit/web';
import { Download, Ellipsis, Play, Settings, Trash2 } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button variant="play" size="lg" icon={Play}>
        Играть
      </Button>
      <Button icon={Download}>Скачать</Button>
      <IconButton icon={Settings} aria-label="Настройки" />
      <IconButton icon={Ellipsis} aria-label="Ещё" />
      <IconButton icon={Trash2} aria-label="Удалить" tone="danger" />
    </div>
  );
}
