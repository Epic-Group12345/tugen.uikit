import React, { useEffect, useState } from 'react';
import { Button } from '../../../src/web/button';
import { Text } from '../../../src/web/text';
import { Pill } from '../../../src/web/pill';
import { Skeleton, SkeletonLines } from '../../../src/web/skeleton';
import { EmptyState } from '../../../src/web/empty-state';
import { Kbd, KbdCombo } from '../../../src/web/kbd';
import { Alert } from '../../../src/web/alert';
import { Progress } from '../../../src/web/progress';
import { Avatar, AvatarGroup } from '../../../src/web/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../src/web/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../src/web/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../src/web/collapsible';
import { Block, Dot, Line } from './shared';

// Картинка аватара без сети: SVG в data-адресе
const FACE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect width="8" height="8" fill="#7b5534"/><rect y="0" width="8" height="2" fill="#3b2a1a"/><rect x="1" y="4" width="2" height="1" fill="#fff"/><rect x="5" y="4" width="2" height="1" fill="#fff"/><rect x="2" y="4" width="1" height="1" fill="#4a3cc9"/><rect x="5" y="4" width="1" height="1" fill="#4a3cc9"/><rect x="3" y="6" width="2" height="1" fill="#5a3b22"/></svg>',
)}`;

/** Прогресс, который сам растёт: видно плавное изменение заливки */
const LiveProgress: React.FC = () => {
  const [value, setValue] = useState(20);
  useEffect(() => {
    const id = setInterval(() => setValue(v => (v >= 100 ? 0 : v + 10)), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <Progress
      value={value}
      aria-label="Загрузка сборки"
      getValueLabel={(v, max) => `${v} из ${max}`}
    />
  );
};

export const Display: React.FC = () => (
  <>
    <Block title="Метки и клавиши">
      <Line>
        <Pill>Технические</Pill>
        <Pill tone="amber">Бета</Pill>
        <Pill tone="green">
          <Dot size={8} />
          <span>Онлайн</span>
        </Pill>
        <Pill tone="red">Несовместим</Pill>
        <Pill tone="violet">Fabric</Pill>
        <Pill tone="danger">Мошенник</Pill>
      </Line>
      <Line>
        <Kbd>Esc</Kbd>
        <KbdCombo keys={['Ctrl', 'K']} />
        <KbdCombo keys={['Ctrl', 'Shift', 'P']} />
      </Line>
    </Block>

    <Block title="Уведомления">
      <Alert icon={Dot} title="Доступно обновление">
        TUGEN 1.4 исправляет запуск сборок на Fabric.
      </Alert>
      <Alert
        tone="danger"
        icon={Dot}
        title="Нет связи с сервером"
        action={<Button variant="secondary">Повторить</Button>}
      >
        Проверьте подключение к интернету.
      </Alert>
      <Alert tone="warning" icon={Dot} title="Мод несовместим" />
      <Alert tone="success" icon={Dot}>
        Сборка установлена
      </Alert>
      <Alert tone="neutral">Нейтральное сообщение без заголовка</Alert>
    </Block>

    <Block title="Прогресс">
      <LiveProgress />
      <Progress value={64} tone="play" />
      <Progress value={30} tone="warning" className="h-1" />
      <Progress value={90} tone="danger" />
      <Progress indeterminate aria-label="Подготовка" />
    </Block>

    <Block title="Аватары">
      <Line>
        <Avatar alt="Алекс Стив" size="sm" />
        <Avatar alt="Алекс Стив" src={FACE} status="online" />
        <Avatar alt="Нотч" size="lg" status="busy" />
        <Avatar alt="Херобрин" size="sm" shape="rounded" />
        <Avatar alt="Херобрин" shape="rounded" src={FACE} status="away" />
        <Avatar
          alt="Херобрин"
          size="lg"
          shape="rounded"
          ring
          status="offline"
        />
        <Avatar alt="Битая ссылка" src="/no-such-image.png" />
      </Line>
      <Line>
        <AvatarGroup
          max={3}
          aria-label="Друзья в игре"
          ringClassName="bg-mist-100 dark:bg-mist-900"
        >
          <Avatar alt="Алекс Стив" src={FACE} />
          <Avatar alt="Нотч Перссон" />
          <Avatar alt="Джеб Бержансон" />
          <Avatar alt="Дин Ним" />
          <Avatar alt="Ли Ли" />
        </AvatarGroup>
        <AvatarGroup
          size="lg"
          shape="rounded"
          ringClassName="bg-mist-100 dark:bg-mist-900"
        >
          <Avatar alt="Алекс" />
          <Avatar alt="Стив" src={FACE} />
          <Avatar alt="Энди" />
        </AvatarGroup>
      </Line>
    </Block>

    <Block title="Заглушки">
      <div className="flex flex-row items-center gap-3">
        <Skeleton className="w-10 h-10" rounded="rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <SkeletonLines lines={4} />
    </Block>

    <Block title="Вкладки">
      <Tabs defaultValue="mods">
        <TabsList aria-label="Раздел сборки">
          <TabsTrigger value="mods">Моды</TabsTrigger>
          <TabsTrigger value="maps" icon={Dot}>
            Карты
          </TabsTrigger>
          <TabsTrigger value="shaders">Шейдеры</TabsTrigger>
          <TabsTrigger value="off" disabled>
            Недоступно
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mods">42 мода установлено</TabsContent>
        <TabsContent value="maps">3 карты</TabsContent>
        <TabsContent value="shaders">Шейдеры выключены</TabsContent>
      </Tabs>
      <Tabs defaultValue="overview">
        <TabsList variant="underline" fill aria-label="Страница мода">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="versions">Версии</TabsTrigger>
          <TabsTrigger value="dependencies">Зависимости</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Описание мода</TabsContent>
        <TabsContent value="versions">Список версий</TabsContent>
        <TabsContent value="dependencies">Нужен Fabric API</TabsContent>
      </Tabs>
      <Tabs defaultValue="home">
        <TabsList orientation="vertical" className="w-40" aria-label="Меню">
          <TabsTrigger value="home" icon={Dot}>
            Главная
          </TabsTrigger>
          <TabsTrigger value="builds" icon={Dot}>
            Сборки
          </TabsTrigger>
          <TabsTrigger value="chats" icon={Dot}>
            Чаты
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">Главная страница</TabsContent>
        <TabsContent value="builds">Ваши сборки</TabsContent>
        <TabsContent value="chats" forceMount>
          Чаты (forceMount — состояние сохраняется)
        </TabsContent>
      </Tabs>
    </Block>

    <Block title="Аккордеон">
      <Accordion type="single" collapsible defaultValue="build">
        <AccordionItem value="build">
          <AccordionTrigger>Что такое сборка?</AccordionTrigger>
          <AccordionContent>
            Набор модов, настроек и версии игры, который запускается одной
            кнопкой.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="java">
          <AccordionTrigger icon={Dot}>Нужна ли Java?</AccordionTrigger>
          <AccordionContent>Лаунчер скачает нужную сам.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="off" disabled>
          <AccordionTrigger>Недоступный пункт</AccordionTrigger>
          <AccordionContent>—</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="multiple" variant="card">
        <AccordionItem value="a">
          <AccordionTrigger>Карточка: заголовки rounded-lg</AccordionTrigger>
          <AccordionContent>rounded-xl (12) − p-1 (4) = 8</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Можно раскрыть несколько</AccordionTrigger>
          <AccordionContent>type="multiple"</AccordionContent>
        </AccordionItem>
      </Accordion>
    </Block>

    <Block title="Раскрывающийся блок">
      <Collapsible>
        <CollapsibleTrigger icon={Dot}>
          Дополнительные параметры
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-2">
          Аргументы JVM: -Xmx4G -XX:+UseG1GC
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="self-start">
            Показать журнал
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Text mono size="xs" tone="muted">
            [12:00:01] Запуск Minecraft 1.21.1
          </Text>
        </CollapsibleContent>
      </Collapsible>
    </Block>

    <Block title="Пустая страница">
      <EmptyState
        icon={Dot}
        title="Чатов пока нет"
        text="Добавьте друга, чтобы начать переписку."
      >
        <Button>Найти друзей</Button>
      </EmptyState>
    </Block>
  </>
);
