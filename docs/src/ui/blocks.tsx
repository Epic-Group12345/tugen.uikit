import React from 'react';
import { Surface, cx } from '@tugen/uikit/web';
import { Check, X } from 'lucide-react';

// Блоки страниц раздела «Общее» в духе дизайн-сайта Gravity UI: подпись «Раздел • Страница» над
// заголовком, крупные карточки ресурсов с превью, нумерованные шаги, правила «так / не так»

/** Подпись над заголовком страницы: «Общее • Ресурсы», «Компоненты • Формы» */
export const Kicker: React.FC<{ parts: string[] }> = ({ parts }) => (
  <div className="mb-3 flex flex-row flex-wrap items-center gap-2 text-sm text-mist-500 dark:text-mist-400">
    {parts.map((part, i) => (
      <React.Fragment key={part}>
        {i > 0 && <span aria-hidden>•</span>}
        <span>{part}</span>
      </React.Fragment>
    ))}
  </div>
);

/**
 * Карточка ресурса: текст и кнопки слева, превью справа (на узком экране — под текстом).
 * Превью — вложенная поверхность: её радиус kit считает по правилу скругления (24 − 8 = 16)
 */
export const ResourceBlock: React.FC<{
  id?: string;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  preview: React.ReactNode;
}> = ({ id, title, children, actions, preview }) => (
  <section id={id} className="my-8 flex flex-col">
    <Surface
      kind="card"
      radius="3xl"
      padding="2"
      className="flex flex-col gap-2 lg:flex-row"
    >
      <div className="flex flex-col gap-3 p-5 sm:p-6 lg:w-[22rem] lg:shrink-0">
        <h2 className="text-2xl font-semibold tracking-tight text-mist-950 dark:text-mist-50">
          {title}
        </h2>
        <div className="flex flex-col gap-2 text-[15px] leading-7 text-mist-700 dark:text-mist-300">
          {children}
        </div>
        {actions && (
          <div className="mt-2 flex flex-row flex-wrap gap-2">{actions}</div>
        )}
      </div>
      <Surface
        kind="page"
        nested
        className="flex min-h-56 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden p-6"
      >
        {preview}
      </Surface>
    </Surface>
  </section>
);

/** Нумерованные шаги — «Порядок использования» */
export const Steps: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ol className="my-5 flex flex-col gap-4">
    {items.map((item, i) => (
      <li key={i} className="flex flex-row gap-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-700 dark:text-blue-300">
          {i + 1}
        </span>
        <div className="min-w-0 flex-1 pt-1 text-[15px] leading-7 text-mist-700 dark:text-mist-300">
          {item}
        </div>
      </li>
    ))}
  </ol>
);

const RULE_TONE = {
  do: {
    bar: 'bg-green-600',
    text: 'text-green-700 dark:text-green-400',
    label: 'Так',
    icon: Check,
  },
  dont: {
    bar: 'bg-red-600',
    text: 'text-red-700 dark:text-red-400',
    label: 'Не так',
    icon: X,
  },
} as const;

/** Правило с образцом: зелёная полоса — так, красная — не так */
export const Rule: React.FC<{
  tone: keyof typeof RULE_TONE;
  children: React.ReactNode;
  caption: React.ReactNode;
  className?: string;
}> = ({ tone, children, caption, className }) => {
  const t = RULE_TONE[tone];
  const Icon = t.icon;
  return (
    <figure className={cx('flex flex-col gap-3', className)}>
      <Surface
        kind="card"
        radius="2xl"
        className="flex min-h-40 flex-col items-center justify-center overflow-hidden p-6"
      >
        {children}
      </Surface>
      <div className={cx('h-1 rounded-full', t.bar)} />
      <figcaption className="flex flex-col gap-1 text-sm leading-6 text-mist-700 dark:text-mist-300">
        <span
          className={cx(
            'flex flex-row items-center gap-1.5 font-semibold',
            t.text,
          )}
        >
          <Icon size={14} /> {t.label}
        </span>
        {caption}
      </figcaption>
    </figure>
  );
};

/** Скачать текст файлом: логотип в SVG, токены в JSON — без отдельных файлов на сервере */
export const download = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  // Ссылку браузер уже отдал загрузке — объект можно освободить на следующем шаге
  setTimeout(() => URL.revokeObjectURL(url));
};
