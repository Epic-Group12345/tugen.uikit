import React from 'react';
import {
  breakpoints,
  font,
  motion,
  palette,
  radius,
  space,
  text,
} from '@tugen/uikit/web';
import { Code } from '../ui/code';
import { C, H1, H2, Lead, P, Table } from '../ui/prose';

// Шкалы из tokens.json: те же числа видят и Tailwind, и React Native

const byValue = <T extends Record<string, number>>(scale: T) =>
  Object.entries(scale).sort(([, a], [, b]) => a - b);

export const Tokens: React.FC = () => (
  <article>
    <H1>Токены</H1>
    <Lead>
      Единственный источник — <C>tokens/tokens.json</C>. Из него читают и React
      Native (<C>src/tokens.ts</C>), и Tailwind, поэтому числа на обеих
      платформах совпадают.
    </Lead>
    <Code
      language="ts"
      code={`import { palette, radius, space, text, motion } from '@tugen/uikit/tokens';

radius.xl;       // 12
space[4];        // 16 — как p-4
text.sm;         // { fontSize: 14, lineHeight: 20 }`}
    />

    <H2>Палитра</H2>
    <P>
      Палитра Tailwind 4 в sRGB. В интерфейсе работают шесть цветов: <C>mist</C>{' '}
      — серая шкала поверхностей и текста, остальные — смысловые.
    </P>
    <div className="my-5 flex flex-col gap-4">
      {Object.entries(palette)
        // white — один цвет, не шкала
        .filter(([, shades]) => typeof shades === 'object')
        .map(([name, shades]) => (
          <div key={name} className="flex flex-col gap-1.5">
            <span className="font-mono text-sm font-medium">{name}</span>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
              {Object.entries(shades as Record<string, string>).map(
                ([shade, hex]) => (
                  <div key={shade} className="flex flex-col gap-1">
                    <div
                      className="h-10 rounded-lg border border-mist-950/5 dark:border-mist-50/10"
                      style={{ backgroundColor: hex }}
                      title={`${name}-${shade} ${hex}`}
                    />
                    <span className="font-mono text-[11px] text-mist-500 dark:text-mist-400">
                      {shade}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
    </div>

    <H2>Скругления</H2>
    <P>
      <C>lg</C> — кнопки и поля, <C>xl</C> — карточки и меню, <C>2xl</C> — окна,{' '}
      <C>full</C> — круглое. Радиусы вложенных элементов считает{' '}
      <C>RadiusScope</C> по правилу скругления.
    </P>
    <div className="my-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
      {byValue(radius).map(([step, px]) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <div
            className="size-16 border-2 border-blue-500 bg-blue-500/10"
            style={{ borderRadius: Math.min(px, 32) }}
          />
          <span className="font-mono text-xs">
            rounded-{step} · {px === 9999 ? '∞' : px}
          </span>
        </div>
      ))}
    </div>

    <H2>Отступы</H2>
    <P>
      Шаг Tailwind: <C>space[4]</C> = 16 = <C>p-4</C>. В лаунчере числа — в DIP.
    </P>
    <div className="my-5 flex flex-col gap-2">
      {byValue(space).map(([step, px]) => (
        <div key={step} className="flex flex-row items-center gap-3">
          <span className="w-12 shrink-0 font-mono text-xs">{step}</span>
          <div
            className="h-3 rounded-sm bg-blue-500"
            style={{ width: px * 4 }}
          />
          <span className="font-mono text-xs text-mist-500 dark:text-mist-400">
            {px}
          </span>
        </div>
      ))}
    </div>

    <H2>Текст</H2>
    <P>
      Системный шрифт Windows. Основная работа — на двух размерах: <C>sm</C> для
      текста и <C>xs</C> для подписей.
    </P>
    <div className="my-5 flex flex-col divide-y divide-mist-200 rounded-xl border border-mist-200 dark:divide-mist-800 dark:border-mist-800">
      {Object.entries(text).map(([size, metrics]) => (
        <div
          key={size}
          className="flex flex-row items-baseline gap-4 px-4 py-3"
        >
          <span className="w-24 shrink-0 font-mono text-xs text-mist-500 dark:text-mist-400">
            {size} · {metrics.fontSize}/{metrics.lineHeight}
          </span>
          <span
            className="truncate"
            style={{
              fontSize: metrics.fontSize,
              lineHeight: `${metrics.lineHeight}px`,
            }}
          >
            Играть в Выживание
          </span>
        </div>
      ))}
    </div>
    <Table
      head={['Шрифт', 'Стек']}
      rows={[
        [<C>sans</C>, <span className="font-mono text-xs">{font.sans}</span>],
        [<C>mono</C>, <span className="font-mono text-xs">{font.mono}</span>],
      ]}
    />

    <H2>Движение</H2>
    <P>
      Длительности, мс. Анимируются только прозрачность и сдвиг — это дёшево на
      обеих платформах.
    </P>
    <Table
      head={['Токен', 'Значение', 'Где']}
      rows={[
        [
          <C>hoverIn / hoverOut</C>,
          `${motion.hoverIn} / ${motion.hoverOut}`,
          'Наведение',
        ],
        [
          <C>pressIn / pressOut</C>,
          `${motion.pressIn} / ${motion.pressOut}`,
          'Нажатие',
        ],
        [<C>appear</C>, motion.appear, 'Появление окон и меню'],
        [<C>toggle</C>, motion.toggle, 'Переключатели'],
        [<C>layout</C>, motion.layout, 'Перемещения в раскладке'],
        [<C>deselect</C>, motion.deselect, 'Снятие выбора'],
        [<C>dimmed</C>, motion.dimmed, 'Прозрачность неактивного элемента'],
      ]}
    />

    <H2>Брейкпоинты</H2>
    <Table
      head={['Режим', 'Ширина окна']}
      rows={[
        [<C>compact</C>, `до ${breakpoints.regular}`],
        [<C>regular</C>, `от ${breakpoints.regular}`],
        [<C>wide</C>, `от ${breakpoints.wide}`],
      ]}
    />
    <P>
      В лаунчере режим даёт <C>useLayout()</C>, функция{' '}
      <C>layoutModeFor(width)</C> — из kit. В вебе пользуйтесь обычными{' '}
      <C>sm:</C> / <C>md:</C> / <C>lg:</C>.
    </P>
  </article>
);
