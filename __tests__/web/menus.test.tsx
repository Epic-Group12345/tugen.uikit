import React, { act } from 'react';
import { Button } from '../../src/web/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../src/web/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../../src/web/context-menu';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from '../../src/web/select';
import { Dropdown, Menu, Select, useDropdownMenu } from '../../src/web/menu';
import { Dot, key, press, render } from './support/render';

const menu = () => document.querySelector('[role="menu"]');
const items = (role = 'menuitem') =>
  Array.from(document.querySelectorAll<HTMLElement>(`[role="${role}"]`));

afterEach(() => {
  document.body.innerHTML = '';
});

it('меню открывается кнопкой, пункт берёт внутренний радиус и закрывает меню', () => {
  const onSelect = jest.fn();
  const { container, unmount } = render(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Действия</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Сборка</DropdownMenuLabel>
        <DropdownMenuItem icon={Dot} shortcut="Ctrl+C" onSelect={onSelect}>
          Копировать
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Удалить</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  const trigger = container.querySelector('button')!;
  expect(menu()).toBeNull();
  press(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  const surface = menu()!;
  // Окно rounded-xl p-1 → пункт 12 − 4 = 8 (rounded-lg)
  expect(surface.className).toContain('rounded-xl');
  expect(surface.className).toContain('p-1');
  expect(surface.className).toContain('w-64');
  const [copy, remove] = items();
  expect(copy.className).toContain('rounded-lg');
  expect(copy.textContent).toContain('Ctrl+C');
  expect(copy.querySelector('[data-icon]')).not.toBeNull();
  expect(remove.className).toContain('text-red-600');
  expect(document.querySelector('[role="separator"]')).not.toBeNull();
  press(copy);
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(menu()).toBeNull();
  unmount();
});

it('флажок и варианты: галочка у выбранного, closeOnSelect={false} оставляет меню', () => {
  const onCheckedChange = jest.fn();
  const onValueChange = jest.fn();
  const { unmount } = render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Вид</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked
          onCheckedChange={onCheckedChange}
          closeOnSelect={false}
        >
          Сетка
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="ru" onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="ru">Русский</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  const [grid] = items('menuitemcheckbox');
  expect(grid.getAttribute('aria-checked')).toBe('true');
  expect(grid.querySelector('svg')).not.toBeNull();
  press(grid);
  expect(onCheckedChange).toHaveBeenCalledWith(false);
  expect(menu()).not.toBeNull();
  const [ru, en] = items('menuitemradio');
  expect(ru.getAttribute('aria-checked')).toBe('true');
  expect(ru.querySelector('svg')).not.toBeNull();
  expect(en.querySelector('svg')).toBeNull();
  press(en);
  expect(onValueChange).toHaveBeenCalledWith('en');
  unmount();
});

it('подменю раскрывается стрелкой вправо', () => {
  const { unmount } = render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Ещё</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Экспорт</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>В файл</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  const sub = items()[0];
  expect(sub.getAttribute('aria-haspopup')).toBe('menu');
  act(() => sub.focus());
  key(sub, 'ArrowRight');
  const menus = document.querySelectorAll('[role="menu"]');
  expect(menus).toHaveLength(2);
  const file = items().find(el => el.textContent === 'В файл')!;
  // Окно подменю — тоже rounded-xl p-1: пункт в нём rounded-lg
  expect(menus[1].className).toContain('rounded-xl');
  expect(file.className).toContain('rounded-lg');
  unmount();
});

it('контекстное меню открывается правой кнопкой', () => {
  const onSelect = jest.fn();
  const { container, unmount } = render(
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div data-area>Область</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onSelect}>Обновить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  );
  const area = container.querySelector('[data-area]')!;
  act(() => {
    area.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 40,
        clientY: 20,
      }),
    );
  });
  expect(menu()!.className).toContain('rounded-xl');
  expect(items()[0].className).toContain('rounded-lg');
  press(items()[0]);
  expect(onSelect).toHaveBeenCalled();
  unmount();
});

it('составной список: placeholder, выбор отдаёт { value, label }', () => {
  const onValueChange = jest.fn();
  const { container, unmount } = render(
    <SelectRoot onValueChange={onValueChange}>
      <SelectTrigger aria-label="Версия">
        <SelectValue placeholder="Выберите версию" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1.21" label="1.21.4" />
        <SelectItem value="1.20" label="1.20.1" />
      </SelectContent>
    </SelectRoot>,
  );
  const trigger = container.querySelector('button')!;
  expect(trigger.getAttribute('role')).toBe('combobox');
  expect(trigger.textContent).toContain('Выберите версию');
  expect(trigger.className).toContain('rounded-lg');
  press(trigger);
  const listbox = document.querySelector('[role="listbox"]')!;
  expect(listbox).not.toBeNull();
  const options = items('option');
  expect(options[0].className).toContain('rounded-lg');
  key(options[1], 'Enter');
  expect(onValueChange).toHaveBeenCalledWith({
    value: '1.20',
    label: '1.20.1',
  });
  expect(trigger.textContent).toContain('1.20.1');
  unmount();
});

it('Select из options: кнопка показывает текущий, onChange — значение', () => {
  const onChange = jest.fn();
  const options = [
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'English', icon: Dot },
  ] as const;
  const { container, rerender, unmount } = render(
    <Select
      options={options}
      value="ru"
      onChange={onChange}
      aria-label="Язык"
    />,
  );
  const trigger = container.querySelector('button')!;
  expect(trigger.getAttribute('aria-label')).toBe('Язык');
  expect(trigger.textContent).toContain('Русский');
  press(trigger);
  const [ru, en] = items('option');
  expect(ru.getAttribute('data-state')).toBe('checked');
  expect(ru.querySelector('svg')).not.toBeNull();
  key(en, 'Enter');
  expect(onChange).toHaveBeenCalledWith('en');
  rerender(
    <Select
      options={options}
      value="en"
      onChange={onChange}
      aria-label="Язык"
    />,
  );
  expect(trigger.textContent).toContain('English');
  expect(trigger.querySelector('[data-icon]')).not.toBeNull();
  unmount();
});

it('Select с placeholder: значение не из списка — подпись-подсказка', () => {
  const { container, unmount } = render(
    <Select
      options={[{ value: 'a', label: 'А' }]}
      value={'z' as string}
      onChange={() => {}}
      placeholder="Не выбрано"
    />,
  );
  expect(container.querySelector('button')!.textContent).toContain(
    'Не выбрано',
  );
  unmount();
});

it('Dropdown: кнопка-иконка с подписью и меню из списка', () => {
  const onSelect = jest.fn();
  const { container, unmount } = render(
    <Dropdown
      icon={Dot}
      aria-label="Ещё"
      items={[
        { label: 'Переименовать', onSelect },
        { label: 'Удалить', destructive: true, onSelect: () => {} },
      ]}
    />,
  );
  const trigger = container.querySelector('button')!;
  expect(trigger.getAttribute('aria-label')).toBe('Ещё');
  press(trigger);
  expect(items()).toHaveLength(2);
  press(items()[0]);
  expect(onSelect).toHaveBeenCalled();
  expect(menu()).toBeNull();
  unmount();
});

it('Menu: пункты-кнопки, выбор закрывает и вызывает onSelect, стрелки двигают фокус', () => {
  const onClose = jest.fn();
  const onSelect = jest.fn();
  const { unmount } = render(
    <Menu
      onClose={onClose}
      items={[
        { label: 'Первый', selected: true, onSelect },
        { label: 'Второй', selected: false, onSelect: () => {} },
      ]}
    />,
  );
  const surface = menu()!;
  expect(surface.className).toContain('rounded-xl');
  const [first, second] = items('menuitemradio');
  expect(first.className).toContain('rounded-lg');
  expect(first.getAttribute('aria-checked')).toBe('true');
  act(() => first.focus());
  key(first, 'ArrowDown');
  expect(document.activeElement).toBe(second);
  press(first);
  expect(onClose).toHaveBeenCalled();
  expect(onSelect).toHaveBeenCalled();
  unmount();
});

it('useDropdownMenu: кнопка открывает и закрывает меню у себя', () => {
  const Demo = () => {
    const { anchorRef, isOpen, onClick, menu: render } = useDropdownMenu();
    return (
      <>
        <Button
          ref={anchorRef as React.Ref<HTMLButtonElement>}
          aria-expanded={isOpen}
          onClick={onClick}
        >
          Меню
        </Button>
        {render([{ label: 'Пункт', onSelect: () => {} }])}
      </>
    );
  };
  const { container, unmount } = render(<Demo />);
  const trigger = container.querySelector('button')!;
  press(trigger);
  expect(menu()).not.toBeNull();
  press(trigger);
  expect(menu()).toBeNull();
  press(trigger);
  press(items()[0]);
  expect(menu()).toBeNull();
  unmount();
});
