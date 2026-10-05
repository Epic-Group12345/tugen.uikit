import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';

// Всплывающие окна (меню, выпадающие списки, пояснения) рисуются средствами React Native
// поверх окна приложения, а не в отдельном нативном окне: нативный попап в RNW оказался
// нестабильным. Popup регистрирует содержимое, PopupHost в корне приложения его рисует —
// над всем остальным, у кнопки-якоря

export interface PopupAnchor {
  /** DIP относительно окна приложения — как отдаёт measureInWindow */
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PopupEntry {
  id: number;
  anchor: PopupAnchor;
  offset: number;
  onDismiss: () => void;
  children: React.ReactNode;
}

// Открытые окна по порядку открытия: последнее — сверху. Хранилище модуля, а не контекст:
// Popup может стоять где угодно в дереве, а рисуется в одном PopupHost
let entries: PopupEntry[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getEntries = () => entries;

const upsert = (entry: PopupEntry) => {
  const i = entries.findIndex(e => e.id === entry.id);
  entries =
    i < 0
      ? [...entries, entry]
      : entries.map(e => (e.id === entry.id ? entry : e));
  emit();
};
const remove = (id: number) => {
  entries = entries.filter(e => e.id !== id);
  emit();
};

/**
 * Закрыть верхнее окно, как по Escape. true — было что закрывать. В RNW клавиши приходят фокусу,
 * поэтому Escape ловит корень приложения и зовёт эту функцию; в вебе PopupHost слушает сам
 */
export const dismissPopup = () => {
  const top = entries[entries.length - 1];
  top?.onDismiss();
  return top !== undefined;
};

let nextId = 1;

export interface PopupProps {
  anchor: PopupAnchor;
  /** Зазор между якорем и окном, DIP */
  offset?: number;
  /** Окно закрылось само (нажатие мимо, Escape, смена размера окна) — уберите Popup из дерева */
  onDismiss: () => void;
  children: React.ReactNode;
}

/**
 * Содержимое у anchor: под ним или над ним, если снизу не хватает места, и в пределах окна.
 * Показано, пока компонент в дереве. Нужен PopupHost в корне приложения
 */
export const Popup: React.FC<PopupProps> = ({
  anchor,
  offset = 4,
  onDismiss,
  children,
}) => {
  const id = useRef(0);
  if (!id.current) {
    id.current = nextId++;
  }
  useLayoutEffect(() => {
    upsert({ id: id.current, anchor, offset, onDismiss, children });
  });
  useEffect(() => {
    const own = id.current;
    return () => remove(own);
  }, []);
  return null;
};

interface Size {
  width: number;
  height: number;
}

/** Место окна размера size у якоря в области host: под якорем, над ним или прижатое к краю */
export const placePopup = (
  anchor: PopupAnchor,
  size: Size,
  host: Size,
  offset: number,
) => {
  const below = anchor.y + anchor.height + offset;
  const aboveTop = anchor.y - offset - size.height;
  const above = below + size.height > host.height && aboveTop >= 0;
  const maxLeft = Math.max(0, host.width - size.width);
  return {
    left: Math.min(Math.max(anchor.x, 0), maxLeft),
    top: above
      ? aboveTop
      : Math.max(0, Math.min(below, host.height - size.height)),
  };
};

const PopupLayer: React.FC<{ entry: PopupEntry; host: Size }> = ({
  entry,
  host,
}) => {
  const [size, setSize] = useState<Size | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize(prev =>
      prev && prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  };
  // Пока размер не известен, окно стоит на месте под якорем невидимым: так его можно измерить
  const place = size
    ? placePopup(entry.anchor, size, host, entry.offset)
    : {
        left: entry.anchor.x,
        top: entry.anchor.y + entry.anchor.height + entry.offset,
      };
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Нажатие мимо окна закрывает его и до того, что под ним, не доходит */}
      <Pressable
        style={StyleSheet.absoluteFill}
        accessible={false}
        onPress={entry.onDismiss}
      />
      <View
        onLayout={onLayout}
        style={{ position: 'absolute', ...place, opacity: size ? 1 : 0 }}
      >
        {entry.children}
      </View>
    </View>
  );
};

// В вебе measureInWindow считает от окна браузера, а не от страницы: слой не должен уезжать с прокруткой
const WEB_FIXED =
  Platform.OS === 'web'
    ? ({ position: 'fixed' } as unknown as object)
    : undefined;

/** Слой всплывающих окон: последним в корне приложения, растянутым на всё окно */
export const PopupHost: React.FC = () => {
  const list = useSyncExternalStore(subscribe, getEntries, getEntries);
  const [host, setHost] = useState<Size>({ width: 0, height: 0 });
  const hostRef = useRef(host);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissPopup()) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const prev = hostRef.current;
    if (prev.width === width && prev.height === height) {
      return;
    }
    // Окно поменяло размер — якоря уехали, открытые окна закрываем, как нативные меню
    if (prev.width || prev.height) {
      [...entries].reverse().forEach(entry => entry.onDismiss());
    }
    hostRef.current = { width, height };
    setHost({ width, height });
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, WEB_FIXED]}
      pointerEvents="box-none"
      onLayout={onLayout}
    >
      {list.map(entry => (
        <PopupLayer key={entry.id} entry={entry} host={host} />
      ))}
    </View>
  );
};

// Нажатие на кнопку при открытом окне закрывает его: окно закрывается само на нажатие мимо.
// Закрытие и отпускание кнопки приходят почти одновременно и в любом порядке, поэтому решаем
// в момент нажатия: было ли окно открыто (или только что закрылось)
const JUST_DISMISSED_MS = 300;

/**
 * Окно, которое открывает и закрывает кнопка: оберните кнопку в
 * <View ref={anchorRef} collapsable={false}>, передайте ей onPressIn / onPress, а рядом, пока
 * anchor не null, отрисуйте <Popup anchor={anchor} onDismiss={onDismiss}>
 */
export const usePopupToggle = () => {
  const anchorRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<PopupAnchor | null>(null);
  const dismissedAt = useRef(0);
  const wasOpenOnPressIn = useRef(false);

  const onPressIn = () => {
    wasOpenOnPressIn.current =
      anchor !== null || Date.now() - dismissedAt.current < JUST_DISMISSED_MS;
  };
  const onPress = () => {
    if (wasOpenOnPressIn.current) {
      setAnchor(null);
      return;
    }
    anchorRef.current?.measureInWindow((x, y, width, height) =>
      setAnchor({ x, y, width, height }),
    );
  };
  const close = () => setAnchor(null);
  const onDismiss = () => {
    dismissedAt.current = Date.now();
    close();
  };

  return {
    anchorRef,
    anchor,
    isOpen: anchor !== null,
    onPressIn,
    onPress,
    close,
    onDismiss,
  };
};
