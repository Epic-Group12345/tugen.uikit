import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  Text,
} from '@tugen/uikit/web';

export default function Example() {
  const [favorite, setFavorite] = useState(true);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex w-full max-w-sm flex-row items-center justify-between rounded-xl bg-mist-100 px-4 py-3 dark:bg-mist-800">
          <div className="flex flex-col">
            <Text weight="semibold">play.tugen.ru</Text>
            <Text size="xs" tone="muted">
              128 игроков · 1.21.4
            </Text>
          </div>
          <Text size="xs" tone="success">
            В сети
          </Text>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Сервер</ContextMenuLabel>
        <ContextMenuItem shortcut="F5">Обновить</ContextMenuItem>
        <ContextMenuItem shortcut="Ctrl+C">Копировать адрес</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Открыть в сборке</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Выживание 1.21.4</ContextMenuItem>
            <ContextMenuItem>Fabric Optimized</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem
          checked={favorite}
          onCheckedChange={setFavorite}
        >
          В избранном
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
