import React, { useState } from 'react';
import {
  Button,
  Segmented,
  Surface,
  Text,
  innerRadius,
  type RadiusStep,
  type SpaceStep,
} from '@tugen/uikit/web';
import { Code } from '../ui/code';
import { C, H1, H2, H3, Lead, Li, Note, P, Table, Ul } from '../ui/prose';

const OUTER = ['xl', '2xl', '3xl'] as const satisfies readonly RadiusStep[];
const PADDING = ['1', '2', '3', '4'] as const satisfies readonly SpaceStep[];

// Песочница: контейнер с выбранным радиусом и отступом, рядом — вложенный элемент с тем же радиусом
// (так делать не надо) и по правилу. Разница видна в углу

const Playground: React.FC = () => {
  const [outer, setOuter] = useState<(typeof OUTER)[number]>('2xl');
  const [padding, setPadding] = useState<(typeof PADDING)[number]>('2');
  const inner = innerRadius(outer, padding);
  return (
    <div className="my-6 flex flex-col gap-4 rounded-xl border border-mist-200 p-4 sm:p-6 dark:border-mist-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex flex-col gap-1.5">
          <Text size="xs" tone="muted">
            Радиус контейнера
          </Text>
          <Segmented
            options={OUTER.map(value => ({ value, label: value }))}
            value={outer}
            onChange={setOuter}
            aria-label="Радиус контейнера"
            className="w-56"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Text size="xs" tone="muted">
            Отступ
          </Text>
          <Segmented
            options={PADDING.map(value => ({ value, label: `p-${value}` }))}
            value={padding}
            onChange={setPadding}
            aria-label="Отступ"
            className="w-64"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[false, true].map(byRule => (
          <div key={String(byRule)} className="flex flex-col gap-2">
            <Text
              size="xs"
              tone={byRule ? 'success' : 'danger'}
              weight="semibold"
            >
              {byRule ? `По правилу: внутри ${inner}` : 'Тот же радиус внутри'}
            </Text>
            <Surface
              kind="overlay"
              radius={outer}
              padding={padding}
              className="flex flex-col"
            >
              {byRule ? (
                <Surface
                  kind="neutral"
                  nested
                  className="flex h-24 items-end p-3"
                >
                  <Button grow>Кнопка</Button>
                </Surface>
              ) : (
                <Surface
                  kind="neutral"
                  radius={outer}
                  className="flex h-24 items-end p-3"
                >
                  <Button grow>Кнопка</Button>
                </Surface>
              )}
            </Surface>
          </div>
        ))}
      </div>
      <Text tone="secondary" mono size="xs">
        rounded-{outer} ({innerRadius(outer, 0)}) − p-{padding} (
        {innerRadius(outer, 0) - inner}) = {inner}
      </Text>
    </div>
  );
};

export const RadiusRule: React.FC = () => (
  <article>
    <H1>Правило скругления</H1>
    <Lead>
      Внешний радиус = внутренний радиус + отступ между краями. Тогда край
      вложенного элемента идёт параллельно краю контейнера, а не расходится в
      углу.
    </Lead>
    <Playground />
    <P>
      Если внутри стоит элемент с тем же радиусом, что у контейнера, угол между
      ними толще, чем стороны: глаз видит это как неаккуратность. Kit не
      полагается на договорённость — радиус вложенного элемента считается сам.
    </P>

    <H2>Как это устроено</H2>
    <Ul>
      <Li>
        Контейнер объявляет свой радиус и отступ:{' '}
        <C>&lt;RadiusScope radius="xl" padding="1"&gt;</C> или{' '}
        <C>&lt;Surface padding="2"&gt;</C>.
      </Li>
      <Li>
        Элемент у края берёт радиус из <C>useInnerRadius(запасной)</C>, а класс
        — из <C>radiusProps(px)</C>. Радиус вне шкалы уходит в <C>style</C>.
      </Li>
      <Li>
        Так уже устроены <C>Button</C>, <C>IconButton</C>, пункты меню,
        сегменты, вкладки и <C>Surface nested</C>. Вне контейнера они берут свой
        обычный радиус.
      </Li>
    </Ul>
    <Code
      code={`<Surface kind="overlay" radius="3xl" padding="3">   {/* 24 − 12 */}
  <Surface kind="neutral" nested padding="1">        {/* получит rounded-xl (12) */}
    <Button grow>Кнопка</Button>                     {/* 12 − 4 → rounded-lg (8) */}
  </Surface>
</Surface>`}
    />

    <H2>Пары kit</H2>
    <P>
      На этих парах стоят готовые элементы — свои контейнеры удобно делать
      такими же.
    </P>
    <Table
      head={['Контейнер', 'Радиус и отступ', 'Вложенное']}
      rows={[
        [
          'Меню, Select, Popover, HoverCard, Alert',
          <C>rounded-xl + p-1 (12 − 4)</C>,
          <C>rounded-lg (8)</C>,
        ],
        [
          'Dialog, AlertDialog, Sheet, уведомление',
          <C>rounded-2xl + p-2 (16 − 8)</C>,
          <C>rounded-lg (8)</C>,
        ],
        [
          'ToggleGroup, Segmented, Tabs segmented, поле с кнопкой',
          <C>rounded-lg + p-0.5 (8 − 2)</C>,
          <C>rounded-md (6)</C>,
        ],
        [
          'То же в виде капсулы',
          <C>rounded-full + p-0.5</C>,
          <C>rounded-full</C>,
        ],
      ]}
    />

    <H2>Свой элемент</H2>
    <H3>Контейнер</H3>
    <P>
      <C>RadiusScope</C> ничего не рисует, только объявляет размеры.
      Оборачивайте им содержимое своего контейнера с отступом:
    </P>
    <Code
      code={`import { RadiusScope } from '@tugen/uikit/web';

const Panel = ({ children }) => (
  <div className="rounded-2xl p-2 bg-mist-100 dark:bg-mist-900">
    <RadiusScope radius="2xl" padding="2">{children}</RadiusScope>
  </div>
);`}
    />
    <H3>Вложенный элемент</H3>
    <Code
      code={`import { cx, radiusProps, useInnerRadius } from '@tugen/uikit/web';

const Tile = ({ className, children }) => {
  // В контейнере — радиус по правилу, вне него — rounded-lg
  const rounded = radiusProps(useInnerRadius('lg'));
  return (
    <div className={cx('bg-mist-200 dark:bg-mist-800', rounded.className, className)} style={rounded.style}>
      {children}
    </div>
  );
};`}
    />
    <H3>Расчёты руками</H3>
    <Code
      language="ts"
      code={`innerRadius('2xl', '2'); // 8
outerRadius('lg', '1');  // 12
radiusStep(8);           // 'lg'`}
    />
    <Note tone="warning" title="Капсула">
      У круглого контейнера (<C>rounded-full</C>) радиус — половина высоты,
      поэтому вложенный элемент тоже круглый: <C>innerRadius('full', …)</C>{' '}
      остаётся <C>full</C>.
    </Note>
  </article>
);
