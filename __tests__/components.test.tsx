import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  CheckRow,
  EmptyState,
  IconButton,
  Pill,
  Row,
  Section,
  Segmented,
  Skeleton,
  SkeletonLines,
  Slider,
  Surface,
  Text,
  TextField,
  ThemeProvider,
  Toggle,
  themes,
  type ColorScheme,
} from '../src';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const Dot: React.FC<{ size?: number; color?: string }> = ({ size, color }) => (
  <span data-icon={`${size}:${color}`} />
);

const Everything: React.FC = () => (
  <Surface kind="page">
    <Section title="Игра">
      <Row title="Музыка" description="Фон в лаунчере">
        <Toggle value onChange={() => {}} accessibilityLabel="Музыка" />
      </Row>
      <Row title="Память">
        <Slider value={4096} min={1024} max={16384} onChange={() => {}} />
      </Row>
      <Row title="Тема">
        <Segmented
          options={[
            { value: 'light', label: 'Светлая' },
            { value: 'dark', label: 'Тёмная' },
          ]}
          value="dark"
          onChange={() => {}}
        />
      </Row>
      <Row title="Путь" wide>
        <TextField value="C:\\" onChangeText={() => {}} mono />
      </Row>
    </Section>
    <Button icon={Dot}>Играть</Button>
    <IconButton icon={Dot} accessibilityLabel="Закрыть" tone="danger" />
    <CheckRow label="Моды" description="Fabric" checked onChange={() => {}} />
    <Pill tone="green">1.21</Pill>
    <Text size="xs" tone="muted">
      подпись
    </Text>
    <EmptyState icon={Dot} title="Пусто" text="Здесь ничего нет" />
    <Skeleton style={{ width: 100, height: 12 }} />
    <SkeletonLines />
  </Surface>
);

const mount = (node: React.ReactElement) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(node));
  return { container, unmount: () => act(() => root.unmount()) };
};

it.each<ColorScheme>(['light', 'dark'])(
  'все элементы рисуются в теме %s',
  scheme => {
    const { container, unmount } = mount(
      <ThemeProvider scheme={scheme}>
        <Everything />
      </ThemeProvider>,
    );
    const html = container.innerHTML;
    expect(html).toContain('Играть');
    expect(html).toContain('role="switch"');
    // Иконка получает цвет темы: у красной кнопки-иконки — iconDanger
    expect(html).toContain(`data-icon="16:${themes[scheme].iconDanger}"`);
    unmount();
  },
);

it('кнопка и переключатель отвечают на нажатие', () => {
  const onPress = jest.fn();
  const onChange = jest.fn();
  const { container, unmount } = mount(
    <>
      <Button onPress={onPress}>Играть</Button>
      <Toggle value={false} onChange={onChange} accessibilityLabel="Музыка" />
    </>,
  );
  const [button, toggle] = Array.from(
    container.querySelectorAll<HTMLElement>('[role]'),
  );
  act(() => button.click());
  act(() => toggle.click());
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(true);
  unmount();
});

it('неактивная кнопка не нажимается', () => {
  const onPress = jest.fn();
  const { container, unmount } = mount(
    <Button onPress={onPress} disabled>
      Играть
    </Button>,
  );
  act(() => container.querySelector<HTMLElement>('[role="button"]')!.click());
  expect(onPress).not.toHaveBeenCalled();
  unmount();
});

it('сегменты выбирают вариант', () => {
  const onChange = jest.fn();
  const { container, unmount } = mount(
    <Segmented
      options={[
        { value: 'light', label: 'Светлая' },
        { value: 'dark', label: 'Тёмная' },
      ]}
      value="light"
      onChange={onChange}
    />,
  );
  const radios = container.querySelectorAll<HTMLElement>('[role="radio"]');
  expect(radios[0].getAttribute('aria-checked')).toBe('true');
  act(() => radios[1].click());
  expect(onChange).toHaveBeenCalledWith('dark');
  unmount();
});

it('числовое поле пропускает только цифры', () => {
  const onChangeText = jest.fn();
  const { container, unmount } = mount(
    <TextField
      value=""
      onChangeText={onChangeText}
      numeric
      placeholder="Память"
    />,
  );
  const input = container.querySelector('input')!;
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )!.set!;
  act(() => {
    setValue.call(input, '40a96');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  expect(onChangeText).toHaveBeenCalledWith('4096');
  unmount();
});
