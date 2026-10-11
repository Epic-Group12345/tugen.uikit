import React from 'react';
import type { Example } from '../registry';
import { Code } from './code';

// Пример на странице компонента: живой элемент kit сверху, его исходник под ним — тот же файл

export const Demo: React.FC<{ example: Example }> = ({
  example: { Demo: Live, code },
}) => (
  <div className="my-4 flex flex-col overflow-hidden rounded-xl border border-mist-200 dark:border-mist-800">
    <div className="flex min-h-36 flex-col items-center justify-center bg-mist-50 p-6 sm:p-10 dark:bg-mist-950">
      <div className="flex w-full max-w-xl flex-col items-center">
        <Live />
      </div>
    </div>
    <div className="max-h-[28rem] overflow-y-auto border-t border-mist-200 bg-mist-100 dark:border-mist-800 dark:bg-mist-900">
      <Code code={code} bare />
    </div>
  </div>
);
