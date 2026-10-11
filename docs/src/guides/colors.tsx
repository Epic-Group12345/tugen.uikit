import React from 'react';
import { Pill, Text, themes, type ColorRole } from '@tugen/uikit/web';
import roles from '../../../tokens/tokens.json';
import { Code } from '../ui/code';
import { C, H1, H2, Lead, P, Table } from '../ui/prose';

const Swatch: React.FC<{ color: string; label?: string }> = ({
  color,
  label,
}) => (
  <span className="inline-flex flex-row items-center gap-2">
    <span
      className="size-5 shrink-0 rounded-md border border-mist-950/10 dark:border-mist-50/10"
      style={{ backgroundColor: color }}
    />
    {label && <span className="font-mono text-xs">{label}</span>}
  </span>
);

const ROLE_ROWS = (Object.keys(themes.light) as ColorRole[]).map(role => [
  <C>{role}</C>,
  <Swatch color={themes.light[role]} label={roles.themes.light[role]} />,
  <Swatch color={themes.dark[role]} label={roles.themes.dark[role]} />,
]);

export const Colors: React.FC = () => (
  <article>
    <H1>Цвета и тема</H1>
    <Lead>
      Серая шкала <C>mist</C>, один акцентный синий и несколько смысловых
      цветов. Каждый цвет задаётся парой — для светлой и тёмной темы.
    </Lead>

    <H2>Тема</H2>
    <P>
      Тема — светлая и тёмная. Каждый цвет в классах записан парой:{' '}
      <C>text-mist-950 dark:text-mist-50</C>. Класс без <C>dark:</C>-пары
      допустим, только если цвет одинаков в обеих темах — белый текст на синей
      кнопке. Kit своей темы не держит: в лаунчере <C>dark:</C> следует за
      Uniwind, в вебе — за системой или классом на <C>&lt;html&gt;</C>.
    </P>
    <Code
      language="ts"
      code={`import { setTheme } from '@tugen/uikit/web';

setTheme('system'); // как в системе — по умолчанию
setTheme('dark');   // класс .dark на <html>
setTheme('light');  // класс .light: тёмная система не действует`}
    />

    <H2>Поверхности</H2>
    <P>
      Уровни разделяются цветом и рамкой, а не тенью. Компонент <C>Surface</C>{' '}
      знает их все.
    </P>
    <Table
      head={['Где', 'Светлая', 'Тёмная']}
      rows={[
        ['Окно, боковая панель', <C>bg-mist-100</C>, <C>bg-mist-900</C>],
        ['Область страницы', <C>bg-mist-50</C>, <C>bg-mist-950</C>],
        ['Карточка на странице', <C>bg-mist-100</C>, <C>bg-mist-900</C>],
        [
          'Окно, меню, всплывашка, уведомление',
          <C>bg-mist-50 + border-mist-200</C>,
          <C>bg-mist-900 + border-mist-800</C>,
        ],
        [
          'Нейтральная кнопка, дорожка, заглушка',
          <C>bg-mist-200</C>,
          <C>bg-mist-800</C>,
        ],
        ['Разделитель', <C>bg-mist-200</C>, <C>bg-mist-800</C>],
        ['Затемнение под окном', <C>bg-mist-950/50</C>, 'то же'],
      ]}
    />

    <H2>Текст</H2>
    <P>
      Роль текста задаёт свойство <C>tone</C> у <C>Text</C> — оно же у подписей
      внутри компонентов.
    </P>
    <Table
      head={['tone', 'Роль', 'Пример']}
      rows={[
        [<C>default</C>, 'Основной', <Text>Выживание</Text>],
        [
          <C>secondary</C>,
          'Второстепенный текст',
          <Text tone="secondary">Обновлено вчера</Text>,
        ],
        [
          <C>muted</C>,
          'Подпись, пояснение, неактивная иконка',
          <Text tone="muted">1.21.4 · Fabric</Text>,
        ],
        [
          <C>faint</C>,
          'Совсем тихий: крестик закрытия',
          <Text tone="faint">Необязательно</Text>,
        ],
      ]}
    />

    <H2>Смысловые цвета</H2>
    <P>
      Новых акцентных цветов не вводите: нужен новый смысл — сначала проверьте,
      не подходит ли один из этих.
    </P>
    <Table
      head={['Цвет', 'Значение', 'Текст', 'Метка']}
      rows={[
        [
          <C>blue</C>,
          'Главное действие, выбор, включено, ссылка',
          <Text tone="info">info</Text>,
          '—',
        ],
        [
          <C>green</C>,
          'Игра («Играть»), успех, в сети',
          <Text tone="success">success</Text>,
          <Pill tone="green">В сети</Pill>,
        ],
        [
          <C>red</C>,
          'Ошибка, опасное действие, «завершить»',
          <Text tone="danger">danger</Text>,
          <Pill tone="red">Ошибка</Pill>,
        ],
        [
          <C>amber</C>,
          'Предупреждение, рейтинг, ожидание',
          <Text tone="warning">warning</Text>,
          <Pill tone="amber">Бета</Pill>,
        ],
        [
          <C>violet</C>,
          'Особые метки: буст сервера, тип сборки',
          <Text tone="special">special</Text>,
          <Pill tone="violet">Модпак</Pill>,
        ],
      ]}
    />

    <H2>Роли</H2>
    <P>
      Для кода без классов (свой рисунок, canvas, нативный модуль) у каждой роли
      есть готовый цвет: <C>themes.light.accent</C>, <C>themes.dark.text</C>.
      Источник — <C>tokens/tokens.json</C>, ссылки вида <C>mist.950/5</C> — цвет
      палитры и прозрачность в процентах, как в классах Tailwind.
    </P>
    <Code
      language="ts"
      code={`import { themes, resolveColor } from '@tugen/uikit/web'; // в лаунчере — '@tugen/uikit'

themes.dark.accent;          // '#2b7fff'
resolveColor('mist.950/5');  // 'rgba(9, 11, 12, 0.05)'`}
    />
    <Table head={['Роль', 'Светлая', 'Тёмная']} rows={ROLE_ROWS} />
  </article>
);
