import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Collapsible',
  group: 'Отображение',
  lead: 'Один раскрывающийся блок: дополнительные параметры, журнал запуска, подробности ошибки. Состояние и aria-expanded — из Radix Collapsible.',
  components: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'],
  examples: [
    {
      id: 'row',
      title: 'Строка с шевроном',
      text: (
        <>
          <C>CollapsibleTrigger</C> по умолчанию — строка с подписью, иконкой и
          шевроном, который поворачивается при раскрытии. Строка становится
          абзацем вторичного цвета.
        </>
      ),
    },
    {
      id: 'button',
      title: 'Своя кнопка',
      text: (
        <>
          С <C>asChild</C> нажатие уходит вашему элементу, например{' '}
          <C>Button</C>, без оформления kit. <C>open</C> и <C>onOpenChange</C> —
          когда от состояния зависит что-то ещё, здесь — подпись кнопки.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Прячьте то, что нужно редко. Если раскрывающихся блоков несколько
        подряд, возьмите{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/accordion"
        >
          Accordion
        </a>
        .
      </Li>
      <Li>
        Высота не анимируется: содержимое сразу встаёт в раскладку и проявляется
        прозрачностью.
      </Li>
      <Li>
        Закрытое содержимое размонтируется. <C>forceMount</C> у{' '}
        <C>CollapsibleContent</C> оставит его в дереве и спрячет через{' '}
        <C>display: none</C> — так сохраняется состояние полей.
      </Li>
      <Li>
        Корень — колонка: промежуток между кнопкой и содержимым задаётся
        классом, например <C>gap-2</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же части на <C>@rn-primitives/collapsible</C>. Подпись кнопки для
      диктора — <C>accessibilityLabel</C>. Поворот шеврона и проявление
      содержимого идут на нативном драйвере; фон наведения и нажатия рисуют слои
      прозрачности.
    </P>
  ),
};
