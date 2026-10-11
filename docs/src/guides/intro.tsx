import React from 'react';
import { Button, Surface, Text, Toggle } from '@tugen/uikit/web';
import { Play } from 'lucide-react';
import { href } from '../router';
import { Code } from '../ui/code';
import { A, C, H1, H2, Lead, Li, P, Table, Ul } from '../ui/prose';

const Hero: React.FC = () => {
  const [music, setMusic] = React.useState(true);
  return (
    <Surface
      kind="card"
      radius="2xl"
      padding="2"
      className="my-8 flex flex-col gap-2 sm:flex-row"
    >
      <Surface
        kind="page"
        nested
        padding="4"
        className="flex flex-1 flex-col gap-3"
      >
        <Text size="xs" tone="muted" uppercase>
          Выживание · 1.21.4
        </Text>
        <Text size="lg" weight="semibold">
          Сборка готова к запуску
        </Text>
        <Button variant="play" size="lg" icon={Play} className="self-start">
          Играть
        </Button>
      </Surface>
      <Surface
        kind="page"
        nested
        padding="4"
        className="flex flex-1 flex-row items-center gap-3"
      >
        <div className="flex flex-1 flex-col">
          <Text weight="semibold">Музыка</Text>
          <Text size="xs" tone="muted">
            Фоновая музыка в лаунчере
          </Text>
        </div>
        <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
      </Surface>
    </Surface>
  );
};

export const Intro: React.FC = () => (
  <article>
    <H1>TUGEN UI-kit</H1>
    <Lead>
      Визуальный язык лаунчера TUGEN одним пакетом: токены, правило скругления и
      готовые компоненты — для лаунчера, мини-приложений игр и веба.
    </Lead>
    <Hero />

    <H2>Две библиотеки, один вид</H2>
    <P>
      В пакете <C>@tugen/uikit</C> две библиотеки, по одной на платформу. Имена,
      варианты, размеры и классы у них одни и те же, поэтому сайт на Vite
      выглядит так же, как лаунчер, а код переносится почти без правок.
    </P>
    <Table
      head={['Где', 'Что брать', 'На чём']}
      rows={[
        [
          'Лаунчер (React Native Windows), мини-приложения',
          <C>@tugen/uikit</C>,
          '@rn-primitives + Uniwind',
        ],
        ['Веб на Vite + React', <C>@tugen/uikit/web</C>, 'Radix + Tailwind 4'],
      ]}
    />
    <P>
      Отличаются только соглашения платформы. В вебе — события и доступность
      DOM: <C>onClick</C>, <C>aria-label</C>, атрибуты <C>&lt;input&gt;</C>. В
      React Native — <C>onPress</C> и <C>accessibilityLabel</C>. Таблицы свойств
      на страницах компонентов показывают обе версии.
    </P>
    <Code
      code={`// веб
import { Button } from '@tugen/uikit/web';
<Button variant="play" onClick={play}>Играть</Button>

// лаунчер
import { Button } from '@tugen/uikit';
<Button variant="play" onPress={play}>Играть</Button>`}
    />

    <H2>Принципы</H2>
    <Ul>
      <Li>
        <b>Спокойный нейтральный интерфейс</b> в духе Windows 11: серая шкала{' '}
        <C>mist</C>, один акцентный синий, мягкие скругления, без теней и
        градиентов в обычных элементах.
      </Li>
      <Li>
        <b>Цвет несёт смысл, а не украшает.</b> Зелёный — игра и успех, красный
        — ошибка и опасное действие, янтарный — предупреждение. Подробнее —{' '}
        <A href={href('colors')}>Цвета и тема</A>.
      </Li>
      <Li>
        <b>Внешний радиус = внутренний + отступ.</b> В kit это не
        договорённость, а механизм: вложенные элементы сами берут нужный радиус.
        См. <A href={href('radius')}>Правило скругления</A>.
      </Li>
      <Li>
        <b>Поведение — из примитивов, оформление — kit.</b> Фокус, клавиатура,
        роли и положение окон дают Radix в вебе и rn-primitives в лаунчере.
      </Li>
      <Li>
        <b>Анимации — только opacity и transform</b>: дёшево и плавно на обеих
        платформах.
      </Li>
    </Ul>

    <H2>С чего начать</H2>
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {[
        ['web', 'Веб: Vite + React', 'Установка, стили, тема и окна на Radix'],
        [
          'native',
          'Лаунчер: React Native',
          'Uniwind, слой окон, Escape и порталы',
        ],
        [
          'radius',
          'Правило скругления',
          'Как kit считает радиусы вложенных элементов',
        ],
        ['components/button', 'Компоненты', 'Живые примеры, код и свойства'],
      ].map(([path, title, text]) => (
        <a key={path} href={href(path)} className="flex flex-col">
          <Surface
            kind="card"
            padding="4"
            className="flex flex-1 flex-col gap-1 transition-colors hover:bg-mist-200 dark:hover:bg-mist-800"
          >
            <Text weight="semibold">{title}</Text>
            <Text tone="muted">{text}</Text>
          </Surface>
        </a>
      ))}
    </div>
  </article>
);
