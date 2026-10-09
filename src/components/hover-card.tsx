import React, { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import * as HoverCardPrimitive from '@rn-primitives/hover-card';
import {
  isNativePrimitive,
  useDismissLayer,
  useFloatingStyle,
  type Align,
} from '../layers';
import { RadiusScope } from '../radius';
import { Appear } from './popover';
import { TOOLTIP_DELAY, useHoverDelay } from './tooltip';

// Карточка при наведении на @rn-primitives/hover-card: состояние и роль — из примитива; наведение
// на Windows (нативный примитив открывается только нажатием), положение, Escape и оформление — kit.
// Курсор можно перевести с кнопки на карточку: закрытие отложено, а наведение на карточку его
// отменяет. В вебе Radix открывает карточку наведением сам (openDelay / closeDelay)

const native = isNativePrimitive(HoverCardPrimitive.Content);

/** Через сколько закрывается карточка, когда курсор ушёл, мс */
export const HOVER_CARD_CLOSE_DELAY = 300;

// Каким способом открыли: наведением — затемнения нет (оно забрало бы наведение), нажатием
// (касание) — прозрачное затемнение ловит нажатие мимо и закрывает карточку
type OpenedBy = 'hover' | 'press';

interface HoverCardState {
  triggerRef: React.RefObject<HoverCardPrimitive.TriggerRef | null>;
  hover: ReturnType<typeof useHoverDelay>;
  openedBy: React.RefObject<OpenedBy>;
}

const HoverContext = React.createContext<HoverCardState | null>(null);

const useHoverCard = () => {
  const ctx = React.useContext(HoverContext);
  if (!ctx) {
    throw new Error(
      'HoverCardTrigger и HoverCardContent — только внутри HoverCard',
    );
  }
  return ctx;
};

export type HoverCardProps = HoverCardPrimitive.RootProps;

/** Корень карточки. Внутри — HoverCardTrigger и HoverCardContent */
export const HoverCard: React.FC<HoverCardProps> = ({
  openDelay = TOOLTIP_DELAY,
  closeDelay = HOVER_CARD_CLOSE_DELAY,
  children,
  ...props
}) => {
  const triggerRef = useRef<HoverCardPrimitive.TriggerRef | null>(null);
  const openedBy = useRef<OpenedBy>('hover');
  const hover = useHoverDelay({
    open: () => {
      openedBy.current = 'hover';
      triggerRef.current?.open();
    },
    close: () => triggerRef.current?.close(),
    openDelay,
    closeDelay,
  });
  const value = React.useMemo(() => ({ triggerRef, hover, openedBy }), [hover]);
  return (
    <HoverCardPrimitive.Root
      {...props}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
    </HoverCardPrimitive.Root>
  );
};

export type HoverCardTriggerProps = HoverCardPrimitive.TriggerProps & {
  ref?: React.Ref<HoverCardPrimitive.TriggerRef>;
};

type HoverEvent = Parameters<NonNullable<PressableProps['onHoverIn']>>[0];
type PressEvent = Parameters<NonNullable<PressableProps['onPress']>>[0];

/**
 * Элемент, над которым появляется карточка: наведение с задержкой, на касание — нажатие (как у
 * примитива). asChild — отдать всё своему элементу
 */
export const HoverCardTrigger: React.FC<HoverCardTriggerProps> = ({
  ref,
  onHoverIn,
  onHoverOut,
  onPress,
  ...props
}) => {
  const { triggerRef, hover, openedBy } = useHoverCard();
  const setRef = useCallback(
    (node: HoverCardPrimitive.TriggerRef | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.RefObject<HoverCardPrimitive.TriggerRef | null>).current =
          node;
      }
    },
    [ref, triggerRef],
  );
  const handlers = native
    ? {
        // Без своего оформления Fabric «сплющивает» Pressable, и на Windows пропадает наведение
        collapsable: false,
        onHoverIn: (e: HoverEvent) => {
          hover.show();
          onHoverIn?.(e);
        },
        onHoverOut: (e: HoverEvent) => {
          hover.hide();
          onHoverOut?.(e);
        },
        onPress: (e: PressEvent) => {
          hover.cancel();
          openedBy.current = 'press';
          onPress?.(e);
        },
      }
    : { onHoverIn, onHoverOut, onPress };
  return <HoverCardPrimitive.Trigger {...props} {...handlers} ref={setRef} />;
};

export interface HoverCardContentProps {
  /** Сторона элемента; если там нет места, карточка встанет напротив */
  side?: 'top' | 'bottom';
  align?: Align;
  /** Зазор от элемента, DIP */
  sideOffset?: number;
  /** Ширина и раскладка классами Uniwind (w-72, gap-2) */
  className?: string;
  /** Имя своего PortalHost, если карточка рисуется не в PopupHost */
  portalHost?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

// Как PopoverContent: rounded-xl p-1, кнопки и плашки у края — 12 − 4 = 8 (rounded-lg)
const RADIUS = 'xl';
const PADDING = '1';

/** Карточка у элемента: профиль, превью ссылки, подробности */
export const HoverCardContent: React.FC<HoverCardContentProps> = ({
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  className = '',
  portalHost,
  accessibilityLabel,
  children,
}) => {
  const root = HoverCardPrimitive.useRootContext();
  const { hover, openedBy } = useHoverCard();
  const style = useFloatingStyle(root, {
    side,
    align,
    offset: sideOffset,
    margin: 8,
    enabled: native,
  });
  const close = () => {
    hover.cancel();
    root.setTriggerPosition(null);
    root.onOpenChange(false);
  };
  useDismissLayer(root.open, close, { skip: !native });
  // Затемнение только у открытой нажатием: при наведении оно перехватило бы курсор
  // (ref читаем в рендере: открытие и onPress приходят одним событием, рендер — после обоих)
  const pressOpened = openedBy.current === 'press';

  const card = (
    <HoverCardPrimitive.Content
      side={side}
      align={align}
      sideOffset={sideOffset}
      disablePositioningStyle={native}
      style={style}
      aria-label={accessibilityLabel}
    >
      {/* Наведение на карточку отменяет отложенное закрытие, уход с неё — закрывает */}
      <Pressable
        accessible={false}
        collapsable={false}
        onHoverIn={native ? hover.cancel : undefined}
        onHoverOut={native ? hover.hide : undefined}
      >
        <Appear>
          <RadiusScope radius={RADIUS} padding={PADDING}>
            <View
              className={`gap-1 p-1 rounded-xl border border-mist-200 dark:border-mist-800 bg-mist-50 dark:bg-mist-900 ${className}`}
            >
              {children}
            </View>
          </RadiusScope>
        </Appear>
      </Pressable>
    </HoverCardPrimitive.Content>
  );

  return (
    <HoverCardPrimitive.Portal hostName={portalHost}>
      {native && pressOpened ? (
        <HoverCardPrimitive.Overlay style={StyleSheet.absoluteFill}>
          {card}
        </HoverCardPrimitive.Overlay>
      ) : (
        card
      )}
    </HoverCardPrimitive.Portal>
  );
};
