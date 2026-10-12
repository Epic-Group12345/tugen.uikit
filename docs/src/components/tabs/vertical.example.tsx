import {
  Icons,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList orientation="vertical" className="w-44" aria-label="Настройки">
        <TabsTrigger value="general" icon={Icons.Gear}>
          Общие
        </TabsTrigger>
        <TabsTrigger value="java" icon={Icons.Cpu}>
          Java и память
        </TabsTrigger>
        <TabsTrigger value="screen" icon={Icons.Display}>
          Экран
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general">Язык, тема и папка игры</TabsContent>
      <TabsContent value="java">Выделено 4 ГБ оперативной памяти</TabsContent>
      <TabsContent value="screen">
        Окно 1280 × 720, без полного экрана
      </TabsContent>
    </Tabs>
  );
}
