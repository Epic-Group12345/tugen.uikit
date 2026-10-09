import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tugen/uikit/web';

export default function Example() {
  return (
    <Tabs defaultValue="mods" className="w-full max-w-sm">
      <TabsList aria-label="Раздел сборки">
        <TabsTrigger value="mods">Моды</TabsTrigger>
        <TabsTrigger value="worlds">Миры</TabsTrigger>
        <TabsTrigger value="shaders">Шейдеры</TabsTrigger>
        <TabsTrigger value="screenshots" disabled>
          Скриншоты
        </TabsTrigger>
      </TabsList>
      <TabsContent value="mods">Установлено 42 мода</TabsContent>
      <TabsContent value="worlds">3 мира, последний — «Остров»</TabsContent>
      <TabsContent value="shaders">Шейдеры выключены</TabsContent>
    </Tabs>
  );
}
