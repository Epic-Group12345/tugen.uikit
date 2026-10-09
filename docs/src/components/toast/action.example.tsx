import { Button, toast } from '@tugen/uikit/web';
import { UserRound } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button
        onClick={() =>
          toast({
            title: 'Алекс в игре',
            description: 'Сервер «Остров», 3 игрока',
            icon: UserRound,
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
