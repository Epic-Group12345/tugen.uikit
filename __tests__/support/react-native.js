// react-native в тестах — это react-native-web. Две поправки:
// - findNodeHandle там бросает исключение, а нативные версии @rn-primitives зовут его для фокуса
//   экранного диктора: в тестах фокус не нужен;
// - className в приложении разбирает Uniwind, а в тестах его нет: кладём классы в data-class,
//   чтобы проверять оформление (правило радиусов, варианты) через classesOf
const React = require('react');
const web = require('react-native-web');

const withClassName = Component => {
  const Wrapped = React.forwardRef(({ className, dataSet, ...props }, ref) =>
    React.createElement(Component, {
      ...props,
      ref,
      dataSet: className ? { ...dataSet, class: className } : dataSet,
    }),
  );
  Wrapped.displayName = Component.displayName;
  return Wrapped;
};

module.exports = {
  ...web,
  findNodeHandle: () => null,
  View: withClassName(web.View),
  Text: withClassName(web.Text),
  Pressable: withClassName(web.Pressable),
  TextInput: withClassName(web.TextInput),
  Image: withClassName(web.Image),
  ScrollView: withClassName(web.ScrollView),
};
