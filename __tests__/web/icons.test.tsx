import React from 'react';
import { Button, ICON_CATALOG, Icons } from '../../src/web';
import { render } from './support/render';

it('иконка — <svg> нужного размера с классом и скрыта от диктора', () => {
  const { container, unmount } = render(
    <Icons.Gear size={24} className="text-mist-500" />,
  );
  const svg = container.querySelector('svg')!;
  expect(svg.getAttribute('width')).toBe('24');
  expect(svg.getAttribute('height')).toBe('24');
  expect(svg.getAttribute('class')).toBe('text-mist-500');
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  unmount();
});

it('иконка с подписью видна диктору как картинка', () => {
  const { container, unmount } = render(
    <Icons.TrashBin aria-label="Удалить" />,
  );
  const svg = container.querySelector('svg')!;
  expect(svg.getAttribute('role')).toBe('img');
  expect(svg.getAttribute('aria-label')).toBe('Удалить');
  expect(svg.hasAttribute('aria-hidden')).toBe(false);
  expect(svg.getAttribute('width')).toBe('16');
  unmount();
});

it('иконка набора подходит в icon у элементов kit', () => {
  const { container, unmount } = render(
    <Button icon={Icons.ArrowDownToLine}>Скачать</Button>,
  );
  expect(container.querySelector('button svg')).not.toBeNull();
  unmount();
});

it('каталог перечисляет каждую иконку набора ровно один раз', () => {
  const names = ICON_CATALOG.map(icon => icon.name);
  expect(new Set(names).size).toBe(names.length);
  expect(names.sort()).toEqual(Object.keys(Icons).sort());
  expect(ICON_CATALOG.find(icon => icon.name === 'Gear')?.keywords).toContain(
    'setting',
  );
});
