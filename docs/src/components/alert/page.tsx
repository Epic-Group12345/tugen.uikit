import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Alert',
  group: 'Отображение',
  lead: 'Сообщение в потоке страницы, а не окно: «нет связи с сервером», «мод несовместим». Фон — цвет смысла с прозрачностью.',
  components: ['Alert'],
  examples: [
    {
      id: 'tones',
      title: 'Тона',
      text: (
        <>
          <C>info</C>, <C>success</C>, <C>warning</C>, <C>danger</C> и{' '}
          <C>neutral</C>. Предупреждение и ошибку диктор зачитывает сразу — у
          них <C>role="alert"</C>, остальные — как статус.
        </>
      ),
    },
    {
      id: 'action',
      title: 'С действием',
      text: (
        <>
          <C>action</C> — кнопки справа. Они прилегают к краю карточки и по{' '}
          <a className="text-blue-600 dark:text-blue-400" href="#/radius">
            правилу скругления
          </a>{' '}
          получают <C>rounded-lg</C>: 12 − 4 = 8.
        </>
      ),
    },
    {
      id: 'plain',
      title: 'Коротко',
      text: (
        <>
          Без иконки и заголовка — одна строка пояснения; без пояснения — один
          заголовок.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Заголовок — что случилось, пояснение — что делать. Ошибка без выхода
        («что-то пошло не так») не помогает.
      </Li>
      <Li>
        Иконка — того же смысла, что тон: она красится сама. Подойдёт любой
        компонент со свойствами <C>size</C> и <C>className</C>.
      </Li>
      <Li>
        Сообщение о только что сделанном действии, которое скоро станет
        неважным, — это уведомление (<C>toast</C>), а не <C>Alert</C>.
      </Li>
      <Li>
        Одно действие, редко два. Главное — <C>primary</C>, остальные —{' '}
        <C>secondary</C> или <C>IconButton</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же свойства и роли. Кнопки в <C>action</C> — с <C>onPress</C>, у{' '}
      <C>IconButton</C> подпись — <C>accessibilityLabel</C>.
    </P>
  ),
};
