import type { Page } from '../registry';
import { Resources } from './resources';
import { Intro } from './intro';
import { Rules } from './rules';
import { Colors } from './colors';
import { Typography } from './typography';
import { RadiusRule } from './radius';
import { Branding } from './branding';
import { Spacing } from './spacing';
import { Tokens } from './tokens';
import { Web } from './web';
import { Native } from './native';
import { IconsGuide } from './icons';

// Руководства — по порядку чтения внутри раздела; страницы компонентов идут за ними (registry.ts).
// Раздел «Общее» повторяет состав дизайна Gravity UI: ресурсы, основы, цвета, типографика, иконки, скругления,
// брендирование, сетка и отступы

export const guides: Page[] = [
  { path: '', title: 'Ресурсы', section: 'Общее', guide: Resources },
  { path: 'basics', title: 'Основы', section: 'Общее', guide: Intro },
  {
    path: 'rules',
    title: 'Правила интерфейса',
    section: 'Общее',
    guide: Rules,
  },
  { path: 'colors', title: 'Цвета', section: 'Общее', guide: Colors },
  {
    path: 'typography',
    title: 'Типографика',
    section: 'Общее',
    guide: Typography,
  },
  { path: 'icons', title: 'Иконки', section: 'Общее', guide: IconsGuide },
  {
    path: 'radius',
    title: 'Радиус скругления',
    section: 'Общее',
    guide: RadiusRule,
  },
  {
    path: 'branding',
    title: 'Брендирование',
    section: 'Общее',
    guide: Branding,
  },
  {
    path: 'spacing',
    title: 'Сетка и отступы',
    section: 'Общее',
    guide: Spacing,
  },
  { path: 'tokens', title: 'Токены', section: 'Общее', guide: Tokens },
  {
    path: 'web',
    title: 'Веб: Vite + React',
    section: 'Разработка',
    guide: Web,
  },
  {
    path: 'native',
    title: 'Лаунчер: React Native',
    section: 'Разработка',
    guide: Native,
  },
];
