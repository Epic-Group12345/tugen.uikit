import React, { act } from 'react';
import { Button } from '../../src/web/button';
import { Checkbox } from '../../src/web/checkbox';
import { CheckRow, Segmented, Slider, Toggle } from '../../src/web/controls';
import { Field } from '../../src/web/field';
import { Label } from '../../src/web/label';
import {
  RadioGroup,
  RadioGroupItem,
  RadioRow,
} from '../../src/web/radio-group';
import { Surface } from '../../src/web/surfaces';
import { TextField } from '../../src/web/text-field';
import {
  Switch,
  ToggleButton,
  ToggleGroup,
  ToggleGroupItem,
} from '../../src/web/toggle-group';
import { Dot, key, press, render } from './support/render';

// Ввод в управляемое поле так, как его видит React: значение через сеттер прототипа + событие input
const type = (el: HTMLInputElement | HTMLTextAreaElement, text: string) =>
  act(() => {
    const proto = Object.getPrototypeOf(el) as object;
    Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, text);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

it('Toggle — role switch, переключается нажатием и подписью', () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <>
      <Label htmlFor="music">Музыка</Label>
      <Toggle id="music" value={false} onChange={onChange} />
    </>,
  );
  const sw = container.querySelector('[role="switch"]')!;
  expect(sw.getAttribute('aria-checked')).toBe('false');
  press(sw);
  expect(onChange).toHaveBeenLastCalledWith(true);
  // <label for> браузер переводит в нажатие кнопки
  act(() => container.querySelector('label')!.click());
  expect(onChange).toHaveBeenCalledTimes(2);
  unmount();
});

it('неактивный Switch не переключается', () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <Switch checked onCheckedChange={onChange} disabled aria-label="Звук" />,
  );
  const sw = container.querySelector('[role="switch"]')!;
  press(sw);
  expect(onChange).not.toHaveBeenCalled();
  expect(sw.getAttribute('aria-label')).toBe('Звук');
  expect(sw.getAttribute('data-state')).toBe('checked');
  unmount();
});

it('Checkbox — aria-checked, «частично» и строка с подписью', () => {
  const onChange = jest.fn();
  const { container, rerender, unmount } = render(
    <Checkbox checked={false} onCheckedChange={onChange} aria-label="Все" />,
  );
  const box = () => container.querySelector('[role="checkbox"]')!;
  press(box());
  expect(onChange).toHaveBeenLastCalledWith(true);
  rerender(
    <Checkbox
      checked={false}
      indeterminate
      onCheckedChange={onChange}
      aria-label="Все"
    />,
  );
  expect(box().getAttribute('aria-checked')).toBe('mixed');
  // «Частично» снимается нажатием в «выбран»
  press(box());
  expect(onChange).toHaveBeenLastCalledWith(true);
  unmount();
});

it('CheckRow нажимается целиком и у края контейнера берёт радиус по правилу', () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <Surface radius="xl" padding="1">
      <CheckRow
        label="Оптимизация"
        description="Sodium и Lithium"
        checked
        onChange={onChange}
      />
    </Surface>,
  );
  const row = container.querySelector('[role="checkbox"]')!;
  // rounded-xl (12) + p-1 (4) → строка 8 = rounded-lg
  expect(row.className).toContain('rounded-lg');
  expect(row.textContent).toContain('Sodium');
  press(row.querySelector('span span')!);
  expect(onChange).toHaveBeenLastCalledWith(false);
  unmount();
});

it('RadioGroup — выбор варианта и строка RadioRow', () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <RadioGroup value="a" onValueChange={onChange} aria-label="Версия">
      <RadioGroupItem value="a" aria-label="Release" />
      <RadioRow value="b" label="Snapshot" description="Нестабильные" />
    </RadioGroup>,
  );
  const group = container.querySelector('[role="radiogroup"]')!;
  expect(group.className).toContain('flex-col');
  const [a, b] = Array.from(container.querySelectorAll('[role="radio"]'));
  expect(a.getAttribute('aria-checked')).toBe('true');
  expect(b.getAttribute('aria-checked')).toBe('false');
  press(b);
  expect(onChange).toHaveBeenLastCalledWith('b');
  unmount();
});

it('Segmented — сегменты rounded-full в капсуле, выбор не снимается повторно', () => {
  const onChange = jest.fn();
  const options = [
    { value: 'light', label: 'Светлая' },
    { value: 'dark', label: 'Тёмная' },
  ] as const;
  const { container, unmount } = render(
    <Segmented options={options} value="light" onChange={onChange} />,
  );
  const [light, dark] = Array.from(container.querySelectorAll('button'));
  expect(light.className).toContain('rounded-full');
  // flex-auto, а не flex-1: в ряду по содержимому подписи не сжимаются в многоточие
  expect(light.className).toContain('flex-auto');
  expect(light.className).not.toContain('flex-1');
  press(light);
  expect(onChange).not.toHaveBeenCalled();
  press(dark);
  expect(onChange).toHaveBeenLastCalledWith('dark');
  unmount();
});

it('ToggleGroup rounded — сегменты rounded-md, single снимает выбор в undefined', () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <ToggleGroup
      type="single"
      shape="rounded"
      value="b"
      onValueChange={onChange}
    >
      <ToggleGroupItem value="b" icon={Dot} aria-label="Жирный" />
      <ToggleGroupItem value="i">Курсив</ToggleGroupItem>
    </ToggleGroup>,
  );
  const track = container.querySelector('[role="radiogroup"]')!;
  expect(track.className).toContain('rounded-lg');
  const [bold, italic] = Array.from(container.querySelectorAll('button'));
  // rounded-lg (8) + p-0.5 (2) → 6 = rounded-md
  expect(bold.className).toContain('rounded-md');
  expect(italic.className).toContain('rounded-md');
  expect(bold.getAttribute('data-state')).toBe('on');
  press(bold);
  expect(onChange).toHaveBeenLastCalledWith(undefined);
  press(italic);
  expect(onChange).toHaveBeenLastCalledWith('i');
  unmount();
});

it('ToggleGroup multiple и ToggleButton', () => {
  const onGroup = jest.fn();
  const onPressed = jest.fn();
  const { container, unmount } = render(
    <>
      <ToggleGroup type="multiple" value={['a']} onValueChange={onGroup}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleButton pressed={false} onPressedChange={onPressed} icon={Dot}>
        Закрепить
      </ToggleButton>
    </>,
  );
  const [, b, pin] = Array.from(container.querySelectorAll('button'));
  press(b);
  expect(onGroup).toHaveBeenLastCalledWith(['a', 'b']);
  expect(pin.getAttribute('aria-pressed')).toBe('false');
  // Вне контейнера — rounded-lg
  expect(pin.className).toContain('rounded-lg');
  press(pin);
  expect(onPressed).toHaveBeenLastCalledWith(true);
  unmount();
});

it('Slider — role slider на бегунке, стрелки меняют значение', () => {
  const onChange = jest.fn();
  const { container, unmount } = render(
    <Slider
      value={40}
      min={0}
      max={100}
      onChange={onChange}
      aria-label="Громкость"
    />,
  );
  const thumb = container.querySelector('[role="slider"]')!;
  expect(thumb.getAttribute('aria-label')).toBe('Громкость');
  expect(thumb.getAttribute('aria-valuenow')).toBe('40');
  key(thumb, 'ArrowRight');
  expect(onChange).toHaveBeenLastCalledWith(41);
  unmount();
});

it('TextField — ввод, numeric, onSubmit по Enter и ref на <input>', () => {
  const onChangeText = jest.fn();
  const onSubmit = jest.fn();
  const ref = React.createRef<HTMLInputElement | HTMLTextAreaElement>();
  const { container, unmount } = render(
    <TextField
      ref={ref}
      value=""
      onChangeText={onChangeText}
      onSubmit={onSubmit}
      numeric
      mono
      placeholder="МБ"
    />,
  );
  const input = container.querySelector('input')!;
  expect(ref.current).toBe(input);
  expect(input.inputMode).toBe('numeric');
  expect(input.className).toContain('font-mono');
  expect(input.placeholder).toBe('МБ');
  type(input, '4a0b96');
  expect(onChangeText).toHaveBeenLastCalledWith('4096');
  key(input, 'Enter');
  expect(onSubmit).toHaveBeenCalledTimes(1);
  unmount();
});

it('TextField multiline — <textarea> с числом строк, secure — пароль', () => {
  const { container, unmount } = render(
    <>
      <TextField value="" onChangeText={() => {}} multiline numberOfLines={4} />
      <TextField value="" onChangeText={() => {}} secure />
    </>,
  );
  expect(container.querySelector('textarea')!.rows).toBe(4);
  expect(container.querySelector('input')!.type).toBe('password');
  unmount();
});

it('кнопка справа в TextField берёт радиус по правилу', () => {
  const { container, unmount } = render(
    <TextField
      value=""
      onChangeText={() => {}}
      trailing={<Button size="sm">Обзор</Button>}
    />,
  );
  // Поле rounded-lg (8) + p-0.5 (2) → кнопка 6 = rounded-md
  const button = container.querySelector('button')!;
  expect(button.className).toContain('rounded-md');
  unmount();
});

it('Field связывает подпись, пояснение и ошибку с элементом', () => {
  const { container, unmount } = render(
    <Field label="Память" description="В мегабайтах" error="Слишком мало">
      <TextField value="" onChangeText={() => {}} />
    </Field>,
  );
  const input = container.querySelector('input')!;
  const label = container.querySelector('label')!;
  expect(label.htmlFor).toBe(input.id);
  expect(input.getAttribute('aria-labelledby')).toBe(label.id);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  const described = input.getAttribute('aria-describedby')!.split(' ');
  expect(described).toHaveLength(2);
  expect(document.getElementById(described[0])!.textContent).toBe(
    'В мегабайтах',
  );
  expect(document.getElementById(described[1])!.textContent).toBe(
    'Слишком мало',
  );
  // Ошибка — красная рамка поля
  expect(input.parentElement!.className).toContain('border-red-500');
  unmount();
});

it('Field horizontal с переключателем: подпись переключает, disabled доходит до элемента', () => {
  const onChange = jest.fn();
  const { container, rerender, unmount } = render(
    <Field label="Музыка" orientation="horizontal">
      <Toggle value={false} onChange={onChange} />
    </Field>,
  );
  const sw = container.querySelector('[role="switch"]')!;
  expect(container.querySelector('label')!.htmlFor).toBe(sw.id);
  act(() => container.querySelector('label')!.click());
  expect(onChange).toHaveBeenLastCalledWith(true);
  rerender(
    <Field label="Музыка" orientation="horizontal" disabled>
      <Toggle value={false} onChange={onChange} />
    </Field>,
  );
  expect(
    (container.querySelector('[role="switch"]') as HTMLButtonElement).disabled,
  ).toBe(true);
  unmount();
});

it('Field с children-функцией раздаёт связи любому элементу', () => {
  const { container, unmount } = render(
    <Field label="Версия" description="Какую запускать" id="ver">
      {({ invalid: _invalid, disabled, ...aria }) => (
        <select {...aria} disabled={disabled} />
      )}
    </Field>,
  );
  const select = container.querySelector('select')!;
  expect(select.id).toBe('ver');
  expect(container.querySelector('label')!.htmlFor).toBe('ver');
  expect(select.getAttribute('aria-describedby')).toBeTruthy();
  unmount();
});
