import React, { act } from 'react';
import { Button } from '../../src/web/button';
import { Pill } from '../../src/web/pill';
import { Skeleton, SkeletonLines } from '../../src/web/skeleton';
import { EmptyState } from '../../src/web/empty-state';
import { Kbd, KbdCombo } from '../../src/web/kbd';
import { Alert } from '../../src/web/alert';
import { Progress } from '../../src/web/progress';
import { Avatar, AvatarGroup, initials } from '../../src/web/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/web/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../src/web/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../src/web/collapsible';
import { Dot, press, render } from './support/render';

it('метка — цвет по тону', () => {
  const { container, unmount } = render(<Pill tone="danger">Скам</Pill>);
  const pill = container.querySelector('span')!;
  expect(pill.className).toContain('bg-red-600');
  expect(pill.textContent).toBe('Скам');
  unmount();
});

it('заглушка скрыта от диктора, строки абзаца — последняя короче', () => {
  const { container, unmount } = render(
    <>
      <Skeleton className="w-24 h-3" />
      <SkeletonLines lines={4} />
    </>,
  );
  const block = container.firstElementChild as HTMLElement;
  expect(block.getAttribute('aria-hidden')).toBe('true');
  expect(block.className).toContain('w-24');
  expect(block.className).toContain('animate-tg-shimmer');
  const lines = Array.from(
    container.querySelectorAll<HTMLElement>('.rounded-full'),
  );
  expect(lines.map(l => l.style.width)).toEqual(['100%', '94%', '97%', '60%']);
  unmount();
});

it('пустая страница — иконка, заголовок, пояснение и действие', () => {
  const { container, unmount } = render(
    <EmptyState icon={Dot} title="Пусто" text="Здесь пока ничего нет">
      <Button>Создать</Button>
    </EmptyState>,
  );
  expect(container.querySelector('h3')!.textContent).toBe('Пусто');
  expect(
    container.querySelector('[data-icon]')!.getAttribute('data-icon'),
  ).toMatch(/^24:/);
  expect(container.querySelector('button')!.textContent).toBe('Создать');
  unmount();
});

it('сочетание клавиш — <kbd> и подпись целиком', () => {
  const { container, unmount } = render(
    <>
      <Kbd>Esc</Kbd>
      <KbdCombo keys={['Ctrl', 'K']} />
    </>,
  );
  expect(container.querySelectorAll('kbd')).toHaveLength(3);
  const combo = container.querySelector('[role="group"]')!;
  expect(combo.getAttribute('aria-label')).toBe('Ctrl + K');
  unmount();
});

it('уведомление: роль по тону, кнопка у края — rounded-lg по правилу', () => {
  const { container, unmount } = render(
    <Alert tone="danger" title="Нет связи" action={<Button>Повторить</Button>}>
      Сервер не отвечает
    </Alert>,
  );
  const alert = container.querySelector('[role="alert"]')!;
  expect(alert.className).toContain('rounded-xl');
  expect(alert.className).toContain('p-1');
  // rounded-xl (12) − p-1 (4) = 8
  expect(container.querySelector('button')!.className).toContain('rounded-lg');
  expect(container.querySelector('p')!.textContent).toBe('Сервер не отвечает');
  unmount();
});

it('прогресс: значение прижато к краю, заливка сдвинута transform', () => {
  const { container, rerender, unmount } = render(
    <Progress value={150} max={200} aria-label="Загрузка" />,
  );
  const bar = container.querySelector('[role="progressbar"]')!;
  expect(bar.getAttribute('aria-valuenow')).toBe('150');
  expect(bar.getAttribute('aria-valuemax')).toBe('200');
  expect(bar.getAttribute('aria-label')).toBe('Загрузка');
  const fill = bar.firstElementChild as HTMLElement;
  expect(fill.style.transform).toBe('translateX(-25%)');
  rerender(<Progress value={500} max={200} />);
  expect(fill.style.transform).toBe('translateX(0%)');
  rerender(<Progress indeterminate />);
  expect(bar.getAttribute('aria-valuenow')).toBeNull();
  expect(bar.getAttribute('aria-busy')).toBe('true');
  expect(bar.getAttribute('data-state')).toBe('indeterminate');
  unmount();
});

it('аватар: инициалы без картинки, обводка — радиус аватара + 2', () => {
  expect(initials('Алекс Стив Третий')).toBe('АС');
  expect(initials('  ')).toBe('?');
  const { container, unmount } = render(
    <>
      <Avatar alt="Алекс Стив" shape="rounded" ring status="online" />
      <Avatar alt="Ник" size="lg" shape="rounded" ring />
    </>,
  );
  const [md, lg] = Array.from(
    container.querySelectorAll('[aria-label]'),
  ).filter(el => el.getAttribute('aria-label') !== 'online');
  expect(md.textContent).toBe('АС');
  expect(md.className).toContain('rounded-md');
  // rounded-md (6) + p-0.5 (2) = 8 → rounded-lg
  expect(md.parentElement!.className).toContain('rounded-lg');
  expect(container.querySelector('[aria-label="online"]')).not.toBeNull();
  // rounded-lg (8) + 2 = 10 — вне шкалы, стилем
  expect(lg.className).toContain('rounded-lg');
  expect((lg.parentElement as HTMLElement).style.borderRadius).toBe('10px');
  unmount();
});

it('группа аватаров: лишние — плашкой +N, у всех обводка', () => {
  const { container, unmount } = render(
    <AvatarGroup max={2} aria-label="Друзья">
      <Avatar alt="А Б" />
      <Avatar alt="В Г" />
      <Avatar alt="Д Е" />
      <Avatar alt="Ж З" />
    </AvatarGroup>,
  );
  const group = container.querySelector('[role="group"]')!;
  expect(group.getAttribute('aria-label')).toBe('Друзья');
  expect(group.querySelectorAll('[role="img"]')).toHaveLength(2);
  expect(group.textContent).toContain('+2');
  expect(group.querySelectorAll('.p-0\\.5')).toHaveLength(3);
  unmount();
});

it('вкладки-сегменты: сегменты rounded-md по правилу, выбор нажатием', () => {
  const onValueChange = jest.fn();
  const { container, unmount } = render(
    <Tabs defaultValue="a" onValueChange={onValueChange}>
      <TabsList aria-label="Раздел">
        <TabsTrigger value="a">Моды</TabsTrigger>
        <TabsTrigger value="b" icon={Dot}>
          Карты
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Список модов</TabsContent>
      <TabsContent value="b">Список карт</TabsContent>
    </Tabs>,
  );
  const list = container.querySelector('[role="tablist"]')!;
  expect(list.className).toContain('rounded-lg');
  expect(list.getAttribute('aria-label')).toBe('Раздел');
  const [a, b] = Array.from(container.querySelectorAll('[role="tab"]'));
  // rounded-lg (8) − p-0.5 (2) = 6
  expect(a.className).toContain('rounded-md');
  expect(a.getAttribute('aria-selected')).toBe('true');
  expect(
    container.querySelector('[role="tabpanel"]:not([hidden])')!.textContent,
  ).toBe('Список модов');
  press(b);
  expect(onValueChange).toHaveBeenCalledWith('b');
  expect(b.getAttribute('aria-selected')).toBe('true');
  expect(
    container.querySelector('[role="tabpanel"]:not([hidden])')!.textContent,
  ).toBe('Список карт');
  unmount();
});

it('вкладки-подчёркивание: полоса встаёт под выбранной transform', async () => {
  // jsdom не считает раскладку: место вкладки — из data-place
  const proto = HTMLElement.prototype;
  const left = Object.getOwnPropertyDescriptor(proto, 'offsetLeft')!;
  const width = Object.getOwnPropertyDescriptor(proto, 'offsetWidth')!;
  const place = (el: HTMLElement, i: number) =>
    Number(el.dataset.place?.split(':')[i] ?? 0);
  Object.defineProperty(proto, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      return place(this, 0);
    },
  });
  Object.defineProperty(proto, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return place(this, 1);
    },
  });
  try {
    const { container, unmount } = render(
      <Tabs defaultValue="a">
        <TabsList variant="underline">
          <TabsTrigger value="a" data-place="0:60">
            Обзор
          </TabsTrigger>
          <TabsTrigger value="b" data-place="64:80">
            Версии
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const list = container.querySelector('[role="tablist"]')!;
    expect(list.className).toContain('border-b');
    const bar = list.querySelector<HTMLElement>('span[aria-hidden]')!;
    expect(bar.style.transform).toBe('translateX(0px) scaleX(60)');
    press(container.querySelectorAll('[role="tab"]')[1]);
    // Смена data-state доходит до полосы через MutationObserver — после микрозадачи
    await act(async () => {});
    expect(bar.style.transform).toBe('translateX(64px) scaleX(80)');
    unmount();
  } finally {
    Object.defineProperty(proto, 'offsetLeft', left);
    Object.defineProperty(proto, 'offsetWidth', width);
  }
});

it('вертикальные вкладки: ориентация для стрелок, плашка иконки rounded-sm', () => {
  const { container, unmount } = render(
    <Tabs defaultValue="a">
      <TabsList orientation="vertical">
        <TabsTrigger value="a" icon={Dot}>
          Главная
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a">Главная</TabsContent>
    </Tabs>,
  );
  const list = container.querySelector('[role="tablist"]')!;
  expect(list.getAttribute('aria-orientation')).toBe('vertical');
  const tab = container.querySelector('[role="tab"]')!;
  expect(tab.className).toContain('rounded-lg');
  // rounded-lg (8) − p-1 (4) = 4
  const plate = tab.querySelector('[data-icon]')!.parentElement!;
  expect(plate.className).toContain('rounded-sm');
  expect(container.querySelector('[role="tabpanel"]')!.className).toContain(
    'flex-1',
  );
  unmount();
});

it('аккордеон-карточка: заголовки rounded-lg, пункт раскрывается', () => {
  const { container, unmount } = render(
    <Accordion type="single" collapsible variant="card">
      <AccordionItem value="a">
        <AccordionTrigger>Что такое сборка?</AccordionTrigger>
        <AccordionContent>Набор модов и настроек</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
  const trigger = container.querySelector('button')!;
  // rounded-xl (12) − p-1 (4) = 8
  expect(trigger.className).toContain('rounded-lg');
  expect(trigger.firstElementChild!.className).toContain('rounded-lg');
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(container.textContent).not.toContain('Набор модов');
  press(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(container.textContent).toContain('Набор модов');
  press(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  unmount();
});

it('раскрывающийся блок: шеврон поворачивается, содержимое с forceMount скрыто', () => {
  const onOpenChange = jest.fn();
  const { container, unmount } = render(
    <Collapsible onOpenChange={onOpenChange}>
      <CollapsibleTrigger icon={Dot}>Дополнительно</CollapsibleTrigger>
      <CollapsibleContent forceMount>Параметры JVM</CollapsibleContent>
    </Collapsible>,
  );
  const trigger = container.querySelector('button')!;
  expect(trigger.className).toContain('rounded-md');
  const panel = container.querySelector('p')!.parentElement!;
  expect(panel.getAttribute('data-state')).toBe('closed');
  expect(panel.className).toContain('data-[state=closed]:hidden');
  press(trigger);
  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  expect(trigger.getAttribute('data-state')).toBe('open');
  expect(panel.getAttribute('data-state')).toBe('open');
  unmount();
});

it('триггер с asChild отдаёт нажатие своей кнопке', () => {
  const { container, unmount } = render(
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="secondary">Ещё</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>Скрытое</CollapsibleContent>
    </Collapsible>,
  );
  const button = container.querySelector('button')!;
  expect(button.className).toContain('bg-mist-200');
  press(button);
  expect(container.textContent).toContain('Скрытое');
  unmount();
});
