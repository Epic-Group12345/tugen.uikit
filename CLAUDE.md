# tugen.uikit

UI-kit TUGEN: токены, компоненты React Native (лаунчер, мини-приложения, react-native-web) и слой для веба
без React (CSS + Nim). Описание — [README.md](README.md); визуальный язык — `DESIGN.md` в tugen.launcher.

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
- Компоненты не зависят от Uniwind, нативных модулей лаунчера и набора иконок: стили — `StyleSheet` и
  цвета из `useTheme()`, иконка — проп-компонент с `size` и `color`.
- Анимации — только opacity и transform, `useNativeDriver: nativeDriver` (в вебе его нет). Цвет меняют
  слои `StateLayers`.
- Доступность — `aria-*` (`aria-checked`, `aria-disabled`): их понимают и RN, и react-native-web.
- Комментарии и документация — по-русски; Prettier как в остальных репозиториях TUGEN.
