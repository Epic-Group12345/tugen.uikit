import React from 'react';
import {
  Button,
  Divider,
  IconButton,
  Row,
  Section,
  Surface,
  Text,
  Icons,
} from '../../../src/web';
import { Block, Line } from './shared';

export const Basics: React.FC = () => (
  <>
    <Block title="Кнопки">
      <Line>
        <Button variant="play" size="lg">
          Играть
        </Button>
        <Button icon={Icons.FloppyDisk}>Сохранить</Button>
        <Button variant="secondary">Отмена</Button>
        <Button variant="outline">Подробнее</Button>
        <Button variant="ghost">Пропустить</Button>
        <Button variant="danger">Удалить</Button>
        <Button disabled>Недоступно</Button>
        <IconButton icon={Icons.Ellipsis} aria-label="Ещё" />
        <IconButton icon={Icons.Stop} aria-label="Завершить" tone="danger" />
      </Line>
    </Block>
    <Block title="Иконки: Gravity UI, Icons.<Имя>">
      <Line>
        {[
          Icons.Play,
          Icons.Gear,
          Icons.Persons,
          Icons.Bell,
          Icons.Magnifier,
          Icons.FolderOpen,
          Icons.ArrowDownToLine,
          Icons.TrashBin,
        ].map((Icon, i) => (
          <Icon
            key={i}
            size={16}
            className="text-mist-700 dark:text-mist-300"
          />
        ))}
        <Icons.StarFill size={24} className="text-amber-500" />
        <Icons.CircleCheck size={24} className="text-green-600" />
      </Line>
    </Block>
    <Section title="Настройки">
      <Row title="Музыка" description="Фоновая музыка в лаунчере">
        <Text tone="muted">Вкл</Text>
      </Row>
      <Row title="Папка игры" wide>
        <Text mono truncate>
          C:\Users\Steve\AppData\Roaming\.tugen
        </Text>
      </Row>
    </Section>
    <Block title="Правило скругления: внешний = внутренний + отступ">
      <Surface
        kind="overlay"
        radius="3xl"
        padding="3"
        className="flex flex-col gap-3"
      >
        <Text size="xs" tone="muted">
          rounded-3xl (24) + p-3 (12) → вложенная поверхность 12
        </Text>
        <Surface
          kind="neutral"
          nested
          padding="1"
          className="flex flex-col gap-1"
        >
          <Text size="xs" tone="muted" className="px-2">
            rounded-xl (12) + p-1 (4) → кнопка 8
          </Text>
          <Button grow>Кнопка по правилу</Button>
        </Surface>
      </Surface>
      <Divider />
      <Text tone="muted">
        Текст muted · <Text tone="danger">danger</Text> ·{' '}
        <Text tone="success">success</Text>
      </Text>
    </Block>
  </>
);
