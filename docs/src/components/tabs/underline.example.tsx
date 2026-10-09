import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tugen/uikit/web';
import { FileText, History, Link } from 'lucide-react';

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList variant="underline" fill aria-label="Страница мода">
        <TabsTrigger value="overview" icon={FileText}>
          Обзор
        </TabsTrigger>
        <TabsTrigger value="versions" icon={History}>
          Версии
        </TabsTrigger>
        <TabsTrigger value="dependencies" icon={Link}>
          Зависимости
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Sodium ускоряет отрисовку и поднимает FPS в несколько раз.
      </TabsContent>
      <TabsContent value="versions">0.6.5 для Fabric 1.21.4</TabsContent>
      <TabsContent value="dependencies">Нужен Fabric API</TabsContent>
    </Tabs>
  );
}
