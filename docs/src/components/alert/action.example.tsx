import { Alert, Button, IconButton, Icons } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert
        tone="danger"
        icon={Icons.CloudSlash}
        title="Нет связи с сервером"
        action={<Button variant="secondary">Повторить</Button>}
      >
        Проверьте подключение к интернету.
      </Alert>
      <Alert
        icon={Icons.ArrowDownToLine}
        title="Доступна версия 1.4"
        action={
          <>
            <Button>Обновить</Button>
            <IconButton icon={Icons.Xmark} aria-label="Скрыть" />
          </>
        }
      />
    </div>
  );
}
