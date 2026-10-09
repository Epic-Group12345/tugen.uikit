# tugen.uikit

UI-kit TUGEN: токены и компоненты React Native на Uniwind — одна библиотека для лаунчера, мини-приложений
и веба (Vite + React через react-native-web). Описание — [README.md](README.md); визуальный язык — `DESIGN.md` в tugen.launcher.

## Команды

```bash
yarn typecheck
yarn test
yarn gallery    # витрина в браузере (Vite); yarn gallery:build — сборка, как в CI
npx prettier --check src __tests__
```

## Правила

- **Токены — только в `tokens/tokens.json`**; `src/tokens.ts` читает JSON сам.
- Новый элемент — компонент в `src/components/` и пример в витрине `example/src/gallery.tsx`. Проверь его
  в браузере (`yarn gallery`): веб-версии примитивов на Radix ведут себя иначе, чем нативные.
- **Оформление — классы Uniwind, как в лаунчере**, и писать их целиком (`bg-blue-500`, а не склейку):
  варианты — словарём `Record<Вариант, 'полный класс'>`. `StyleSheet` — только там, где класса нет
  (измеренные размеры, длительности анимаций).
- **Поведение — из `@rn-primitives/*`, оформление — kit.** `className` только на свои `View`/`Text` (Uniwind не видит
  компоненты примитивов), на примитивы — `style` и пропсы. Окна у кнопки — как `components/popover.tsx`:
  `useFloatingStyle` + `disablePositioningStyle`, `useDismissLayer` (Escape на Windows), `isNativePrimitive`.
- **asChild в вебе — через Slot Radix**: он склеивает `style` как объекты, поэтому элементу под `asChild` и прямому
  ребёнку портала — `StyleSheet.flatten(...)`, не массив. Компонент, который бывает триггером (`Button`), передаёт
  `ref` и остальные пропсы своему `Pressable`: по ним Radix ставит окно и открывает меню.
- **Правило скругления: внешний радиус = внутренний + отступ.** Контейнер с элементами у своего отступа объявляет
  `RadiusScope` (или `Surface padding`), вложенные берут радиус из `useInnerRadius` + `radiusProps` (`src/radius.tsx`).
  Новый контейнер — с тестом, что вложенный элемент получил внутренний радиус (классы в тестах — `data-class`).
- Темы kit не держит: `dark:` следует за темой Uniwind, которую ставит приложение.
- Компоненты не зависят от нативных модулей лаунчера и набора иконок: иконка — проп-компонент
  с `size` и `className`.
- Анимации — только opacity и transform, `useNativeDriver: nativeDriver` (в вебе его нет). Цвет меняют
  слои `StateLayers`.
- Доступность — `aria-*` (`aria-checked`, `aria-disabled`): их понимают и RN, и react-native-web.
- Комментарии и документация — по-русски; Prettier как в остальных репозиториях TUGEN.
