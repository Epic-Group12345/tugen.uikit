import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Field и Label',
  group: 'Формы',
  lead: 'Field собирает поле формы: подпись, элемент, пояснение и ошибку — и сам связывает их для экранного диктора. Label — отдельная подпись, нажатие на которую отдаётся элементу.',
  components: ['Field', 'Label'],
  examples: [
    {
      id: 'vertical',
      title: 'Подпись сверху',
      text: (
        <>
          <C>description</C> — пояснение под элементом, <C>error</C> — ошибка
          красным. С ошибкой элемент внутри сам получает <C>invalid</C>, а текст
          ошибки зачитывается сразу, как появился.
        </>
      ),
    },
    {
      id: 'horizontal',
      title: 'Подпись слева',
      text: (
        <>
          <C>orientation="horizontal"</C> — для переключателей и флажков:
          подпись с пояснением слева, элемент справа. <C>disabled</C> приглушает
          подпись и выключает элемент.
        </>
      ),
    },
    {
      id: 'custom',
      title: 'Свой элемент',
      text: (
        <>
          Элементы kit (<C>TextField</C>, <C>Checkbox</C>, <C>Toggle</C>,{' '}
          <C>RadioGroup</C>, <C>ToggleGroup</C>, <C>Slider</C>) берут связи
          сами. Любому другому их отдаёт функция в <C>children</C>: <C>id</C>,{' '}
          <C>aria-labelledby</C>, <C>aria-describedby</C>, <C>aria-invalid</C> и{' '}
          <C>disabled</C>. <C>invalid</C> — не атрибут DOM, его не раскладывают
          на элемент.
        </>
      ),
    },
    {
      id: 'label',
      title: 'Label отдельно',
      text: (
        <>
          <C>Label</C> — настоящий <C>&lt;label&gt;</C>: с <C>htmlFor</C>{' '}
          нажатие на подпись переключает флажок или ставит фокус в поле с этим{' '}
          <C>id</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Для полей ввода берите <C>Field</C>, а не <C>Label</C> рядом с полем: он
        сам сгенерирует <C>id</C> и свяжет подпись, пояснение и ошибку.
      </Li>
      <Li>
        Свои пропсы элемента важнее <C>Field</C>: явный <C>id</C> или{' '}
        <C>disabled</C> на элементе перекрывают значения из контекста.
      </Li>
      <Li>
        Подпись короткая, без двоеточия: «Память», «Папка игры». Подробности — в{' '}
        <C>description</C>.
      </Li>
      <Li>
        Для своих компонентов есть хук <C>useFieldControl</C>: он отдаёт те же
        связи, что и функция в <C>children</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Вместо <C>id</C> — <C>nativeID</C>. В React Native у подписи нет связи с
      элементом, поэтому элементы kit регистрируют по своему <C>nativeID</C>{' '}
      действие (переключиться или взять фокус), а <C>Label</C> с <C>htmlFor</C>{' '}
      его вызывает; своё действие подписи — <C>onPress</C>. <C>Slider</C>{' '}
      лаунчера связей из <C>Field</C> не берёт.
    </P>
  ),
};
