import { Button, EmptyState, Icons } from '@tugen/uikit/web';

export default function Example() {
  return (
    <EmptyState
      icon={Icons.Magnifier}
      title="Серверов не найдено"
      text="По запросу «скайблок 1.8» ничего нет. Попробуйте другую версию или сбросьте фильтры."
    >
      <Button variant="secondary">Сбросить фильтры</Button>
    </EmptyState>
  );
}
