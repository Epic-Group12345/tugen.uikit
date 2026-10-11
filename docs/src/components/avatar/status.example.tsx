import { Avatar, Text } from '@tugen/uikit/web';

const FRIENDS = [
  { name: 'Алекс Стив', status: 'online', note: 'Играет на «Островке»' },
  { name: 'Нотч Перссон', status: 'away', note: 'Отошёл' },
  { name: 'Джеб Бержансон', status: 'busy', note: 'Не беспокоить' },
  { name: 'Энди Ним', status: 'offline', note: 'Был вчера' },
] as const;

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      {FRIENDS.map(friend => (
        <div key={friend.name} className="flex flex-row items-center gap-3">
          <Avatar alt={friend.name} status={friend.status} />
          <div className="flex flex-col">
            <Text>{friend.name}</Text>
            <Text size="xs" tone="muted">
              {friend.note}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
}
