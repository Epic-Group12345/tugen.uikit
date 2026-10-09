import React from 'react';
import { Text } from 'react-native';
import { Portal, PortalHost } from '../src/rnp-portal';
import { placeFloating } from '../src';
import { render } from './support/render';

const area = { width: 800, height: 600 };
const size = { width: 200, height: 100 };
const anchor = { x: 300, y: 200, width: 100, height: 40 };

it('окно встаёт с выбранной стороны и выравнивается', () => {
  expect(placeFloating(anchor, size, area, { offset: 4 })).toEqual({
    left: 300,
    top: 244,
    side: 'bottom',
  });
  expect(
    placeFloating(anchor, size, area, { side: 'top', align: 'center' }),
  ).toEqual({ left: 250, top: 96, side: 'top' });
  expect(
    placeFloating(anchor, size, area, { side: 'right', align: 'end' }),
  ).toEqual({ left: 404, top: 140, side: 'right' });
});

it('не помещается — встаёт напротив, не помещается нигде — прижимается к краю', () => {
  const low = { ...anchor, y: 540 };
  expect(placeFloating(low, size, area).side).toBe('top');
  const tall = { width: 200, height: 590 };
  expect(placeFloating(anchor, tall, area, { margin: 8 }).top).toBe(8);
});

it('у правого края окно не выходит за область с учётом отступа', () => {
  expect(
    placeFloating({ ...anchor, x: 700 }, size, area, { margin: 8 }).left,
  ).toBe(592);
});

// Состояние, которое не должно перейти к соседнему порталу
const Counter: React.FC<{ label: string }> = ({ label }) => {
  const [mountedAs] = React.useState(label);
  return <Text>{`${label}:${mountedAs}`}</Text>;
};

it('портал с ключами: закрытие первого не отдаёт его состояние второму', () => {
  const both = (
    <>
      <Portal name="a">
        <Counter label="a" />
      </Portal>
      <Portal name="b">
        <Counter label="b" />
      </Portal>
      <PortalHost />
    </>
  );
  const { container, rerender, unmount } = render(both, { host: false });
  expect(container.textContent).toBe('a:ab:b');
  rerender(
    <>
      <Portal name="b">
        <Counter label="b" />
      </Portal>
      <PortalHost />
    </>,
  );
  // Без ключей «b» досталось бы состояние «a»: b:a
  expect(container.textContent).toBe('b:b');
  unmount();
});
