// Компоненты проверяем в вебе: react-native-web вместо react-native. Так тесты заодно
// подтверждают, что kit работает в браузере. @rn-primitives подключаем нативной версией
// (index.js → dialog.js, а не dialog.web.js): тесты проверяют то, что пойдёт в лаунчер.
// Пакеты @rn-primitives публикуют JSX как есть — их тоже прогоняем через ts-jest
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
    '^.+/@rn-primitives/.+\\.js$': [
      'ts-jest',
      { tsconfig: { allowJs: true, jsx: 'react-jsx' }, isolatedModules: true },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!@rn-primitives/)'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__tests__/support/react-native.js',
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
