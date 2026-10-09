import type { Page } from '../registry';
import { Intro } from './intro';
import { Web } from './web';
import { Native } from './native';
import { Tokens } from './tokens';
import { Colors } from './colors';
import { RadiusRule } from './radius';

// Руководства — по порядку чтения; страницы компонентов идут за ними (registry.ts)

export const guides: Page[] = [
  { path: '', title: 'Введение', section: 'Начало', guide: Intro },
  { path: 'web', title: 'Веб: Vite + React', section: 'Начало', guide: Web },
  {
    path: 'native',
    title: 'Лаунчер: React Native',
    section: 'Начало',
    guide: Native,
  },
  { path: 'colors', title: 'Цвета и тема', section: 'Основы', guide: Colors },
  {
    path: 'radius',
    title: 'Правило скругления',
    section: 'Основы',
    guide: RadiusRule,
  },
  { path: 'tokens', title: 'Токены', section: 'Основы', guide: Tokens },
];
