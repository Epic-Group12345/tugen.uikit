import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { nativeDriver } from '../animation';
import { isNativePrimitive, useDismissLayer, useHostSize } from '../layers';
import { RadiusScope } from '../radius';
import { Button, IconButton, type ButtonProps } from './button';
import type { IconComponent } from './icon';
import { Text } from './text';

// Модальные окна на @rn-primitives/dialog и alert-dialog: состояние, роль dialog / alertdialog,
// фокус доступности и возврат его на кнопку — из примитивов; затемнение, место окна, анимация,
// Escape на Windows и оформление — kit. Окно рисуется в PopupHost (портал примитива)

// Нативная версия примитива (RNW, тесты) или веб на Radix: в вебе Radix сам ловит Escape и
// держит фокус внутри окна, а портал уходит в body — слою нужна position: fixed
const native = isNativePrimitive(DialogPrimitive.Content);
const alertNative = isNativePrimitive(AlertDialogPrimitive.Content);

// Окно — rounded-2xl p-2: кнопки и плашки у его отступа по правилу радиусов получают
// 16 − 8 = 8 (rounded-lg), текстовые блоки отступают дальше своим px-3 py-2
const RADIUS = '2xl';
const PADDING = '2';

// Доля высоты окна приложения, выше которой окно не растёт (как Modal в лаунчере)
const MAX_HEIGHT_RATIO = 0.88;

// Окно появляется чуть уменьшенным и «доезжает» до своего размера
const APPEAR_SCALE = 0.96;

// Доля хода, за которую слой из «спрятан прозрачностью» становится видимым. RNW складывает
// статичный transform из props (он считается из JS-копии значения, а та меняется только в конце
// нативной анимации) с нативным: в покое (0 и 1) transform обязан быть нулевым, а в 0 слой
// прячет прозрачность — она у статики и анимации одно свойство и не складывается
export const HIDDEN_UNTIL = 0.001;

// В вебе на Radix портал — в body, и слой не должен уезжать с прокруткой страницы
const WEB_FIXED = { position: 'fixed' } as unknown as ViewStyle;

/**
 * Присутствие окна с анимацией выхода: mounted держится, пока окно открыто и пока оно гаснет
 * после закрытия, progress — 0..1 на нативном драйвере. Для Dialog, AlertDialog и Sheet
 */
export const useOverlayPresence = (
  open: boolean,
  { in: durationIn = 160, out: durationOut = 120 } = {},
) => {
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (open) {
      setMounted(true);
    }
    const animation = Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: open ? durationIn : durationOut,
      easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: nativeDriver,
      isInteraction: false,
    });
    animation.start(({ finished }) => {
      if (finished && !open) {
        setMounted(false);
      }
    });
    return () => animation.stop();
  }, [open, progress, durationIn, durationOut]);
  return { mounted: open || mounted, progress };
};

/** Крестик из двух черт: кнопка закрытия, если приложение не дало свою иконку */
const Cross: IconComponent = ({ size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <View
      className="bg-mist-500 dark:bg-mist-400 rounded-full"
      style={[styles.bar, { top: size / 2 - 0.75 }, styles.barA]}
    />
    <View
      className="bg-mist-500 dark:bg-mist-400 rounded-full"
      style={[styles.bar, { top: size / 2 - 0.75 }, styles.barB]}
    />
  </View>
);

interface FrameProps {
  open: boolean;
  /** Ширина окна классами Uniwind */
  className: string;
  progress: Animated.Value;
  /** Затемнение: своё у Dialog (нажатие закрывает) и у AlertDialog (не закрывает) */
  overlay: React.ReactNode;
  /** Обёртка окна примитивом Content: роль, фокус доступности */
  content: (window: React.ReactNode, style: ViewStyle) => React.ReactNode;
  /** Кнопка закрытия в углу окна */
  close?: React.ReactNode;
  web: boolean;
  children: React.ReactNode;
}

/**
 * Общая раскладка модального окна: затемнение на всё окно приложения и окно по центру. Высота —
 * от размера окна приложения (useHostSize): примитив знает только размер экрана, а на Windows это
 * весь монитор
 */
const ModalFrame: React.FC<FrameProps> = ({
  open,
  className,
  progress,
  overlay,
  content,
  close,
  web,
  children,
}) => {
  const { height } = useHostSize();
  // Интерполяции — одни на окно, а не новые на каждый рендер
  const motionStyle = useMemo(
    () => ({
      fade: {
        opacity: progress.interpolate({
          inputRange: [0, HIDDEN_UNTIL, 1],
          outputRange: [0, 0, 1],
        }),
      },
      scale: {
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, HIDDEN_UNTIL, 1],
              outputRange: [1, APPEAR_SCALE, 1],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    }),
    [progress],
  );
  const window = (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.window, motionStyle.scale]}
    >
      <RadiusScope radius={RADIUS} padding={PADDING}>
        <View
          className={`rounded-2xl p-2 overflow-hidden border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900 ${className}`}
          style={height > 0 ? { maxHeight: height * MAX_HEIGHT_RATIO } : null}
        >
          {children}
          {close}
        </View>
      </RadiusScope>
    </Animated.View>
  );
  return (
    <Animated.View
      // Пока окно гаснет после закрытия, оно уже не ловит нажатия
      pointerEvents={open ? 'box-none' : 'none'}
      style={[StyleSheet.absoluteFill, web && WEB_FIXED, motionStyle.fade]}
    >
      {overlay}
      <View
        pointerEvents="box-none"
        className="flex-1 items-center justify-center p-6"
      >
        {content(window, styles.content)}
      </View>
    </Animated.View>
  );
};

// ---------------------------------------------------------------- Dialog

/** Корень окна: open / defaultOpen / onOpenChange. Внутри — DialogTrigger и DialogContent */
export const Dialog = DialogPrimitive.Root;
/** Кнопка, которая открывает окно. asChild — отдать нажатие своему элементу (Button) */
export const DialogTrigger = DialogPrimitive.Trigger;
/** Закрыть окно изнутри. asChild — своей кнопкой: <DialogClose asChild><Button …/></DialogClose> */
export const DialogClose = DialogPrimitive.Close;

export interface DialogContentProps {
  /** Ширина окна классами Uniwind; по умолчанию «w-full max-w-lg» */
  className?: string;
  /** Кнопка закрытия в правом верхнем углу */
  showClose?: boolean;
  /** Иконка кнопки закрытия (Icons.Xmark лаунчера); без неё — крестик kit */
  closeIcon?: IconComponent;
  /** Подпись кнопки закрытия для экранного диктора — на языке приложения */
  closeLabel?: string;
  /** Имя своего PortalHost, если окно рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

/** Окно поверх приложения: нажатие на затемнение и Escape закрывают его */
export const DialogContent: React.FC<DialogContentProps> = ({
  className = 'w-full max-w-lg',
  showClose = false,
  closeIcon,
  closeLabel,
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = DialogPrimitive.useRootContext();
  const close = () => root.onOpenChange(false);
  useDismissLayer(root.open, close, { skip: !native });
  const { mounted, progress } = useOverlayPresence(root.open);
  if (!mounted) {
    return null;
  }
  return (
    <DialogPrimitive.Portal hostName={portalHost} forceMount>
      <ModalFrame
        open={root.open}
        className={className}
        progress={progress}
        web={!native}
        overlay={
          <DialogPrimitive.Overlay forceMount style={StyleSheet.absoluteFill}>
            <View className="flex-1 bg-mist-950/50" />
          </DialogPrimitive.Overlay>
        }
        content={(window, style) => (
          <DialogPrimitive.Content
            forceMount
            style={style}
            // Ряд с окном шире самого окна: мимо окна нажатие должно доходить до затемнения
            pointerEvents="box-none"
            aria-label={accessibilityLabel}
          >
            {window}
          </DialogPrimitive.Content>
        )}
        close={
          showClose ? (
            <View className="absolute top-2 right-2">
              <IconButton
                icon={closeIcon ?? Cross}
                onPress={close}
                accessibilityLabel={closeLabel}
              />
            </View>
          ) : undefined
        }
      >
        {children}
      </ModalFrame>
    </DialogPrimitive.Portal>
  );
};

/** Шапка окна: заголовок и пояснение с отступом текста от края */
export const DialogHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <View className={`gap-1 px-3 pt-2 pb-1 ${className}`}>{children}</View>
);

/** Заголовок окна; в вебе — Dialog.Title Radix (aria-labelledby окна) */
export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({
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

/** Пояснение под заголовком; в вебе — Dialog.Description Radix (aria-describedby окна) */
export const DialogDescription: React.FC<{ children: React.ReactNode }> = ({
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

/** Текстовая часть окна: отступает от края дальше кнопок (px-3 py-2) */
export const DialogBody: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <View className={`gap-2 px-3 py-2 ${className}`}>
    {typeof children === 'string' ? (
      <Text tone="secondary" className="leading-5">
        {children}
      </Text>
    ) : (
      children
    )}
  </View>
);

/**
 * Ряд кнопок внизу окна, справа. Кнопки стоят у отступа окна и по правилу радиусов получают
 * rounded-lg (16 − 8) из RadiusScope окна
 */
export const DialogFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <View className={`flex-row flex-wrap justify-end gap-2 pt-2 ${className}`}>
    {children}
  </View>
);

// ---------------------------------------------------------------- AlertDialog

/** Корень окна-подтверждения: open / defaultOpen / onOpenChange */
export const AlertDialog = AlertDialogPrimitive.Root;
/** Кнопка, которая открывает подтверждение. asChild — своим элементом */
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export type AlertDialogContentProps = Omit<
  DialogContentProps,
  'showClose' | 'closeIcon' | 'closeLabel'
>;

/**
 * Окно-подтверждение: оформление как у DialogContent, но нажатие на затемнение его не закрывает —
 * ответить нужно кнопкой. Escape закрывает, как отмена
 */
export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
  className = 'w-full max-w-lg',
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = AlertDialogPrimitive.useRootContext();
  useDismissLayer(root.open, () => root.onOpenChange(false), {
    skip: !alertNative,
  });
  const { mounted, progress } = useOverlayPresence(root.open);
  if (!mounted) {
    return null;
  }
  return (
    <AlertDialogPrimitive.Portal hostName={portalHost} forceMount>
      <ModalFrame
        open={root.open}
        className={className}
        progress={progress}
        web={!alertNative}
        overlay={
          // Затемнение примитива — View без нажатия: мимо окна ничего не происходит
          <AlertDialogPrimitive.Overlay
            forceMount
            style={StyleSheet.absoluteFill}
          >
            <View className="flex-1 bg-mist-950/50" />
          </AlertDialogPrimitive.Overlay>
        }
        content={(window, style) => (
          <AlertDialogPrimitive.Content
            forceMount
            style={style}
            pointerEvents="box-none"
            aria-label={accessibilityLabel}
          >
            {window}
          </AlertDialogPrimitive.Content>
        )}
      >
        {children}
      </ModalFrame>
    </AlertDialogPrimitive.Portal>
  );
};

/** Шапка подтверждения */
export const AlertDialogHeader = DialogHeader;
/** Ряд кнопок подтверждения: справа, rounded-lg по правилу радиусов */
export const AlertDialogFooter = DialogFooter;

/** Заголовок подтверждения: роль heading и aria-labelledby окна — из примитива */
export const AlertDialogTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AlertDialogPrimitive.Title asChild>
    <Text size="base" weight="semibold">
      {children}
    </Text>
  </AlertDialogPrimitive.Title>
);

/** Пояснение подтверждения */
export const AlertDialogDescription: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <AlertDialogPrimitive.Description asChild>
    <Text tone="secondary" className="leading-5">
      {children}
    </Text>
  </AlertDialogPrimitive.Description>
);

export type AlertDialogButtonProps = Omit<ButtonProps, 'onPressIn'>;

/**
 * Главная кнопка подтверждения: кнопка kit (по умолчанию primary; для «Удалить» — danger),
 * после onPress окно закрывается
 */
export const AlertDialogAction: React.FC<AlertDialogButtonProps> = ({
  variant = 'primary',
  disabled,
  onPress,
  ...props
}) => (
  // Slot примитива сливает его onPress (закрыть окно) с onPress кнопки
  <AlertDialogPrimitive.Action asChild disabled={disabled}>
    <Button
      {...props}
      variant={variant}
      disabled={disabled}
      onPress={onPress}
    />
  </AlertDialogPrimitive.Action>
);

/** Отмена: нейтральная кнопка kit, закрывает окно */
export const AlertDialogCancel: React.FC<AlertDialogButtonProps> = ({
  variant = 'secondary',
  disabled,
  onPress,
  ...props
}) => (
  <AlertDialogPrimitive.Cancel asChild disabled={disabled}>
    <Button
      {...props}
      variant={variant}
      disabled={disabled}
      onPress={onPress}
    />
  </AlertDialogPrimitive.Cancel>
);

const styles = StyleSheet.create({
  // Content растянут на ширину ряда, окно по центру: так className окна (max-w-lg) считается
  // от ширины окна приложения, а не от содержимого
  content: { width: '100%', alignItems: 'center' },
  window: { width: '100%', alignItems: 'center' },
  bar: { position: 'absolute', left: 0, right: 0, height: 1.5 },
  barA: { transform: [{ rotate: '45deg' }] },
  barB: { transform: [{ rotate: '-45deg' }] },
});
