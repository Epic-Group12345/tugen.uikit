import { Button, EmptyState } from '@tugen/uikit/web';
import { Package, Plus } from 'lucide-react';

export default function Example() {
  return (
    <EmptyState
      icon={Package}
      title="Сборок пока нет"
      text="Создайте свою сборку или установите готовую из каталога."
    >
      <Button icon={Plus}>Создать сборку</Button>
    </EmptyState>
  );
}
