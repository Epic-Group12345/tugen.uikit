// Компоненты проверяем в вебе: react-native-web вместо react-native. Так тесты заодно
// подтверждают, что kit работает в браузере
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: { '^react-native$': 'react-native-web' },
};
