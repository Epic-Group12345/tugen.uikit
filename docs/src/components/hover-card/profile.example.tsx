import {
  Avatar,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Text,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost">Steve</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex flex-row items-center gap-3 px-2.5 py-2">
          <Avatar alt="Steve" size="lg" status="online" />
          <div className="flex flex-col gap-0.5">
            <Text weight="semibold">Steve</Text>
            <Text size="xs" tone="success">
              В игре · Выживание
            </Text>
          </div>
        </div>
        <Button variant="secondary" grow>
          Присоединиться
        </Button>
      </HoverCardContent>
    </HoverCard>
  );
}
