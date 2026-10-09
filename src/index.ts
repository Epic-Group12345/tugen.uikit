// @tugen/uikit — визуальный язык TUGEN (DESIGN.md лаунчера) в одном пакете: токены и
// компоненты React Native для лаунчера, мини-приложений игр и веба (Vite + React через react-native-web)

export * from './tokens';
export * from './radius';
export {
  dismissAllLayers,
  dismissTopLayer,
  hasOpenLayers,
  isNativePrimitive,
  placeFloating,
  useDismissLayer,
  useFloatingStyle,
  useHostSize,
  type Align,
  type Anchor,
  type PlaceOptions,
  type PrimitivePosition,
  type Side,
} from './layers';
export {
  StateLayers,
  nativeDriver,
  useAnimatedFlag,
  useAppear,
  useFlipOffset,
  usePressFeedback,
  type StateLayer,
} from './animation';
export type { IconComponent } from './components/icon';
export {
  Text,
  type TextProps,
  type TextSize,
  type TextTone,
  type TextWeight,
} from './components/text';
export {
  Button,
  IconButton,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
  type IconButtonProps,
  type IconTone,
} from './components/button';
export {
  CheckRow,
  Segmented,
  Slider,
  Toggle,
  type CheckRowProps,
  type SegmentOption,
  type SegmentedProps,
  type SliderProps,
  type ToggleProps,
} from './components/controls';
export { TextField, type TextFieldProps } from './components/text-field';
export { Pill, type PillTone } from './components/pill';
export {
  Card,
  Divider,
  Row,
  Section,
  Surface,
  type RowProps,
  type SurfaceKind,
  type SurfaceProps,
  type DividerProps,
  type DividerOrientation,
} from './components/surfaces';
export { EmptyState, type EmptyStateProps } from './components/empty-state';
export {
  Skeleton,
  SkeletonLines,
  type SkeletonProps,
} from './components/skeleton';
export {
  Popup,
  PopupHost,
  dismissPopup,
  placePopup,
  usePopupToggle,
  type PopupAnchor,
  type PopupProps,
} from './popup';
export {
  Dropdown,
  Menu,
  Select,
  useDropdownMenu,
  type MenuItem,
  type SelectOption,
  type SelectProps,
} from './components/menu';

// Компоненты на @rn-primitives: доступность и состояние — из примитивов, оформление и поведение
// на Windows — kit
export * from './components/popover';
export * from './components/dialog';
export * from './components/sheet';
export * from './components/tooltip';
export * from './components/hover-card';
export * from './components/dropdown-menu';
export * from './components/context-menu';
export * from './components/select';
export * from './components/checkbox';
export * from './components/radio-group';
export * from './components/toggle-group';
export * from './components/label';
export * from './components/field';
export * from './components/tabs';
export * from './components/accordion';
export * from './components/collapsible';
export * from './components/avatar';
export * from './components/progress';
export * from './components/alert';
export * from './components/toast';
export * from './components/kbd';
