import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Segmented',
  group: 'Формы',
  lead: 'Выбор одного варианта из двух–четырёх кнопками в ряд — как переключатель темы в настройках. Вариант выбран всегда: повторное нажатие выбор не снимает.',
  components: ['Segmented'],
  examples: [
    {
      id: 'basic',
      title: 'Варианты',
      text: (
        <>
          <C>options</C> — массив <C>{'{ value, label }'}</C>; тип значения
          выводится из него, и <C>onChange</C> получает тот же тип. Сегменты
          делят ширину дорожки поровну.
        </>
      ),
    },
    {
      id: 'icons',
      title: 'С иконками',
      text: (
        <>
          <C>icon</C> у варианта — иконка перед подписью.
        </>
      ),
    },
    {
      id: 'shape',
      title: 'Форма и недоступность',
      text: (
        <>
          По умолчанию дорожка — капсула. <C>shape="rounded"</C>: дорожка{' '}
          <C>rounded-lg</C> с отступом <C>p-0.5</C>, сегменты по правилу
          скругления — <C>rounded-md</C>. <C>disabled</C> приглушает всю
          дорожку.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Подписи короткие, в одно-два слова, и сопоставимой длины: длинная
        подпись обрежется многоточием в узкой дорожке.
      </Li>
      <Li>
        Больше четырёх вариантов или нужны пояснения — берите{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/radio-group"
        >
          RadioGroup
        </a>{' '}
        или{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/select"
        >
          Select
        </a>
        . Выбор нескольких или со снятием —{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/toggle-group"
        >
          ToggleGroup
        </a>
        .
      </Li>
      <Li>
        Ширина — через <C>className</C>: <C>w-full</C> в строке настроек,{' '}
        <C>self-start</C> в столбце, чтобы дорожка не растягивалась.
      </Li>
      <Li>
        Под капотом — <C>ToggleGroup type="single"</C>, поэтому стрелки и роли
        для диктора те же.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же <C>options</C>, <C>value</C>, <C>onChange</C>, <C>shape</C> и{' '}
      <C>disabled</C>; подпись — <C>accessibilityLabel</C>. Свойств{' '}
      <C>className</C> и <C>id</C> нет: ширину задаёт родитель.
    </P>
  ),
};
