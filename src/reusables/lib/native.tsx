import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

// Полноэкранный слой для окон и меню. В Reusables это FullWindowOverlay из react-native-screens (нативный
// экран поверх всего окна). В kit — обычный View на всё окно: портал примитивов ставит его поверх страницы.
export const FullWindowOverlay: React.FC<ViewProps> = ({ children, style, ...rest }) => (
  <View {...rest} pointerEvents="box-none" style={[StyleSheet.absoluteFill, style]}>
    {children}
  </View>
);
