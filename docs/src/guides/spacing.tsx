import React from 'react';
import { breakpoints, cx, space } from '@tugen/uikit/web';
import { href } from '../router';
import { A, C, H1, H2, Lead, Li, P, Table, Ul } from '../ui/prose';

// Сетка и отступы: шаг 4, шкала отступов, отступы страницы по режиму окна и брейкпоинты

const byValue = (scale: Record<string, number>) =>
  Object.entries(scale).sort(([, a], [, b]) => a - b);

/** Типовые расстояния — по разделу «Форма и отступы» DESIGN.md */
const USAGE: [string, string][] = [
  ['gap-0.5', 'Заголовок и подпись под ним'],
  ['gap-1.5 – gap-2', 'Иконка и текст, ряд кнопок'],
  ['gap-3', 'Элементы внутри карточки'],
  ['p-4', 'Строка карточки, карточка'],
  ['gap-6', 'Разделы страницы'],
];

const MODES = [
  {
    mode: 'compact',
    width: `до ${breakpoints.regular}`,
    padding: 'p-3',
    nav: 'Боковая панель — только иконки (56)',
  },
  {
    mode: 'regular',
    width: `от ${breakpoints.regular}`,
    padding: 'p-6',
    nav: 'Панель с подписями (224)',
  },
  {
    mode: 'wide',
    width: `от ${breakpoints.wide}`,
    padding: 'p-8',
    nav: 'Панель 256, контент max-w-5xl по центру',
  },
];

export const Spacing: React.FC = () => (
  <article>
    <H1>Сетка и отступы</H1>
    <Lead>
      Все расстояния — кратны 4: шаг Tailwind, в лаунчере — в DIP. Отступы
      растут с уровнем вложенности: внутри элемента меньше, между разделами
      больше.
    </Lead>

    <H2>Шкала отступов</H2>
    <P>
      <C>space[4]</C> = 16 = <C>p-4</C>. Те же числа kit берёт для правила
      скругления: отступ контейнера вычитается из его радиуса.
    </P>
    <div className="my-5 flex flex-col gap-2.5 rounded-2xl bg-mist-100 p-5 dark:bg-mist-900">
      {byValue(space).map(([step, px]) => (
        <div key={step} className="flex flex-row items-center gap-4">
          <span className="w-10 shrink-0 font-mono text-sm">{step}</span>
          <span className="w-8 shrink-0 font-mono text-xs text-mist-500 dark:text-mist-400">
            {px}
          </span>
          <div
            className="h-4 rounded-sm bg-blue-500"
            style={{ width: Math.max(px * 6, 2) }}
          />
        </div>
      ))}
    </div>

    <H2>Модули</H2>
    <P>Типовые расстояния повторяются от экрана к экрану:</P>
    <div className="my-5 flex flex-col gap-3 rounded-3xl border border-dashed border-blue-500/40 bg-blue-500/5 p-6">
      {/* Раздел страницы: подпись, карточка со строками — отступы видны рамками */}
      <span className="text-xs font-medium tracking-wide text-mist-500 uppercase dark:text-mist-400">
        Игра · gap-3
      </span>
      <div className="flex flex-col rounded-xl bg-mist-50 dark:bg-mist-950">
        {['Музыка', 'Папка игры'].map((title, i) => (
          <div
            key={title}
            className={cx(
              'flex flex-col gap-0.5 p-4',
              i > 0 && 'border-t border-mist-200 dark:border-mist-800',
            )}
          >
            <span className="text-sm">{title}</span>
            <span className="text-xs text-mist-500 dark:text-mist-400">
              p-4 · gap-0.5 между заголовком и подписью
            </span>
          </div>
        ))}
      </div>
    </div>
    <Table
      head={['Класс', 'Где']}
      rows={USAGE.map(([cls, where]) => [<C>{cls}</C>, where])}
    />

    <H2>Сетка окна</H2>
    <P>
      Раскладка зависит от ширины окна: три режима, брейкпоинты{' '}
      {breakpoints.regular} и {breakpoints.wide}. В лаунчере режим даёт{' '}
      <C>useLayout()</C>, в вебе — обычные <C>sm:</C> / <C>md:</C> / <C>lg:</C>.
    </P>
    <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {MODES.map((item, i) => (
        <div
          key={item.mode}
          className="flex flex-col gap-3 rounded-2xl bg-mist-100 p-3 dark:bg-mist-900"
        >
          {/* Схема окна: панель слева, страница справа; ширина панели растёт с режимом */}
          <div className="flex h-24 flex-row gap-1.5 rounded-xl bg-mist-200 p-1.5 dark:bg-mist-800">
            <div
              className={cx(
                ['w-3', 'w-10', 'w-12'][i],
                'shrink-0 rounded-lg bg-mist-300 dark:bg-mist-700',
              )}
            />
            <div className="flex flex-1 items-center justify-center rounded-lg bg-mist-50 dark:bg-mist-950">
              <div
                className={cx(
                  ['w-[85%]', 'w-[80%]', 'w-[70%]'][i],
                  'h-3/5 rounded-md bg-blue-500/20',
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 px-1 pb-1">
            <span className="font-mono text-sm font-medium">{item.mode}</span>
            <span className="text-xs leading-5 text-mist-500 dark:text-mist-400">
              {item.width} · {item.padding}
            </span>
            <span className="text-xs leading-5 text-mist-500 dark:text-mist-400">
              {item.nav}
            </span>
          </div>
        </div>
      ))}
    </div>

    <H2>Рекомендации</H2>
    <Ul>
      <Li>
        Уровни разделяйте отступом и цветом поверхности, а не тенью и не рамкой
        вокруг всего подряд.
      </Li>
      <Li>
        Отступ внутри контейнера задаёт и радиус вложенного элемента — см.{' '}
        <A href={href('radius')}>Радиус скругления</A>.
      </Li>
      <Li>
        Элементы управления в строках настроек — одной ширины (<C>w-56</C>,
        широкие <C>w-80</C>), чтобы колонка справа не прыгала.
      </Li>
    </Ul>
  </article>
);
