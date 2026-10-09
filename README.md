# tugen.uikit

UI-kit TUGEN: визуальный язык лаунчера (`DESIGN.md` в tugen.launcher) одним пакетом для всех частей
проекта. Две библиотеки в одном пакете — по одной на платформу, с общими токенами и правилом скругления:

| Где                                                 | Что брать                                                  |
| --------------------------------------------------- | ---------------------------------------------------------- |
| лаунчер (React Native Windows), мини-приложения игр | `@tugen/uikit` — компоненты React Native на @rn-primitives + Uniwind |
| веб — Vite + React                                  | `@tugen/uikit/web` — компоненты React DOM на Radix + Tailwind |

Имена, варианты, размеры и классы у двух библиотек одни и те же (`Button variant="play"`, `Surface`,
`DropdownMenu`…), поэтому веб выглядит как лаунчер. Отличаются только соглашения платформы: в вебе — события
и доступность DOM (`onClick`, `aria-label`, атрибуты `<input>`).

Токены — [tokens/tokens.json](tokens/tokens.json). Цвета — палитра Tailwind 4 (`mist`, `blue`, `green`,
`red`, `amber`, `violet`) и роли поверх неё: `page`, `card`, `text`, `textMuted`, `accent`, `play`… У каждой
роли пара — для светлой и тёмной темы; в компонентах роли записаны классами Tailwind (в лаунчере их читает Uniwind).

## React Native

```tsx
import { Button, Row, Section, Toggle } from '@tugen/uikit';

<Section title="Игра">
  <Row title="Музыка" description="Фоновая музыка в лаунчере">
    <Toggle value={music} onChange={setMusic} accessibilityLabel="Музыка" />
  </Row>
</Section>;
<Button variant="play" icon={Icons.Play}>
  Играть
</Button>;
```

Оформление — классы [Uniwind](https://uniwind.dev) (Tailwind для React Native), как в самом лаунчере:
цвета, отступы и скругления пишутся классами целиком (`bg-mist-200 dark:bg-mist-800`), тему
переключает приложение (`Uniwind.setTheme`), а `dark:` в классах следует за ней. Поэтому сборка
приложения должна видеть исходники kit — в её `global.css` добавьте строку `@source`:

```css
@source "../../uikit/src/**/*.{ts,tsx}"; /* путь до src пакета @tugen/uikit */
@import 'tailwindcss';
@import 'uniwind';
```

### Элементы

Поведение и доступность (роли, `aria-*`, фокус экранного диктора, управление с клавиатуры в вебе) дают
[react-native primitives](https://rnprimitives.com) (`@rn-primitives/*`), оформление и поведение на Windows — kit.
API составной, как в shadcn: `Dialog` + `DialogTrigger` + `DialogContent`…, пропсы примитивов (`asChild`, `onOpenChange`,
`defaultValue`) проходят насквозь. Для частых случаев есть короткие варианты одной строкой (`Select`, `Dropdown`, `Tip`).

| Группа       | Элементы                                                                                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| основа       | `Text`, `Button` (primary, secondary, play, ghost, outline, danger; sm/md/lg), `IconButton`, `Kbd`, `KbdCombo`                                                              |
| поверхности  | `Surface`, `Card`, `Section`, `Row`, `Divider`, `EmptyState`, `Skeleton`, `SkeletonLines`                                                                                   |
| формы        | `TextField` (leading/trailing), `Field`, `Label`, `Checkbox`, `CheckRow`, `RadioGroup`, `RadioRow`, `Toggle`/`Switch`, `ToggleButton`, `ToggleGroup`, `Segmented`, `Slider` |
| выбор и меню | `Select` / `SelectRoot`…, `Dropdown` / `DropdownMenu`…, `ContextMenu`… (долгое нажатие и правая кнопка), `Menu`                                                             |
| окна         | `Dialog`, `AlertDialog`, `Sheet`, `Popover`, `HoverCard`, `Tooltip` / `Tip`                                                                                                 |
| отображение  | `Tabs` (segmented, underline, vertical), `Accordion`, `Collapsible`, `Avatar`, `AvatarGroup`, `Progress`, `Alert`, `Pill`                                                   |
| уведомления  | `Toaster` + `toast({ title, description, tone, action })`, `toast.dismiss(id)`                                                                                              |

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="danger">Удалить сборку</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Удалить «Выживание»?</DialogTitle>
      <DialogDescription>Миры останутся в папке saves.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary">Отмена</Button>
      </DialogClose>
      <Button variant="danger" onPress={remove}>
        Удалить
      </Button>
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

| Контейнер                                                    | Радиус и отступ                | Вложенное        |
| ------------------------------------------------------------ | ------------------------------ | ---------------- |
| меню, `Select`, `Popover`, `HoverCard`, `Alert`              | `rounded-xl` + `p-1` (12 − 4)  | `rounded-lg` (8) |
| `Dialog`, `AlertDialog`, `Sheet`, уведомление                | `rounded-2xl` + `p-2` (16 − 8) | `rounded-lg` (8) |
| `ToggleGroup`, `Segmented`, `Tabs` segmented, поле с кнопкой | `rounded-lg` + `p-0.5` (8 − 2) | `rounded-md` (6) |
| то же в виде капсулы                                         | `rounded-full` + `p-0.5`       | `rounded-full`   |

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
  закрывает верхнее окно любого вида (меню, `Dialog`, `Sheet`, `Popover`).
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
  ```

  Без алиаса всё работает на исходном пакете, с его ограничением.

Иконки kit не навязывает: `icon` — любой компонент с `size` и `className`, то есть `Icons.<Имя>` лаунчера.
Цвет иконки задаёт класс `text-*`, который передаёт сам элемент, поэтому он совпадает с цветом соседнего
текста. Нативных модулей лаунчера kit не требует. Анимации — только opacity и transform, на нативном
драйвере; цвета не анимируются, их меняют слои `StateLayers`.

## Веб: Vite + React

```bash
yarn add react react-dom tailwindcss @tugen/uikit
yarn add -D vite @vitejs/plugin-react @tailwindcss/vite
```

```ts
// vite.config.ts — ничего особого: kit и Radix собираются как обычные пакеты
plugins: [tailwindcss(), react()];
```

```css
/* global.css */
@import 'tailwindcss';
@import '@tugen/uikit/web.css'; /* классы компонентов kit, тёмная тема, анимации появления */
```

```tsx
import { Button, DropdownMenu, Section, Row, Toggle, Toaster, setTheme } from '@tugen/uikit/web';

<Section title="Игра">
  <Row title="Музыка" description="Фоновая музыка">
    <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
  </Row>
</Section>;
<Button variant="play" onClick={play}>Играть</Button>;
```

- **Тема** — как в системе (`prefers-color-scheme`); `setTheme('dark' | 'light' | 'system')` задаёт её явно
  классом на `<html>`. Классы `dark:` в компонентах те же, что в лаунчере.
- **Окна, меню, списки, подсказки** — на Radix: фокус, Escape, клавиатура, положение у кнопки и порталы в
  `document.body` — его. `PopupHost` в вебе не нужен (есть для совместимости и ничего не рисует), `<Toaster />`
  поставьте один раз в корне.
- **Триггеры.** `Button` и `IconButton` передают `ref` и все свойства `<button>`, поэтому работают под `asChild`:
  `<DropdownMenuTrigger asChild><Button>Меню</Button></DropdownMenuTrigger>`.
- **Брейкпоинты** — обычные `sm:` / `md:` Tailwind: в вебе они работают как надо.

Витрина всех элементов веб-слоя — [example/](example/): `yarn gallery` запускает её в Vite, `yarn gallery:build`
собирает (так её проверяет CI).

## Документация

Сайт документации — [docs/](docs/): введение, установка для веба и лаунчера, цвета, токены, правило скругления и
страница на каждый компонент — живые примеры, их код и свойства для веба и React Native. `yarn docs` запускает его
в Vite, `yarn docs:build` собирает статический сайт в `docs/dist` (открывается с любого адреса).

Таблицы свойств собираются из типов kit (`docs/props-plugin.ts`): описание свойства — его JSDoc в исходниках.
Страница компонента — папка `docs/src/components/<имя>/`: `page.tsx` с описанием и примеры `*.example.tsx`,
код которых показывается на странице как есть.

## Подключение

В лаунчере — сабмодулем `uikit/` и `"@tugen/uikit": "link:./uikit"` в package.json; в остальных
репозиториях — пакетом с закреплённым коммитом: `"@tugen/uikit": "github:Epic-Group12345/tugen.uikit#<коммит>"`.

## Работа

```bash
yarn install
yarn typecheck
yarn test       # компоненты лаунчера (через react-native-web в jsdom) и веб-слоя (React DOM)
yarn gallery    # витрина веб-слоя в браузере (Vite)
yarn docs       # сайт документации (Vite)
```
