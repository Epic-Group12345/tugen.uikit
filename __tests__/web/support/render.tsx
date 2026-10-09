import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

// Помощники тестов веб-слоя: рисуем через React DOM в jsdom

export const render = (node: React.ReactNode) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(node));
  return {
    container,
    rerender: (next: React.ReactNode) => act(() => root.render(next)),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
};

/** Нажатие так, как его видит Radix: pointerdown, mousedown, pointerup, mouseup, click */
export const press = (el: Element) =>
  act(() => {
    const init = { bubbles: true, cancelable: true, button: 0 };
    el.dispatchEvent(new PointerEvent('pointerdown', init));
    el.dispatchEvent(new MouseEvent('mousedown', init));
    el.dispatchEvent(new PointerEvent('pointerup', init));
    el.dispatchEvent(new MouseEvent('mouseup', init));
    el.dispatchEvent(new MouseEvent('click', init));
  });

export const key = (el: Element, k: string) =>
  act(() => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  });

/** Иконка-заглушка: размер и классы видны в разметке */
export const Dot: React.FC<{ size?: number; className?: string }> = ({
  size,
  className,
}) => <span data-icon={`${size}:${className ?? ''}`} />;
