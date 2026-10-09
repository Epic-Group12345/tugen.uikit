import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Sheet',
  group: 'Окна',
  lead: 'Боковая панель — шторка у края окна: фильтры, настройки, список загрузок. Модальная, как Dialog, но не закрывает страницу целиком.',
  components: ['SheetContent'],
  examples: [
    {
      id: 'filters',
      title: 'Панель справа',
      text: (
        <>
          По умолчанию панель прилегает к правому краю и шириной <C>w-80</C>.{' '}
          <C>SheetHeader</C> с заголовком и пояснением, <C>SheetFooter</C>{' '}
          прижат к низу панели.
        </>
      ),
    },
    {
      id: 'sides',
      title: 'Края',
      text: (
        <>
          <C>side</C> — <C>left</C>, <C>right</C> или <C>bottom</C>. Скруглены
          только углы, которые смотрят в страницу; нижняя панель — по
          содержимому и не выше 90% окна.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Шторка — для того, что дополняет страницу и к чему возвращаются: фильтры
        библиотеки, параметры сборки. Короткий вопрос — в <C>Dialog</C>.
      </Li>
      <Li>
        Заголовок обязателен: <C>SheetTitle</C> — имя панели для диктора.
      </Li>
      <Li>
        Ширину или высоту меняйте <C>className</C> панели: он заменяет размер по
        умолчанию.
      </Li>
      <Li>
        Кнопки у края панели по правилу скругления получают <C>rounded-lg</C>,
        текст отступает дальше своим <C>px-3</C>.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере панель на <C>@rn-primitives/dialog</C> рисуется в{' '}
      <C>PopupHost</C> и выезжает анимацией transform на нативном драйвере;
      нижняя ограничена долей окна приложения. Escape на Windows ловит kit,
      подпись панели — <C>accessibilityLabel</C>.
    </P>
  ),
};
