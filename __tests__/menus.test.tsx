import React, { useState } from 'react';
import { Text } from 'react-native';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  dismissPopup,
} from '../src';
import { classOf, classesOf, press, render, tick } from './support/render';

const openMenu = async (container: HTMLElement) => {
  press(container.querySelector('[role="button"]'));
  await tick();
};

/** Пункт меню по подписи */
const itemByText = (container: HTMLElement, role: string, text: string) =>
  [...container.querySelectorAll(`[role="${role}"]`)].find(el =>
    el.textContent?.includes(text),
  ) ?? null;

it('DropdownMenu: открывается, выбор пункта зовёт onSelect и закрывает меню', async () => {
  const onSelect = jest.fn();
  const { container, unmount } = render(
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Text>Ещё</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Сборка</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onSelect} shortcut="Ctrl+D">
          Дублировать
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={() => {}}>
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  expect(container.querySelector('[role="menu"]')).toBeNull();
  await openMenu(container);
  expect(container.querySelector('[role="menu"]')).not.toBeNull();
  expect(container.textContent).toContain('Ctrl+D');
  expect(container.querySelector('[role="separator"]')).not.toBeNull();
  // destructive — красный текст
  expect(classesOf(itemByText(container, 'menuitem', 'Удалить')!)).toContain(
    'text-red-600',
  );

  press(itemByText(container, 'menuitem', 'Дублировать'));
  await tick();
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(container.querySelector('[role="menu"]')).toBeNull();
  unmount();
});

it('DropdownMenu: окно rounded-xl p-1, пункты внутри — rounded-lg', async () => {
  const { container, unmount } = render(
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Text>Ещё</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => {}}>Открыть</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  await openMenu(container);
  const menu = container.querySelector('[role="menu"]')!;
  const surface = [...menu.querySelectorAll('[data-class]')].find(el =>
    classOf(el).includes('min-w-48'),
  )!;
  expect(classOf(surface)).toContain('rounded-xl');
  expect(classOf(surface).split(' ')).toContain('p-1');
  // 12 − 4 = 8: слои наведения пункта скруглены rounded-lg
  const item = menu.querySelector('[role="menuitem"]')!;
  expect(classesOf(item)).toContain('rounded-lg');
  expect(classesOf(item)).not.toContain('rounded-xl');
  unmount();
});

it('DropdownMenu: Escape (dismissPopup) закрывает меню', async () => {
  const { container, unmount } = render(
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Text>Ещё</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => {}}>Открыть</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  await openMenu(container);
  expect(container.querySelector('[aria-expanded="true"]')).not.toBeNull();
  let closed = false;
  React.act(() => {
    closed = dismissPopup();
  });
  await tick();
  expect(closed).toBe(true);
  expect(container.querySelector('[role="menu"]')).toBeNull();
  unmount();
});

it('DropdownMenuCheckboxItem переключается, RadioItem выбирает вариант', async () => {
  const Demo = () => {
    const [pinned, setPinned] = useState(false);
    const [sort, setSort] = useState('name');
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Text>Вид</Text>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={pinned}
            onCheckedChange={setPinned}
            closeOnSelect={false}
          >
            Закрепить
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="name">По имени</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">По дате</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  const { container, unmount } = render(<Demo />);
  await openMenu(container);
  const checkbox = () => container.querySelector('[role="checkbox"]')!;
  expect(checkbox().getAttribute('aria-checked')).toBe('false');
  press(checkbox());
  await tick();
  // closeOnSelect={false}: меню осталось открытым, флажок включён
  expect(checkbox().getAttribute('aria-checked')).toBe('true');
  expect(
    itemByText(container, 'radio', 'По имени')!.getAttribute('aria-checked'),
  ).toBe('true');
  press(itemByText(container, 'radio', 'По дате'));
  await tick();
  expect(container.querySelector('[role="menu"]')).toBeNull();
  await openMenu(container);
  expect(
    itemByText(container, 'radio', 'По дате')!.getAttribute('aria-checked'),
  ).toBe('true');
  expect(checkbox().getAttribute('aria-checked')).toBe('true');
  unmount();
});

it('DropdownMenuSub раскрывается внутри того же окна', async () => {
  const { container, unmount } = render(
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Text>Ещё</Text>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Экспорт</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => {}}>Архивом</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  await openMenu(container);
  expect(container.textContent).not.toContain('Архивом');
  const sub = itemByText(container, 'menuitem', 'Экспорт')!;
  press(sub);
  await tick();
  expect(sub.getAttribute('aria-expanded')).toBe('true');
  expect(container.querySelectorAll('[role="menu"]')[0].textContent).toContain(
    'Архивом',
  );
  unmount();
});

it('ContextMenu открывается правой кнопкой мыши, пункт закрывает меню', async () => {
  const onSelect = jest.fn();
  const { container, unmount } = render(
    <ContextMenu>
      <ContextMenuTrigger>
        <Text>Сборка</Text>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onSelect}>Переименовать</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>,
  );
  expect(container.querySelector('[role="menu"]')).toBeNull();
  // Правая кнопка мыши: событие указателя с button = 2
  const trigger = container.querySelector('[role="button"]')!;
  // jsdom не заполняет pageX / pageY у событий мыши — задаём сами
  const event = new MouseEvent('pointerdown', { bubbles: true, button: 2 });
  Object.defineProperties(event, {
    pageX: { value: 40 },
    pageY: { value: 30 },
  });
  React.act(() => {
    trigger.dispatchEvent(event);
  });
  await tick();
  expect(container.querySelector('[role="menu"]')).not.toBeNull();
  const item = container.querySelector('[role="menuitem"]')!;
  expect(classesOf(item)).toContain('rounded-lg');
  press(item);
  await tick();
  expect(onSelect).toHaveBeenCalled();
  expect(container.querySelector('[role="menu"]')).toBeNull();
  unmount();
});

it('SelectRoot: составной список выбирает значение', async () => {
  const onValueChange = jest.fn();
  const { container, unmount } = render(
    <SelectRoot onValueChange={onValueChange}>
      <SelectTrigger accessibilityLabel="Версия">
        <SelectValue placeholder="Выберите версию" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Релизы</SelectLabel>
          <SelectItem value="1.21" label="1.21" />
          <SelectItem value="1.20" label="1.20" />
        </SelectGroup>
      </SelectContent>
    </SelectRoot>,
  );
  const combo = container.querySelector('[role="combobox"]')!;
  expect(combo.textContent).toContain('Выберите версию');
  press(combo);
  await tick();
  const options = container.querySelectorAll('[role="option"]');
  expect(options).toHaveLength(2);
  expect(classesOf(options[0])).toContain('rounded-lg');
  press(options[1]);
  await tick();
  expect(onValueChange).toHaveBeenCalledWith({ value: '1.20', label: '1.20' });
  expect(container.querySelectorAll('[role="option"]')).toHaveLength(0);
  expect(combo.textContent).toContain('1.20');
  unmount();
});

it('Select одной строкой: выбранный вариант отмечен, выбор зовёт onChange', async () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <Select
      options={[
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
      ]}
      value="ru"
      onChange={onChange}
      accessibilityLabel="Язык"
    />,
  );
  const combo = container.querySelector('[role="combobox"]')!;
  expect(combo.textContent).toContain('Русский');
  press(combo);
  await tick();
  const options = container.querySelectorAll('[role="option"]');
  expect(options[0].getAttribute('aria-selected')).toBe('true');
  press(options[1]);
  expect(onChange).toHaveBeenCalledWith('en');
  unmount();
});
