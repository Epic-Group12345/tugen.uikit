import { Card, Divider, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <Card className="w-full max-w-sm">
      <div className="flex flex-row items-center justify-between p-4">
        <Text>Версия игры</Text>
        <Text tone="muted">1.21.1</Text>
      </div>
      <div className="flex flex-row items-center justify-between p-4">
        <Text>Загрузчик</Text>
        <div className="flex flex-row items-center gap-3">
          <Text tone="muted">Fabric</Text>
          <Divider orientation="vertical" />
          <Text tone="muted">0.16.5</Text>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between p-4">
        <Text>Размер</Text>
        <Text tone="muted">1,3 ГБ</Text>
      </div>
    </Card>
  );
}
