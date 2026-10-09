import { Alert } from '@tugen/uikit/web';
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert icon={Info} title="Доступно обновление">
        TUGEN 1.4 исправляет запуск сборок на Fabric.
      </Alert>
      <Alert tone="success" icon={CircleCheck} title="Сборка установлена">
        «Выживание 1.21» готова к запуску.
      </Alert>
      <Alert tone="warning" icon={TriangleAlert} title="Мод несовместим">
        Sodium 0.5 не работает с Minecraft 1.21. Обновите его или отключите.
      </Alert>
      <Alert tone="danger" icon={CircleX} title="Не удалось запустить игру">
        Java завершилась с кодом 1. Подробности — в журнале.
      </Alert>
    </div>
  );
}
