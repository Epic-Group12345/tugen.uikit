import { Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Text as="h1" size="3xl" weight="bold">
          Выживание 1.21
        </Text>
        <Text tone="muted">Сборка на Fabric · 42 мода</Text>
      </div>
      <div className="flex flex-col gap-0.5">
        <Text as="h2" size="lg" weight="semibold">
          Сервер «Островок»
        </Text>
        <Text as="p" size="xs" tone="muted">
          Ванильное выживание без приватов, вайп раз в сезон.
        </Text>
      </div>
      <Text as="h3" size="xs" tone="muted" uppercase>
        Настройки игры
      </Text>
    </div>
  );
}
