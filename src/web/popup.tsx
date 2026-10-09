import type React from 'react';

// В лаунчере окна рисует PopupHost в корне приложения. В вебе порталы Radix уходят в
// document.body сами, поэтому PopupHost здесь пустой — он оставлен, чтобы код корня приложения
// был одинаковым на обеих платформах

/** Слой всплывающих окон: в вебе ничего не рисует, окна Radix живут в document.body */
export const PopupHost: React.FC = () => null;

/**
 * Закрыть верхнее окно, как по Escape. true — было что закрывать: окна Radix ловят Escape на
 * документе и гасят событие (preventDefault), когда закрываются
 */
export const dismissPopup = (): boolean => {
  const event = new KeyboardEvent('keydown', {
    key: 'Escape',
    bubbles: true,
    cancelable: true,
  });
  (document.activeElement ?? document.body).dispatchEvent(event);
  return event.defaultPrevented;
};
