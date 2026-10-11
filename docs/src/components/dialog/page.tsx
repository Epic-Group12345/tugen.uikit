import React from 'react';
import type { ComponentDoc } from '../../registry';
import { C, Li, P, Ul } from '../../ui/prose';

export const doc: ComponentDoc = {
  title: 'Dialog',
  group: 'Окна',
  lead: 'Модальное окно поверх страницы: короткая форма или выбор, который нужно сделать прямо сейчас. Нажатие на затемнение и Escape закрывают окно.',
  components: ['DialogContent', 'DialogHeader', 'DialogBody', 'DialogFooter'],
  examples: [
    {
      id: 'basic',
      title: 'Окно',
      text: (
        <>
          <C>DialogHeader</C> с заголовком и пояснением, <C>DialogBody</C> —
          текст (строка становится абзацем), <C>DialogFooter</C> — кнопки
          справа. <C>DialogClose</C> с <C>asChild</C> закрывает окно своей
          кнопкой, <C>showClose</C> добавляет крестик в угол.
        </>
      ),
    },
    {
      id: 'form',
      title: 'Форма и управляемое окно',
      text: (
        <>
          <C>open</C> и <C>onOpenChange</C> на <C>Dialog</C> — чтобы закрыть
          окно после сохранения. Ширину задаёт <C>className</C> окна, по
          умолчанию <C>w-full max-w-lg</C>.
        </>
      ),
    },
  ],
  usage: (
    <Ul>
      <Li>
        Окно прерывает работу. Подробности о сборке, которые можно не читать, —
        в <C>Popover</C> или <C>Sheet</C>, а не в окне.
      </Li>
      <Li>
        Заголовок обязателен: <C>DialogTitle</C> — имя окна для диктора. Подпись
        главной кнопки повторяет действие из заголовка: «Переименовать сборку» —
        «Сохранить».
      </Li>
      <Li>
        Окно — <C>rounded-2xl p-2</C>: кнопки и поля у его края по{' '}
        <a className="text-blue-600 dark:text-blue-400" href="#/radius">
          правилу скругления
        </a>{' '}
        получают <C>rounded-lg</C>, текстовые части отступают дальше своим{' '}
        <C>px-3</C>.
      </Li>
      <Li>
        Высота окна — не больше 88% окна браузера, лишнее прокручивается внутри.
      </Li>
    </Ul>
  ),
  native: (
    <P>
      В лаунчере окно на <C>@rn-primitives/dialog</C> рисуется в{' '}
      <C>PopupHost</C> в корне приложения, высота считается от окна приложения,
      а не от монитора. Escape на Windows ловит kit, а закрыть верхнее окно из
      кода можно <C>dismissPopup()</C>. Подпись окна — <C>accessibilityLabel</C>
      , нажатия кнопок — <C>onPress</C>.
    </P>
  ),
};
