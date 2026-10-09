import React, { useMemo, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { isNativePrimitive, useDismissLayer, useHostSize } from '../layers';
import { RadiusScope } from '../radius';
import { HIDDEN_UNTIL, useOverlayPresence } from './dialog';
import { Text } from './text';

// Боковая панель (шторка) на @rn-primitives/dialog: модальная, как Dialog, но прилегает к краю
// окна приложения и выезжает из-за него. Скруглены только внутренние углы — те, что смотрят
// в окно; по краю окна панель идёт вровень с ним

const native = isNativePrimitive(DialogPrimitive.Content);

// Панель — rounded-2xl p-2, как окно: кнопки у её отступа по правилу радиусов получают
// 16 − 8 = 8 (rounded-lg), текст отступает дальше своим px-3 py-2
const RADIUS = '2xl';
const PADDING = '2';

// Шторка снизу не выше этой доли окна приложения
const BOTTOM_MAX_RATIO = 0.9;

const OPEN_MS = 280;
const CLOSE_MS = 200;

const WEB_FIXED = { position: 'fixed' } as unknown as ViewStyle;

export type SheetSide = 'left' | 'right' | 'bottom';

// Классы целиком — иначе Uniwind их не найдёт при сборке. Рамка и скругление — только с
// внутренней стороны панели
const PANEL: Record<SheetSide, string> = {
  right:
    'h-full rounded-l-2xl border-l border-y border-mist-200 dark:border-mist-800',
  left: 'h-full rounded-r-2xl border-r border-y border-mist-200 dark:border-mist-800',
  bottom:
    'w-full rounded-t-2xl border-t border-x border-mist-200 dark:border-mist-800',
};

// Ширина боковой панели или высота нижней по умолчанию
const SIZE: Record<SheetSide, string> = {
  right: 'w-80 max-w-full',
  left: 'w-80 max-w-full',
  bottom: '',
};

// Где панель стоит в окне
// В вебе Radix оборачивает Content в свой div без стилей: flex: 1 внутри него не тянется. Строка
// растягивает этот div на всю высоту (align-items: stretch), а height: 100% передаёт её панели
const WEB_STRETCH: ViewStyle = { flexDirection: 'row' };
const WEB_FULL: ViewStyle = { height: '100%' };

const PLACE: Record<SheetSide, ViewStyle> = {
  right: { position: 'absolute', top: 0, bottom: 0, right: 0 },
  left: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0 },
};

/** Корень панели: open / defaultOpen / onOpenChange */
export const Sheet = DialogPrimitive.Root;
/** Кнопка, которая открывает панель. asChild — своим элементом */
export const SheetTrigger = DialogPrimitive.Trigger;
/** Закрыть панель изнутри. asChild — своей кнопкой */
export const SheetClose = DialogPrimitive.Close;

export interface SheetContentProps {
  /** Край окна, к которому прилегает панель */
  side?: SheetSide;
  /** Ширина (сбоку) или высота (снизу) и раскладка классами Uniwind */
  className?: string;
  /** Имя своего PortalHost, если панель рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

/** Панель у края окна: нажатие на затемнение и Escape закрывают её */
export const SheetContent: React.FC<SheetContentProps> = ({
  side = 'right',
  className,
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = DialogPrimitive.useRootContext();
  useDismissLayer(root.open, () => root.onOpenChange(false), { skip: !native });
  const { mounted, progress } = useOverlayPresence(root.open, {
    in: OPEN_MS,
    out: CLOSE_MS,
  });
  const host = useHostSize();
  // Ход выезда — размер самой панели; пока он не измерен, — размер окна приложения
  const [size, setSize] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize(side === 'bottom' ? height : width);
  };
  const distance =
    size || (side === 'bottom' ? host.height : host.width) || 800;

  // Сдвиг в покое (0 и 1) — нулевой, в 0 панель прячет прозрачность: RNW складывает статичный
  // transform из props с нативной анимацией (см. HIDDEN_UNTIL в dialog.tsx)
  const motion = useMemo(() => {
    const shift = progress.interpolate({
      inputRange: [0, HIDDEN_UNTIL, 1],
      outputRange: [0, side === 'left' ? -distance : distance, 0],
      extrapolate: 'clamp',
    });
    return {
      fade: { opacity: progress },
      slide: {
        opacity: progress.interpolate({
          inputRange: [0, HIDDEN_UNTIL],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          side === 'bottom' ? { translateY: shift } : { translateX: shift },
        ],
      },
    };
  }, [progress, distance, side]);

  if (!mounted) {
    return null;
  }
  return (
    <DialogPrimitive.Portal hostName={portalHost} forceMount>
      <View
        pointerEvents={root.open ? 'box-none' : 'none'}
        // Веб-портал Radix отдаёт стиль через Slot, а тот склеивает только объекты — массив сломал бы стиль
        style={StyleSheet.flatten<ViewStyle>([
          StyleSheet.absoluteFill,
          !native && WEB_FIXED,
        ])}
      >
        <Animated.View style={[StyleSheet.absoluteFill, motion.fade]}>
          <DialogPrimitive.Overlay forceMount style={StyleSheet.absoluteFill}>
            <View className="flex-1 bg-mist-950/50" />
          </DialogPrimitive.Overlay>
        </Animated.View>
        <Animated.View
          onLayout={onLayout}
          style={[
            PLACE[side],
            side === 'bottom' && host.height > 0
              ? { maxHeight: host.height * BOTTOM_MAX_RATIO }
              : null,
            motion.slide,
            !native && side !== 'bottom' && WEB_STRETCH,
          ]}
        >
          <DialogPrimitive.Content
            forceMount
            style={side === 'bottom' ? null : native ? styles.full : WEB_FULL}
            aria-label={accessibilityLabel}
          >
            <RadiusScope radius={RADIUS} padding={PADDING}>
              <View
                className={`gap-1 p-2 overflow-hidden bg-mist-50 dark:bg-mist-900 ${
                  PANEL[side]
                } ${className ?? SIZE[side]}`}
              >
                {children}
              </View>
            </RadiusScope>
          </DialogPrimitive.Content>
        </Animated.View>
      </View>
    </DialogPrimitive.Portal>
  );
};

/** Шапка панели: заголовок и пояснение с отступом текста */
export const SheetHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <View className={`gap-1 px-3 py-2 ${className}`}>{children}</View>
);

/** Заголовок панели */
export const SheetTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const text = (
    <Text size="base" weight="semibold" role="heading">
      {children}
    </Text>
  );
  // Нативный Title — Text из react-native без asChild: классы на нём не работают
  return native ? (
    text
  ) : (
    <DialogPrimitive.Title asChild>{text}</DialogPrimitive.Title>
  );
};

/** Пояснение под заголовком панели */
export const SheetDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const text = (
    <Text tone="secondary" className="leading-5">
      {children}
    </Text>
  );
  return native ? (
    text
  ) : (
    <DialogPrimitive.Description asChild>{text}</DialogPrimitive.Description>
  );
};

/** Ряд кнопок внизу панели, справа: rounded-lg по правилу радиусов (16 − 8) */
export const SheetFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <View className={`mt-auto flex-row flex-wrap justify-end gap-2 ${className}`}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  full: { flex: 1 },
});
