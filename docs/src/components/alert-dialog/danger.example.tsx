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
  Icons,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger" icon={Icons.TrashBin}>
          Удалить сборку
        </Button>
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
  );
}
