import { Button, Icons, toast } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button
        onClick={() =>
          toast({
            title: 'Алекс в игре',
            description: 'Сервер «Остров», 3 игрока',
            icon: Icons.Person,
            action: { label: 'Войти', onPress: () => {} },
            duration: Infinity,
          })
        }
      >
        Друг в игре
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        Закрыть все
      </Button>
    </div>
  );
}
