import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@tugen/uikit/web';
import { Copy, FolderOpen, Pencil, Share2, Trash2 } from 'lucide-react';

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Сборка</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Выживание 1.21.4</DropdownMenuLabel>
        <DropdownMenuItem icon={Pencil} shortcut="Ctrl+E">
          Изменить
        </DropdownMenuItem>
        <DropdownMenuItem icon={Copy} shortcut="Ctrl+D">
          Дублировать
        </DropdownMenuItem>
        <DropdownMenuItem icon={FolderOpen}>Открыть папку</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={Share2}>Экспорт</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>В файл .zip</DropdownMenuItem>
            <DropdownMenuItem>В Modrinth</DropdownMenuItem>
            <DropdownMenuItem disabled>В CurseForge</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Trash2} destructive>
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
