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
  Icons,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Сборка</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Выживание 1.21.4</DropdownMenuLabel>
        <DropdownMenuItem icon={Icons.Pencil} shortcut="Ctrl+E">
          Изменить
        </DropdownMenuItem>
        <DropdownMenuItem icon={Icons.Copy} shortcut="Ctrl+D">
          Дублировать
        </DropdownMenuItem>
        <DropdownMenuItem icon={Icons.FolderOpen}>
          Открыть папку
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={Icons.ArrowUpFromSquare}>
            Экспорт
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>В файл .zip</DropdownMenuItem>
            <DropdownMenuItem>В Modrinth</DropdownMenuItem>
            <DropdownMenuItem disabled>В CurseForge</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.TrashBin} destructive>
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
