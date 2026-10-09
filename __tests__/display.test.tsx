import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  AvatarGroup,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Divider,
  KbdCombo,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  toast,
} from '../src';
import { classOf, classesOf, press, render, tick } from './support/render';

const tabs = (variant: 'segmented' | 'underline' = 'segmented') => (
  <Tabs defaultValue="mods">
    <TabsList variant={variant}>
      <TabsTrigger value="mods">Моды</TabsTrigger>
      <TabsTrigger value="worlds">Миры</TabsTrigger>
    </TabsList>
    <TabsContent value="mods">Список модов</TabsContent>
    <TabsContent value="worlds">Список миров</TabsContent>
  </Tabs>
);

describe('Tabs', () => {
  it('переключает содержимое и aria-selected', async () => {
    const { container, unmount } = render(tabs());
    const triggers = container.querySelectorAll('[role="tab"]');
    expect(triggers).toHaveLength(2);
    expect(triggers[0]!.getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Список модов');
    expect(container.textContent).not.toContain('Список миров');
    press(triggers[1]!);
    await tick();
    expect(triggers[1]!.getAttribute('aria-selected')).toBe('true');
    expect(triggers[0]!.getAttribute('aria-selected')).toBe('false');
    expect(container.textContent).toContain('Список миров');
    expect(container.textContent).not.toContain('Список модов');
    unmount();
  });

  it('segmented: дорожка rounded-lg p-0.5, сегменты rounded-md по правилу радиусов', () => {
    const { container, unmount } = render(tabs());
    const list = container.querySelector('[role="tablist"]')!;
    expect(classOf(list)).toContain('rounded-lg');
    expect(classOf(list)).toContain('p-0.5');
    const trigger = container.querySelector('[role="tab"]')!;
    expect(classesOf(trigger)).toContain('rounded-md');
    expect(classesOf(trigger)).not.toContain('rounded-lg');
    unmount();
  });

  it('underline и вертикальный список рисуются', () => {
    const { container, unmount } = render(
      <>
        {tabs('underline')}
        <Tabs defaultValue="a">
          <TabsList orientation="vertical">
            <TabsTrigger value="a">Главная</TabsTrigger>
          </TabsList>
        </Tabs>
      </>,
    );
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(3);
    const vertical = container.querySelectorAll('[role="tab"]')[2]!;
    expect(classesOf(vertical)).toContain('rounded-lg');
    unmount();
  });
});

describe('Accordion и Collapsible', () => {
  it('Accordion раскрывает пункт и aria-expanded', async () => {
    const { container, unmount } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Что такое сборка?</AccordionTrigger>
          <AccordionContent>Набор модов и версия игры</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(container.textContent).not.toContain('Набор модов');
    const trigger = container.querySelector('[role="button"][aria-expanded]')!;
    press(trigger);
    await tick();
    expect(container.textContent).toContain('Набор модов');
    expect(
      container.querySelector('[role="button"][aria-expanded="true"]'),
    ).not.toBeNull();
    unmount();
  });

  it('Accordion card: заголовки у края карточки rounded-lg', () => {
    const { container, unmount } = render(
      <Accordion type="multiple" variant="card">
        <AccordionItem value="a">
          <AccordionTrigger>Пункт</AccordionTrigger>
        </AccordionItem>
      </Accordion>,
    );
    expect(classesOf(container)).toContain('rounded-xl');
    const trigger = container.querySelector('[role="button"]')!;
    expect(classesOf(trigger)).toContain('rounded-lg');
    unmount();
  });

  it('Collapsible открывается по кнопке', async () => {
    const { container, unmount } = render(
      <Collapsible>
        <CollapsibleTrigger>Подробнее</CollapsibleTrigger>
        <CollapsibleContent>Скрытый текст</CollapsibleContent>
      </Collapsible>,
    );
    expect(container.textContent).not.toContain('Скрытый текст');
    press(container.querySelector('[role="button"]'));
    await tick();
    expect(container.textContent).toContain('Скрытый текст');
    unmount();
  });
});

describe('Avatar', () => {
  it('без картинки показывает инициалы', () => {
    const { container, unmount } = render(
      <Avatar alt="Алекс Стив" status="online" />,
    );
    expect(container.textContent).toContain('АС');
    expect(container.querySelector('[aria-label="Алекс Стив"]')).not.toBeNull();
    expect(classesOf(container)).toContain('bg-green-500');
    unmount();
  });

  it('группа: обводка вокруг квадратного аватара — радиус + толщина', () => {
    const { container, unmount } = render(
      <AvatarGroup shape="rounded" size="md" max={2}>
        <Avatar alt="А" />
        <Avatar alt="Б" />
        <Avatar alt="В" />
      </AvatarGroup>,
    );
    const html = classesOf(container);
    // Аватар md — rounded-md (6), обводка p-0.5 — rounded-lg (6 + 2 = 8)
    expect(html).toContain('rounded-md');
    expect(html).toMatch(/p-0\.5 [^ ]*bg-mist-50 dark:bg-mist-950 rounded-lg/);
    expect(container.textContent).toContain('+1');
    unmount();
  });
});

describe('Progress', () => {
  it('выставляет aria-valuenow', () => {
    const { container, unmount } = render(<Progress value={40} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('40');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
    expect(classOf(bar)).toContain('h-1.5');
    unmount();
  });

  it('значение вне диапазона прижимается к краю', () => {
    const { container, unmount } = render(<Progress value={140} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
    unmount();
  });
});

describe('Toast', () => {
  it('toast() показывает уведомление, dismiss убирает', async () => {
    const { container, unmount } = render(<Toaster closeLabel="Закрыть" />);
    let id = '';
    await tick(0);
    React.act(() => {
      id = toast({ title: 'Сборка установлена', description: 'Можно играть' });
    });
    expect(container.textContent).toContain('Сборка установлена');
    expect(classesOf(container)).toContain('rounded-2xl');
    React.act(() => toast.dismiss(id));
    expect(container.textContent).not.toContain('Сборка установлена');
    unmount();
  });

  it('кнопка действия — rounded-lg по правилу радиусов, нажатие закрывает', async () => {
    const onPress = jest.fn();
    const { container, unmount } = render(<Toaster closeLabel="Закрыть" />);
    React.act(() => {
      toast({ title: 'Друг в игре', action: { label: 'Открыть', onPress } });
    });
    const buttons = [...container.querySelectorAll('[role="button"]')];
    const action = buttons.find(b => b.textContent === 'Открыть')!;
    expect(classesOf(action)).toContain('rounded-lg');
    press(action);
    expect(onPress).toHaveBeenCalled();
    expect(container.textContent).not.toContain('Друг в игре');
    unmount();
  });

  it('закрывается по таймеру', async () => {
    const { container, unmount } = render(<Toaster />);
    React.act(() => {
      toast({ title: 'Скоро исчезнет', duration: 30 });
    });
    expect(container.textContent).toContain('Скоро исчезнет');
    await tick(80);
    expect(container.textContent).not.toContain('Скоро исчезнет');
    unmount();
  });
});

describe('Alert, Kbd, Divider', () => {
  it('Alert рисует заголовок, действие получает rounded-lg', () => {
    const { container, unmount } = render(
      <Alert
        tone="warning"
        title="Нет связи"
        action={<Button variant="secondary">Повторить</Button>}
      >
        Проверьте интернет
      </Alert>,
    );
    expect(container.textContent).toContain('Нет связи');
    expect(container.textContent).toContain('Проверьте интернет');
    const alert = container.querySelector('[role="alert"]')!;
    expect(classOf(alert)).toContain('rounded-xl');
    expect(classOf(alert)).toContain('bg-amber-500/15');
    const button = container.querySelector('[role="button"]')!;
    expect(classesOf(button)).toContain('rounded-lg');
    unmount();
  });

  it('KbdCombo рисует клавиши через +', () => {
    const { container, unmount } = render(<KbdCombo keys={['Ctrl', 'K']} />);
    expect(container.textContent).toBe('Ctrl+K');
    expect(classesOf(container)).toContain('border-b-2');
    unmount();
  });

  it('Divider vertical', () => {
    const { container, unmount } = render(
      <Divider orientation="vertical" decorative={false} />,
    );
    const line = container.querySelector('[aria-orientation="vertical"]')!;
    expect(line).not.toBeNull();
    expect(classOf(line)).toContain('w-px');
    unmount();
  });
});
