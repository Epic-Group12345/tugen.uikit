import { Avatar, AvatarGroup, Surface, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <Surface
      kind="card"
      className="flex w-full max-w-sm flex-row items-center justify-between gap-3 p-4"
    >
      <div className="flex flex-col">
        <Text weight="semibold">Выживание 1.21</Text>
        <Text size="xs" tone="muted">
          5 друзей играют сейчас
        </Text>
      </div>
      <AvatarGroup
        max={3}
        aria-label="Друзья в игре"
        ringClassName="bg-mist-100 dark:bg-mist-900"
      >
        <Avatar alt="Алекс Стив" />
        <Avatar alt="Нотч Перссон" />
        <Avatar alt="Джеб Бержансон" />
        <Avatar alt="Энди Ним" />
        <Avatar alt="Ли Ли" />
      </AvatarGroup>
    </Surface>
  );
}
