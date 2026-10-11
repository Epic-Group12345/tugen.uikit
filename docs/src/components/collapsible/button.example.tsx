import { useState } from 'react';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Text,
} from '@tugen/uikit/web';
import { ScrollText } from 'lucide-react';

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-sm gap-2"
    >
      <CollapsibleTrigger asChild>
        <Button variant="outline" icon={ScrollText} className="self-start">
          {open ? 'Скрыть журнал' : 'Показать журнал'}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-1 rounded-xl bg-mist-100 p-3 dark:bg-mist-900">
          <Text mono size="xs" tone="muted">
            [12:00:01] Запуск Minecraft 1.21.4
          </Text>
          <Text mono size="xs" tone="muted">
            [12:00:03] Загружено 42 мода
          </Text>
          <Text mono size="xs" tone="muted">
            [12:00:09] Мир «Остров» открыт
          </Text>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
