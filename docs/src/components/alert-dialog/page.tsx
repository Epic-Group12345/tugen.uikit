import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'AlertDialog',
  group: 'Окна',
  lead: 'Окно-подтверждение перед необратимым или заметным действием. Нажатие мимо его не закрывает: ответить нужно кнопкой.',
  components: ['AlertDialogContent', 'AlertDialogAction', 'AlertDialogCancel'],
  examples: [
    {
      id: 'danger',
      title: 'Удаление',
      text: (
        <>
          <C>AlertDialogAction</C> — кнопка kit, по умолчанию <C>primary</C>;
          для удаления — <C>variant="danger"</C>. <C>AlertDialogCancel</C> —
          нейтральная, Radix ставит на неё фокус при открытии.
        </>
      ),
    },
    {
      id: 'confirm',
      title: 'Подтверждение действия',
      text: (
        <>
          <C>onClick</C> главной кнопки выполняет действие, после него окно
          закрывается само. Escape закрывает окно, как отмена.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Заголовок — вопрос с объектом: «Удалить „Выживание“?». Описание — что
        именно пропадёт или изменится.
      </Li>
      <Li>
        Подпись главной кнопки — то же действие, что в вопросе: «Удалить», а не
        «Да» и не «ОК».
      </Li>
      <Li>
        Не спрашивайте о том, что легко отменить: частые подтверждения приучают
        нажимать не читая. Для отменяемого действия лучше уведомление с кнопкой
        «Вернуть».
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере окно на <C>@rn-primitives/alert-dialog</C> рисуется в{' '}
      <C>PopupHost</C>, Escape на Windows ловит kit. Действие кнопки —{' '}
      <C>onPress</C>: примитив склеивает его со своим закрытием окна, как Radix
      склеивает <C>onClick</C>.
    </P>
  ),
};
