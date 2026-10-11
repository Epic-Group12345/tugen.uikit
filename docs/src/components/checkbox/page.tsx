import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Checkbox',
  group: 'Формы',
  lead: 'Флажок «да / нет» и строка с флажком, подписью и пояснением. Берите его, когда вариантов можно выбрать несколько или изменение вступит в силу после сохранения.',
  components: ['Checkbox', 'CheckRow'],
  examples: [
    {
      id: 'basic',
      title: 'Флажок',
      text: (
        <>
          Состояние — <C>checked</C> и <C>onCheckedChange</C>. Одному квадрату
          нужен <C>aria-label</C>; с <C>children</C> флажок становится строкой с
          подписью, и нажимается вся строка.
        </>
      ),
    },
    {
      id: 'rows',
      title: 'Строки с пояснением',
      text: (
        <>
          <C>CheckRow</C> — готовая строка: <C>label</C>, <C>description</C>,{' '}
          <C>checked</C> и <C>onChange</C>. Фон наведения у края контейнера
          скругляется по правилу: здесь <C>rounded-xl</C> с отступом <C>p-1</C>{' '}
          дают строкам <C>rounded-lg</C>.
        </>
      ),
    },
    {
      id: 'indeterminate',
      title: 'Частичный выбор',
      text: (
        <>
          <C>indeterminate</C> — выбрана часть вложенных: черта вместо галочки,
          для диктора — <C>aria-checked="mixed"</C>. Нажатие на такой флажок
          выбирает всё.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Флажок — для выбора, который применится позже («Установить вместе с
        модами»). Настройку, которая действует сразу, делайте{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/toggle"
        >
          Toggle
        </a>
        .
      </Li>
      <Li>
        Подпись — утверждение без отрицания: «Показывать скрытые файлы», а не
        «Не скрывать файлы».
      </Li>
      <Li>
        Для формы без JavaScript есть <C>name</C>, <C>value</C> и{' '}
        <C>required</C>: Radix добавит скрытый <C>&lt;input&gt;</C>.
      </Li>
      <Li>
        <C>checkIcon</C> заменяет встроенную галочку своей иконкой. Квадрат без
        поведения для своих списков — <C>CheckboxBox</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же <C>checked</C>, <C>onCheckedChange</C> и <C>indeterminate</C>.
      Подпись квадрата — <C>accessibilityLabel</C>, свой идентификатор для{' '}
      <C>Label</C> — <C>nativeID</C>. Свойств формы (<C>name</C>, <C>value</C>)
      нет, галочка нарисована повёрнутым уголком, а наведение — слоями{' '}
      <C>StateLayers</C>.
    </P>
  ),
};
