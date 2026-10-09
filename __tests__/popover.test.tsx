import React from 'react';
import { Text } from 'react-native';
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  dismissPopup,
} from '../src';
import { press, render, tick } from './support/render';

it('Popover открывается по кнопке и закрывается Escape', async () => {
  const { container, unmount } = render(
    <Popover>
      <PopoverTrigger>
        <Text>Почему?</Text>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody title="Буст">Сервер продвигается</PopoverBody>
      </PopoverContent>
    </Popover>,
  );
  expect(container.textContent).not.toContain('Сервер продвигается');
  press(container.querySelector('[role="button"]'));
  await tick();
  expect(container.textContent).toContain('Сервер продвигается');
  expect(container.querySelector('[aria-expanded="true"]')).not.toBeNull();
  dismissPopup();
  await tick();
  expect(container.textContent).not.toContain('Сервер продвигается');
  unmount();
});
