import React from 'react';
import { Kbd, Text, text, weight } from '@tugen/uikit/web';
import { href } from '../router';
import { Rule } from '../ui/blocks';
import { A, C, H1, H2, Lead, Li, P, Table, Ul } from '../ui/prose';

// Типографика: шрифты по платформам, шкала размеров с ролями, насыщенность и правила текста.
// Числа — из tokens.json (text, weight), роли — из DESIGN.md лаунчера

/** Где какой размер работает — по таблице «Типографика» в DESIGN.md */
const ROLES: Record<keyof typeof text, string> = {
  xs: 'Подписи, пояснения, метаданные, заголовок раздела настроек',
  sm: 'Основной текст, кнопки, пункты меню',
  base: 'Заголовок пустого состояния',
  lg: 'Заголовок окна, карточки, блока',
  xl: 'Подзаголовок страницы',
  '2xl': 'Заголовок страницы-карточки: сборка, чат, сервер',
  '3xl': 'Крупный заголовок страницы',
};

export const Typography: React.FC = () => (
  <article>
    <H1>Типографика</H1>
    <Lead>
      Текст в TUGEN спокойный и плотный: основная работа — на двух размерах,
      насыщенность — две, иерархию задают размер и цвет, а не начертания.
    </Lead>

    <H2>Шрифты</H2>
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-3xl bg-mist-100 p-6 dark:bg-mist-900">
        <span className="font-sans text-6xl leading-none font-bold">Аа</span>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Ubuntu Sans</span>
          <span className="text-sm leading-6 text-mist-500 dark:text-mist-400">
            Текст сайтов и документации. Вариативный, начертания 100–800,
            кириллица и латиница.
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-3xl bg-mist-100 p-6 dark:bg-mist-900">
        <span className="font-mono text-6xl leading-none font-bold">
          {'{}'}
        </span>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Ubuntu Mono</span>
          <span className="text-sm leading-6 text-mist-500 dark:text-mist-400">
            Код, клавиши <Kbd>Ctrl</Kbd>, адреса серверов, пути и версии.
          </span>
        </div>
      </div>
    </div>
    <Table
      head={['Платформа', 'Текст', 'Моноширинный']}
      rows={[
        ['Сайты TUGEN, документация', 'Ubuntu Sans', 'Ubuntu Mono'],
        [
          'Лаунчер (Windows), стек kit по умолчанию',
          'Segoe UI Variable',
          'Consolas, Cascadia Mono',
        ],
      ]}
    />
    <P>
      Шрифт сайта подменяется переменными <C>--font-sans</C> и{' '}
      <C>--font-mono</C> в <C>@theme</C> приложения: классы kit (
      <C>font-sans</C>, <C>font-mono</C>) остаются прежними.
    </P>

    <H2>Шкала</H2>
    <P>
      Размеры — шкала Tailwind, строка — с межстрочным интервалом из того же
      токена. Основной текст — <C>sm</C>, подписи — <C>xs</C>.
    </P>
    <div className="my-5 flex flex-col divide-y divide-mist-200 overflow-hidden rounded-2xl border border-mist-200 dark:divide-mist-800 dark:border-mist-800">
      {(Object.keys(text) as (keyof typeof text)[])
        .slice()
        .reverse()
        .map(size => (
          <div
            key={size}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <div className="flex w-40 shrink-0 flex-col">
              <span className="font-mono text-sm font-medium">text-{size}</span>
              <span className="font-mono text-xs text-mist-500 dark:text-mist-400">
                {text[size].fontSize} / {text[size].lineHeight}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className="truncate font-semibold"
                style={{
                  fontSize: text[size].fontSize,
                  lineHeight: `${text[size].lineHeight}px`,
                }}
              >
                Выживание с друзьями
              </span>
              <span className="text-xs text-mist-500 dark:text-mist-400">
                {ROLES[size]}
              </span>
            </div>
          </div>
        ))}
    </div>

    <H2>Насыщенность</H2>
    <Table
      head={['Токен', 'Значение', 'Где']}
      rows={[
        [<C>regular</C>, weight.regular, 'Текст, подписи, пункты меню'],
        [<C>semibold</C>, weight.semibold, 'Заголовки карточек и строк'],
        [<C>bold</C>, weight.bold, 'Заголовки страниц и окон'],
      ]}
    />
    <P>
      Других начертаний не используем: <C>font-medium</C> и <C>font-light</C> на
      одном экране с <C>semibold</C> читаются как ошибка.
    </P>

    <H2>Цвет текста</H2>
    <div className="my-5 flex flex-col gap-2 rounded-2xl bg-mist-100 p-5 dark:bg-mist-900">
      <Text weight="semibold">Основной — заголовки и важный текст</Text>
      <Text tone="secondary">Второстепенный — описания и абзацы</Text>
      <Text tone="muted">
        Подпись — пояснения, метаданные, неактивные иконки
      </Text>
    </div>
    <P>
      Пары классов для светлой и тёмной темы — на странице{' '}
      <A href={href('colors')}>Цвета</A>, компонент —{' '}
      <A href={href('components/text')}>Text</A>.
    </P>

    <H2>Рекомендации</H2>
    <div className="my-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Rule
        tone="do"
        caption="Иерархия — размером и цветом: заголовок, под ним тихая подпись."
      >
        <div className="flex flex-col gap-0.5">
          <Text size="lg" weight="semibold">
            Сборка готова
          </Text>
          <Text size="xs" tone="muted">
            Выживание · 1.21.4 · 214 модов
          </Text>
        </div>
      </Rule>
      <Rule
        tone="dont"
        caption="Не выделяйте всё сразу: жирный, капс и цвет в одной строке."
      >
        <span className="text-lg font-bold text-blue-600 uppercase dark:text-blue-400">
          Сборка ГОТОВА!!!
        </span>
      </Rule>
    </div>
    <Ul>
      <Li>
        Заголовок раздела настроек — <C>text-xs uppercase</C> тихим цветом, не
        жирный.
      </Li>
      <Li>
        Длинный текст в строке обрезайте многоточием (<C>truncate</C>, в
        лаунчере <C>numberOfLines={'{1}'}</C>), а не переносом.
      </Li>
      <Li>
        <C>font-mono</C> — только для технических строк: версии, адреса, коды.
      </Li>
      <Li>
        Пишите коротко и по-человечески: «Играть», «Сохранить», «Нет связи с
        сервером» — без восклицаний и канцелярита.
      </Li>
    </Ul>
  </article>
);
