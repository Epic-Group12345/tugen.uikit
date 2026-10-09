import React, { useState } from 'react';
import { Button } from '../../../src/web/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../../../src/web/context-menu';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../src/web/dropdown-menu';
import { Dropdown, Select, useDropdownMenu } from '../../../src/web/menu';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueOption,
} from '../../../src/web/select';
import { Text } from '../../../src/web/text';
import { Block, Dot, Line } from './shared';

const LANGUAGES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
  { value: 'de', label: 'Deutsch' },
] as const;

type Language = (typeof LANGUAGES)[number]['value'];

const DropdownExample: React.FC = () => {
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState('date');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Сборка</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>Сборка</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem icon={Dot} shortcut="Ctrl+E">
            Изменить
          </DropdownMenuItem>
          <DropdownMenuItem icon={Dot} shortcut="Ctrl+D">
            Дублировать
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={Dot}>Экспорт</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>В файл .zip</DropdownMenuItem>
              <DropdownMenuItem>В Modrinth</DropdownMenuItem>
              <DropdownMenuItem disabled>В CurseForge</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={grid}
          onCheckedChange={setGrid}
          closeOnSelect={false}
          inset
        >
          Сеткой
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel inset>Сортировка</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="date" inset>
            По дате
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name" inset>
            По имени
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Dot} destructive>
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SelectExample: React.FC = () => {
  const [version, setVersion] = useState<SelectValueOption>();
  return (
    <div className="w-56">
      <SelectRoot value={version} onValueChange={setVersion}>
        <SelectTrigger aria-label="Версия игры">
          <SelectValue placeholder="Версия игры" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Релизы</SelectLabel>
            <SelectItem value="1.21.4" label="1.21.4" />
            <SelectItem value="1.20.1" label="1.20.1" />
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Снапшоты</SelectLabel>
            <SelectItem value="25w14a" label="25w14a" />
            <SelectItem value="24w44a" label="24w44a" disabled />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </div>
  );
};

const PopupMenuExample: React.FC = () => {
  const { anchorRef, isOpen, onClick, menu } = useDropdownMenu({
    matchWidth: true,
  });
  return (
    <>
      <Button
        ref={anchorRef as React.Ref<HTMLButtonElement>}
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onClick}
      >
        useDropdownMenu (по ширине кнопки)
      </Button>
      {menu([
        { label: 'Открыть папку', icon: Dot, onSelect: () => {} },
        { label: 'Журнал', icon: Dot, onSelect: () => {} },
        { label: 'Удалить', destructive: true, onSelect: () => {} },
      ])}
    </>
  );
};

export const Menus: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ru');
  return (
    <>
      <Block title="Меню">
        <Line>
          <DropdownExample />
          <Dropdown
            icon={Dot}
            aria-label="Ещё"
            items={[
              { label: 'Переименовать', icon: Dot, onSelect: () => {} },
              { label: 'Сеткой', selected: true, onSelect: () => {} },
              { label: 'Недоступно', disabled: true, onSelect: () => {} },
              { label: 'Удалить', destructive: true, onSelect: () => {} },
            ]}
          />
          <PopupMenuExample />
        </Line>
      </Block>
      <Block title="Контекстное меню">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-mist-300 dark:border-mist-700">
              <Text tone="muted">Щёлкните правой кнопкой</Text>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem shortcut="F5">Обновить</ContextMenuItem>
            <ContextMenuItem shortcut="Ctrl+C">Копировать</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Открыть в</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Проводнике</ContextMenuItem>
                <ContextMenuItem>Терминале</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem destructive>Удалить</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Block>
      <Block title="Выпадающие списки">
        <Line>
          <div className="w-56">
            <Select
              options={LANGUAGES}
              value={language}
              onChange={setLanguage}
              aria-label="Язык интерфейса"
            />
          </div>
          <SelectExample />
          <div className="w-56">
            <Select
              options={LANGUAGES}
              value={language}
              onChange={setLanguage}
              disabled
              aria-label="Недоступно"
            />
          </div>
        </Line>
      </Block>
    </>
  );
};
