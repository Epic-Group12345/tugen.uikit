import { Button, toast } from '@tugen/uikit/web';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Сборка установлена',
            description: 'Fabric 1.21.4 готова к запуску',
            tone: 'success',
            icon: CircleCheck,
          })
        }
      >
        Успех
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Доступно обновление',
            description: 'Sodium 0.6.5 для вашей сборки',
            tone: 'info',
            icon: Info,
          })
        }
      >
        Сведения
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Мало памяти',
            description: 'Сборке выделено меньше 2 ГБ',
            tone: 'warning',
            icon: TriangleAlert,
          })
        }
      >
        Предупреждение
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Не удалось скачать файлы',
            description: 'Проверьте подключение к интернету',
            tone: 'danger',
            icon: CircleAlert,
          })
        }
      >
        Ошибка
      </Button>
    </div>
  );
}
