import { useSyncExternalStore } from 'react';

// Адреса — в hash (#/components/button): статическому хостингу не нужна настройка под SPA

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

const current = () => window.location.hash.replace(/^#\/?/, '');

export const useRoute = () => useSyncExternalStore(subscribe, current);

export const href = (path: string) => `#/${path}`;
