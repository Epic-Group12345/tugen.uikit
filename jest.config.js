// Компоненты проверяем в вебе: react-native-web вместо react-native. Так тесты заодно
// подтверждают, что kit работает в браузере. @rn-primitives подключаем нативной версией
// (index.js → dialog.js, а не dialog.web.js): тесты проверяют то, что пойдёт в лаунчер.
// Пакеты @rn-primitives и uniwind публикуют JSX и ESM как есть — их тоже прогоняем через ts-jest
const ESM_PACKAGES = '/node_modules/(?!(@rn-primitives|uniwind)/)';

const native = {
  displayName: 'native',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/support/',
    '/__tests__/web/',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+/(@rn-primitives|uniwind)/.+\\.js$': [
      'ts-jest',
      { tsconfig: { allowJs: true, jsx: 'react-jsx' }, isolatedModules: true },
    ],
  },
  transformIgnorePatterns: [ESM_PACKAGES],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__tests__/support/react-native.js',
    '^uniwind$': '<rootDir>/__tests__/support/uniwind.js',
    '^react-native-svg$': '<rootDir>/__tests__/support/react-native-svg.js',
    // Портал с ключами — как советует README для приложений
    '^@rn-primitives/portal$': '<rootDir>/src/rnp-portal.tsx',
  },
};

// Веб-слой (src/web) — React DOM без react-native-web: свои тесты в __tests__/web
const web = {
  displayName: 'web',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/web/**/*.test.ts?(x)'],
  setupFiles: ['<rootDir>/__tests__/web/support/setup.ts'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
};

module.exports = { projects: [native, web] };
