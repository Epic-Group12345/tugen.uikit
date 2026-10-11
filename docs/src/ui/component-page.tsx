import React from 'react';
import { example, type ComponentDoc } from '../registry';
import { Demo } from './demo';
import { PropsTable } from './props-table';
import { Code } from './code';
import { H1, H2, Lead, P } from './prose';
import { Anatomy, Guidelines, States, WhenToUse } from './rules';

// Страница компонента — как гайд компонента у Gravity UI: описание, когда использовать, живые примеры
// с кодом, анатомия, состояния, рекомендации и тексты, отличия в лаунчере и свойства. Подпись
// «Компоненты • группа» над заголовком ставит каркас (app.tsx)

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
      <H1>{doc.title}</H1>
      <Lead>{doc.lead}</Lead>
      <Code code={imports} language="ts" />
      {doc.rules && <WhenToUse rules={doc.rules} />}

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

      {doc.rules?.anatomy && <Anatomy items={doc.rules.anatomy} />}
      {doc.rules?.states && <States items={doc.rules.states} />}
      <Guidelines usage={doc.usage} writing={doc.rules?.writing} />

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
