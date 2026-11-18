// Заглушка react-native-svg для тестов: нативные части SVG в jsdom не поднимаются, нужны только имена
const Component = () => null;
module.exports = {
  __esModule: true,
  default: Component,
  Svg: Component,
  G: Component,
  Path: Component,
  Circle: Component,
  Rect: Component,
  Defs: Component,
  LinearGradient: Component,
  RadialGradient: Component,
  Stop: Component,
  ClipPath: Component,
  Text: Component,
  Line: Component,
  Polygon: Component,
  Polyline: Component,
  Ellipse: Component,
};
