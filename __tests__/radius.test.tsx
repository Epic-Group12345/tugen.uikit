import React from 'react';
import { View } from 'react-native';
import {
  Button,
  RadiusScope,
  Surface,
  innerRadius,
  outerRadius,
  radiusProps,
  radiusStep,
  useInnerRadius,
} from '../src';
import { Dot, classesOf, render } from './support/render';

describe('правило радиусов: внешний = внутренний + отступ', () => {
  it('внутренний радиус — внешний минус отступ', () => {
    expect(innerRadius('xl', '1')).toBe(8);
    expect(innerRadius('2xl', '2')).toBe(8);
    expect(innerRadius('lg', '0.5')).toBe(6);
    expect(innerRadius(16, 6)).toBe(10);
  });

  it('и наоборот: внешний — внутренний плюс отступ', () => {
    expect(outerRadius('lg', '1')).toBe(12);
    expect(outerRadius(innerRadius('3xl', '3'), '3')).toBe(24);
  });

  it('отступ больше радиуса — прямой угол, а не отрицательный радиус', () => {
    expect(innerRadius('xl', '4')).toBe(0);
  });

  it('в круглом контейнере элемент тоже круглый', () => {
    expect(radiusStep(innerRadius('full', '0.5'))).toBe('full');
  });

  it('радиус на шкале — класс, вне шкалы — стиль', () => {
    expect(radiusProps(8)).toEqual({
      className: 'rounded-lg',
      style: undefined,
    });
    expect(radiusProps(10)).toEqual({
      className: '',
      style: { borderRadius: 10 },
    });
  });
});

const Probe: React.FC = () => {
  const r = useInnerRadius('lg');
  return <View testID="probe" accessibilityLabel={String(r)} />;
};

const probed = (container: HTMLElement) =>
  container.querySelector('[data-testid="probe"]')!.getAttribute('aria-label');

it('вне контейнера элемент берёт свой радиус', () => {
  const { container, unmount } = render(<Probe />, { host: false });
  expect(probed(container)).toBe('8');
  unmount();
});

it('ближайший RadiusScope задаёт радиус вложенного', () => {
  const { container, unmount } = render(
    <RadiusScope radius="3xl" padding="2">
      <RadiusScope radius="2xl" padding="1">
        <Probe />
      </RadiusScope>
    </RadiusScope>,
    { host: false },
  );
  expect(probed(container)).toBe('12');
  unmount();
});

it('Surface с отступом — контейнер: вложенная поверхность и кнопка следуют правилу', () => {
  const { container, unmount } = render(
    <Surface kind="overlay" radius="3xl" padding="3">
      <Surface kind="neutral" nested padding="1">
        <Button icon={Dot}>Ок</Button>
      </Surface>
    </Surface>,
    { host: false },
  );
  const classes = classesOf(container);
  // 24 − 12 = 12 у вложенной поверхности, 12 − 4 = 8 у кнопки
  expect(classes).toContain('rounded-3xl');
  expect(classes).toContain('rounded-xl');
  expect(classes).toContain('rounded-lg');
  unmount();
});
