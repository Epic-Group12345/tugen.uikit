import React, { useDeferredValue, useMemo, useState } from 'react';
import {
  ICON_CATALOG,
  IconButton,
  Icons,
  Select,
  Text,
  TextField,
  toast,
  type IconName,
} from '@tugen/uikit/web';
import { Code } from '../ui/code';
import { A, C, H1, H2, Lead, P, Table } from '../ui/prose';

// Иконки: набор kit — Gravity UI Icons — с поиском по имени, ключевым словам и категориям, как на
// странице иконок Gravity UI. Нажатие на иконку копирует её имя

/** Категории Gravity UI по-русски: подпись в списке и второй язык поиска */
const CATEGORIES: Record<string, string> = {
  arrows: 'Стрелки',
  brands: 'Бренды',
  charts: 'Графики',
  cloud: 'Облако',
  commerce: 'Покупки',
  communication: 'Общение',
  development: 'Разработка',
  devices: 'Устройства',
  editor: 'Редактор',
  files: 'Файлы',
  finance: 'Финансы',
  food: 'Еда',
  games: 'Игры',
  health: 'Здоровье',
  layout: 'Раскладка',
  maps: 'Карты',
  math: 'Математика',
  media: 'Медиа',
  people: 'Люди',
  security: 'Безопасность',
  shapes: 'Фигуры',
  status: 'Состояния',
  text: 'Текст',
  time: 'Время',
  tools: 'Инструменты',
  transport: 'Транспорт',
  weather: 'Погода',
};

const ALL = 'all';

const CATEGORY_OPTIONS = [
  { value: ALL, label: 'Все категории' },
  ...Object.entries(CATEGORIES)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label)),
];

/** Строка, по которой ищем: имя, ключевые слова и категории на двух языках — в нижнем регистре */
const HAYSTACK = new Map(
  ICON_CATALOG.map(icon => [
    icon.name,
    [
      icon.name,
      ...icon.keywords,
      ...icon.categories,
      ...icon.categories.map(category => CATEGORIES[category] ?? ''),
    ]
      .join(' ')
      .toLowerCase(),
  ]),
);

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast({ title: `Скопировано: ${text}`, tone: 'success' });
  } catch {
    // Буфер обмена недоступен (страница без HTTPS, запрет браузера): имя хотя бы видно в сообщении
    toast({ title: 'Не удалось скопировать', description: text });
  }
};

const IconTile: React.FC<{ name: IconName }> = ({ name }) => {
  const Icon = Icons[name];
  return (
    <button
      type="button"
      onClick={() => copy(name)}
      title={`Скопировать ${name}`}
      className="flex min-w-0 flex-col items-center gap-3 rounded-2xl px-2 pt-5 pb-3 text-mist-700 outline-none hover:bg-mist-100 focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-mist-200 dark:text-mist-300 dark:hover:bg-mist-900 dark:active:bg-mist-800"
    >
      <Icon size={24} />
      <span className="w-full truncate text-center text-xs text-mist-500 dark:text-mist-400">
        {name}
      </span>
    </button>
  );
};

const Catalog: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  // Сетка из сотен иконок перерисовывается после ввода, а не на каждой букве
  const search = useDeferredValue(query.trim().toLowerCase());

  const found = useMemo(
    () =>
      ICON_CATALOG.filter(
        icon =>
          (category === ALL || icon.categories.includes(category)) &&
          (!search || HAYSTACK.get(icon.name)!.includes(search)),
      ),
    [search, category],
  );

  return (
    <section className="my-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <TextField
          value={query}
          onChangeText={setQuery}
          icon={Icons.Magnifier}
          type="search"
          placeholder="Поиск: gear, стрелки, play"
          aria-label="Поиск иконок"
          className="min-w-0 flex-1"
          trailing={
            query ? (
              <IconButton
                icon={Icons.Xmark}
                aria-label="Очистить"
                onClick={() => setQuery('')}
              />
            ) : null
          }
        />
        <div className="flex sm:w-56">
          <Select
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            grow
            aria-label="Категория"
          />
        </div>
      </div>
      <Text size="xs" tone="muted">
        {found.length} из {ICON_CATALOG.length} · нажмите на иконку, чтобы
        скопировать имя
      </Text>
      {found.length ? (
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-6">
          {found.map(icon => (
            <IconTile key={icon.name} name={icon.name} />
          ))}
        </div>
      ) : (
        <Text tone="muted" className="py-10 text-center">
          Ничего не нашлось. Ключевые слова Gravity UI — английские: попробуйте
          «settings» вместо «настройки».
        </Text>
      )}
    </section>
  );
};

export const IconsGuide: React.FC = () => (
  <article>
    <H1>Иконки</H1>
    <Lead>
      Kit держит один набор иконок для лаунчера и сайтов — Gravity UI Icons:{' '}
      {ICON_CATALOG.length} иконок на сетке 16 × 16, линией и заливкой. Новых
      наборов не подключайте: нужной иконки нет — сначала поищите по ключевым
      словам и категориям.
    </Lead>

    <H2>Как подключить</H2>
    <P>
      Иконка — компонент <C>Icons.&lt;Имя&gt;</C> со свойствами <C>size</C> и{' '}
      <C>className</C>. Его принимает свойство <C>icon</C> у элементов kit —{' '}
      <C>Button</C>, <C>TextField</C>, <C>Tabs</C>, <C>Pill</C>, пунктов меню.
      Цвет — <C>currentColor</C>: элемент передаёт свой класс <C>text-*</C>,
      поэтому иконка совпадает с цветом текста рядом.
    </P>
    <Code
      code={`import { Button, Icons } from '@tugen/uikit/web';

<Button icon={Icons.ArrowDownToLine}>Скачать</Button>
<Icons.Gear size={16} className="text-mist-500 dark:text-mist-400" />
<Icons.TrashBin aria-label="Удалить" /> // одна иконка без текста — с подписью`}
    />
    <P>
      В вебе в бандл попадают только иконки, к которым обращается код. В
      лаунчере имена те же — <C>Icons.Gear</C> из <C>components/icons</C>: SVG
      Gravity UI рисует нативный модуль, а <C>yarn icons</C> собирает только
      упомянутые в коде иконки.
    </P>

    <H2>Размеры</H2>
    <Table
      head={['size', 'Где']}
      rows={[
        [<C>12</C>, 'Шевроны и крестики внутри полей и меток'],
        [<C>14</C>, 'В кнопках с текстом, в подписях'],
        [<C>16</C>, 'Кнопки-иконки, пункты меню, вкладки — основной размер'],
        [<C>24</C>, 'Пустые состояния, карточки разделов'],
      ]}
    />
    <P>
      Сетка набора — 16 пикселей, поэтому резче всего иконки на 16, 32 и 48.
      Вариант с заливкой (<C>StarFill</C>, <C>HeartFill</C>) — для включённого
      состояния: избранное, лайк, закреп.
    </P>

    <H2>Все иконки</H2>
    <Catalog />

    <H2>Лицензия</H2>
    <P>
      Иконки —{' '}
      <A href="https://github.com/gravity-ui/icons">Gravity UI Icons</A> (
      <C>@gravity-ui/icons</C>), © YANDEX LLC, лицензия{' '}
      <A href="https://github.com/gravity-ui/icons/blob/main/LICENSE">MIT</A>.
      Kit ставит пакет зависимостью и оборачивает его компоненты; текст лицензии
      лежит в пакете, его сохраняет сборка зависимостей.
    </P>
  </article>
);
