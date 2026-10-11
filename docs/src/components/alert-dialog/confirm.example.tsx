import { useState } from 'react';
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
  Text,
} from '@tugen/uikit/web';

export default function Example() {
  const [version, setVersion] = useState('1.20.1');
  return (
    <div className="flex flex-col items-center gap-3">
      <Text tone="secondary">Версия сборки: {version}</Text>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" disabled={version === '1.21.4'}>
            Обновить до 1.21.4
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-full max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Обновить сборку до 1.21.4?</AlertDialogTitle>
            <AlertDialogDescription>
              Три мода ещё не вышли для этой версии и будут выключены. Миры
              откроются в новой версии.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Не сейчас</AlertDialogCancel>
            <AlertDialogAction onClick={() => setVersion('1.21.4')}>
              Обновить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
