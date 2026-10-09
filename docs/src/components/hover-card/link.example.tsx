import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Text,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Text as="p" tone="secondary" className="max-w-sm text-center leading-6">
      Для этой сборки нужен{' '}
      <HoverCard>
        <HoverCardTrigger
          href="https://modrinth.com/mod/sodium"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Sodium
        </HoverCardTrigger>
        <HoverCardContent side="top" className="w-72">
          <div className="flex flex-col gap-1 px-2.5 py-2">
            <Text weight="semibold">Sodium 0.6.5</Text>
            <Text size="xs" tone="secondary" className="leading-5">
              Переписанный движок отрисовки: заметно поднимает FPS и не меняет
              вид игры.
            </Text>
            <Text size="xs" tone="muted">
              Fabric · 1.21.4 · 52 млн загрузок
            </Text>
          </div>
        </HoverCardContent>
      </HoverCard>{' '}
      версии 0.6 или новее.
    </Text>
  );
}
