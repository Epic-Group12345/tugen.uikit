import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Button',
  group: 'Основа',
  lead: 'Кнопка действия и кнопка-иконка. Вариант говорит о смысле действия, размер — о его месте на экране.',
  components: ['Button', 'IconButton'],
  examples: [
    {
      id: 'variants',
      title: 'Варианты',
      text: (
        <>
          <C>primary</C> — одно главное действие на экране, <C>play</C> — только
          запуск игры, <C>danger</C> — необратимое действие. Остальные — для
          второстепенных.
        </>
      ),
    },
    { id: 'sizes', title: 'Размеры' },
    {
      id: 'icons',
      title: 'С иконкой',
      text: (
        <>
          <C>icon</C> — любой компонент со свойствами <C>size</C> и{' '}
          <C>className</C>. У <C>IconButton</C> подпись видна только экранному
          диктору, поэтому <C>aria-label</C> обязателен.
        </>
      ),
    },
    {
      id: 'grow',
      title: 'По ширине',
      text: (
        <>
          <C>grow</C> растягивает кнопку по ширине родителя — в ряду кнопки
          делят место поровну.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Одна синяя или зелёная кнопка на экран: если главных несколько, главного
        нет.
      </Li>
      <Li>
        Подпись — глагол: «Сохранить», «Удалить сборку». Не «ОК» и не «Да».
      </Li>
      <Li>
        Кнопка работает триггером окон и меню под <C>asChild</C>: она передаёт{' '}
        <C>ref</C> и все свойства <C>&lt;button&gt;</C>.
      </Li>
      <Li>
        Внутри меню, уведомления или окна радиус кнопки считается по{' '}
        <a className="text-blue-600 dark:text-blue-400" href="#/radius">
          правилу скругления
        </a>
        .
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же варианты и размеры. Нажатие — <C>onPress</C>, подпись{' '}
      <C>IconButton</C> — <C>accessibilityLabel</C>. Наведение и нажатие рисуют
      слои <C>StateLayers</C> с анимацией прозрачности: цвет в React Native не
      анимируется.
    </P>
  ),
};
