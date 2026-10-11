import React, { useState } from 'react';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { IconButton, Tip, cx } from '@tugen/uikit/web';
import { Check, Copy } from 'lucide-react';

// Подсветка кода: цвета — переменные из global.css, поэтому тема сайта меняет и их

const theme: PrismTheme = {
  plain: { color: 'var(--code-plain)', backgroundColor: 'transparent' },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--code-comment)', fontStyle: 'italic' },
    },
    {
      types: ['keyword', 'builtin', 'important', 'atrule'],
      style: { color: 'var(--code-keyword)' },
    },
    {
      types: ['string', 'char', 'attr-value', 'template-string', 'url'],
      style: { color: 'var(--code-string)' },
    },
    {
      types: ['tag', 'class-name', 'maybe-class-name', 'selector'],
      style: { color: 'var(--code-tag)' },
    },
    {
      types: ['attr-name', 'property', 'function', 'variable'],
      style: { color: 'var(--code-attr)' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: { color: 'var(--code-number)' },
    },
    {
      types: ['punctuation', 'operator'],
      style: { color: 'var(--code-punctuation)' },
    },
  ],
};

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Буфер обмена недоступен (страница не в фокусе, http) — код можно выделить руками
    }
  };
  return (
    <Tip label={copied ? 'Скопировано' : 'Копировать'}>
      <IconButton
        icon={copied ? Check : Copy}
        tone={copied ? 'success' : 'default'}
        aria-label="Копировать код"
        onClick={copy}
      />
    </Tip>
  );
};

export interface CodeProps {
  code: string;
  language?: 'tsx' | 'ts' | 'css' | 'bash' | 'js' | 'json';
  /** Без своей рамки: внутри карточки примера */
  bare?: boolean;
  className?: string;
}

export const Code: React.FC<CodeProps> = ({
  code,
  language = 'tsx',
  bare = false,
  className,
}) => (
  <div
    className={cx(
      'group relative flex flex-col',
      !bare &&
        'my-4 rounded-xl border border-mist-200 bg-mist-100 dark:border-mist-800 dark:bg-mist-900',
      className,
    )}
  >
    <Highlight code={code.trim()} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-6">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
    <div className="absolute top-2 right-2">
      <CopyButton text={code.trim()} />
    </div>
  </div>
);
