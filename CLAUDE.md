# tugen.uikit

UI-kit TUGEN: токены, компоненты React Native на Uniwind (лаунчер, мини-приложения, react-native-web)
и слой для веба без React (CSS + Nim). Описание — [README.md](README.md); визуальный язык — `DESIGN.md` в tugen.launcher.

## Команды

```bash
yarn typecheck
yarn test
yarn css        # css/tugen.css из tokens/tokens.json
npx prettier --check src __tests__
```

## Правила

- **Токены — только в `tokens/tokens.json`.** После правки — `yarn css`; `src/tokens.ts` читает JSON сам.
  Тест сверяет CSS-переменные с темами RN.
- Новый элемент делается сразу в обоих слоях: компонент в `src/components/` и классы `.tg-*` в
  `scripts/build-css.mjs` (+ процедура в `nim/tugen_uikit.nim`), с одинаковыми размерами и цветами.
- **Оформление — классы Uniwind, как в лаунчере**, и писать их целиком (`bg-blue-500`, а не склейку):
  варианты — словарём `Record<Вариант, 'полный класс'>`. `StyleSheet` — только там, где класса нет
  (измеренные размеры, длительности анимаций).
- Темы kit не держит: `dark:` следует за темой Uniwind, которую ставит приложение.
- Компоненты не зависят от нативных модулей лаунчера и набора иконок: иконка — проп-компонент
  с `size` и `className`.
- Анимации — только opacity и transform, `useNativeDriver: nativeDriver` (в вебе его нет). Цвет меняют
  слои `StateLayers`.
- Доступность — `aria-*` (`aria-checked`, `aria-disabled`): их понимают и RN, и react-native-web.
- Комментарии и документация — по-русски; Prettier как в остальных репозиториях TUGEN.
