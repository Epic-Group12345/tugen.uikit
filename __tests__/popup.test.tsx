import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupHost, Select, dismissPopup, placePopup } from '../src';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const host = { width: 800, height: 600 };
const size = { width: 200, height: 100 };

it('окно встаёт под якорем', () => {
  expect(
    placePopup({ x: 10, y: 10, width: 40, height: 20 }, size, host, 4),
  ).toEqual({
    left: 10,
    top: 34,
  });
});

it('снизу не хватает места — окно над якорем', () => {
  expect(
    placePopup({ x: 10, y: 550, width: 40, height: 20 }, size, host, 4),
  ).toEqual({
    left: 10,
    top: 446,
  });
});

it('у правого края окно прижимается внутрь', () => {
  expect(
    placePopup({ x: 700, y: 10, width: 40, height: 20 }, size, host, 4).left,
  ).toBe(600);
});

const tick = () => act(() => new Promise(resolve => setTimeout(resolve, 50)));

it('Select открывает меню в PopupHost, выбирает и закрывается', async () => {
  const onChange = jest.fn();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() =>
    root.render(
      <>
        <Select
          options={[
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' },
          ]}
          value="ru"
          onChange={onChange}
        />
        <PopupHost />
      </>,
    ),
  );
  const combo = container.querySelector<HTMLElement>('[role="combobox"]')!;
  act(() => combo.click());
  await tick();
  const items = container.querySelectorAll<HTMLElement>('[role="menuitem"]');
  expect(items).toHaveLength(2);
  act(() => items[1].click());
  expect(onChange).toHaveBeenCalledWith('en');
  expect(container.querySelectorAll('[role="menuitem"]')).toHaveLength(0);

  // Escape закрывает открытое меню
  act(() => combo.click());
  await tick();
  expect(container.querySelectorAll('[role="menuitem"]')).toHaveLength(2);
  act(() => {
    expect(dismissPopup()).toBe(true);
  });
  expect(container.querySelectorAll('[role="menuitem"]')).toHaveLength(0);
  act(() => root.unmount());
});
