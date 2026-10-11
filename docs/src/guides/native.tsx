import React from 'react';
import { Code } from '../ui/code';
import { A, C, H1, H2, Lead, Li, Note, P, Ul } from '../ui/prose';

export const Native: React.FC = () => (
  <article>
    <H1>Лаунчер: React Native</H1>
    <Lead>
      <C>@tugen/uikit</C> — компоненты React Native на{' '}
      <A href="https://rnprimitives.com">@rn-primitives</A> и{' '}
      <A href="https://uniwind.dev">Uniwind</A>. Их использует лаунчер на React
      Native Windows и мини-приложения игр.
    </Lead>
    <Note>
      Живые примеры на этом сайте сделаны веб-слоем: он выглядит так же. Код для
      лаунчера отличается событиями (<C>onPress</C> вместо <C>onClick</C>) и
      подписями (<C>accessibilityLabel</C> вместо <C>aria-label</C>) — смотрите
      вкладку «React Native» в свойствах компонента.
    </Note>

    <H2>Подключение</H2>
    <P>
      В лаунчере kit — сабмодуль <C>uikit/</C>, в остальных репозиториях — пакет
      с закреплённым коммитом:
    </P>
    <Code
      language="json"
      code={`// лаунчер
"@tugen/uikit": "link:./uikit"

// другие репозитории
"@tugen/uikit": "github:Epic-Group12345/tugen.uikit#<коммит>"`}
    />

    <H2>Uniwind</H2>
    <P>
      Оформление — классы Uniwind (Tailwind для React Native), как в самом
      лаунчере. Сборка приложения должна видеть исходники kit, поэтому в её{' '}
      <C>global.css</C> добавьте <C>@source</C>:
    </P>
    <Code
      language="css"
      code={`@source "../../uikit/src/**/*.{ts,tsx}"; /* путь до src пакета @tugen/uikit */
@import 'tailwindcss';
@import 'uniwind';`}
    />
    <P>
      Тему переключает приложение (<C>Uniwind.setTheme</C>), а <C>dark:</C> в
      классах kit следует за ней. Своей темы kit не держит.
    </P>

    <H2>Слой окон</H2>
    <P>
      Последними в корне приложения — уведомления и слой окон (порталы
      примитивов):
    </P>
    <Code
      code={`import { PopupHost, Toaster } from '@tugen/uikit';

<App />
<Toaster />
<PopupHost />`}
    />
    <Ul>
      <Li>
        <b>Escape.</b> В RNW клавиши приходят элементу с фокусом, поэтому корень
        приложения ловит Escape и зовёт <C>dismissPopup()</C> — она закрывает
        верхнее окно любого вида: меню, <C>Dialog</C>, <C>Sheet</C>,{' '}
        <C>Popover</C>.
      </Li>
      <Li>
        <b>Положение окон.</b> Встроенное в примитивы прижимает окна к размеру
        экрана (на Windows это весь монитор). Kit ставит окна сам: по размеру{' '}
        <C>PopupHost</C>, под кнопкой или над ней, в пределах окна приложения.
        Смена размера окна закрывает открытые окна.
      </Li>
    </Ul>

    <H2>Портал</H2>
    <P>
      У <C>PortalHost</C> из <C>@rn-primitives/portal</C> нет ключей у порталов:
      закрытие окна из середины стопки сбрасывает состояние следующих. Kit даёт
      исправленную замену с тем же API — подключите её алиасом в Metro:
    </P>
    <Code
      language="js"
      code={`// metro.config.js: extraNodeModules не подойдёт — пакет установлен и находится раньше
resolver: {
  resolveRequest: (context, name, platform) =>
    context.resolveRequest(
      context,
      name === '@rn-primitives/portal' ? '@tugen/uikit/rn-primitives-portal' : name,
      platform,
    ),
}`}
    />
    <P>Без алиаса всё работает на исходном пакете, с его ограничением.</P>

    <H2>Отличия от веба</H2>
    <Ul>
      <Li>
        События — <C>onPress</C>, <C>onChangeText</C>; подписи —{' '}
        <C>accessibilityLabel</C>.
      </Li>
      <Li>
        Наведение и нажатие рисуют слои <C>StateLayers</C> с анимацией
        прозрачности на нативном драйвере: цвет в RN не анимируется.
      </Li>
      <Li>
        Брейкпоинты — <C>useLayout()</C> лаунчера (<C>compact</C> /{' '}
        <C>regular</C> / <C>wide</C>), а не <C>sm:</C> / <C>md:</C>: на RNW они
        срабатывают не там.
      </Li>
      <Li>
        <C>View</C> — колонка по умолчанию, поэтому <C>flex-col</C> писать не
        нужно.
      </Li>
      <Li>
        Нативных модулей лаунчера kit не требует, иконки —{' '}
        <C>Icons.&lt;Имя&gt;</C> лаунчера или любой компонент с <C>size</C> и{' '}
        <C>className</C>.
      </Li>
    </Ul>
  </article>
);
