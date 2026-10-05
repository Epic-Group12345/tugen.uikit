# tugen.uikit

UI-kit TUGEN: визуальный язык лаунчера (`DESIGN.md` в tugen.launcher) одним пакетом для всех частей
проекта. Один источник токенов — [tokens/tokens.json](tokens/tokens.json), из него три слоя:

| Где                                              | Что брать                          |
| ------------------------------------------------ | ---------------------------------- |
| лаунчер (React Native Windows), мини-приложения игр | компоненты `@tugen/uikit`          |
| веб на React (react-native-web)                  | те же компоненты `@tugen/uikit`    |
| веб без React — tugen.webservices (Nim + Vite)   | `@tugen/uikit/css` и `nim/tugen_uikit.nim` |

Цвета — палитра Tailwind 4 (`mist`, `blue`, `green`, `red`, `amber`, `violet`) в sRGB и роли поверх неё:
`page`, `card`, `text`, `textMuted`, `accent`, `play`… У каждой роли пара — для светлой и тёмной темы.

## React Native

```tsx
import { Button, Row, Section, ThemeProvider, Toggle } from '@tugen/uikit';

<ThemeProvider scheme={theme /* 'light' | 'dark'; без него — тема системы */}>
  <Section title='Игра'>
    <Row title='Музыка' description='Фоновая музыка в лаунчере'>
      <Toggle value={music} onChange={setMusic} accessibilityLabel='Музыка' />
    </Row>
  </Section>
  <Button variant='play' icon={Icons.Play}>Играть</Button>
</ThemeProvider>;
```

Элементы: `Text`, `Button`, `IconButton`, `Toggle`, `Slider`, `Segmented`, `CheckRow`, `TextField`, `Pill`,
`Surface`, `Card`, `Section`, `Row`, `Divider`, `EmptyState`, `Skeleton`, `SkeletonLines`. Хуки движения —
`usePressFeedback`, `useAnimatedFlag`, `useFlipOffset`, `StateLayers`. Цвета в своём коде —
`useTheme().colors.<роль>`, размеры — `radius`, `space`, `text`.

Иконки kit не навязывает: `icon` — любой компонент с `size` и `color` (`Icons.*` лаунчера, `@gravity-ui/icons`).
Kit не зависит от Uniwind и нативных модулей лаунчера — стили обычные (`StyleSheet`), поэтому он работает
и в мини-приложениях, и в браузере через react-native-web. Анимации — только opacity и transform, на
нативном драйвере (в вебе — без него).

## Веб без React

```js
import '@tugen/uikit/css'; // переменные --tg-* и классы .tg-*
```

```nim
# nim js --path:node_modules/@tugen/uikit/nim
import std/dom, tugen_uikit

mount(document.body)
document.getElementById("app").add section("Игра",
  row("Музыка", "Фоновая музыка", toggle(true, "Музыка", proc(on: bool) = echo on)))
```

Тема — как в системе; `setTheme(ctDark)` или `data-theme="dark"` на `<html>` задают её явно. Классы можно
писать и руками: `<button class="tg-button tg-button--play">`. Живой пример — [example/](example/).

## Подключение

Репозиторий приватный, поэтому пакет подключается сабмодулем: в лаунчере — `uikit/` и
`"@tugen/uikit": "link:./uikit"` в package.json. Так CI берёт его тем же токеном, что и ядро.

## Работа

```bash
yarn install
yarn typecheck
yarn test       # компоненты рисуются через react-native-web в jsdom
yarn css        # пересобрать css/tugen.css после правки tokens/tokens.json
nim js --path:nim -o:example/settings.js example/settings.nim   # пример для браузера
```
