import { Alert, Icons } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Alert icon={Icons.CircleInfo} title="Доступно обновление">
        TUGEN 1.4 исправляет запуск сборок на Fabric.
      </Alert>
      <Alert tone="success" icon={Icons.CircleCheck} title="Сборка установлена">
        «Выживание 1.21» готова к запуску.
      </Alert>
      <Alert
        tone="warning"
        icon={Icons.TriangleExclamation}
        title="Мод несовместим"
      >
        Sodium 0.5 не работает с Minecraft 1.21. Обновите его или отключите.
      </Alert>
      <Alert
        tone="danger"
        icon={Icons.CircleXmark}
        title="Не удалось запустить игру"
      >
        Java завершилась с кодом 1. Подробности — в журнале.
      </Alert>
    </div>
  );
}
