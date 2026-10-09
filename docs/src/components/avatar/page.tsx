import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Avatar',
  group: 'Отображение',
  lead: 'Аватар игрока, сервера или группы: картинка, а пока она грузится или если не загрузилась — инициалы. Точка в углу показывает, где человек.',
  components: ['Avatar', 'AvatarGroup', 'AvatarFallback'],
  examples: [
    {
      id: 'sizes',
      title: 'Размеры и форма',
      text: (
        <>
          <C>circle</C> — люди, <C>rounded</C> — серверы, сборки и группы.
          Скругление квадратного аватара растёт с размером, чтобы форма была
          одна в списке, карточке и чате.
        </>
      ),
    },
    {
      id: 'image',
      title: 'Картинка',
      text: (
        <>
          <C>src</C> — адрес картинки. Пока она грузится или если не
          загрузилась, видны инициалы из <C>alt</C>: «Алекс Стив» → «АС».
        </>
      ),
    },
    {
      id: 'status',
      title: 'Статус',
      text: (
        <>
          <C>status</C>: <C>online</C> — зелёная точка, <C>away</C> — жёлтая,{' '}
          <C>busy</C> — красная, <C>offline</C> — серая.
        </>
      ),
    },
    {
      id: 'group',
      title: 'Группа',
      text: (
        <>
          <C>AvatarGroup</C> ставит аватары внахлёст с обводкой цветом фона;{' '}
          <C>max</C> оставляет первые, остальные сворачиваются в «+N». На
          карточке обводке нужен цвет карточки — <C>ringClassName</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        <C>alt</C> обязателен: это и подпись для диктора, и источник инициалов.
      </Li>
      <Li>
        <C>ringClassName</C> — фон под аватаром. Без него обводка и край точки
        статуса берут цвет страницы и на карточке видны пятном.
      </Li>
      <Li>
        Обводка подчиняется{' '}
        <a className="text-blue-600 dark:text-blue-400" href="#/radius">
          правилу скругления
        </a>
        : её радиус — радиус аватара плюс толщина.
      </Li>
      <Li>
        Своё содержимое (иконку группы вместо инициалов) кладите в{' '}
        <C>AvatarImage</C> и <C>AvatarFallback</C> внутри <C>Avatar</C>;{' '}
        <C>delayMs</C> у замены не даёт инициалам мелькнуть перед быстрой
        картинкой.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Картинка — <C>source</C> (как у <C>Image</C>) вместо <C>src</C>, подпись
      группы — <C>accessibilityLabel</C> вместо <C>aria-label</C>. У{' '}
      <C>AvatarFallback</C> в лаунчере нет <C>delayMs</C>. Собран на{' '}
      <C>@rn-primitives/avatar</C>.
    </P>
  ),
};
