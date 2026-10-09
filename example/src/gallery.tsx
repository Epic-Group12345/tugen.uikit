import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Uniwind } from 'uniwind';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  KbdCombo,
  Pill,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverRow,
  PopoverTrigger,
  PopupHost,
  Progress,
  RadioGroup,
  RadioRow,
  Row,
  Section,
  Segmented,
  Select,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Surface,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  TextField,
  Tip,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  toast,
} from '../../src';

// Витрина kit: каждый элемент в обеих темах, в браузере через react-native-web. Открывается
// командой yarn gallery; заодно проверяет, что kit собирается в Vite как обычное веб-приложение

type Theme = 'light' | 'dark';

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View className="gap-2">
    <Text size="xs" tone="muted" uppercase>
      {title}
    </Text>
    <Surface kind="card" className="gap-3 p-4">
      {children}
    </Surface>
  </View>
);

const Line: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View className="flex-row flex-wrap items-center gap-2">{children}</View>
);

export const Gallery: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [music, setMusic] = useState(true);
  const [memory, setMemory] = useState(4096);
  const [loader, setLoader] = useState('fabric');
  const [version, setVersion] = useState('1.21.4');
  const [quality, setQuality] = useState<string | undefined>('mid');
  const [hidden, setHidden] = useState(false);
  const [agree, setAgree] = useState(true);
  const [name, setName] = useState('');

  const switchTheme = (next: Theme) => {
    setTheme(next);
    Uniwind.setTheme(next);
  };

  return (
    <View className="flex-1 bg-mist-50 dark:bg-mist-950">
      <ScrollView contentContainerClassName="items-center p-6">
        <View className="w-full max-w-3xl gap-6">
          <View className="flex-row items-center justify-between gap-3">
            <View className="gap-0.5">
              <Text size="2xl" weight="bold">
                TUGEN UI-kit
              </Text>
              <Text tone="muted">
                Компоненты на react-native primitives — те же, что в лаунчере
              </Text>
            </View>
            <Segmented
              options={[
                { value: 'light', label: 'Светлая' },
                { value: 'dark', label: 'Тёмная' },
              ]}
              value={theme}
              onChange={switchTheme}
            />
          </View>

          <Block title="Кнопки">
            <Line>
              <Button variant="play" size="lg">
                Играть
              </Button>
              <Button>Сохранить</Button>
              <Button variant="secondary">Отмена</Button>
              <Button variant="outline">Подробнее</Button>
              <Button variant="ghost">Пропустить</Button>
              <Button variant="danger">Удалить</Button>
              <Button disabled>Недоступно</Button>
            </Line>
            <Line>
              <Pill>Fabric</Pill>
              <Pill tone="green">В сети</Pill>
              <Pill tone="amber">Бета</Pill>
              <Pill tone="violet">Буст</Pill>
              <Pill tone="danger">Мошенник</Pill>
              <KbdCombo keys={['Ctrl', 'K']} />
            </Line>
          </Block>

          <Section title="Настройки">
            <Row title="Музыка" description="Фоновая музыка в лаунчере">
              <Toggle
                value={music}
                onChange={setMusic}
                accessibilityLabel="Музыка"
              />
            </Row>
            <Row title="Память" description={`${Math.round(memory)} МБ`}>
              <Slider
                value={memory}
                min={1024}
                max={16384}
                onChange={setMemory}
              />
            </Row>
            <Row title="Версия">
              <Select
                options={[
                  { value: '1.21.4', label: '1.21.4' },
                  { value: '1.20.1', label: '1.20.1' },
                  { value: '1.12.2', label: '1.12.2' },
                ]}
                value={version}
                onChange={setVersion}
              />
            </Row>
            <Row title="Графика">
              <ToggleGroup
                type="single"
                value={quality}
                onValueChange={setQuality}
              >
                <ToggleGroupItem value="low" grow>
                  Низкая
                </ToggleGroupItem>
                <ToggleGroupItem value="mid" grow>
                  Средняя
                </ToggleGroupItem>
                <ToggleGroupItem value="high" grow>
                  Высокая
                </ToggleGroupItem>
              </ToggleGroup>
            </Row>
          </Section>

          <Block title="Формы">
            <Field
              label="Название сборки"
              description="Видно только вам"
              error={name.length > 24 ? 'Не длиннее 24 символов' : undefined}
            >
              <TextField
                value={name}
                onChangeText={setName}
                placeholder="Выживание"
                trailing={
                  <Button size="sm" variant="secondary">
                    Создать
                  </Button>
                }
              />
            </Field>
            <RadioGroup value={loader} onValueChange={setLoader}>
              <RadioRow
                value="fabric"
                label="Fabric"
                description="Лёгкий, быстро обновляется"
              />
              <RadioRow
                value="forge"
                label="Forge"
                description="Большинство старых модов"
              />
            </RadioGroup>
            <Checkbox checked={agree} onCheckedChange={setAgree}>
              Отправлять отчёты о сбоях
            </Checkbox>
          </Block>

          <Block title="Окна и меню">
            <Line>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Диалог</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая сборка</DialogTitle>
                    <DialogDescription>
                      Сборка — отдельная папка игры со своими модами.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Отмена</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Создать</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="danger">Подтверждение</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить «Выживание»?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Миры останутся в папке saves.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction variant="danger">
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary">Панель</Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Друзья</SheetTitle>
                    <SheetDescription>3 в сети</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">Меню</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Сборка</DropdownMenuLabel>
                  <DropdownMenuItem shortcut="Ctrl+O">
                    Открыть папку
                  </DropdownMenuItem>
                  <DropdownMenuItem>Дублировать</DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={hidden}
                    onCheckedChange={setHidden}
                  >
                    Показывать скрытые
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem destructive>Удалить</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Почему буст?</Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <PopoverBody title="Буст сервера">
                    <PopoverRow label="Голосов" value="1 204" />
                    <PopoverRow label="До конца" value="3 дня" />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Tip label="Подсказка при наведении">
                <Button variant="ghost">Наведите</Button>
              </Tip>
              <Button
                variant="secondary"
                onPress={() =>
                  toast({
                    title: 'Сборка установлена',
                    description: 'Fabric 1.21.4',
                    tone: 'success',
                    action: { label: 'Играть', onPress: () => {} },
                  })
                }
              >
                Уведомление
              </Button>
            </Line>
          </Block>

          <Block title="Отображение">
            <Tabs defaultValue="mods" className="gap-3">
              <TabsList>
                <TabsTrigger value="mods">Моды</TabsTrigger>
                <TabsTrigger value="worlds">Миры</TabsTrigger>
                <TabsTrigger value="shots">Скриншоты</TabsTrigger>
              </TabsList>
              <TabsContent value="mods">42 мода, 3 отключены</TabsContent>
              <TabsContent value="worlds">5 миров</TabsContent>
              <TabsContent value="shots">Скриншотов пока нет</TabsContent>
            </Tabs>
            <Progress value={64} />
            <Progress indeterminate tone="play" />
            <Line>
              <Avatar alt="Алиса Смирнова" status="online" />
              <Avatar alt="Борис" size="lg" shape="rounded" status="busy" />
              <AvatarGroup max={3} ringClassName="bg-mist-100 dark:bg-mist-900">
                <Avatar alt="Алиса" />
                <Avatar alt="Борис" />
                <Avatar alt="Вера" />
                <Avatar alt="Глеб" />
                <Avatar alt="Дина" />
              </AvatarGroup>
              <Skeleton className="w-32 h-3" rounded="rounded-full" />
            </Line>
            <Alert
              tone="warning"
              title="Java 17 не найдена"
              action={<Button size="sm">Скачать</Button>}
            >
              Для 1.21 нужна Java 21. Лаунчер скачает её сам.
            </Alert>
            <Accordion type="single" collapsible variant="card">
              <AccordionItem value="a">
                <AccordionTrigger>Что такое сборка?</AccordionTrigger>
                <AccordionContent>
                  Отдельная папка игры со своими модами, настройками и мирами.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>Где хранятся миры?</AccordionTrigger>
                <AccordionContent>
                  В папке saves внутри сборки.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Block>

          <Block title="Правило скругления: внешний = внутренний + отступ">
            <Surface kind="overlay" radius="3xl" padding="3" className="gap-3">
              <Text size="xs" tone="muted">
                rounded-3xl (24) + p-3 (12) → вложенная поверхность 12
              </Text>
              <Surface kind="neutral" nested padding="1" className="gap-1">
                <Text size="xs" tone="muted" className="px-2 pt-1">
                  rounded-xl (12) + p-1 (4) → кнопка 8
                </Text>
                <Button>Кнопка по правилу</Button>
              </Surface>
            </Surface>
          </Block>
        </View>
      </ScrollView>
      <Toaster />
      <PopupHost />
    </View>
  );
};
