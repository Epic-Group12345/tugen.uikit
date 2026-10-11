import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Slider',
  group: 'Формы',
  lead: 'Ползунок для числа в диапазоне: громкость, память. Нажатие на дорожку ставит значение, протягивание и стрелки меняют его.',
  components: ['Slider'],
  examples: [
    {
      id: 'basic',
      title: 'Ползунок',
      text: (
        <>
          Значение — <C>value</C> и <C>onChange</C>, диапазон по умолчанию от 0
          до 100. Подпись — <C>aria-label</C> или <C>Field</C>; число рядом
          ползунок сам не показывает.
        </>
      ),
    },
    {
      id: 'step',
      title: 'Шаг и сохранение',
      text: (
        <>
          <C>min</C>, <C>max</C> и <C>step</C> задают диапазон и шаг.{' '}
          <C>onChange</C> вызывается на каждом шаге протягивания, а{' '}
          <C>onCommit</C> — когда ползунок отпустили: в нём и сохраняйте.
        </>
      ),
    },
    {
      id: 'disabled',
      title: 'Недоступный',
      text: (
        <>
          <C>disabled</C> приглушает ползунок — например, громкость при
          выключенной музыке.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Ползунок — для приблизительного значения. Когда важна точная цифра
        (память в мегабайтах), дайте рядом поле{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/text-field"
        >
          TextField
        </a>{' '}
        с <C>numeric</C> или хотя бы показывайте текущее значение.
      </Li>
      <Li>
        Тяжёлую работу (запись в файл, запрос) делайте в <C>onCommit</C>, а не в{' '}
        <C>onChange</C>.
      </Li>
      <Li>
        Ширина — во всю ширину родителя; ограничивайте её контейнером или{' '}
        <C>className</C>.
      </Li>
      <Li>
        Роль <C>slider</C> и фокус — у бегунка: ему же уходят <C>aria-label</C>,{' '}
        <C>id</C> и связи из <C>Field</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере ползунок проще: <C>value</C>, <C>min</C>, <C>max</C>,{' '}
      <C>onChange</C> и <C>accessibilityLabel</C>. Шага, <C>onCommit</C>,{' '}
      <C>disabled</C> и связей из <C>Field</C> нет, значение дробное —
      округляйте его сами. Для диктора это элемент с ролью <C>adjustable</C>.
    </P>
  ),
};
