import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'ContextMenu',
  group: 'Выбор и меню',
  lead: 'Меню по правой кнопке мыши или долгому касанию: встаёт у точки нажатия. Пункты, флажки и подменю — те же, что у DropdownMenu.',
  components: ['ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem'],
  examples: [
    {
      id: 'basic',
      title: 'Меню у карточки',
      text: (
        <>
          <C>ContextMenuTrigger</C> — область, по которой открывается меню. Без{' '}
          <C>asChild</C> Radix рисует строчный <C>&lt;span&gt;</C>, поэтому блок
          передавайте своим элементом.
        </>
      ),
    },
    {
      id: 'nested',
      title: 'Подменю и флажок',
      text: (
        <>
          <C>ContextMenuSub</C> с <C>ContextMenuSubTrigger</C> и{' '}
          <C>ContextMenuSubContent</C> — подменю, <C>ContextMenuCheckboxItem</C>{' '}
          — флажок с галочкой справа.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Контекстное меню — ускоритель, а не единственный путь: те же действия
        должны быть доступны кнопкой или обычным меню, иначе их не найдут.
      </Li>
      <Li>
        Порядок и подписи пунктов — как в меню той же сущности у кнопки: человек
        узнаёт их по месту.
      </Li>
      <Li>
        Необратимое действие — последним, после разделителя, с{' '}
        <C>destructive</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере меню на <C>@rn-primitives/context-menu</C> рисуется в{' '}
      <C>PopupHost</C>. Долгое нажатие даёт примитив, правую кнопку мыши kit
      ловит сам через <C>onPointerDown</C>: у <C>Pressable</C> в RN нет{' '}
      <C>onContextMenu</C>. Подпись области — <C>accessibilityLabel</C>, а{' '}
      <C>relativeTo="trigger"</C> у корня ставит меню у края области, а не у
      точки нажатия.
    </P>
  ),
};
