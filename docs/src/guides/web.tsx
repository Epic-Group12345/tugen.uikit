import React from 'react';
import { href } from '../router';
import { Code } from '../ui/code';
import { A, C, H1, H2, Lead, Li, Note, P, Ul } from '../ui/prose';

export const Web: React.FC = () => (
  <article>
    <H1>Веб: Vite + React</H1>
    <Lead>
      Веб-слой <C>@tugen/uikit/web</C> — компоненты на React DOM, Radix и
      Tailwind 4. Никакого react-native-web: обычный Vite, обычные пакеты.
    </Lead>

    <H2>Установка</H2>
    <P>
      Kit подключается пакетом с закреплённым коммитом — так же, как в
      веб-сервисах TUGEN:
    </P>
    <Code
      language="bash"
      code={`yarn add react react-dom tailwindcss "@tugen/uikit@github:Epic-Group12345/tugen.uikit#<коммит>"
yarn add -D vite @vitejs/plugin-react @tailwindcss/vite`}
    />
    <P>
      Особой настройки Vite не нужно: kit и Radix собираются как обычные пакеты.
    </P>
    <Code
      language="ts"
      code={`// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
});`}
    />

    <H2>Стили</H2>
    <P>
      В главный CSS приложения добавьте стили kit сразу после Tailwind. Они
      подключают классы компонентов, тёмную тему и анимации появления окон.
    </P>
    <Code
      language="css"
      code={`/* global.css */
@import 'tailwindcss';
@import '@tugen/uikit/web.css';

body {
  @apply bg-mist-50 dark:bg-mist-950 text-mist-950 dark:text-mist-50 font-sans antialiased;
}`}
    />
    <Note title="Почему это важно">
      Tailwind собирает только те классы, что нашёл в исходниках. <C>web.css</C>{' '}
      указывает ему на файлы kit в <C>node_modules</C> — без этого импорта
      кнопки останутся без оформления.
    </Note>

    <H2>Первый экран</H2>
    <Code
      code={`import { Button, Row, Section, Toaster, Toggle } from '@tugen/uikit/web';

export const App = () => {
  const [music, setMusic] = useState(true);
  return (
    <>
      <Section title="Игра">
        <Row title="Музыка" description="Фоновая музыка">
          <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
        </Row>
      </Section>
      <Button variant="play" onClick={play}>Играть</Button>
      {/* один раз в корне — для toast() */}
      <Toaster />
    </>
  );
};`}
    />

    <H2>Тема</H2>
    <P>
      По умолчанию тема — как в системе (<C>prefers-color-scheme</C>). Чтобы
      задать её явно, вызовите <C>setTheme</C>: он ставит класс <C>dark</C> или{' '}
      <C>light</C> на <C>&lt;html&gt;</C>. Классы <C>dark:</C> в компонентах те
      же, что в лаунчере. Подробнее — <A href={href('colors')}>Цвета и тема</A>.
    </P>
    <Code
      language="ts"
      code={`import { setTheme } from '@tugen/uikit/web';

setTheme('dark');   // 'light' | 'dark' | 'system'`}
    />

    <H2>Окна, меню и подсказки</H2>
    <Ul>
      <Li>
        Всё всплывающее построено на Radix: фокус, Escape, клавиатура, положение
        у кнопки и порталы в <C>document.body</C> — его забота.
      </Li>
      <Li>
        <C>Button</C> и <C>IconButton</C> передают <C>ref</C> и все свойства{' '}
        <C>&lt;button&gt;</C>, поэтому работают триггером под <C>asChild</C>.
      </Li>
      <Li>
        <C>PopupHost</C> в вебе не нужен: он есть для совместимости с кодом
        лаунчера и ничего не рисует.
      </Li>
    </Ul>
    <Code
      code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">Ещё</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={rename}>Переименовать</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
    />

    <H2>Раскладка</H2>
    <P>
      <C>div</C> в вебе блочный, а не колонка, как <C>View</C> в React Native.
      Раскладку пишите явно — <C>flex flex-col</C>, <C>flex-row</C>. Брейкпоинты
      — обычные <C>sm:</C> / <C>md:</C> / <C>lg:</C> Tailwind: в вебе они
      работают как надо (в лаунчере для этого есть <C>useLayout()</C>).
    </P>

    <H2>Иконки</H2>
    <P>
      Kit не навязывает набор иконок. Свойство <C>icon</C> принимает любой
      компонент со свойствами <C>size</C> и <C>className</C> — например, иконки
      lucide-react, как на этом сайте. Цвет иконки задаёт класс <C>text-*</C>,
      который передаёт сам элемент, поэтому он совпадает с цветом текста рядом.
    </P>
    <Code
      code={`import { Download } from 'lucide-react';

<Button icon={Download}>Скачать</Button>`}
    />
  </article>
);
