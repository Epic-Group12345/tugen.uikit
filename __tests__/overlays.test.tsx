import React, { act } from 'react';
import { Text } from 'react-native';
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
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Tip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  dismissPopup,
  useRadiusScope,
} from '../src';
import { classOf, classesOf, press, render, tick } from './support/render';

// Окна закрываются с анимацией выхода — ждём дольше её
const CLOSE_WAIT = 400;

/** Показывает радиус и отступ ближайшего RadiusScope */
const ScopeProbe: React.FC = () => {
  const scope = useRadiusScope();
  return (
    <Text>{scope ? `scope:${scope.radius}/${scope.padding}` : 'none'}</Text>
  );
};

const dialog = (
  <Dialog>
    <DialogTrigger>
      <Text>Открыть</Text>
    </DialogTrigger>
    <DialogContent showClose closeLabel="Закрыть">
      <DialogHeader>
        <DialogTitle>Удалить сборку?</DialogTitle>
      </DialogHeader>
      <DialogBody>Сборка будет удалена</DialogBody>
      <DialogFooter>
        <ScopeProbe />
        <DialogClose asChild>
          <Button variant="secondary">Отмена</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

it('Dialog открывается по кнопке и закрывается dismissPopup()', async () => {
  const { container, unmount } = render(dialog);
  expect(container.textContent).not.toContain('Сборка будет удалена');
  press(container.querySelector('[role="button"]'));
  await tick();
  expect(container.textContent).toContain('Сборка будет удалена');
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  act(() => {
    dismissPopup();
  });
  await tick(CLOSE_WAIT);
  expect(container.textContent).not.toContain('Сборка будет удалена');
  unmount();
});

it('Dialog закрывается кнопкой DialogClose и крестиком', async () => {
  const { container, unmount } = render(dialog);
  press(container.querySelector('[role="button"]'));
  await tick();
  const cancel = [...container.querySelectorAll('[role="button"]')].find(
    el => el.textContent === 'Отмена',
  );
  press(cancel ?? null);
  await tick(CLOSE_WAIT);
  expect(container.textContent).not.toContain('Сборка будет удалена');

  press(container.querySelector('[role="button"]'));
  await tick();
  press(container.querySelector('[aria-label="Закрыть"]'));
  await tick(CLOSE_WAIT);
  expect(container.textContent).not.toContain('Сборка будет удалена');
  unmount();
});

it('окно Dialog — rounded-2xl p-2, кнопки в DialogFooter — rounded-lg по правилу', async () => {
  const { container, unmount } = render(dialog);
  press(container.querySelector('[role="button"]'));
  await tick();
  const win = container.querySelector('[role="dialog"]')!;
  const classes = classesOf(win);
  expect(classes).toContain('rounded-2xl');
  expect(classes).toContain('p-2');
  expect(classes).toContain('max-w-lg');
  // Окно объявляет 16 / 8 — вложенным достаётся 8
  expect(container.textContent).toContain('scope:16/8');
  const cancel = [...win.querySelectorAll('[role="button"]')].find(
    el => el.textContent === 'Отмена',
  )!;
  expect(classesOf(cancel)).toContain('rounded-lg');
  expect(classesOf(cancel)).not.toContain('rounded-2xl');
  unmount();
});

it('AlertDialog не закрывается нажатием на затемнение, закрывается кнопкой', async () => {
  const onAction = jest.fn();
  const { container, unmount } = render(
    <AlertDialog>
      <AlertDialogTrigger>
        <Text>Удалить</Text>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Точно удалить?</AlertDialogTitle>
          <AlertDialogDescription>Это нельзя отменить</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction variant="danger" onPress={onAction}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  );
  press(container.querySelector('[role="button"]'));
  await tick();
  const alert = container.querySelector('[role="alertdialog"]')!;
  expect(alert).not.toBeNull();
  // Затемнение — первый слой перед окном: нажатие по нему ничего не делает
  const overlay = [...container.querySelectorAll('[data-class]')].find(el =>
    classOf(el).includes('bg-mist-950/50'),
  )!;
  expect(overlay).toBeDefined();
  press(overlay);
  await tick(CLOSE_WAIT);
  expect(container.textContent).toContain('Это нельзя отменить');

  const action = [...alert.querySelectorAll('[role="button"]')].find(
    el => el.textContent === 'Удалить',
  )!;
  expect(classesOf(action)).toContain('rounded-lg');
  press(action);
  await tick(CLOSE_WAIT);
  expect(onAction).toHaveBeenCalledTimes(1);
  expect(container.textContent).not.toContain('Это нельзя отменить');
  unmount();
});

it('Dialog закрывается нажатием на затемнение', async () => {
  const { container, unmount } = render(dialog);
  press(container.querySelector('[role="button"]'));
  await tick();
  const overlay = [...container.querySelectorAll('[data-class]')].find(el =>
    classOf(el).includes('bg-mist-950/50'),
  )!;
  press(overlay);
  await tick(CLOSE_WAIT);
  expect(container.textContent).not.toContain('Сборка будет удалена');
  unmount();
});

it('Sheet открывается у края со скруглёнными внутренними углами', async () => {
  const { container, unmount } = render(
    <Sheet>
      <SheetTrigger>
        <Text>Фильтры</Text>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>Фильтры сборок</SheetTitle>
        <ScopeProbe />
      </SheetContent>
    </Sheet>,
  );
  expect(container.textContent).not.toContain('Фильтры сборок');
  press(container.querySelector('[role="button"]'));
  await tick();
  expect(container.textContent).toContain('Фильтры сборок');
  const panel = container.querySelector('[role="dialog"]')!;
  expect(classesOf(panel)).toContain('rounded-l-2xl');
  expect(container.textContent).toContain('scope:16/8');
  act(() => {
    dismissPopup();
  });
  await tick(CLOSE_WAIT);
  expect(container.textContent).not.toContain('Фильтры сборок');
  unmount();
});

it('Tooltip показывает текст тёмной плашкой', async () => {
  const { container, unmount } = render(
    <Tooltip>
      <TooltipTrigger>
        <Text>?</Text>
      </TooltipTrigger>
      <TooltipContent>Подсказка</TooltipContent>
    </Tooltip>,
  );
  expect(container.textContent).not.toContain('Подсказка');
  press(container.querySelector('[role="button"]'));
  await tick();
  expect(container.textContent).toContain('Подсказка');
  const tip = container.querySelector('[role="tooltip"]')!;
  expect(classesOf(tip)).toContain('rounded-lg px-2 py-1');
  expect(classesOf(tip)).toContain('bg-mist-950');
  act(() => {
    dismissPopup();
  });
  await tick();
  expect(container.textContent).not.toContain('Подсказка');
  unmount();
});

it('HoverCard — rounded-xl p-1 и открывается нажатием на касание', async () => {
  const { container, unmount } = render(
    <HoverCard>
      <HoverCardTrigger>
        <Text>Ник</Text>
      </HoverCardTrigger>
      <HoverCardContent>
        <ScopeProbe />
      </HoverCardContent>
    </HoverCard>,
  );
  press(container.querySelector('[role="button"]'));
  await tick();
  expect(container.textContent).toContain('scope:12/4');
  act(() => {
    dismissPopup();
  });
  await tick();
  expect(container.textContent).not.toContain('scope:12/4');
  unmount();
});

it('Tip открывается наведением с задержкой и не перехватывает нажатие кнопки', async () => {
  const onPress = jest.fn();
  const { container, unmount } = render(
    <Tip label="Настройки" delay={100}>
      <Button onPress={onPress}>Шестерёнка</Button>
    </Tip>,
  );
  const button = [...container.querySelectorAll('[role="button"]')].find(
    el => el.textContent === 'Шестерёнка',
  )!;
  act(() => {
    // Наведение в react-native-web без PointerEvent — mouseenter (не всплывает): на обёртку Tip
    button.parentElement!.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: false }),
    );
  });
  expect(container.textContent).not.toContain('Настройки');
  await tick(200);
  expect(container.textContent).toContain('Настройки');
  // Нажатие целиком: el.click() не даёт onPressIn — без него подсказка не знает о нажатии
  act(() => {
    button.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    button.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  });
  press(button);
  await tick();
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(container.textContent).not.toContain('Настройки');
  unmount();
});
