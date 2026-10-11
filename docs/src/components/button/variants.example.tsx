import { Button } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button>Сохранить</Button>
      <Button variant="play">Играть</Button>
      <Button variant="secondary">Отмена</Button>
      <Button variant="outline">Подробнее</Button>
      <Button variant="ghost">Пропустить</Button>
      <Button variant="danger">Удалить</Button>
      <Button disabled>Недоступно</Button>
    </div>
  );
}
