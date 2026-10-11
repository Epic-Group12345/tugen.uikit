import { useState } from 'react';
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@tugen/uikit/web';

export default function Example() {
  const [tab, setTab] = useState('servers');

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full max-w-sm">
      <TabsList fill aria-label="Сетевая игра">
        <TabsTrigger value="servers">Серверы</TabsTrigger>
        <TabsTrigger value="friends">Друзья</TabsTrigger>
      </TabsList>
      <TabsContent value="servers">
        <div className="flex flex-col items-start gap-2">
          <Text tone="secondary">Список серверов пуст</Text>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setTab('friends')}
          >
            Играть с друзьями
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="friends">2 друга в сети</TabsContent>
    </Tabs>
  );
}
