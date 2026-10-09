import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'DropdownMenu',
  group: 'Выбор и меню',
  lead: 'Меню действий у кнопки: пункты с иконками и горячими клавишами, флажки, выбор одного из группы, подменю. Короткая форма — Dropdown: кнопка-иконка и список пунктов.',
  components: [
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuCheckboxItem',
    'DropdownMenuRadioItem',
    'DropdownMenuSubTrigger',
    'Dropdown',
    'Menu',
  ],
  examples: [
    {
      id: 'basic',
      title: 'Составное меню',
      text: (
        <>
          <C>DropdownMenu</C> держит состояние, <C>DropdownMenuTrigger</C> с{' '}
          <C>asChild</C> отдаёт нажатие кнопке kit, <C>DropdownMenuContent</C> —
          окно. Пункт закрывает меню после <C>onSelect</C>; <C>destructive</C>{' '}
          красит необратимое действие.
        </>
      ),
    },
    {
      id: 'checkable',
      title: 'Флажки и выбор одного',
      text: (
        <>
          <C>DropdownMenuCheckboxItem</C> — независимый флажок,{' '}
          <C>DropdownMenuRadioItem</C> внутри <C>DropdownMenuRadioGroup</C> —
          один вариант из группы. <C>closeOnSelect={'{false}'}</C> оставляет
          меню открытым, чтобы переключить несколько флажков подряд.
        </>
      ),
    },
    {
      id: 'dropdown',
      title: 'Одной строкой',
      text: (
        <>
          <C>Dropdown</C> — кнопка-иконка с меню из массива <C>items</C>. У
          пункта с <C>selected</C> справа галочка. Подпись кнопки видна только
          диктору, поэтому <C>aria-label</C> обязателен.
        </>
      ),
    },
    {
      id: 'list',
      title: 'Меню у своей кнопки',
      text: (
        <>
          <C>useDropdownMenu</C> рисует <C>Menu</C> у любой кнопки: дайте ей{' '}
          <C>ref={'{anchorRef}'}</C> и <C>onClick</C>, а рядом отрисуйте{' '}
          <C>menu(items)</C>. <C>matchWidth</C> — меню не уже кнопки. Новое
          лучше строить на составном меню.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Меню — для действий над объектом: сборкой, миром, сервером. Выбор
        значения поля — это <C>Select</C>.
      </Li>
      <Li>
        Пункт без иконки среди пунктов с иконками выровняйте свойством{' '}
        <C>inset</C>.
      </Li>
      <Li>
        Необратимое действие — последним, после разделителя, с{' '}
        <C>destructive</C>; удаление сборки дополнительно подтверждайте{' '}
        <C>AlertDialog</C>.
      </Li>
      <Li>
        Длинное меню не выходит за край страницы, а прокручивается; ширину
        задайте классом на окне (<C>w-60</C>) или <C>matchTriggerWidth</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере меню на <C>@rn-primitives/dropdown-menu</C> рисуется в{' '}
      <C>PopupHost</C>, Escape закрывает его через слой kit. Подменю там
      раскрывается в том же окне под своим пунктом, а не отдельным окном сбоку.
      Подпись окна и кнопки <C>Dropdown</C> — <C>accessibilityLabel</C>, у
      пунктов <C>Dropdown</C> и <C>Menu</C> нажатие — <C>onPress</C> вместо{' '}
      <C>onSelect</C>; <C>Menu</C> и <C>useDropdownMenu</C> там построены на{' '}
      <C>Popup</C>.
    </P>
  ),
};
