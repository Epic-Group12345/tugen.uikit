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

### Элементы

Поведение и доступность (роли, `aria-*`, фокус экранного диктора, управление с клавиатуры в вебе) дают
[react-native primitives](https://rnprimitives.com) (`@rn-primitives/*`), оформление и поведение на Windows — kit.
API составной, как в shadcn: `Dialog` + `DialogTrigger` + `DialogContent`…, пропсы примитивов (`asChild`, `onOpenChange`,
`defaultValue`) проходят насквозь. Для частых случаев есть короткие варианты одной строкой (`Select`, `Dropdown`, `Tip`).

| Группа         | Элементы                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------- |
| основа         | `Text`, `Button` (primary, secondary, play, ghost, outline, danger; sm/md/lg), `IconButton`, `Kbd`, `KbdCombo` |
| поверхности    | `Surface`, `Card`, `Section`, `Row`, `Divider`, `EmptyState`, `Skeleton`, `SkeletonLines`    |
| формы          | `TextField` (leading/trailing), `Field`, `Label`, `Checkbox`, `CheckRow`, `RadioGroup`, `RadioRow`, `Toggle`/`Switch`, `ToggleButton`, `ToggleGroup`, `Segmented`, `Slider` |
| выбор и меню   | `Select` / `SelectRoot`…, `Dropdown` / `DropdownMenu`…, `ContextMenu`… (долгое нажатие и правая кнопка), `Menu` |
| окна           | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `HoverCard`, `Tooltip` / `Tip`                  |
| отображение    | `Tabs` (segmented, underline, vertical), `Accordion`, `Collapsible`, `Avatar`, `AvatarGroup`, `Progress`, `Alert`, `Pill` |
| уведомления    | `Toaster` + `toast({ title, description, tone, action })`, `toast.dismiss(id)`               |

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant='danger'>Удалить сборку</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Удалить «Выживание»?</DialogTitle>
      <DialogDescription>Миры останутся в папке saves.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant='secondary'>Отмена</Button></DialogClose>
      <Button variant='danger' onPress={remove}>Удалить</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Правило скругления

**Внешний радиус = внутренний радиус + отступ между краями.** Тогда край вложенного элемента идёт параллельно
краю контейнера, а не расходится в углу. В kit это не договорённость, а механизм (`src/radius.tsx`):

- контейнер объявляет свой радиус и отступ — `<RadiusScope radius='xl' padding='1'>` или `<Surface padding='2'>`;
- элемент у края контейнера берёт радиус из `useInnerRadius(запасной)`, а класс — из `radiusProps(px)`
  (радиус вне шкалы уходит в `style`). Так делают `Button`, `IconButton`, пункты меню, сегменты, вкладки, `Surface nested`.

Пары, на которых стоят элементы kit:

| Контейнер                                   | Радиус и отступ      | Вложенное            |
| ------------------------------------------- | -------------------- | -------------------- |
| меню, `Select`, `Popover`, `HoverCard`, `Alert` | `rounded-xl` + `p-1` (12 − 4) | `rounded-lg` (8)     |
| `Dialog`, `AlertDialog`, `Sheet`, уведомление | `rounded-2xl` + `p-2` (16 − 8) | `rounded-lg` (8)     |
| `ToggleGroup`, `Segmented`, `Tabs` segmented, поле с кнопкой | `rounded-lg` + `p-0.5` (8 − 2) | `rounded-md` (6)     |
| то же в виде капсулы                        | `rounded-full` + `p-0.5` | `rounded-full`       |

Свой контейнер: `<Surface kind='overlay' radius='3xl' padding='3'>` — вложенный `<Surface nested>` получит `rounded-xl`,
кнопка внутри него — по его отступу. Хелперы `innerRadius('2xl', '2') === 8` и `outerRadius('lg', '1') === 12` — для
расчётов руками.

### Подключение примитивов в приложении

```tsx
// корень приложения: последним — слой окон (порталы примитивов, Popup) и уведомления
<App />
<Toaster />
<PopupHost />
```

- **Escape.** В RNW клавиши приходят фокусу, поэтому корень приложения ловит Escape и зовёт `dismissPopup()` — она
  закрывает верхнее окно любого вида (меню, `Dialog`, `Sheet`, `Popover`). В вебе это делают Radix и сам `PopupHost`.
- **Положение окон.** Встроенное в примитивы прижимает окна к размеру экрана (на Windows это весь монитор) и не
  переворачивает их. Kit ставит окна сам: по размеру `PopupHost`, под кнопкой или над ней, в пределах окна приложения.
  Смена размера окна закрывает открытые окна.
- **Портал.** У `PortalHost` из `@rn-primitives/portal` нет ключей у порталов: закрытие окна из середины стопки
  сбрасывает состояние следующих. Kit даёт исправленную замену с тем же API — подключите её алиасом:

  ```js
  // metro.config.js: extraNodeModules не подойдёт — пакет установлен и находится раньше
  resolver: {
    resolveRequest: (context, name, platform) =>
      context.resolveRequest(
        context,
        name === '@rn-primitives/portal' ? '@tugen/uikit/rn-primitives-portal' : name,
        platform,
      ),
  }
  // vite.config.ts
  resolve: { alias: { '@rn-primitives/portal': '@tugen/uikit/rn-primitives-portal' } }
  ```

  Без алиаса всё работает на исходном пакете, с его ограничением.
- **Веб.** Пакеты `@rn-primitives/*` публикуют JSX в `.js` и выбирают реализацию по расширению (`dialog.web.js` —
  на Radix). Vite должен знать `.web.js` в `resolve.extensions` и прогонять `@rn-primitives` через esbuild с `loader: jsx`.

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
писать и руками: `<button class="tg-button tg-button--play">`. Живой пример — [example/](example/),
все элементы на одной странице — [example/gallery.html](example/gallery.html).

Процедуры Nim повторяют компоненты RN: `dialog` и `sheet` (объект `Modal` с `open` / `close`, Escape и
нажатие по затемнению), `dropdownMenu`, `contextMenu`, `select`, `popover`, `hoverCard`, `tooltip`, `tabs`,
`accordion`, `collapsible`, `checkbox`, `radioGroup`, `toggleButton`, `toggleGroup`, `switch`, `formLabel`,
`field`, `inputField`, `progress`, `avatar`, `avatarGroup`, `alert`, `toast`, `kbd`, `kbdCombo`, `surface`.

Правило радиусов в CSS: контейнер (`.tg-menu`, `.tg-dialog`, `.tg-segmented`… или свой
`class="tg-scope" style="--tg-outer: 16px; --tg-pad: 8px"`) задаёт `--tg-outer` и `--tg-pad`, из них
считается `--tg-inner`; кнопки, пункты, сегменты и `.tg-nested` у его края берут `var(--tg-inner, свой
радиус)`. Поверхность с отступом — `tg-card tg-pad--2`, вложенная — `tg-nested`.

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
nim js --path:nim -o:example/gallery.js example/gallery.nim     # витрина всех элементов
```
