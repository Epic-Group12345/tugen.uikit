import React, { useState } from 'react';
import { Button } from '../../../src/web/button';
import { Checkbox } from '../../../src/web/checkbox';
import { CheckRow, Segmented, Slider, Toggle } from '../../../src/web/controls';
import { Field } from '../../../src/web/field';
import { Label } from '../../../src/web/label';
import {
  RadioGroup,
  RadioGroupItem,
  RadioRow,
} from '../../../src/web/radio-group';
import { Row, Section, Surface } from '../../../src/web/surfaces';
import { Text } from '../../../src/web/text';
import { TextField } from '../../../src/web/text-field';
import {
  Switch,
  ToggleButton,
  ToggleGroup,
  ToggleGroupItem,
} from '../../../src/web/toggle-group';
import { Block, Dot, Line } from './shared';

const THEMES = [
  { value: 'system', label: 'Системная' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
] as const;

type Theme = (typeof THEMES)[number]['value'];

export const Forms: React.FC = () => {
  const [music, setMusic] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [volume, setVolume] = useState(40);
  const [theme, setTheme] = useState<Theme>('system');
  const [density, setDensity] = useState<Theme>('light');
  const [mods, setMods] = useState({ sodium: true, lithium: false });
  const [agree, setAgree] = useState(false);
  const [channel, setChannel] = useState<string | undefined>('release');
  const [align, setAlign] = useState<string | undefined>('left');
  const [styles, setStyles] = useState<string[]>(['bold']);
  const [pinned, setPinned] = useState(false);
  const [name, setName] = useState('');
  const [memory, setMemory] = useState('4096');
  const [path, setPath] = useState('C:\\Users\\Steve\\.tugen');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [submitted, setSubmitted] = useState('');

  const all = mods.sodium && mods.lithium;
  const some = mods.sodium !== mods.lithium;
  const memoryError =
    memory !== '' && Number(memory) < 1024 ? 'Не меньше 1024 МБ' : undefined;

  return (
    <>
      <Section title="Настройки">
        <Row title="Музыка" description="Фоновая музыка в лаунчере">
          <div className="flex flex-row justify-end">
            <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
          </div>
        </Row>
        <Row title="Громкость" description={`${Math.round(volume)}%`}>
          <Slider
            value={volume}
            onChange={setVolume}
            aria-label="Громкость"
            disabled={!music}
          />
        </Row>
        <Row title="Тема" wide>
          <Segmented
            options={THEMES}
            value={theme}
            onChange={setTheme}
            aria-label="Тема"
          />
        </Row>
      </Section>

      <Block title="Переключатели">
        <Line>
          <Switch
            checked={sounds}
            onCheckedChange={setSounds}
            aria-label="Звуки"
          />
          <Switch
            checked
            disabled
            onCheckedChange={() => {}}
            aria-label="Вкл"
          />
          <Switch
            checked={false}
            disabled
            onCheckedChange={() => {}}
            aria-label="Выкл"
          />
          <Label htmlFor="sounds-toggle">Звуки интерфейса</Label>
          <Toggle id="sounds-toggle" value={sounds} onChange={setSounds} />
        </Line>
        <Field
          label="Звуки уведомлений"
          description="Подпись слева — нажатие на неё тоже переключает"
          orientation="horizontal"
        >
          <Toggle value={sounds} onChange={setSounds} />
        </Field>
      </Block>

      <Block title="Сегменты и группы кнопок">
        <Text size="xs" tone="muted">
          Капсула (по умолчанию) и rounded: дорожка rounded-lg + p-0.5 →
          сегменты rounded-md
        </Text>
        <Segmented options={THEMES} value={theme} onChange={setTheme} />
        <Segmented
          options={THEMES}
          value={density}
          onChange={setDensity}
          shape="rounded"
          className="self-start"
        />
        <Line>
          <ToggleGroup
            type="single"
            value={align}
            onValueChange={setAlign}
            aria-label="Выравнивание"
          >
            <ToggleGroupItem value="left" icon={Dot}>
              Слева
            </ToggleGroupItem>
            <ToggleGroupItem value="center" icon={Dot}>
              По центру
            </ToggleGroupItem>
            <ToggleGroupItem value="right" icon={Dot} aria-label="Справа" />
          </ToggleGroup>
          <ToggleGroup
            type="multiple"
            shape="pill"
            value={styles}
            onValueChange={setStyles}
            aria-label="Начертание"
          >
            <ToggleGroupItem value="bold">Жирный</ToggleGroupItem>
            <ToggleGroupItem value="italic">Курсив</ToggleGroupItem>
            <ToggleGroupItem value="under" disabled>
              Подчёркнутый
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            value="a"
            onValueChange={() => {}}
            disabled
            aria-label="Недоступно"
          >
            <ToggleGroupItem value="a">Недоступно</ToggleGroupItem>
            <ToggleGroupItem value="b">Совсем</ToggleGroupItem>
          </ToggleGroup>
        </Line>
        <Line>
          <ToggleButton pressed={pinned} onPressedChange={setPinned} icon={Dot}>
            {pinned ? 'Закреплено' : 'Закрепить'}
          </ToggleButton>
          <ToggleButton
            pressed={pinned}
            onPressedChange={setPinned}
            icon={Dot}
            aria-label="Закрепить"
          />
          <ToggleButton pressed={false} onPressedChange={() => {}} disabled>
            Недоступно
          </ToggleButton>
          <Text size="xs" tone="muted">
            выбрано: {align ?? '—'} · {styles.join(', ') || '—'}
          </Text>
        </Line>
      </Block>

      <Block title="Флажки и варианты">
        <Line>
          <Checkbox
            checked={all}
            indeterminate={some}
            onCheckedChange={v => setMods({ sodium: v, lithium: v })}
            aria-label="Все моды"
          />
          <Checkbox
            checked
            onCheckedChange={() => {}}
            disabled
            aria-label="Вкл"
          />
          <Label htmlFor="agree">Принимаю условия</Label>
          <Checkbox id="agree" checked={agree} onCheckedChange={setAgree} />
        </Line>
        {/* Строки у края контейнера: rounded-xl + p-1 → фон наведения rounded-lg */}
        <Surface
          kind="neutral"
          radius="xl"
          padding="1"
          className="flex flex-col"
        >
          <CheckRow
            label="Sodium"
            description="Быстрый рендер"
            checked={mods.sodium}
            onChange={v => setMods(m => ({ ...m, sodium: v }))}
          />
          <CheckRow
            label="Lithium"
            description="Оптимизация сервера"
            checked={mods.lithium}
            onChange={v => setMods(m => ({ ...m, lithium: v }))}
          />
          <CheckRow
            label="Iris"
            description="Нет для этой версии"
            checked={false}
            onChange={() => {}}
            disabled
          />
        </Surface>
        <Field label="Канал обновлений" description="Что ставить при запуске">
          <RadioGroup value={channel} onValueChange={setChannel}>
            <RadioRow
              value="release"
              label="Release"
              description="Стабильные"
            />
            <RadioRow
              value="snapshot"
              label="Snapshot"
              description="Каждую неделю"
            />
            <RadioRow value="old" label="Old alpha" disabled />
          </RadioGroup>
        </Field>
        <RadioGroup
          value={channel}
          onValueChange={setChannel}
          orientation="horizontal"
          aria-label="Канал кружками"
          className="flex-row gap-4"
        >
          <RadioGroupItem value="release" aria-label="Release" />
          <RadioGroupItem value="snapshot" aria-label="Snapshot" />
          <RadioGroupItem value="old" aria-label="Old alpha" disabled />
        </RadioGroup>
      </Block>

      <Block title="Поля ввода">
        <Field label="Имя сборки" description="Видно в списке слева">
          <TextField
            value={name}
            onChangeText={setName}
            placeholder="Моя сборка"
            onSubmit={() => setSubmitted(name)}
          />
        </Field>
        {submitted ? (
          <Text size="xs" tone="success">
            Enter: {submitted}
          </Text>
        ) : null}
        <Field label="Память" error={memoryError}>
          <TextField
            value={memory}
            onChangeText={setMemory}
            numeric
            mono
            trailing={
              <Text tone="muted" className="pr-2.5">
                МБ
              </Text>
            }
          />
        </Field>
        <Field label="Папка игры">
          <TextField
            value={path}
            onChangeText={setPath}
            mono
            trailing={
              <Button size="sm" variant="secondary">
                Обзор
              </Button>
            }
          />
        </Field>
        <TextField
          value={search}
          onChangeText={setSearch}
          icon={Dot}
          type="search"
          placeholder="Поиск модов"
          aria-label="Поиск модов"
        />
        <Field label="Заметки">
          <TextField
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Что поменял в сборке"
          />
        </Field>
        <Field label="Пароль сервера" disabled>
          <TextField value="secret" onChangeText={() => {}} secure />
        </Field>
      </Block>
    </>
  );
};
