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

/**
 * Правила компонента в духе гайдов Gravity UI: когда брать и когда нет, из чего состоит, какие
 * бывают состояния, как писать тексты. Строки — обычный текст, `код` в обратных кавычках
 */
export interface ComponentRules {
  /** Когда брать */
  use?: string[];
  /** Когда не брать — и что взять вместо */
  avoid?: string[];
  /** Части компонента по порядку; необязательные — с пометкой */
  anatomy?: string[];
  /** Состояние и что оно значит */
  states?: [string, string][];
  /** Написание текстов: подписи, заголовки, сообщения */
  writing?: string[];
}

export interface ComponentDoc {
  title: string;
  group: Group;
  /** Одна-две фразы: что это и когда брать */
  lead: React.ReactNode;
  /** Компоненты для таблиц свойств, главный — первым */
  components: string[];
  examples: ExampleDoc[];
  /** Правила: когда брать, анатомия, состояния, тексты */
  rules?: ComponentRules;
  /** Советы по использованию */
  usage?: React.ReactNode;
  /** Чем отличается в React Native (лаунчер) */
  native?: React.ReactNode;
}

export interface Example {
  Demo: React.ComponentType;
  code: string;
}

/** Разделы боковой навигации — как у Gravity UI: «Общее» (дизайн), разработка, компоненты */
export const SECTIONS = ['Общее', 'Разработка', 'Компоненты'] as const;

export type Section = (typeof SECTIONS)[number];

export interface Page {
  path: string;
  title: string;
  section: Section;
  /** Подпись над заголовком вместо раздела: у компонентов — их группа */
  kicker?: string;
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
    section: 'Компоненты' as const,
    kicker: doc.group,
    doc,
  }))
  // Компоненты — одним списком по алфавиту, как в навигации Gravity UI; группа — подпись на странице
  .sort((a, b) => a.title.localeCompare(b.title));

// Порядок чтения: руководства по разделам, затем компоненты — по нему же идут ссылки «Назад / Далее»
export const pages: Page[] = [
  ...SECTIONS.flatMap(section =>
    guides.filter(page => page.section === section),
  ),
  ...componentPages,
];

/** Первая страница раздела — для вкладок в шапке */
export const sectionStart = (section: Section) =>
  pages.find(page => page.section === section) ?? pages[0];

export const findPage = (path: string) =>
  pages.find(page => page.path === path) ?? pages[0];
