import React from 'react';
import { cx } from '@tugen/uikit/web';
import { Check, X } from 'lucide-react';
import type { ComponentRules } from '../registry';
import { C, H2, H3, Li, Table, Ul } from './prose';

// Правила компонента в духе гайдов Gravity UI: «Когда использовать», «Анатомия», «Состояния»,
// «Написание текстов». Данные — поле rules в page.tsx компонента

/** Строка правила: `код` в обратных кавычках становится <C> */
export const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text
      .split('`')
      .map((part, i) =>
        i % 2 ? (
          <C key={i}>{part}</C>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
  </>
);

const WHEN = {
  use: {
    title: 'Когда использовать',
    bar: 'bg-green-600',
    icon: Check,
    iconClass: 'text-green-600 dark:text-green-400',
  },
  avoid: {
    title: 'Когда не использовать',
    bar: 'bg-red-600',
    icon: X,
    iconClass: 'text-red-600 dark:text-red-400',
  },
} as const;

const WhenCard: React.FC<{ kind: keyof typeof WHEN; items: string[] }> = ({
  kind,
  items,
}) => {
  const t = WHEN[kind];
  const Icon = t.icon;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-mist-100 dark:bg-mist-900">
      <div className={cx('h-1', t.bar)} />
      <div className="flex flex-col gap-3 p-5">
        <span className="font-semibold text-mist-950 dark:text-mist-50">
          {t.title}
        </span>
        <ul className="flex flex-col gap-2.5">
          {items.map(item => (
            <li
              key={item}
              className="flex flex-row gap-2.5 text-sm leading-6 text-mist-700 dark:text-mist-300"
            >
              <Icon size={16} className={cx('mt-1 shrink-0', t.iconClass)} />
              <span>
                <Rich text={item} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/** «Когда использовать / не использовать» — две карточки рядом */
export const WhenToUse: React.FC<{ rules: ComponentRules }> = ({ rules }) =>
  rules.use || rules.avoid ? (
    <section>
      <H2 id="when">Применение</H2>
      <div className="my-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {rules.use && <WhenCard kind="use" items={rules.use} />}
        {rules.avoid && <WhenCard kind="avoid" items={rules.avoid} />}
      </div>
    </section>
  ) : null;

/** Анатомия — нумерованные части, как схема с выносками у Gravity UI */
export const Anatomy: React.FC<{ items: string[] }> = ({ items }) => (
  <section>
    <H2 id="anatomy">Анатомия</H2>
    <ol className="my-5 flex flex-col divide-y divide-mist-200 rounded-2xl border border-mist-200 dark:divide-mist-800 dark:border-mist-800">
      {items.map((item, i) => (
        <li key={item} className="flex flex-row items-start gap-4 px-5 py-3.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-mist-50">
            {i + 1}
          </span>
          <span className="text-[15px] leading-6 text-mist-700 dark:text-mist-300">
            <Rich text={item} />
          </span>
        </li>
      ))}
    </ol>
  </section>
);

export const States: React.FC<{ items: [string, string][] }> = ({ items }) => (
  <section>
    <H2 id="states">Состояния</H2>
    <Table
      head={['Состояние', 'Что значит']}
      rows={items.map(([name, text]) => [
        <span className="font-medium text-mist-950 dark:text-mist-50">
          {name}
        </span>,
        <Rich text={text} />,
      ])}
    />
  </section>
);

/** «Рекомендации»: советы страницы (usage) и правила текстов */
export const Guidelines: React.FC<{
  usage?: React.ReactNode;
  writing?: string[];
}> = ({ usage, writing }) =>
  usage || writing ? (
    <section>
      <H2 id="usage">Рекомендации</H2>
      {usage && writing && <H3>Использование</H3>}
      {usage}
      {writing && (
        <>
          <H3>Написание текстов</H3>
          <Ul>
            {writing.map(item => (
              <Li key={item}>
                <Rich text={item} />
              </Li>
            ))}
          </Ul>
        </>
      )}
    </section>
  ) : null;
