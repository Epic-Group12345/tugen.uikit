import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { RadiusScope } from '../radius';
import type { IconComponent } from '../components/icon';
import { Button, IconButton } from './button';
import { cx } from './cx';
import { Text } from './text';

// Уведомления у нижнего края окна, как в лаунчере: toast() можно звать откуда угодно (без хуков) —
// поэтому хранилище модуля на useSyncExternalStore, а рисует их один Toaster в корне приложения.
// Слой — position: fixed, страница под ним прокручивается. Карточка rounded-2xl p-2: кнопки у её
// края по правилу радиусов 16 − 8 = 8 (rounded-lg)

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

// Классы целиком — иначе Tailwind их не найдёт при сборке. Слой пропускает мышь мимо карточек
const POSITION: Record<ToasterPosition, string> = {
  'bottom-center':
    'fixed left-4 right-4 bottom-4 z-50 flex flex-col items-center gap-2 pointer-events-none',
  'bottom-right':
    'fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2 pointer-events-none',
};

export interface ToasterProps {
  position?: ToasterPosition;
  /** Сколько уведомлений видно сразу; старые уходят первыми */
  max?: number;
  /** Подпись крестика для экранного диктора: «Закрыть» на языке приложения */
  closeLabel?: string;
}

/** Слой уведомлений: один в корне приложения. Новые — внизу стопки */
export const Toaster: React.FC<ToasterProps> = ({
  position = 'bottom-right',
  max = 3,
  closeLabel = 'Закрыть',
}) => {
  const list = useSyncExternalStore(subscribe, getToasts, getToasts);
  if (!list.length) {
    return null;
  }
  return (
    <div className={POSITION[position]}>
      {list.slice(-max).map(entry => (
        <ToastCard key={entry.id} entry={entry} closeLabel={closeLabel} />
      ))}
    </div>
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

/** Крестик из двух черт: kit не зависит от набора иконок */
const Cross: IconComponent = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    className={className}
    aria-hidden
  >
    <path
      d="M4.5 4.5l7 7M11.5 4.5l-7 7"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

const ToastCard: React.FC<{ entry: ToastEntry; closeLabel: string }> = ({
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
    <RadiusScope radius="2xl" padding="2">
      <div
        role={tone === 'danger' ? 'alert' : 'status'}
        aria-live="polite"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        // Появление снизу: @starting-style (starting:) — стартовые значения перехода при вставке
        className={cx(
          'pointer-events-auto w-80 max-w-full flex flex-row items-center gap-1 p-2 rounded-2xl border bg-mist-50 dark:bg-mist-900 transition-[opacity,transform] duration-150 ease-out starting:opacity-0 starting:translate-y-2',
          BORDER[tone],
        )}
      >
        {Icon && (
          <div className="self-start pl-2 pt-1.5">
            <Icon size={16} className={ICON_CLASS[tone]} />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-0.5 min-w-0 px-2 py-1">
          <Text weight="semibold" className="line-clamp-2">
            {title}
          </Text>
          {description ? (
            <Text size="xs" tone="secondary" className="line-clamp-3">
              {description}
            </Text>
          ) : null}
        </div>
        {action ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              action.onPress();
              dismiss(id);
            }}
          >
            {action.label}
          </Button>
        ) : null}
        <IconButton
          icon={Cross}
          aria-label={closeLabel}
          className="self-start"
          onClick={() => dismiss(id)}
        />
      </div>
    </RadiusScope>
  );
};
