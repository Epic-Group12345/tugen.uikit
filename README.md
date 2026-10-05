# tugen.uikit

UI-kit TUGEN: визуальный язык лаунчера (`DESIGN.md` в tugen.launcher) одним пакетом для всех частей
проекта. Один источник токенов — [tokens/tokens.json](tokens/tokens.json), из него три слоя:

| Где                                              | Что брать                          |
| ------------------------------------------------ | ---------------------------------- |
| лаунчер (React Native Windows), мини-приложения игр | компоненты `@tugen/uikit` + Uniwind |
| веб на React (react-native-web)                  | те же компоненты и плагин Uniwind для Vite |
| веб без React — tugen.webservices (Nim + Vite)   | `@tugen/uikit/css` и `nim/tugen_uikit.nim` |

Цвета — палитра Tailwind 4 (`mist`, `blue`, `green`, `red`, `amber`, `violet`) и роли поверх неё:
`page`, `card`, `text`, `textMuted`, `accent`, `play`… У каждой роли пара — для светлой и тёмной темы.
В компонентах роли записаны классами Uniwind, в вебе без React — теми же цветами в переменных `--tg-*`.

## React Native

```tsx
import { Button, Row, Section, Toggle } from '@tugen/uikit';

<Section title='Игра'>
  <Row title='Музыка' description='Фоновая музыка в лаунчере'>
    <Toggle value={music} onChange={setMusic} accessibilityLabel='Музыка' />
  </Row>
</Section>;
<Button variant='play' icon={Icons.Play}>Играть</Button>;
```

Оформление — классы [Uniwind](https://uniwind.dev) (Tailwind для React Native), как в самом лаунчере:
цвета, отступы и скругления пишутся классами целиком (`bg-mist-200 dark:bg-mist-800`), тему
переключает приложение (`Uniwind.setTheme`), а `dark:` в классах следует за ней. Поэтому сборка
приложения должна видеть исходники kit — в её `global.css` добавьте строку `@source`:

```css
@source "../../uikit/src/**/*.{ts,tsx}";   /* путь до src пакета @tugen/uikit */
@import 'tailwindcss';
@import 'uniwind';
```

Элементы: `Text`, `Button`, `IconButton`, `Toggle`, `Slider`, `Segmented`, `CheckRow`, `TextField`, `Pill`,
`Surface`, `Card`, `Section`, `Row`, `Divider`, `EmptyState`, `Skeleton`, `SkeletonLines`, `Menu`, `Dropdown`,
`Select`.

Всплывающие окна (`Popup`, меню, `Select`) — виртуальные: рисуются самим React Native поверх окна приложения,
без нативного окна-попапа (он в RNW оказался нестабильным). Для них в корне приложения нужен `<PopupHost />`,
последним; Escape в RNW передайте в `dismissPopup()` из обработчика клавиш корня (в вебе слой ловит его сам).
Окно не выходит за границы окна приложения: встаёт под якорем, над ним, если снизу нет места, и
прижимается к краю. Хуки движения —
`usePressFeedback`, `useAnimatedFlag`, `useFlipOffset`, `StateLayers`. Числовые токены там, где классов не хватает (длительности
анимаций, размеры в `StyleSheet`) — `motion`, `radius`, `space`, `text`, `breakpoints`.

Иконки kit не навязывает: `icon` — любой компонент с `size` и `className`, то есть `Icons.<Имя>` лаунчера.
Цвет иконки задаёт класс `text-*`, который передаёт сам элемент, поэтому он совпадает с цветом соседнего
текста. Нативных модулей лаунчера kit не требует. Анимации — только opacity и transform, на нативном
драйвере (в вебе — без него); цвета не анимируются, их меняют слои `StateLayers`.

В браузере на React те же компоненты работают через react-native-web с
[плагином Uniwind для Vite](https://uniwind.dev): он подменяет `react-native` своими обёртками, которые
понимают `className`.

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

В лаунчере — сабмодулем `uikit/` и `"@tugen/uikit": "link:./uikit"` в package.json; в остальных
репозиториях — пакетом с закреплённым коммитом: `"@tugen/uikit": "github:Epic-Group12345/tugen.uikit#<коммит>"`.

## Работа

```bash
yarn install
yarn typecheck
yarn test       # компоненты рисуются через react-native-web в jsdom
yarn css        # пересобрать css/tugen.css после правки tokens/tokens.json
nim js --path:nim -o:example/settings.js example/settings.nim   # пример для браузера
```
