import {
  Icons,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList variant="underline" fill aria-label="Страница мода">
        <TabsTrigger value="overview" icon={Icons.FileText}>
          Обзор
        </TabsTrigger>
        <TabsTrigger value="versions" icon={Icons.ClockArrowRotateLeft}>
          Версии
        </TabsTrigger>
        <TabsTrigger value="dependencies" icon={Icons.Link}>
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
