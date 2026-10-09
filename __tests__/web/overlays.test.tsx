import React, { act } from 'react';
import { Button } from '../../src/web/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../src/web/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../src/web/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '../../src/web/popover';
import { dismissPopup, PopupHost } from '../../src/web/popup';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '../../src/web/sheet';
import { toast, Toaster } from '../../src/web/toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../src/web/tooltip';
import { key, press, render } from './support/render';

const byText = (text: string) =>
  Array.from(document.body.querySelectorAll('button')).find(
    b => b.textContent === text,
  )!;

afterEach(() => {
  act(() => toast.dismiss());
});

it('окно открывается кнопкой, кнопки у края — rounded-lg, крестик и Escape закрывают', () => {
  const { unmount } = render(
    <Dialog>
      <DialogTrigger asChild>
        <Button>Открыть</Button>
      </DialogTrigger>
      <DialogContent showClose closeLabel="Закрыть окно">
        <DialogHeader>
          <DialogTitle>Удалить сборку?</DialogTitle>
          <DialogDescription>Файлы будут удалены</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Ок</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>,
  );
  press(byText('Открыть'));
  const dialog = document.body.querySelector('[role="dialog"]')!;
  expect(dialog).not.toBeNull();
  expect(dialog.className).toContain('rounded-2xl');
  expect(dialog.className).toContain('max-w-lg');
  // Заголовок подписывает окно
  const title = document.getElementById(
    dialog.getAttribute('aria-labelledby')!,
  )!;
  expect(title.textContent).toBe('Удалить сборку?');
  expect(title.tagName).toBe('H2');
  // rounded-2xl (16) − p-2 (8) → 8 = rounded-lg у кнопки и у крестика
  expect(byText('Ок').className).toContain('rounded-lg');
  const close = dialog.querySelector('[aria-label="Закрыть окно"]')!;
  expect(close.className).toContain('rounded-lg');
  press(close);
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();

  press(byText('Открыть'));
  key(document.body.querySelector('[role="dialog"]')!, 'Escape');
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  unmount();
});

it('подтверждение: роль alertdialog, действие зовёт onClick и закрывает', () => {
  const onClick = jest.fn();
  const { unmount } = render(
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Удалить</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить?</AlertDialogTitle>
          <AlertDialogDescription>Нельзя отменить</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={onClick}>
            Да
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  );
  press(byText('Удалить'));
  expect(document.body.querySelector('[role="alertdialog"]')).not.toBeNull();
  expect(byText('Отмена').className).toContain('bg-mist-200');
  expect(byText('Отмена').className).toContain('rounded-lg');
  const yes = byText('Да');
  expect(yes.className).toContain('bg-red-600');
  press(yes);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(document.body.querySelector('[role="alertdialog"]')).toBeNull();
  unmount();
});

it('шторка прилегает к краю: скруглены внутренние углы, кнопки — rounded-lg', () => {
  const { unmount } = render(
    <Sheet>
      <SheetTrigger asChild>
        <Button>Фильтры</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>Фильтры</SheetTitle>
        <SheetFooter>
          <Button>Применить</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>,
  );
  press(byText('Фильтры'));
  const panel = document.body.querySelector('[role="dialog"]')!;
  expect(panel.className).toContain('rounded-r-2xl');
  expect(panel.className).toContain('left-0');
  expect(panel.className).toContain('w-80');
  expect(byText('Применить').className).toContain('rounded-lg');
  unmount();
});

it('поповер: строка — абзацем, кнопка у края — rounded-lg, dismissPopup закрывает', () => {
  const { unmount } = render(
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Подробнее</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Сведения">
          <Button>Внутри</Button>
        </PopoverContent>
      </Popover>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button>Текст</Button>
        </PopoverTrigger>
        <PopoverContent>Короткое пояснение</PopoverContent>
      </Popover>
      <PopupHost />
    </>,
  );
  expect(document.body.textContent).toContain('Короткое пояснение');
  press(byText('Подробнее'));
  const trigger = byText('Подробнее');
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  const card = document.body.querySelector('[aria-label="Сведения"]')!;
  // rounded-xl (12) − p-1 (4) → 8
  expect(card.className).toContain('rounded-xl');
  expect(byText('Внутри').className).toContain('rounded-lg');
  let closed = false;
  act(() => {
    closed = dismissPopup();
  });
  expect(closed).toBe(true);
  expect(document.body.querySelector('[aria-label="Сведения"]')).toBeNull();
  unmount();
});

it('подсказка и карточка при наведении: открытые рисуются с оформлением kit', () => {
  const { unmount } = render(
    <>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button>Настройки</Button>
        </TooltipTrigger>
        <TooltipContent>Открыть настройки</TooltipContent>
      </Tooltip>
      <HoverCard open>
        <HoverCardTrigger asChild>
          <Button>Steve</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <Button>Профиль</Button>
        </HoverCardContent>
      </HoverCard>
    </>,
  );
  const tip = document.body.querySelector('[role="tooltip"]')!;
  expect(tip.textContent).toBe('Открыть настройки');
  const plate = document.body.querySelector('.bg-mist-950')!;
  expect(plate.className).toContain('rounded-lg');
  expect(byText('Профиль').className).toContain('rounded-lg');
  expect(byText('Профиль').closest('.w-64')!.className).toContain('rounded-xl');
  unmount();
});

it('toast(): показывает, обновляет по id, действие закрывает уведомление', () => {
  const onPress = jest.fn();
  const { unmount } = render(<Toaster />);
  act(() => {
    toast({ id: 'install', title: 'Установка…', duration: Infinity });
  });
  expect(document.body.querySelector('[role="status"]')!.textContent).toContain(
    'Установка…',
  );
  act(() => {
    toast({
      id: 'install',
      title: 'Сборка установлена',
      tone: 'danger',
      duration: Infinity,
      action: { label: 'Играть', onPress },
    });
  });
  expect(document.body.querySelectorAll('[role="alert"]').length).toBe(1);
  expect(document.body.querySelector('[role="status"]')).toBeNull();
  // rounded-2xl (16) − p-2 (8) → кнопка 8
  const play = byText('Играть');
  expect(play.className).toContain('rounded-lg');
  press(play);
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(document.body.querySelector('[role="alert"]')).toBeNull();
  unmount();
});

it('toast(): закрывается сам и крестиком, видно не больше max', () => {
  jest.useFakeTimers();
  const { unmount } = render(<Toaster max={2} closeLabel="Закрыть" />);
  act(() => {
    toast({ title: 'Первое', duration: Infinity });
    toast({ title: 'Второе', duration: Infinity });
    toast({ title: 'Третье' });
  });
  const cards = () =>
    Array.from(document.body.querySelectorAll('[role="status"]'));
  const titles = () => cards().map(c => c.querySelector('span')!.textContent);
  expect(titles()).toEqual(['Второе', 'Третье']);
  act(() => {
    jest.advanceTimersByTime(4000);
  });
  expect(titles()).toEqual(['Первое', 'Второе']);
  press(cards()[1].querySelector('[aria-label="Закрыть"]')!);
  expect(titles()).toEqual(['Первое']);
  jest.useRealTimers();
  unmount();
});
