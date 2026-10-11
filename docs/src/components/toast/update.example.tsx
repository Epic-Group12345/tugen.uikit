import { Button, toast } from '@tugen/uikit/web';
import { CircleCheck, Download } from 'lucide-react';

export default function Example() {
  const install = () => {
    const id = toast({
      title: 'Скачивание сборки',
      description: 'Осталось 120 МБ',
      icon: Download,
      duration: Infinity,
    });
    setTimeout(() => {
      toast({
        id,
        title: 'Сборка установлена',
        tone: 'success',
        icon: CircleCheck,
        action: { label: 'Играть', onPress: () => {} },
      });
    }, 2000);
  };

  return (
    <Button icon={Download} onClick={install}>
      Установить
    </Button>
  );
}
