import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { StateLayers, useAppear, usePressFeedback } from '../animation';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import { Button } from './button';
import type { IconComponent } from './icon';
import { Text } from './text';

// Уведомления у нижнего края окна: «сборка установлена», «друг в игре», ошибка действия.
// toast() можно звать откуда угодно (из сервисов, без хуков) — поэтому хранилище модуля на
// useSyncExternalStore, как у Popup, а рисует их один Toaster в корне приложения рядом с PopupHost.
// Карточка rounded-2xl p-2: кнопки у её края по правилу радиусов 16 − 8 = 8 (rounded-lg)

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastOptions {
  /** Свой id: повторный toast() с ним обновит уведомление, а не добавит новое */
  id?: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  icon?: IconComponent;
  /** Кнопка в уведомлении; после нажатия оно закрывается */
  action?: ToastAction;
  /** Сколько показывать, мс; Infinity — пока не закроют */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: string;
}

/** Время показа по умолчанию, мс */
const DURATION = 4000;

let toasts: ToastEntry[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getToasts = () => toasts;

let nextId = 1;

const dismiss = (id?: string) => {
  const next = id === undefined ? [] : toasts.filter(t => t.id !== id);
  if (next.length !== toasts.length) {
    toasts = next;
    emit();
  }
};

/**
 * Показать уведомление; вернёт его id. Нужен Toaster в корне приложения.
 * toast.dismiss(id) — закрыть одно, toast.dismiss() — все
 */
export const toast = Object.assign(
  (options: ToastOptions): string => {
    const id = options.id ?? `toast-${nextId++}`;
    const entry = { ...options, id };
    toasts = toasts.some(t => t.id === id)
      ? toasts.map(t => (t.id === id ? entry : t))
      : [...toasts, entry];
    emit();
    return id;
  },
  { dismiss },
);

export type ToasterPosition = 'bottom-center' | 'bottom-right';

// Классы целиком — иначе Uniwind их не найдёт при сборке
const POSITION: Record<ToasterPosition, string> = {
  'bottom-center': 'absolute left-4 right-4 bottom-4 items-center gap-2',
  'bottom-right': 'absolute right-4 bottom-4 items-end gap-2',
};

export interface ToasterProps {
  position?: ToasterPosition;
  /** Сколько уведомлений видно сразу; старые уходят первыми */
  max?: number;
  /** Подпись крестика для экранного диктора: «Закрыть» на языке приложения */
  closeLabel?: string;
}

/**
 * Слой уведомлений: в корне приложения, растянутым на всё окно, рядом с PopupHost (перед ним —
 * тогда меню открываются поверх уведомлений). Новые — внизу стопки
 */
export const Toaster: React.FC<ToasterProps> = ({
  position = 'bottom-right',
  max = 3,
  closeLabel,
}) => {
  const list = useSyncExternalStore(subscribe, getToasts, getToasts);
  if (!list.length) {
    return null;
  }
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View pointerEvents="box-none" className={POSITION[position]}>
        {list.slice(-max).map(entry => (
          <ToastCard key={entry.id} entry={entry} closeLabel={closeLabel} />
        ))}
      </View>
    </View>
  );
};

// Рамка по смыслу: ошибка заметна, не перекрашивая всю карточку
const BORDER: Record<ToastTone, string> = {
  neutral: 'border-mist-200 dark:border-mist-800',
  info: 'border-blue-300 dark:border-blue-900',
  success: 'border-green-300 dark:border-green-900',
  warning: 'border-amber-300 dark:border-amber-900',
  danger: 'border-red-300 dark:border-red-900',
};

const ICON_CLASS: Record<ToastTone, string> = {
  neutral: 'text-mist-500 dark:text-mist-400',
  info: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

const ToastCard: React.FC<{ entry: ToastEntry; closeLabel?: string }> = ({
  entry,
  closeLabel,
}) => {
  const {
    id,
    title,
    description,
    tone = 'neutral',
    icon: Icon,
    action,
    duration = DURATION,
  } = entry;
  const shown = useAppear(motion.appear);
  const style = useMemo(
    () => ({
      opacity: shown,
      transform: [
        {
          translateY: shown.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 0],
          }),
        },
      ],
    }),
    [shown],
  );

  // Автозакрытие с паузой на наведении: остаток времени копится между паузами
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);
  useEffect(() => {
    remaining.current = duration;
  }, [duration, entry]);
  useEffect(() => {
    if (paused || !Number.isFinite(duration) || duration <= 0) {
      return;
    }
    const started = Date.now();
    const timer = setTimeout(() => dismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, duration, id, entry]);

  return (
    <Animated.View style={style}>
      <Pressable
        // Pressable без нажатия — ради наведения: на Windows наведение есть только у него, а
        // collapsable={false} не даёт Fabric «сплющить» вид
        collapsable={false}
        accessible={false}
        onHoverIn={() => setPaused(true)}
        onHoverOut={() => setPaused(false)}
      >
        <RadiusScope radius="2xl" padding="2">
          <View
            role={tone === 'danger' ? 'alert' : 'status'}
            accessibilityLiveRegion="polite"
            className={`w-80 max-w-full flex-row items-center gap-1 p-2 rounded-2xl border bg-mist-50 dark:bg-mist-900 ${BORDER[tone]}`}
          >
            {Icon && (
              <View className="self-start pl-2 pt-1.5">
                <Icon size={16} className={ICON_CLASS[tone]} />
              </View>
            )}
            <View className="flex-1 gap-0.5 px-2 py-1">
              <Text weight="semibold" numberOfLines={2}>
                {title}
              </Text>
              {description ? (
                <Text size="xs" tone="secondary" numberOfLines={3}>
                  {description}
                </Text>
              ) : null}
            </View>
            {action ? (
              <Button
                variant="secondary"
                size="sm"
                onPress={() => {
                  action.onPress();
                  dismiss(id);
                }}
              >
                {action.label}
              </Button>
            ) : null}
            <CloseButton label={closeLabel} onPress={() => dismiss(id)} />
          </View>
        </RadiusScope>
      </Pressable>
    </Animated.View>
  );
};

/** Крестик из двух повёрнутых линий: kit не зависит от набора иконок */
const CloseButton: React.FC<{ label?: string; onPress: () => void }> = ({
  label,
  onPress,
}) => {
  const { hover, press, handlers } = usePressFeedback();
  const rounded = radiusProps(useInnerRadius('lg'));
  return (
    <Pressable
      {...handlers}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="self-start"
    >
      <StateLayers
        className={rounded.className}
        style={rounded.style}
        layers={[
          { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
          { className: 'bg-mist-950/10 dark:bg-mist-50/10', progress: press },
        ]}
      />
      <View className="w-7 h-7 items-center justify-center">
        <View
          style={LINE_A}
          className="absolute rounded-full bg-mist-400 dark:bg-mist-500"
        />
        <View
          style={LINE_B}
          className="absolute rounded-full bg-mist-400 dark:bg-mist-500"
        />
      </View>
    </Pressable>
  );
};

const LINE_A = { width: 11, height: 1.5, transform: [{ rotate: '45deg' }] };
const LINE_B = { width: 11, height: 1.5, transform: [{ rotate: '-45deg' }] };
