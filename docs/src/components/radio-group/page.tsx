import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'RadioGroup',
  group: 'Формы',
  lead: 'Выбор одного варианта из нескольких кружками. Подходит, когда варианты стоит видеть все сразу и у каждого есть пояснение.',
  components: ['RadioGroup', 'RadioGroupItem', 'RadioRow'],
  examples: [
    {
      id: 'rows',
      title: 'Варианты с пояснением',
      text: (
        <>
          <C>RadioRow</C> — готовая строка: <C>label</C> и <C>description</C>,
          нажимается целиком. Внутри <C>Field</C> группа берёт подпись и
          пояснение поля.
        </>
      ),
    },
    {
      id: 'items',
      title: 'Своё содержимое',
      text: (
        <>
          <C>RadioGroupItem</C> с <C>children</C> — строка с любым содержимым.
          Строка — это <C>&lt;button&gt;</C>, поэтому внутри только строчные
          элементы: <C>Text</C>, <C>span</C>.
        </>
      ),
    },
    {
      id: 'horizontal',
      title: 'В ряд',
      text: (
        <>
          <C>orientation="horizontal"</C> переключает стрелки на влево / вправо,
          раскладку задаёт <C>className="flex-row gap-4"</C>. Кружку без подписи
          нужен <C>aria-label</C> или <C>Label</C> с <C>htmlFor</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Два–пять вариантов. Больше — берите{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/select"
        >
          Select
        </a>
        , короткие подписи без пояснений в одну строку —{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/segmented"
        >
          Segmented
        </a>
        .
      </Li>
      <Li>
        Выбор по умолчанию — безопасный вариант, а не пустой: «ничего не
        выбрано» (<C>undefined</C>) оставляйте, только когда выбор обязателен и
        осознан.
      </Li>
      <Li>
        Стрелки переводят выбор между вариантами, Tab уводит из группы целиком —
        это поведение Radix.
      </Li>
      <Li>
        Для формы без JavaScript есть <C>name</C> и <C>required</C>: Radix
        добавит скрытые <C>&lt;input type="radio"&gt;</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же <C>value</C> и <C>onValueChange</C> на @rn-primitives/radio-group.
      Подпись группы и кружка — <C>accessibilityLabel</C>, идентификатор —{' '}
      <C>nativeID</C>. Свойств <C>orientation</C>, <C>name</C> и <C>required</C>{' '}
      нет; наведение рисуют слои <C>StateLayers</C>.
    </P>
  ),
};
