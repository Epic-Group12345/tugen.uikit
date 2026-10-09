import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Field,
  IconButton,
  Label,
  RadioGroup,
  RadioGroupItem,
  RadioRow,
  Segmented,
  Switch,
  TextField,
  Toggle,
  ToggleButton,
  ToggleGroup,
  ToggleGroupItem,
} from '../src';
import { Dot, classOf, classesOf, press, render } from './support/render';

// Элементы форм на @rn-primitives: состояние и aria-* из примитивов, вид и правило радиусов — kit

const checked = (el: Element | null) => el?.getAttribute('aria-checked');

describe('Checkbox', () => {
  const Controlled: React.FC<{ onChange?: (v: boolean) => void }> = ({
    onChange,
  }) => {
    const [value, setValue] = useState(false);
    return (
      <Checkbox
        checked={value}
        onCheckedChange={v => {
          setValue(v);
          onChange?.(v);
        }}
        accessibilityLabel="Моды"
      />
    );
  };

  it('переключается и выставляет aria-checked', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(<Controlled onChange={onChange} />, {
      host: false,
    });
    const box = container.querySelector('[role="checkbox"]');
    expect(checked(box)).toBe('false');
    press(box);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(checked(container.querySelector('[role="checkbox"]'))).toBe('true');
    expect(classesOf(container)).toContain('bg-blue-500 border-blue-500');
    unmount();
  });

  it('«частично» — aria-checked="mixed", нажатие выбирает', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <Checkbox checked={false} indeterminate onCheckedChange={onChange} />,
      { host: false },
    );
    const box = container.querySelector('[role="checkbox"]');
    expect(checked(box)).toBe('mixed');
    press(box);
    expect(onChange).toHaveBeenCalledWith(true);
    unmount();
  });

  it('неактивный не переключается', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <Checkbox checked={false} disabled onCheckedChange={onChange} />,
      { host: false },
    );
    press(container.querySelector('[role="checkbox"]'));
    expect(onChange).not.toHaveBeenCalled();
    unmount();
  });
});

describe('RadioGroup', () => {
  const Controlled: React.FC = () => {
    const [value, setValue] = useState<string | undefined>('a');
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <RadioGroupItem value="a" accessibilityLabel="A" />
        <RadioRow value="b" label="Б" description="второй" />
      </RadioGroup>
    );
  };

  it('выбирает вариант и выставляет aria-checked', () => {
    const { container, unmount } = render(<Controlled />, { host: false });
    expect(container.querySelector('[role="radiogroup"]')).not.toBeNull();
    let radios = container.querySelectorAll('[role="radio"]');
    expect(checked(radios[0])).toBe('true');
    expect(checked(radios[1])).toBe('false');
    press(radios[1]);
    radios = container.querySelectorAll('[role="radio"]');
    expect(checked(radios[0])).toBe('false');
    expect(checked(radios[1])).toBe('true');
    // Точка выбранного — круглая внутри круглого кружка
    expect(classesOf(radios[1])).toContain(
      'w-2.5 h-2.5 rounded-full bg-blue-500',
    );
    expect(container.textContent).toContain('второй');
    unmount();
  });
});

describe('ToggleGroup', () => {
  it('single: выбор одного, повторное нажатие снимает', () => {
    const onValueChange = jest.fn();
    const { container, unmount } = render(
      <ToggleGroup type="single" value="a" onValueChange={onValueChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
      { host: false },
    );
    const items = container.querySelectorAll('[role="radio"]');
    expect(checked(items[0])).toBe('true');
    press(items[1]);
    expect(onValueChange).toHaveBeenLastCalledWith('b');
    press(items[0]);
    expect(onValueChange).toHaveBeenLastCalledWith(undefined);
    unmount();
  });

  it('multiple: значения копятся', () => {
    const Controlled: React.FC = () => {
      const [value, setValue] = useState<string[]>([]);
      return (
        <ToggleGroup type="multiple" value={value} onValueChange={setValue}>
          <ToggleGroupItem value="b" icon={Dot} accessibilityLabel="Жирный" />
          <ToggleGroupItem value="i" icon={Dot} accessibilityLabel="Курсив" />
        </ToggleGroup>
      );
    };
    const { container, unmount } = render(<Controlled />, { host: false });
    expect(container.querySelector('[role="group"]')).not.toBeNull();
    press(container.querySelectorAll('[role="checkbox"]')[0]);
    press(container.querySelectorAll('[role="checkbox"]')[1]);
    const items = container.querySelectorAll('[role="checkbox"]');
    expect(checked(items[0])).toBe('true');
    expect(checked(items[1])).toBe('true');
    unmount();
  });

  it('дорожка rounded-lg p-0.5 → сегменты rounded-md, pill → rounded-full', () => {
    const { container, unmount } = render(
      <>
        <ToggleGroup type="single" value="a" onValueChange={() => {}}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          shape="pill"
          value="a"
          onValueChange={() => {}}
        >
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
      </>,
      { host: false },
    );
    const [rounded, pill] = Array.from(
      container.querySelectorAll('[role="radiogroup"]'),
    );
    expect(classOf(rounded)).toContain('rounded-lg');
    expect(classOf(rounded)).toContain('p-0.5');
    const roundedItem = rounded.querySelector('[role="radio"]')!;
    expect(classesOf(roundedItem)).toContain('rounded-md');
    expect(classesOf(roundedItem)).not.toContain('rounded-full');
    expect(classOf(pill)).toContain('rounded-full');
    expect(classesOf(pill.querySelector('[role="radio"]')!)).toContain(
      'rounded-full',
    );
    unmount();
  });

  it('ToggleButton переключает «нажата»', () => {
    const onPressedChange = jest.fn();
    const { container, unmount } = render(
      <ToggleButton pressed={false} onPressedChange={onPressedChange}>
        Закреп
      </ToggleButton>,
      { host: false },
    );
    const button = container.querySelector('[aria-checked]');
    expect(checked(button)).toBe('false');
    press(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    // Отдельно, без контейнера — rounded-lg
    expect(classesOf(container)).toContain('rounded-lg');
    unmount();
  });
});

describe('Segmented', () => {
  const options = [
    { value: 'light', label: 'Светлая' },
    { value: 'dark', label: 'Тёмная' },
  ] as const;

  it('вызывает onChange и не снимает выбор', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <Segmented options={options} value="light" onChange={onChange} />,
      { host: false },
    );
    const radios = container.querySelectorAll('[role="radio"]');
    press(radios[0]);
    expect(onChange).not.toHaveBeenCalled();
    press(radios[1]);
    expect(onChange).toHaveBeenCalledWith('dark');
    // По умолчанию — капсула, как раньше
    expect(classOf(container.querySelector('[role="radiogroup"]'))).toContain(
      'rounded-full',
    );
    unmount();
  });

  it('shape="rounded" — сегменты rounded-md', () => {
    const { container, unmount } = render(
      <Segmented
        options={options}
        value="light"
        onChange={() => {}}
        shape="rounded"
      />,
      { host: false },
    );
    expect(classesOf(container.querySelector('[role="radio"]')!)).toContain(
      'rounded-md',
    );
    unmount();
  });
});

describe('Toggle и Switch', () => {
  it('Toggle переключается', () => {
    const Controlled: React.FC = () => {
      const [value, setValue] = useState(false);
      return (
        <Toggle value={value} onChange={setValue} accessibilityLabel="Музыка" />
      );
    };
    const { container, unmount } = render(<Controlled />, { host: false });
    const sw = () => container.querySelector('[role="switch"]');
    expect(checked(sw())).toBe('false');
    press(sw());
    expect(checked(sw())).toBe('true');
    press(sw());
    expect(checked(sw())).toBe('false');
    unmount();
  });

  it('Switch — API примитива, неактивный не переключается', () => {
    const onCheckedChange = jest.fn();
    const { container, rerender, unmount } = render(
      <Switch checked onCheckedChange={onCheckedChange} />,
      { host: false },
    );
    press(container.querySelector('[role="switch"]'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    rerender(<Switch checked disabled onCheckedChange={onCheckedChange} />);
    press(container.querySelector('[role="switch"]'));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    unmount();
  });
});

describe('TextField', () => {
  it('кнопка в trailing получает rounded-md (поле rounded-lg p-0.5)', () => {
    const { container, unmount } = render(
      <TextField
        value=""
        onChangeText={() => {}}
        trailing={<Button size="sm">Обзор</Button>}
      />,
      { host: false },
    );
    const button = container.querySelector('[role="button"]')!;
    expect(classesOf(button)).toContain('rounded-md');
    expect(classesOf(button)).not.toContain('rounded-lg');
    const field = container.querySelector('[data-class*="border"]');
    expect(classOf(field)).toContain('rounded-lg');
    expect(classOf(field)).toContain('p-0.5');
    unmount();
  });

  it('IconButton в trailing — тоже rounded-md; обычное поле не меняется', () => {
    const { container, unmount } = render(
      <>
        <TextField
          value=""
          onChangeText={() => {}}
          trailing={<IconButton icon={Dot} accessibilityLabel="Очистить" />}
        />
        <TextField value="" onChangeText={() => {}} />
      </>,
      { host: false },
    );
    expect(classesOf(container.querySelector('[role="button"]')!)).toContain(
      'rounded-md',
    );
    const fields = container.querySelectorAll('[data-class*="border "]');
    expect(classOf(fields[1])).toContain('px-3 rounded-lg');
    expect(classOf(fields[1])).not.toContain('p-0.5');
    unmount();
  });

  it('disabled и multiline', () => {
    const { container, unmount } = render(
      <TextField
        value="текст"
        onChangeText={() => {}}
        disabled
        multiline
        numberOfLines={4}
      />,
      { host: false },
    );
    const area = container.querySelector('textarea')!;
    expect(area).not.toBeNull();
    expect(area.readOnly).toBe(true);
    unmount();
  });
});

describe('Field и Label', () => {
  it('Field связывает подпись, пояснение и ошибку с полем', () => {
    const { container, unmount } = render(
      <Field label="Память" description="В мегабайтах" error="Слишком мало">
        <TextField value="1" onChangeText={() => {}} />
      </Field>,
      { host: false },
    );
    const input = container.querySelector('input')!;
    const labelledBy = input.getAttribute('aria-labelledby')!;
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy)?.textContent).toBe('Память');
    const describedBy = input.getAttribute('aria-describedby')!.split(' ');
    expect(
      describedBy.map(id => document.getElementById(id)?.textContent),
    ).toEqual(['В мегабайтах', 'Слишком мало']);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    // Ошибка красит рамку
    expect(classesOf(container)).toContain('border-red-500');
    unmount();
  });

  it('нажатие на подпись Field переключает флажок, children-функция получает связи', () => {
    const Controlled: React.FC = () => {
      const [value, setValue] = useState(false);
      return (
        <>
          <Field label="Моды" orientation="horizontal">
            <Checkbox checked={value} onCheckedChange={setValue} />
          </Field>
          <Field label="Своё">
            {control => <span data-probe={control['aria-labelledby']} />}
          </Field>
        </>
      );
    };
    const { container, unmount } = render(<Controlled />, { host: false });
    const box = () => container.querySelector('[role="checkbox"]');
    expect(checked(box())).toBe('false');
    const label = document.getElementById(
      box()!.getAttribute('aria-labelledby')!,
    )!;
    expect(label.textContent).toBe('Моды');
    press(label);
    expect(checked(box())).toBe('true');
    const probe = container.querySelector('[data-probe]')!;
    expect(
      document.getElementById(probe.getAttribute('data-probe')!)?.textContent,
    ).toBe('Своё');
    unmount();
  });

  it('Label htmlFor фокусирует поле с nativeID', () => {
    const { container, unmount } = render(
      <>
        <Label htmlFor="path">Путь</Label>
        <TextField value="" onChangeText={() => {}} nativeID="path" />
      </>,
      { host: false },
    );
    const input = container.querySelector('input')!;
    press(
      Array.from(container.querySelectorAll('*')).find(
        el => el.textContent === 'Путь' && el.children.length === 0,
      )!,
    );
    expect(document.activeElement).toBe(input);
    unmount();
  });
});
