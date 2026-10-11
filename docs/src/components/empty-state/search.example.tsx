import { Button, EmptyState } from '@tugen/uikit/web';
import { SearchX } from 'lucide-react';

export default function Example() {
  return (
    <EmptyState
      icon={SearchX}
      title="Серверов не найдено"
      text="По запросу «скайблок 1.8» ничего нет. Попробуйте другую версию или сбросьте фильтры."
    >
      <Button variant="secondary">Сбросить фильтры</Button>
    </EmptyState>
  );
}
