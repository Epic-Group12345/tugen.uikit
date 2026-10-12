import { Button, EmptyState, Icons } from '@tugen/uikit/web';

export default function Example() {
  return (
    <EmptyState
      icon={Icons.Box}
      title="Сборок пока нет"
      text="Создайте свою сборку или установите готовую из каталога."
    >
      <Button icon={Icons.Plus}>Создать сборку</Button>
    </EmptyState>
  );
}
