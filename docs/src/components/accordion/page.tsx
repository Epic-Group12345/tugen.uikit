import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Accordion',
  group: 'Отображение',
  lead: 'Список заголовков, под каждым из которых раскрывается своя панель: частые вопросы, группы настроек, состав сборки.',
  components: [
    'Accordion',
    'AccordionItem',
    'AccordionTrigger',
    'AccordionContent',
  ],
  examples: [
    {
      id: 'single',
      title: 'Один пункт',
      text: (
        <>
          <C>type="single"</C> — открыт не больше одного пункта, с{' '}
          <C>collapsible</C> открытый можно и закрыть. <C>defaultValue</C> — что
          открыто сразу.
        </>
      ),
    },
    {
      id: 'card',
      title: 'Карточка и несколько пунктов',
      text: (
        <>
          <C>variant="card"</C> — карточка <C>rounded-xl p-1</C>, заголовки у её
          края скругляются по правилу: 12 − 4 = 8. <C>type="multiple"</C>{' '}
          раскрывает несколько пунктов сразу; <C>value</C> тогда — массив.
        </>
      ),
    },
    {
      id: 'icons',
      title: 'С иконкой',
      text: (
        <>
          <C>icon</C> у <C>AccordionTrigger</C> встаёт перед подписью,{' '}
          <C>chevron</C> заменяет шеврон своей иконкой. Пункт выключается через{' '}
          <C>disabled</C> у <C>AccordionItem</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Аккордеон прячет второстепенное. Если пользователь почти всегда
        раскрывает все пункты, покажите их сразу.
      </Li>
      <Li>
        Для одного раскрывающегося блока берите{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/collapsible"
        >
          Collapsible
        </a>
        , а не аккордеон из одного пункта.
      </Li>
      <Li>
        Высота не анимируется: панель сразу встаёт в раскладку и проявляется
        прозрачностью, шеврон поворачивается <C>transform</C>.
      </Li>
      <Li>
        Строка в <C>AccordionContent</C> становится абзацем вторичного цвета;
        своё содержимое выводится как есть, с теми же отступами.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же <C>type</C>, <C>collapsible</C> и варианты на{' '}
      <C>@rn-primitives/accordion</C>. Подпись заголовка для диктора —{' '}
      <C>accessibilityLabel</C>, свой шеврон — <C>Icons.ChevronDown</C>{' '}
      лаунчера. Проявление панели и поворот шеврона идут на нативном драйвере.
    </P>
  ),
};
