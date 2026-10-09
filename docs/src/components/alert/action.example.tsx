import { Alert, Button, IconButton } from '@tugen/uikit/web';
import { Download, WifiOff, X } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert
        tone="danger"
        icon={WifiOff}
        title="Нет связи с сервером"
        action={<Button variant="secondary">Повторить</Button>}
      >
        Проверьте подключение к интернету.
      </Alert>
      <Alert
        icon={Download}
        title="Доступна версия 1.4"
        action={
          <>
            <Button>Обновить</Button>
            <IconButton icon={X} aria-label="Скрыть" />
          </>
        }
      />
    </div>
  );
}
