import { Surface, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="grid w-full grid-cols-3 gap-3">
      <Surface kind="card" className="flex flex-col gap-1 p-4">
        <Text weight="semibold">card</Text>
        <Text size="xs" tone="muted">
          Карточка сборки на странице
        </Text>
      </Surface>
      <Surface kind="overlay" className="flex flex-col gap-1 p-4">
        <Text weight="semibold">overlay</Text>
        <Text size="xs" tone="muted">
          Меню, окно, уведомление
        </Text>
      </Surface>
      <Surface kind="neutral" className="flex flex-col gap-1 p-4">
        <Text weight="semibold">neutral</Text>
        <Text size="xs" tone="muted">
          Плашка, дорожка
        </Text>
      </Surface>
    </div>
  );
}
