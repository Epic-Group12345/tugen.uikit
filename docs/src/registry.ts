import type React from 'react';
import { guides } from './guides';

// Состав сайта: руководства перечислены в guides/index.ts, страницы компонентов собираются сами —
// папка components/<имя>/ с page.tsx и примерами <пример>.example.tsx

export const GROUPS = [
  'Основа',
  'Поверхности',
  'Формы',
  'Выбор и меню',
  'Окна',
  'Отображение',
  'Уведомления',
] as const;

export type Group = (typeof GROUPS)[number];

export interface ExampleDoc {
  /** Имя файла примера без .example.tsx */
  id: string;
  title: string;
  text?: React.ReactNode;
}

export interface ComponentDoc {
  title: string;
  group: Group;
  /** Одна-две фразы: что это и когда брать */
  lead: React.ReactNode;
  /** Компоненты для таблиц свойств, главный — первым */
  components: string[];
  examples: ExampleDoc[];
  /** Советы: когда брать, чего избегать */
  usage?: React.ReactNode;
  /** Чем отличается в React Native (лаунчер) */
  native?: React.ReactNode;
}

export interface Example {
  Demo: React.ComponentType;
  code: string;
}

export interface Page {
  path: string;
  title: string;
  section: string;
  /** Руководство — свой компонент, страница компонента — описание */
  guide?: React.ComponentType;
  doc?: ComponentDoc;
}

const docs = import.meta.glob<ComponentDoc>('./components/*/page.tsx', {
  eager: true,
  import: 'doc',
});
const demos = import.meta.glob<React.ComponentType>(
  './components/*/*.example.tsx',
  { eager: true, import: 'default' },
);
const sources = import.meta.glob<string>('./components/*/*.example.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const slugOf = (path: string) => path.split('/')[2];

/** Пример страницы компонента: живой и его исходник */
export const example = (slug: string, id: string): Example | undefined => {
  const file = `./components/${slug}/${id}.example.tsx`;
  const Demo = demos[file];
  return Demo && { Demo, code: sources[file].trim() };
};

const componentPages: Page[] = Object.entries(docs)
  .map(([file, doc]) => ({
    path: `components/${slugOf(file)}`,
    title: doc.title,
    section: doc.group,
    doc,
  }))
  .sort(
    (a, b) =>
      GROUPS.indexOf(a.section as Group) - GROUPS.indexOf(b.section as Group) ||
      a.title.localeCompare(b.title),
  );

export const pages: Page[] = [...guides, ...componentPages];

export const sections = [...new Set(pages.map(page => page.section))];

export const findPage = (path: string) =>
  pages.find(page => page.path === path) ?? pages[0];
