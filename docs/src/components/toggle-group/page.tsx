import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'ToggleGroup',
  group: 'Формы',
  lead: 'Кнопки-переключатели на общей дорожке: выбор одного или нескольких вариантов. ToggleButton — одиночная кнопка с состоянием «нажата».',
  components: ['ToggleGroup', 'ToggleGroupItem', 'ToggleButton'],
  examples: [
    {
      id: 'single',
      title: 'Выбор одного',
      text: (
        <>
          <C>type="single"</C>: повторное нажатие на выбранный сегмент снимает
          выбор, и <C>value</C> становится <C>undefined</C>. Сегменту без
          подписи нужен <C>aria-label</C>.
        </>
      ),
    },
    {
      id: 'multiple',
      title: 'Выбор нескольких',
      text: (
        <>
          <C>type="multiple"</C> — <C>value</C> массив. <C>shape="pill"</C>{' '}
          делает дорожку и сегменты капсулами; по умолчанию дорожка{' '}
          <C>rounded-lg</C>, а сегменты у её края — <C>rounded-md</C>.
        </>
      ),
    },
    {
      id: 'button',
      title: 'ToggleButton',
      text: (
        <>
          Одиночная кнопка: <C>pressed</C> и <C>onPressedChange</C>. Нажатая — с
          фоном, для диктора — <C>aria-pressed</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Группа — для вида и фильтров: плитка или список, загрузчики модов. Выбор
        одного, который нельзя снять, — это{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/segmented"
        >
          Segmented
        </a>
        .
      </Li>
      <Li>
        <C>grow</C> у сегментов делит ширину дорожки поровну — для группы на всю
        ширину (<C>className="w-full"</C>).
      </Li>
      <Li>
        Стрелки переводят фокус между сегментами, Tab уводит из группы. Вид
        сегмента следует <C>data-state</C> примитива, поэтому видимое и
        услышанное диктором не расходятся.
      </Li>
      <Li>
        <C>disabled</C> группы приглушает дорожку один раз; на сегменте —
        выключает только его.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же типы, формы и <C>grow</C> на @rn-primitives/toggle-group. Подпись
      группы и сегмента — <C>accessibilityLabel</C>. Плашка выбранного,
      наведение и нажатие — слои <C>StateLayers</C>, которые проявляются
      прозрачностью: цвет в React Native не анимируется.
    </P>
  ),
};
