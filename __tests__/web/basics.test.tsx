import React from 'react';
import { Button, IconButton, Surface, Text } from '../../src/web';
import { Dot, press, render } from './support/render';

it('кнопка — <button> с вариантом и классами, ref и пропсы проходят насквозь', () => {
  const ref = React.createRef<HTMLButtonElement>();
  const onClick = jest.fn();
  const { container, unmount } = render(
    <Button ref={ref} variant="play" aria-expanded onClick={onClick}>
      Играть
    </Button>,
  );
  const button = container.querySelector('button')!;
  expect(ref.current).toBe(button);
  expect(button.type).toBe('button');
  expect(button.className).toContain('bg-green-600');
  expect(button.getAttribute('aria-expanded')).toBe('true');
  press(button);
  expect(onClick).toHaveBeenCalledTimes(1);
  unmount();
});

it('неактивная кнопка не нажимается', () => {
  const onClick = jest.fn();
  const { container, unmount } = render(
    <Button disabled onClick={onClick}>
      Играть
    </Button>,
  );
  press(container.querySelector('button')!);
  expect(onClick).not.toHaveBeenCalled();
  unmount();
});

it('кнопка у края контейнера берёт радиус по правилу', () => {
  // rounded-2xl (16) + p-1 (4) → 12 = rounded-xl; вложенная 12 + p-1 → кнопка 8 = rounded-lg
  const { container, unmount } = render(
    <Surface radius="2xl" padding="1">
      <Button>Ок</Button>
      <Surface nested padding="1">
        <IconButton icon={Dot} aria-label="Ещё" />
      </Surface>
    </Surface>,
  );
  const [outer, inner] = Array.from(container.querySelectorAll('button'));
  expect(outer.className).toContain('rounded-xl');
  expect(inner.className).toContain('rounded-lg');
  expect(inner.getAttribute('aria-label')).toBe('Ещё');
  unmount();
});

it('текст — тег и цвет по смыслу', () => {
  const { container, unmount } = render(
    <Text as="h2" tone="danger" weight="bold">
      Ошибка
    </Text>,
  );
  const h2 = container.querySelector('h2')!;
  expect(h2.className).toContain('text-red-600');
  expect(h2.className).toContain('font-bold');
  unmount();
});
