import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Select',
  group: 'Выбор и меню',
  lead: 'Выпадающий список: кнопка показывает текущий вариант, список — все. Для выбора из длинного перечня, который не помещается в ряд.',
  components: [
    'Select',
    'SelectRoot',
    'SelectTrigger',
    'SelectValue',
    'SelectContent',
    'SelectItem',
  ],
  examples: [
    {
      id: 'basic',
      title: 'Одной строкой',
      text: (
        <>
          <C>Select</C> собирает список из <C>options</C>: значение — строка,{' '}
          <C>onChange</C> отдаёт новую. Без <C>placeholder</C> кнопка не бывает
          пустой и показывает первый вариант.
        </>
      ),
    },
    {
      id: 'placeholder',
      title: 'Подпись-подсказка и ряд',
      text: (
        <>
          <C>placeholder</C> виден, пока <C>value</C> нет среди вариантов.{' '}
          <C>grow</C> делит ширину ряда поровну, <C>disabled</C> гасит список.
        </>
      ),
    },
    {
      id: 'composite',
      title: 'Составной',
      text: (
        <>
          <C>SelectRoot</C> и части — для групп, подписей и своего содержимого
          пункта. Значение здесь — пара <C>{'{ value, label }'}</C>: подпись
          нужна кнопке, пока список закрыт. <C>value={'{undefined}'}</C> снова
          показывает подсказку.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Два-четыре коротких варианта видны сразу — для них лучше{' '}
        <C>Segmented</C> или радиокнопки: список прячет выбор за нажатием.
      </Li>
      <Li>
        У кнопки списка нет видимой подписи поля: дайте ей <C>aria-label</C> или
        поставьте рядом подпись.
      </Li>
      <Li>
        Кнопка занимает ширину контейнера (<C>w-full</C>): в ряду задайте ей
        обёртку с шириной или <C>grow</C>.
      </Li>
      <Li>
        Список для действий («Удалить», «Экспорт») — не выбор, а меню: берите{' '}
        <C>DropdownMenu</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере список построен на <C>@rn-primitives/select</C> и рисуется в{' '}
      <C>PopupHost</C> в корне приложения. Подпись кнопки —{' '}
      <C>accessibilityLabel</C>, картинка варианта — <C>ImageSourcePropType</C>{' '}
      вместо адреса. У короткого <C>Select</C> там нет <C>disabled</C> и{' '}
      <C>grow</C>.
    </P>
  ),
};
