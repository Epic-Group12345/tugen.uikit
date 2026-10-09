import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  Text as RNText,
  View,
  type LayoutChangeEvent,
  type PressableProps,
} from 'react-native';
import * as TooltipPrimitive from '@rn-primitives/tooltip';
import {
  isNativePrimitive,
  useDismissLayer,
  useFloatingStyle,
  type Align,
  type PrimitivePosition,
} from '../layers';
import { Appear } from './popover';

// Подсказка на @rn-primitives/tooltip: роль tooltip и состояние — из примитива; наведение на
// Windows, положение, Escape и оформление — kit. Нативный примитив открывается только нажатием
// (onPress у Trigger), поэтому наведение kit добавляет само: через ref кнопки (у TriggerRef есть
// open() и close(), open() заодно меряет кнопку, как onPress). В вебе на Radix подсказка сама
// открывается наведением с delayDuration — свои обработчики там не ставим

const native = isNativePrimitive(TooltipPrimitive.Content);

/** Задержка перед появлением подсказки при наведении, мс */
export const TOOLTIP_DELAY = 500;
// Подсказка, открытая долгим нажатием (касание), сама гаснет через это время
const LONG_PRESS_HIDE_MS = 1500;

/**
 * Наведение с задержкой: show — открыть через openDelay, hide — закрыть через closeDelay,
 * cancel — отменить отложенное. Для Tooltip и HoverCard: курсор, пролетевший над кнопкой,
 * подсказку не открывает
 */
export const useHoverDelay = ({
  open,
  close,
  openDelay = TOOLTIP_DELAY,
  closeDelay = 0,
}: {
  open: () => void;
  close: () => void;
  openDelay?: number;
  closeDelay?: number;
}) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Функции — по ссылке: таймер, запущенный в прошлом рендере, зовёт свежие
  const actions = useRef({ open, close });
  actions.current = { open, close };

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  const later = useCallback(
    (action: 'open' | 'close', ms: number) => {
      cancel();
      if (ms <= 0) {
        actions.current[action]();
        return;
      }
      timer.current = setTimeout(() => {
        timer.current = null;
        actions.current[action]();
      }, ms);
    },
    [cancel],
  );
  useEffect(() => cancel, [cancel]);

  return useMemo(
    () => ({
      show: () => later('open', openDelay),
      hide: () => later('close', closeDelay),
      hideAfter: (ms: number) => later('close', ms),
      cancel,
    }),
    [later, cancel, openDelay, closeDelay],
  );
};

interface TooltipState extends PrimitivePosition {
  open: boolean;
  triggerRef: React.RefObject<TooltipPrimitive.TriggerRef | null>;
  setContentLayout: (size: { width: number; height: number } | null) => void;
  delay: number;
}

// Нативный примитив не отдаёт свой контекст (useRootContext у tooltip нет), а положение окна
// kit считает само — поэтому у корня свой контекст: открыто ли, ref кнопки, её место и размер окна
const TooltipContext = createContext<TooltipState | null>(null);

const useTooltip = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error('TooltipTrigger и TooltipContent — только внутри Tooltip');
  }
  return ctx;
};

export type TooltipProps = Omit<TooltipPrimitive.RootProps, 'delayDuration'> & {
  /** Задержка появления при наведении, мс */
  delayDuration?: number;
};

/** Корень подсказки. Внутри — TooltipTrigger и TooltipContent */
export const Tooltip: React.FC<TooltipProps> = ({
  delayDuration = TOOLTIP_DELAY,
  onOpenChange,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] =
    useState<PrimitivePosition['triggerPosition']>(null);
  const [contentLayout, setContentLayout] =
    useState<PrimitivePosition['contentLayout']>(null);
  const triggerRef = useRef<TooltipPrimitive.TriggerRef | null>(null);

  // Место кнопки для окна: меряем при открытии — так же, как примитив для себя
  useEffect(() => {
    if (!open) {
      setTriggerPosition(null);
      setContentLayout(null);
      return;
    }
    triggerRef.current?.measure((_x, _y, width, height, pageX, pageY) =>
      setTriggerPosition({ pageX, pageY, width, height }),
    );
  }, [open]);

  const value = useMemo(
    () => ({
      open,
      triggerRef,
      triggerPosition,
      contentLayout,
      setContentLayout,
      delay: delayDuration,
    }),
    [open, triggerPosition, contentLayout, delayDuration],
  );
  return (
    <TooltipPrimitive.Root
      {...props}
      delayDuration={delayDuration}
      onOpenChange={next => {
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <TooltipContext.Provider value={value}>
        {children}
      </TooltipContext.Provider>
    </TooltipPrimitive.Root>
  );
};

export type TooltipTriggerProps = TooltipPrimitive.TriggerProps & {
  ref?: React.Ref<TooltipPrimitive.TriggerRef>;
};

/**
 * Элемент, у которого подсказка: на Windows открывает её наведением с задержкой, на касание —
 * нажатием (как у примитива) или долгим нажатием. asChild — отдать всё своему элементу
 */
export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  ref,
  onHoverIn,
  onHoverOut,
  onPressIn,
  onLongPress,
  ...props
}) => {
  const { triggerRef, delay } = useTooltip();
  const hover = useHoverDelay({
    open: () => triggerRef.current?.open(),
    close: () => triggerRef.current?.close(),
    openDelay: delay,
  });
  const setRef = useCallback(
    (node: TooltipPrimitive.TriggerRef | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<TooltipPrimitive.TriggerRef | null>).current =
          node;
      }
    },
    [ref, triggerRef],
  );
  const handlers = native
    ? {
        // Без своего оформления Fabric «сплющивает» Pressable, и на Windows пропадает наведение
        collapsable: false,
        onHoverIn: (
          e: Parameters<NonNullable<PressableProps['onHoverIn']>>[0],
        ) => {
          hover.show();
          onHoverIn?.(e);
        },
        onHoverOut: (
          e: Parameters<NonNullable<PressableProps['onHoverOut']>>[0],
        ) => {
          hover.hide();
          onHoverOut?.(e);
        },
        // Нажатие — уже действие кнопки: отложенное появление отменяем
        onPressIn: (
          e: Parameters<NonNullable<PressableProps['onPressIn']>>[0],
        ) => {
          hover.cancel();
          onPressIn?.(e);
        },
        onLongPress: (
          e: Parameters<NonNullable<PressableProps['onLongPress']>>[0],
        ) => {
          triggerRef.current?.open();
          hover.hideAfter(LONG_PRESS_HIDE_MS);
          onLongPress?.(e);
        },
      }
    : { onHoverIn, onHoverOut, onPressIn, onLongPress };
  return <TooltipPrimitive.Trigger {...props} {...handlers} ref={setRef} />;
};

export interface TooltipContentProps {
  /** Сторона элемента; если там нет места, подсказка встанет напротив */
  side?: 'top' | 'bottom';
  align?: Align;
  /** Зазор от элемента, DIP */
  sideOffset?: number;
  /** Ширина и раскладка классами Uniwind */
  className?: string;
  /** Имя своего PortalHost, если подсказка рисуется не в PopupHost */
  portalHost?: string;
  children: React.ReactNode;
}

/**
 * Тёмная плашка с коротким текстом: rounded-lg px-2 py-1, вложенных фигур нет. Мышь сквозь неё
 * проходит — иначе плашка над кнопкой забирала бы наведение и подсказка мигала
 */
export const TooltipContent: React.FC<TooltipContentProps> = ({
  side = 'top',
  align = 'center',
  sideOffset = 6,
  className = '',
  portalHost,
  children,
}) => {
  const ctx = useTooltip();
  const style = useFloatingStyle(ctx, {
    side,
    align,
    offset: sideOffset,
    margin: 8,
    enabled: native,
  });
  useDismissLayer(ctx.open, () => ctx.triggerRef.current?.close(), {
    skip: !native,
  });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    ctx.setContentLayout({ width, height });
  };
  // Затемнения-Overlay у подсказки нет: оно ловило бы наведение мимо кнопки
  return (
    <TooltipPrimitive.Portal hostName={portalHost}>
      <TooltipPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        disablePositioningStyle={native}
        style={style}
        pointerEvents="none"
        onLayout={native ? onLayout : undefined}
      >
        <Appear>
          <View
            className={`max-w-64 rounded-lg px-2 py-1 bg-mist-950 dark:bg-mist-50 ${className}`}
          >
            {typeof children === 'string' ? (
              <RNText className="text-xs text-mist-50 dark:text-mist-950">
                {children}
              </RNText>
            ) : (
              children
            )}
          </View>
        </Appear>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

/**
 * Обёртка элемента для Tip: Pressable без своего нажатия. Trigger примитива через asChild отдаёт
 * ей onPress (переключить подсказку) и роль кнопки — их отбрасываем: нажатие принадлежит
 * вложенной кнопке, а подсказка — наведению и долгому нажатию
 */
const HoverHost: React.FC<
  PressableProps & { ref?: React.Ref<View>; children: React.ReactNode }
> = ({
  ref,
  onPress: _onPress,
  role: _role,
  accessibilityState: _state,
  'aria-expanded': _expanded,
  ...props
}) => {
  const { triggerRef } = useTooltip();
  return (
    <Pressable
      {...props}
      ref={ref}
      accessible={false}
      collapsable={false}
      // Нажатие вложенной кнопки — действие: подсказка над ней больше не нужна. Своего onPressIn
      // обёртке не дождаться — ответчиком станет вложенная кнопка, поэтому смотрим на касание
      // на фазе захвата и не забираем его (false)
      onStartShouldSetResponderCapture={() => {
        triggerRef.current?.close();
        return false;
      }}
    />
  );
};

export interface TipProps {
  /** Текст подсказки */
  label: string;
  side?: 'top' | 'bottom';
  /** Задержка появления, мс */
  delay?: number;
  children: React.ReactNode;
}

/** Подсказка одной строкой: <Tip label="Настройки"><IconButton …/></Tip> */
export const Tip: React.FC<TipProps> = ({
  label,
  side = 'top',
  delay = TOOLTIP_DELAY,
  children,
}) => (
  <Tooltip delayDuration={delay}>
    <TooltipTrigger asChild>
      <HoverHost>{children}</HoverHost>
    </TooltipTrigger>
    <TooltipContent side={side}>{label}</TooltipContent>
  </Tooltip>
);
