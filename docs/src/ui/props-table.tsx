import React from 'react';
import { native, web } from 'virtual:uikit-props';
import {
  Pill,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@tugen/uikit/web';
import type { ComponentProps } from '../../props-plugin';

// Свойства компонента — из типов kit (props-plugin.ts). Не таблицей, а списком: длинные типы
// и описания на телефоне иначе не помещаются

const Props: React.FC<{ info: ComponentProps }> = ({ info }) =>
  info.props.length === 0 ? (
    <Text tone="muted">
      Своих свойств нет: всё, что передано, уходит элементу или примитиву Radix.
    </Text>
  ) : (
    <dl className="flex flex-col divide-y divide-mist-200 rounded-xl border border-mist-200 dark:divide-mist-800 dark:border-mist-800">
      {info.props.map(prop => (
        <div key={prop.name} className="flex flex-col gap-1.5 px-4 py-3">
          <dt className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
            <code className="font-mono text-sm font-semibold text-mist-950 dark:text-mist-50">
              {prop.name}
            </code>
            {prop.required && <Pill tone="amber">обязательное</Pill>}
            {prop.default !== undefined && (
              <span className="font-mono text-xs text-mist-500 dark:text-mist-400">
                = {prop.default}
              </span>
            )}
          </dt>
          <dd className="flex flex-col gap-1">
            <code className="font-mono text-xs break-words text-blue-700 dark:text-blue-400">
              {prop.type}
            </code>
            {prop.description && (
              <span className="text-sm leading-6 whitespace-pre-line text-mist-700 dark:text-mist-300">
                {prop.description.replace(/\n(?!\n)/g, ' ')}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );

export const PropsTable: React.FC<{ name: string }> = ({ name }) => {
  const forWeb = web[name];
  const forNative = native[name];
  if (!forWeb && !forNative) return null;
  return (
    <section className="mt-8 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3
          id={`props-${name}`}
          className="font-mono text-base font-semibold text-mist-950 dark:text-mist-50"
        >
          {name}
        </h3>
        {(forWeb ?? forNative)?.description && (
          <Text tone="secondary" className="leading-6">
            {(forWeb ?? forNative)!.description.replace(/\n(?!\n)/g, ' ')}
          </Text>
        )}
      </div>
      {forWeb && forNative ? (
        <Tabs defaultValue="web">
          <TabsList variant="underline" aria-label={`Свойства ${name}`}>
            <TabsTrigger value="web">Веб</TabsTrigger>
            <TabsTrigger value="native">React Native</TabsTrigger>
          </TabsList>
          <TabsContent value="web">
            <Props info={forWeb} />
          </TabsContent>
          <TabsContent value="native">
            <Props info={forNative} />
          </TabsContent>
        </Tabs>
      ) : (
        <Props info={(forWeb ?? forNative)!} />
      )}
    </section>
  );
};
