import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Text,
} from '@tugen/uikit/web';
import { Copy, FolderOpen, Play, Trash2 } from 'lucide-react';

export default function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-32 w-full max-w-sm flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-mist-300 dark:border-mist-700">
          <Text weight="semibold">Мир «Долина»</Text>
          <Text size="xs" tone="muted">
            Щёлкните правой кнопкой
          </Text>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={Play} shortcut="Enter">
          Играть
        </ContextMenuItem>
        <ContextMenuItem icon={Copy} shortcut="Ctrl+D">
          Дублировать
        </ContextMenuItem>
        <ContextMenuItem icon={FolderOpen}>Открыть папку</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={Trash2} destructive>
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
