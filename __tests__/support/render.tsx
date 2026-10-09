import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupHost } from '../../src';

// Общие помощники тестов: компоненты рисуются через react-native-web в jsdom

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

/** Нарисовать node рядом с PopupHost; вернуть контейнер и уборку */
export const render = (node: React.ReactNode, { host = true } = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() =>
    root.render(
      <>
        {node}
        {host && <PopupHost />}
      </>,
    ),
  );
  return {
    container,
    rerender: (next: React.ReactNode) =>
      act(() =>
        root.render(
          <>
            {next}
            {host && <PopupHost />}
          </>,
        ),
      ),
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
};

/** Дать отработать measure, onLayout и таймерам */
export const tick = (ms = 50) =>
  act(() => new Promise(resolve => setTimeout(resolve, ms)));

/** Нажать элемент */
export const press = (el: Element | null) => {
  if (!el) {
    throw new Error('Нет элемента для нажатия');
  }
  act(() => (el as HTMLElement).click());
};

/**
 * Классы Uniwind всех элементов поддерева одной строкой — для проверки оформления. В тестах
 * className попадает в data-class (см. support/react-native.js)
 */
export const classesOf = (el: Element) =>
  [el, ...el.querySelectorAll('[data-class]')]
    .map(e => e.getAttribute('data-class') ?? '')
    .join(' ');

/** Классы одного элемента */
export const classOf = (el: Element | null) =>
  el?.getAttribute('data-class') ?? '';

/** Иконка для тестов: показывает, с каким размером и классами её нарисовали */
export const Dot: React.FC<{ size?: number; className?: string }> = ({
  size,
  className,
}) => <span data-icon={`${size}:${className}`} />;
