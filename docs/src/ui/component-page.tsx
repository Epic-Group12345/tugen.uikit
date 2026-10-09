import React from 'react';
import { Pill } from '@tugen/uikit/web';
import { example, type ComponentDoc } from '../registry';
import { Demo } from './demo';
import { PropsTable } from './props-table';
import { Code } from './code';
import { H1, H2, Lead, P } from './prose';

// Страница компонента: описание, живые примеры с кодом, советы, отличия в лаунчере и свойства

export const ComponentPage: React.FC<{ slug: string; doc: ComponentDoc }> = ({
  slug,
  doc,
}) => {
  const names = doc.components.join(', ');
  // Длинный список — по имени в строке, как отформатирует Prettier
  const imports =
    names.length > 50
      ? `import {\n${doc.components
          .map(name => `  ${name},`)
          .join('\n')}\n} from '@tugen/uikit/web';`
      : `import { ${names} } from '@tugen/uikit/web';`;
  return (
    <article>
      <div className="flex flex-row flex-wrap items-center gap-2">
        <Pill tone="neutral">{doc.group}</Pill>
      </div>
      <div className="mt-3">
        <H1>{doc.title}</H1>
      </div>
      <Lead>{doc.lead}</Lead>
      <Code code={imports} language="ts" />

      {doc.examples.map(item => {
        const found = example(slug, item.id);
        return (
          <section key={item.id}>
            <H2 id={item.id}>{item.title}</H2>
            {item.text && <P>{item.text}</P>}
            {found ? (
              <Demo example={found} />
            ) : (
              <P className="text-red-600">
                Нет примера components/{slug}/{item.id}.example.tsx
              </P>
            )}
          </section>
        );
      })}

      {doc.usage && (
        <section>
          <H2 id="usage">Как пользоваться</H2>
          {doc.usage}
        </section>
      )}

      {doc.native && (
        <section>
          <H2 id="native">В лаунчере (React Native)</H2>
          {doc.native}
        </section>
      )}

      <H2 id="props">Свойства</H2>
      {doc.components.map(name => (
        <PropsTable key={name} name={name} />
      ))}
    </article>
  );
};
