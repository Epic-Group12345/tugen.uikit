import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Platform, type View, type ViewStyle } from 'react-native';

// Замена @rn-primitives/portal с тем же API (Portal, PortalHost, useModalPortalRoot). Подключается
// алиасом бандлера: '@rn-primitives/portal' → '@tugen/uikit/rn-primitives-portal' (README).
// Зачем: PortalHost пакета рисует порталы массивом без ключей, и React сверяет их по позиции —
// когда закрывается портал из середины (подсказка под открытым окном), следующие за ним
// получают состояние предшественника или пересоздаются. Здесь у каждого портала ключ — его имя.
// Kit сам импортирует '@rn-primitives/portal', поэтому без алиаса всё работает на исходном пакете

const DEFAULT_HOST = 'INTERNAL_PRIMITIVE_DEFAULT_HOST_NAME';

type PortalMap = Map<string, React.ReactNode>;

// Хранилище модуля: Portal может стоять где угодно в дереве, а рисуется в своём PortalHost
let hosts = new Map<string, PortalMap>();
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getHosts = () => hosts;

const update = (host: string, name: string, children: React.ReactNode) => {
  const next = new Map(hosts);
  const portals = new Map(next.get(host));
  portals.set(name, children);
  next.set(host, portals);
  hosts = next;
  listeners.forEach(listener => listener());
};

const remove = (host: string, name: string) => {
  const portals = hosts.get(host);
  if (!portals?.has(name)) {
    return;
  }
  const next = new Map(hosts);
  const rest = new Map(portals);
  rest.delete(name);
  next.set(host, rest);
  hosts = next;
  listeners.forEach(listener => listener());
};

export function PortalHost({ name = DEFAULT_HOST }: { name?: string }) {
  const portals = useSyncExternalStore(subscribe, getHosts, getHosts).get(name);
  if (!portals?.size) {
    return null;
  }
  return (
    <>
      {Array.from(portals.entries()).map(([portal, children]) => (
        <React.Fragment key={portal}>{children}</React.Fragment>
      ))}
    </>
  );
}

export function Portal({
  name,
  hostName = DEFAULT_HOST,
  children,
}: {
  name: string;
  hostName?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    update(hostName, name, children);
  }, [hostName, name, children]);
  useEffect(() => () => remove(hostName, name), [hostName, name]);
  return null;
}

const ROOT: ViewStyle = { flex: 1 };

/** Корень для порталов внутри нативного модального окна — как в @rn-primitives/portal */
export function useModalPortalRoot() {
  const ref = useRef<View>(null);
  const [sideOffset, setSideOffset] = useState(0);
  const onLayout = () => {
    if (Platform.OS === 'web') {
      return;
    }
    ref.current?.measure((_x, _y, _width, _height, _pageX, pageY) =>
      setSideOffset(-pageY),
    );
  };
  return { ref, sideOffset, onLayout, style: ROOT };
}
