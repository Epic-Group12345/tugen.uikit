# tugen.uikit

UI-kit TUGEN: две библиотеки с общими токенами и правилом скругления — компоненты React Native на
@rn-primitives + Uniwind (`src/components/`, лаунчер и мини-приложения) и веб-слой на React DOM + Radix +
Tailwind (`src/web/`, `@tugen/uikit/web`, веб на Vite). react-native-web в вебе не используется.
Описание — [README.md](README.md); визуальный язык — `DESIGN.md` в tugen.launcher.

## Команды

```bash
yarn typecheck
yarn test
yarn gallery    # витрина веб-слоя в браузере (Vite); yarn gallery:build — сборка, как в CI
npx prettier --check src __tests__
```

## Правила

- **Токены — только в `tokens/tokens.json`**; `src/tokens.ts` читает JSON сам.
- **Новый элемент делается в обеих библиотеках**: компонент RN в `src/components/` и веб в `src/web/` — с теми же
  именами, вариантами, размерами и классами; в вебе — события и доступность DOM (`onClick`, `aria-label`, `ref`).
  Веб-компонент — с примером в витрине (`example/src/sections/`) и тестом в `__tests__/web/`; проверь его в
  браузере (`yarn gallery`).
- **Общее у библиотек — только платформенно-нейтральные модули**: `tokens.ts`, `radius.tsx`, `tone.ts`, тип
  `components/icon.ts`. `src/web/` не импортирует `react-native` и компоненты RN, `src/components/` — `src/web/`.
- **Веб-слой**: div — блочный, раскладку пиши явно (`flex flex-col`). Появление и исчезновение окон — анимациями
  `animate-tg-*` из `src/web/tugen.css` по `data-[state=…]` (Radix ждёт их окончания). Классы из общих модулей
  попадают в CSS через `@source` в `tugen.css` — новый общий модуль с классами добавь туда.
- **Оформление — классы Uniwind, как в лаунчере**, и писать их целиком (`bg-blue-500`, а не склейку):
  варианты — словарём `Record<Вариант, 'полный класс'>`. `StyleSheet` — только там, где класса нет
  (измеренные размеры, длительности анимаций).
- **Поведение — из `@rn-primitives/*` (в вебе — Radix), оформление — kit.** `className` только на свои `View`/`Text` (Uniwind не видит
  компоненты примитивов), на примитивы — `style` и пропсы. Окна у кнопки — как `components/popover.tsx`:
  `useFloatingStyle` + `disablePositioningStyle`, `useDismissLayer` (Escape на Windows), `isNativePrimitive`.
- Компонент, который бывает триггером примитива (`Button`), передаёт `ref` и остальные пропсы своему `Pressable`
  (в вебе — `<button>`): по ним примитив ставит окно у кнопки и открывает меню.
- **Правило скругления: внешний радиус = внутренний + отступ.** Контейнер с элементами у своего отступа объявляет
  `RadiusScope` (или `Surface padding`), вложенные берут радиус из `useInnerRadius` + `radiusProps` (`src/radius.tsx`).
  Новый контейнер — с тестом, что вложенный элемент получил внутренний радиус (классы в тестах — `data-class`).
- Темы kit не держит: `dark:` следует за темой Uniwind, которую ставит приложение; в вебе — за системой
  или классом на `<html>` (`setTheme`).
- Компоненты не зависят от нативных модулей лаунчера и набора иконок: иконка — проп-компонент
  с `size` и `className`.
- Анимации — только opacity и transform: в RN `useNativeDriver: nativeDriver`, цвет меняют слои `StateLayers`;
  в вебе наведение и нажатие — классами `hover:` / `active:`.
- Доступность — `aria-*` (`aria-checked`, `aria-disabled`): в RN их понимают и Windows, и тесты на
  react-native-web; в вебе роли и клавиатуру дают Radix и нативные элементы.
- Комментарии и документация — по-русски; Prettier как в остальных репозиториях TUGEN.
