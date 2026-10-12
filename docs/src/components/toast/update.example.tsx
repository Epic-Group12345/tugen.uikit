import { Button, Icons, toast } from '@tugen/uikit/web';

export default function Example() {
  const install = () => {
    const id = toast({
      title: 'Скачивание сборки',
      description: 'Осталось 120 МБ',
      icon: Icons.ArrowDownToLine,
      duration: Infinity,
    });
    setTimeout(() => {
      toast({
        id,
        title: 'Сборка установлена',
        tone: 'success',
        icon: Icons.CircleCheck,
        action: { label: 'Играть', onPress: () => {} },
      });
    }, 2000);
  };

  return (
    <Button icon={Icons.ArrowDownToLine} onClick={install}>
      Установить
    </Button>
  );
}
