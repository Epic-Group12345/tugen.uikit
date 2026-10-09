import React from 'react';
import { Button, IconButton, Text } from '../../../src/web';
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
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../src/web/dialog';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../src/web/hover-card';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverRow,
  PopoverTrigger,
} from '../../../src/web/popover';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from '../../../src/web/sheet';
import { toast, Toaster } from '../../../src/web/toast';
import {
  Tip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../src/web/tooltip';
import { Block, Dot, Line } from './shared';

const SIDES: { side: SheetSide; label: string }[] = [
  { side: 'right', label: 'Шторка справа' },
  { side: 'left', label: 'Слева' },
  { side: 'bottom', label: 'Снизу' },
];

export const Overlays: React.FC = () => (
  <>
    <Block title="Окна">
      <Line>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Окно</Button>
          </DialogTrigger>
          <DialogContent showClose>
            <DialogHeader>
              <DialogTitle>Новая сборка</DialogTitle>
              <DialogDescription>
                Выберите версию игры и загрузчик модов
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              Сборка появится в библиотеке, а файлы скачаются при первом
              запуске.
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Отмена</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Создать</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="danger">Удалить сборку</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-full max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить «Выживание»?</AlertDialogTitle>
              <AlertDialogDescription>
                Миры и настройки сборки будут удалены без возможности
                восстановления.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction variant="danger">Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {SIDES.map(({ side, label }) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="outline">{label}</Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
                <SheetDescription>
                  Какие сборки показывать в библиотеке
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className="pt-4">
                <SheetClose asChild>
                  <Button variant="secondary">Сбросить</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>Применить</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </Line>
    </Block>
    <Block title="Всплывающие карточки">
      <Line>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">Поповер</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <PopoverBody title="Fabric 0.16.9">
              <PopoverRow label="Версия игры" value="1.21.4" />
              <PopoverRow label="Модов" value="42" />
            </PopoverBody>
            <Button variant="secondary" grow>
              Открыть папку
            </Button>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">Текстом</Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            Строка становится абзацем с отступом от края карточки.
          </PopoverContent>
        </Popover>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost">Наведите: Steve</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="flex flex-row items-center gap-3 px-2.5 py-2">
              <div className="h-10 w-10 shrink-0 rounded-full bg-green-600" />
              <div className="flex flex-col gap-0.5">
                <Text weight="semibold">Steve</Text>
                <Text size="xs" tone="success">
                  В игре · Выживание
                </Text>
              </div>
            </div>
            <Button variant="secondary" grow>
              Присоединиться
            </Button>
          </HoverCardContent>
        </HoverCard>
      </Line>
    </Block>
    <Block title="Подсказки">
      <Line>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Наведите</Button>
          </TooltipTrigger>
          <TooltipContent>Подсказка сверху</TooltipContent>
        </Tooltip>
        <Tip label="Настройки" side="bottom">
          <IconButton icon={Dot} aria-label="Настройки" />
        </Tip>
      </Line>
    </Block>
    <Block title="Уведомления">
      <Line>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              title: 'Сборка установлена',
              description: 'Fabric 1.21.4 готова к запуску',
              tone: 'success',
              icon: Dot,
              action: { label: 'Играть', onPress: () => {} },
            })
          }
        >
          Успех
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              title: 'Не удалось скачать файлы',
              description: 'Проверьте подключение к интернету',
              tone: 'danger',
              icon: Dot,
            })
          }
        >
          Ошибка
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast({ title: 'Друг в игре', duration: Infinity })}
        >
          Без автозакрытия
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Закрыть все
        </Button>
      </Line>
      <Toaster />
    </Block>
  </>
);
