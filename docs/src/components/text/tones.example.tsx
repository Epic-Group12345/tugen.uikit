import { Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5">
      <Text>Сборка «Выживание 1.21» готова к запуску</Text>
      <Text tone="secondary">42 мода, Fabric 0.16</Text>
      <Text tone="muted">Последний запуск — вчера в 21:40</Text>
      <Text tone="faint">Версия лаунчера 1.4.0</Text>
      <div className="flex flex-row flex-wrap gap-3">
        <Text tone="info">Обновление</Text>
        <Text tone="success">В сети</Text>
        <Text tone="warning">Ожидание</Text>
        <Text tone="danger">Ошибка запуска</Text>
        <Text tone="special">Буст сервера</Text>
      </div>
    </div>
  );
}
