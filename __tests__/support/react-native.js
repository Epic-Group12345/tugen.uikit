// react-native в тестах — это react-native-web. findNodeHandle там бросает исключение, а нативные
// версии @rn-primitives зовут его для фокуса экранного диктора: в тестах фокус не нужен
const web = require('react-native-web');

module.exports = { ...web, findNodeHandle: () => null };
