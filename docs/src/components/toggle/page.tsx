import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Toggle',
  group: 'Формы',
  lead: 'Переключатель «вкл / выкл» для настройки, которая действует сразу. Toggle — API лаунчера (value / onChange), Switch — тот же переключатель с API примитива (checked / onCheckedChange).',
  components: ['Toggle', 'Switch'],
  examples: [
    {
      id: 'basic',
      title: 'Переключатель',
      text: (
        <>
          Состояние — <C>value</C> и <C>onChange</C>. Без видимой подписи нужен{' '}
          <C>aria-label</C>.
        </>
      ),
    },
    {
      id: 'label',
      title: 'С подписью',
      text: (
        <>
          <C>Label</C> с <C>htmlFor</C> на <C>id</C> переключателя — нажатие на
          подпись тоже переключает. В <C>Field</C> с{' '}
          <C>orientation="horizontal"</C> связи ставятся сами.
        </>
      ),
    },
    {
      id: 'settings',
      title: 'В настройках',
      text: (
        <>
          Обычное место переключателя — строка <C>Row</C> в разделе настроек:
          подпись слева, переключатель у правого края.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Переключатель применяет настройку сразу, без кнопки «Сохранить». Если
        изменение ждёт подтверждения — берите{' '}
        <a
          className="text-blue-600 dark:text-blue-400"
          href="#/components/checkbox"
        >
          Checkbox
        </a>
        .
      </Li>
      <Li>
        Подпись называет то, что включается: «Музыка», «Закрывать лаунчер». Не
        «Вкл / выкл» и не вопрос.
      </Li>
      <Li>
        <C>Switch</C> берите, когда удобнее API Radix: он принимает все свойства{' '}
        <C>&lt;button&gt;</C>, а для формы — <C>name</C>, <C>value</C> и{' '}
        <C>required</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      Те же <C>Toggle</C> и <C>Switch</C>; подпись — <C>accessibilityLabel</C>,
      идентификатор для <C>Label</C> — <C>nativeID</C>. Бегунок едет
      FLIP-сдвигом на нативном драйвере, а цвет дорожки меняется слоями
      прозрачности, а не классом: иначе он сменился бы раньше, чем доедет
      бегунок.
    </P>
  ),
};
