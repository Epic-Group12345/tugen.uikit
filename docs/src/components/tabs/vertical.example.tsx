import { Tabs, TabsContent, TabsList, TabsTrigger } from '@tugen/uikit/web';
import { Cpu, Monitor, Settings } from 'lucide-react';

export default function Example() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList orientation="vertical" className="w-44" aria-label="Настройки">
        <TabsTrigger value="general" icon={Settings}>
          Общие
        </TabsTrigger>
        <TabsTrigger value="java" icon={Cpu}>
          Java и память
        </TabsTrigger>
        <TabsTrigger value="screen" icon={Monitor}>
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
