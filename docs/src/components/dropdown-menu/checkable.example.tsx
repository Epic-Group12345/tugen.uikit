import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icons,
} from '@tugen/uikit/web';

export default function Example() {
  const [grid, setGrid] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [sort, setSort] = useState('date');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" icon={Icons.Sliders}>
          Вид
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuCheckboxItem
          checked={grid}
          onCheckedChange={setGrid}
          closeOnSelect={false}
        >
          Сеткой
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={hidden}
          onCheckedChange={setHidden}
          closeOnSelect={false}
        >
          Скрытые сборки
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Сортировка</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="date">
            По дате запуска
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">По имени</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="version">
            По версии игры
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
