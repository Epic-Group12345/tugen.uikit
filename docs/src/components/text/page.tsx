import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Text',
  group: 'Основа',
  lead: 'Текст по шкале kit: размер, насыщенность и цвет по смыслу. Вместо своих классов цвета и размера у каждого абзаца.',
  components: ['Text'],
  examples: [
    {
      id: 'tones',
      title: 'Цвет по смыслу',
      text: (
        <>
          <C>tone</C> называет роль текста, а не цвет: <C>muted</C> — подписи и
          пояснения, <C>faint</C> — совсем тихое. Пара для тёмной темы уже
          внутри.
        </>
      ),
    },
    {
      id: 'sizes',
      title: 'Размер и заголовки',
      text: (
        <>
          По умолчанию <C>Text</C> — <C>&lt;span&gt;</C> размера <C>sm</C>.{' '}
          <C>as</C> меняет тег: <C>p</C> для абзаца, <C>h1</C>…<C>h4</C> для
          заголовков — так страницу понимает диктор.
        </>
      ),
    },
    {
      id: 'technical',
      title: 'Технические строки',
      text: (
        <>
          <C>mono</C> — для путей, аргументов и кодов. <C>truncate</C> обрезает
          строку многоточием; полный текст стоит положить в <C>title</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Основная работа на двух размерах: <C>sm</C> — текст, кнопки, пункты
        меню; <C>xs</C> — подписи и метаданные.
      </Li>
      <Li>
        Насыщенность — только <C>semibold</C> или <C>bold</C>: заголовок окна и
        карточки — <C>lg</C>, пустого состояния — <C>base bold</C>, страницы
        сборки или сервера — <C>2xl</C>/<C>3xl bold</C>.
      </Li>
      <Li>
        Подпись раздела настроек — <C>xs</C> + <C>uppercase</C> +{' '}
        <C>tone="muted"</C>; так её рисует <C>Section</C>.
      </Li>
      <Li>
        Новых цветов текста не вводите: если смысл не подходит ни под один{' '}
        <C>tone</C>, скорее всего он не нужен.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же <C>size</C>, <C>weight</C>, <C>tone</C>, <C>mono</C> и{' '}
      <C>uppercase</C>, но без <C>as</C>: в React Native текст один —{' '}
      <C>Text</C>. Вместо <C>truncate</C> — <C>numberOfLines={'{1}'}</C>.
      Моноширинный шрифт задаётся стилем: класс <C>font-mono</C> на Windows не
      даёт шрифта.
    </P>
  ),
};
