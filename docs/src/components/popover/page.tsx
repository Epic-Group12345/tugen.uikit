import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Popover',
  group: 'Окна',
  lead: 'Всплывающая карточка у кнопки: подробности, пояснение или маленькая форма. Не прерывает работу — закрывается нажатием мимо и Escape.',
  components: ['PopoverContent', 'PopoverBody', 'PopoverRow'],
  examples: [
    {
      id: 'details',
      title: 'Подробности',
      text: (
        <>
          <C>PopoverBody</C> — текстовая часть с заголовком и отступом от края,{' '}
          <C>PopoverRow</C> — строка «подпись — значение». Кнопка у края
          карточки по правилу скругления получает <C>rounded-lg</C>.
        </>
      ),
    },
    {
      id: 'text',
      title: 'Пояснение',
      text: (
        <>
          Строка в <C>PopoverContent</C> сама становится абзацем с отступом.{' '}
          <C>side="top"</C> ставит карточку над кнопкой; если места нет, она
          встанет напротив.
        </>
      ),
    },
    {
      id: 'form',
      title: 'Маленькая форма',
      text: (
        <>
          <C>open</C> и <C>onOpenChange</C> на <C>Popover</C> — закрыть карточку
          после отправки. Фокус при закрытии возвращается на кнопку.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Карточка — для необязательного: то, что можно не открывать. Обязательный
        выбор — в <C>Dialog</C>, длинная форма — в <C>Sheet</C>.
      </Li>
      <Li>
        Ширину задайте классом (<C>w-64</C>, <C>w-72</C>): содержимое карточки
        не растягивает её по экрану.
      </Li>
      <Li>
        Для пояснения при наведении без нажатия — <C>HoverCard</C> или{' '}
        <C>Tooltip</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере карточка на <C>@rn-primitives/popover</C> рисуется в{' '}
      <C>PopupHost</C>; положение и Escape на Windows считает kit, а появляется
      она только прозрачностью — окно может встать с любой стороны кнопки.
      Подпись окна — <C>accessibilityLabel</C>.
    </P>
  ),
};
