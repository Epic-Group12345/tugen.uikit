import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Новая сборка</Button>
      </DialogTrigger>
      <DialogContent showClose>
        <DialogHeader>
          <DialogTitle>Новая сборка</DialogTitle>
          <DialogDescription>
            Выберите версию игры и загрузчик модов
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          Сборка появится в библиотеке, а файлы скачаются при первом запуске.
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
  );
}
