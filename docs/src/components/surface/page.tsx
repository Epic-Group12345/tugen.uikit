import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Surface',
  group: 'Поверхности',
  lead: 'Поверхность одного из уровней интерфейса: окно, страница, карточка, всплывающее окно, плашка. Уровни различаются цветом и рамкой, а не тенью.',
  components: ['Surface', 'Card', 'Divider'],
  examples: [
    {
      id: 'kinds',
      title: 'Уровни',
      text: (
        <>
          <C>kind</C> задаёт фон и обычное скругление: у <C>card</C> и{' '}
          <C>overlay</C> — <C>rounded-xl</C>, у <C>neutral</C> —{' '}
          <C>rounded-lg</C>, у <C>window</C> и <C>page</C> скругления нет.
        </>
      ),
    },
    {
      id: 'radius',
      title: 'Правило скругления',
      text: (
        <>
          С <C>padding</C> поверхность становится контейнером правила: вложенная{' '}
          <C>Surface nested</C> и кнопка получают радиус внешней минус отступ.
          Здесь <C>rounded-3xl</C> (24) и <C>p-3</C> (12) дают внутри{' '}
          <C>rounded-xl</C> (12) — края идут параллельно.
        </>
      ),
    },
    {
      id: 'card',
      title: 'Card и Divider',
      text: (
        <>
          <C>Card</C> ставит между дочерними элементами разделитель с отступами
          по краям. <C>Divider orientation="vertical"</C> разделяет элементы
          ряда.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Теней нет: если карточка сливается с фоном, она стоит не на том уровне.
        Карточка лежит на странице, меню и окна — поверх всего.
      </Li>
      <Li>
        Отступ задавайте через <C>padding</C>, а не классом <C>p-*</C>, когда
        внутри есть скруглённые элементы у края — иначе их радиус придётся
        считать руками. Подробнее — в{' '}
        <a className="text-blue-600 dark:text-blue-400" href="#/radius">
          правиле скругления
        </a>
        .
      </Li>
      <Li>
        <C>Divider</C> по умолчанию декоративный и диктору не виден;{' '}
        <C>decorative={'{false}'}</C> — когда он разделяет смысловые группы.
      </Li>
      <Li>
        Для настроек берите <C>Section</C> и <C>Row</C>: они уже собраны из{' '}
        <C>Card</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же уровни, <C>padding</C> и <C>nested</C>; радиус вне шкалы уходит в{' '}
      <C>style</C>. <C>Surface</C> — <C>View</C>, поэтому раскладка по умолчанию
      уже колонкой. <C>Divider</C> собран на <C>@rn-primitives/separator</C>.
    </P>
  ),
};
