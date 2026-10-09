import React from 'react';
import { Alert, cx } from '@tugen/uikit/web';
import { Info, TriangleAlert } from 'lucide-react';

// Текст руководств и страниц компонентов. Оформление сайта, не kit: абзацы длиннее, чем в интерфейсе

const slug = (text: React.ReactNode) =>
  typeof text === 'string'
    ? text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-|-$/g, '')
    : undefined;

export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="text-3xl font-semibold tracking-tight text-mist-950 dark:text-mist-50">
    {children}
  </h1>
);

export const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-3 text-lg leading-8 text-mist-700 dark:text-mist-300">
    {children}
  </p>
);

export const H2: React.FC<{ children: React.ReactNode; id?: string }> = ({
  children,
  id = slug(children),
}) => (
  <h2
    id={id}
    className="mt-12 mb-4 text-xl font-semibold tracking-tight text-mist-950 dark:text-mist-50"
  >
    {children}
  </h2>
);

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mt-8 mb-3 text-base font-semibold text-mist-950 dark:text-mist-50">
    {children}
  </h3>
);

export const P: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p
    className={cx(
      'my-3 text-[15px] leading-7 text-mist-700 dark:text-mist-300',
      className,
    )}
  >
    {children}
  </p>
);

/** Код в строке: имя компонента, свойство, класс */
export const C: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="rounded-md bg-mist-200/70 dark:bg-mist-800/70 px-1.5 py-0.5 font-mono text-[0.85em] text-mist-900 dark:text-mist-100">
    {children}
  </code>
);

export const Ul: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="my-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-7 text-mist-700 marker:text-mist-400 dark:text-mist-300 dark:marker:text-mist-500">
    {children}
  </ul>
);

export const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="pl-1">{children}</li>
);

export const A: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel="noreferrer"
    className="font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
  >
    {children}
  </a>
);

/** Заметка: совет (info) или то, на чём легко ошибиться (warning) */
export const Note: React.FC<{
  tone?: 'info' | 'warning';
  title?: string;
  children: React.ReactNode;
}> = ({ tone = 'info', title, children }) => (
  <div className="my-5 flex flex-col">
    <Alert
      tone={tone}
      icon={tone === 'info' ? Info : TriangleAlert}
      title={title}
    >
      <div className="text-sm leading-6">{children}</div>
    </Alert>
  </div>
);

/** Простая таблица: токены, соответствия классов */
export const Table: React.FC<{
  head: string[];
  rows: React.ReactNode[][];
}> = ({ head, rows }) => (
  <div className="my-5 overflow-x-auto rounded-xl border border-mist-200 dark:border-mist-800">
    <table className="w-full border-collapse text-left text-sm">
      <thead className="bg-mist-100 dark:bg-mist-900">
        <tr>
          {head.map(cell => (
            <th
              key={cell}
              className="px-4 py-2.5 font-medium text-mist-700 dark:text-mist-300"
            >
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-mist-200 dark:border-mist-800">
            {row.map((cell, j) => (
              <td
                key={j}
                className="px-4 py-2.5 align-top text-mist-700 dark:text-mist-300"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
