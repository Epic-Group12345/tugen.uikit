import React from 'react';
import { Button, Icons, cx, palette } from '@tugen/uikit/web';
import { href } from '../router';
import { Rule, download } from '../ui/blocks';
import { Logo, Mark, logoSvg, markSvg, type LogoTone } from '../ui/logo';
import { A, C, H1, H2, H3, Lead, Li, Note, P, Table, Ul } from '../ui/prose';

// Брендирование: логотип и его варианты, охранное поле, цвета бренда и чего с логотипом не делать.
// Логотип рабочий — знак повторяет значок сайта; файлы отдаём из того же SVG, что на превью

const VARIANTS: {
  tone: LogoTone;
  title: string;
  text: string;
  bg: string;
}[] = [
  {
    tone: 'color',
    title: 'Цветной',
    text: 'Основной вариант — на светлом и тёмном фоне сайта и лаунчера',
    bg: 'bg-mist-50 dark:bg-mist-950 border border-mist-200 dark:border-mist-800',
  },
  {
    tone: 'light',
    title: 'Светлый',
    text: 'На тёмных и насыщенных фонах, на скриншотах игр',
    bg: 'bg-mist-950',
  },
  {
    tone: 'dark',
    title: 'Тёмный',
    text: 'Одноцветная печать и светлые фоны без цвета',
    bg: 'bg-mist-50 border border-mist-200 dark:border-mist-800',
  },
];

const BRAND_COLORS = [
  {
    name: 'blue-500',
    hex: palette.blue[500],
    role: 'Знак, ссылки, главное действие',
  },
  { name: 'green-600', hex: palette.green[600], role: 'Кнопка «Играть»' },
  { name: 'mist-950', hex: palette.mist[950], role: 'Надпись, тёмный фон' },
  {
    name: 'mist-50',
    hex: palette.mist[50],
    role: 'Светлый фон, знак на тёмном',
  },
];

export const Branding: React.FC = () => (
  <article>
    <H1>Брендирование</H1>
    <Lead>
      Как выглядит TUGEN за пределами интерфейса: логотип, его варианты и цвета,
      которые с ним работают. Эти правила — для сайтов, баннеров, обложек в
      каталогах и материалов партнёров.
    </Lead>
    <Note title="Рабочий вариант">
      Знак повторяет значок сайта, надпись набрана Ubuntu Sans. Финальные файлы
      логотипа придут вместе с брендбуком — страница обновится, а правила ниже
      останутся.
    </Note>

    <H2>Логотип</H2>
    <P>
      Логотип состоит из знака — синего квадрата со скруглением и буквой T — и
      надписи TUGEN. Знак без надписи работает там, где места мало: значок
      приложения, вкладка браузера, аватар в соцсетях.
    </P>
    <div className="my-6 flex flex-col items-center justify-center gap-8 rounded-3xl border border-mist-200 bg-mist-100 px-6 py-14 sm:flex-row sm:gap-14 dark:border-mist-800 dark:bg-mist-900">
      <Logo size="lg" />
      <Mark size={64} />
    </div>

    <H3>Варианты</H3>
    <div className="my-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {VARIANTS.map(item => (
        <div key={item.tone} className="flex flex-col gap-3">
          <div
            className={cx(
              'flex h-32 items-center justify-center rounded-2xl',
              item.bg,
            )}
          >
            <Logo tone={item.tone} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{item.title}</span>
            <span className="text-sm leading-6 text-mist-500 dark:text-mist-400">
              {item.text}
            </span>
          </div>
          <div className="flex flex-row flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={Icons.ArrowDownToLine}
              onClick={() =>
                download(
                  `tugen-logo-${item.tone}.svg`,
                  logoSvg(item.tone),
                  'image/svg+xml',
                )
              }
            >
              Логотип
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={Icons.ArrowDownToLine}
              onClick={() =>
                download(
                  `tugen-mark-${item.tone}.svg`,
                  markSvg(item.tone, 256),
                  'image/svg+xml',
                )
              }
            >
              Знак
            </Button>
          </div>
        </div>
      ))}
    </div>

    <H2>Охранное поле</H2>
    <P>
      Вокруг логотипа оставляйте свободное поле не меньше половины высоты знака:
      ни текст, ни край баннера, ни другие логотипы в него не заходят.
      Минимальная высота знака — 16 px на экране, логотипа с надписью — 20 px.
    </P>
    <div className="my-6 flex items-center justify-center rounded-3xl border border-mist-200 bg-mist-100 px-6 py-12 dark:border-mist-800 dark:bg-mist-900">
      {/* Поле — пунктирная рамка с отступом в половину знака (48 / 2 = 24) */}
      <div className="rounded-xl border-2 border-dashed border-blue-500/50 bg-blue-500/5 p-6">
        <Logo size="lg" />
      </div>
    </div>

    <H2>Цвета бренда</H2>
    <P>
      Бренд говорит теми же цветами, что и интерфейс: синий акцент, зелёный
      «Играть» и серая шкала <C>mist</C>. Своих оттенков у бренда нет — полная
      палитра на странице <A href={href('colors')}>Цвета</A>.
    </P>
    <div className="my-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {BRAND_COLORS.map(color => (
        <div
          key={color.name}
          className="flex flex-col overflow-hidden rounded-2xl border border-mist-200 dark:border-mist-800"
        >
          <div className="h-24" style={{ backgroundColor: color.hex }} />
          <div className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="font-mono text-sm font-medium">{color.name}</span>
            <span className="font-mono text-xs text-mist-500 dark:text-mist-400">
              {color.hex}
            </span>
            <span className="text-xs leading-5 text-mist-500 dark:text-mist-400">
              {color.role}
            </span>
          </div>
        </div>
      ))}
    </div>

    <H2>Использование</H2>
    <div className="my-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <Rule tone="do" caption="Логотип на спокойном фоне, с охранным полем.">
        <Logo />
      </Rule>
      <Rule
        tone="dont"
        caption="Не растягивайте и не сжимайте логотип по одной оси."
      >
        <div className="flex scale-x-150">
          <Logo />
        </div>
      </Rule>
      <Rule tone="do" caption="На тёмном фоне — светлый вариант.">
        <div className="flex rounded-xl bg-mist-950 px-5 py-4">
          <Logo tone="light" />
        </div>
      </Rule>
      <Rule
        tone="dont"
        caption="Не перекрашивайте знак в другие цвета и не добавляйте тени."
      >
        <div className="flex -rotate-6 opacity-70 drop-shadow-lg hue-rotate-90">
          <Logo />
        </div>
      </Rule>
    </div>
    <Ul>
      <Li>
        Не меняйте пропорции знака и надписи и не набирайте надпись другим
        шрифтом.
      </Li>
      <Li>
        Не ставьте логотип на пёстрый фон без подложки: на скриншоте игры —
        светлый вариант на затемнении <C>mist-950/50</C>.
      </Li>
      <Li>Не поворачивайте логотип и не делайте из него обводку.</Li>
    </Ul>

    <H2>Название</H2>
    <Table
      head={['Где', 'Как писать']}
      rows={[
        ['Логотип, заголовки, шапка сайта', <b>TUGEN</b>],
        ['Текст, описания, магазины приложений', 'TUGEN — лаунчер Minecraft'],
        ['Пакеты и адреса', <C>@tugen/uikit</C>],
      ]}
    />
  </article>
);
