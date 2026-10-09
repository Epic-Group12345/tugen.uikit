import React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from '../components/icon';
import { cx } from './cx';
import { Text } from './text';

// Раскрывающийся блок на Radix Collapsible: состояние, aria-expanded и aria-controls — из
// примитива. Высоту не анимируем (только opacity и transform): содержимое появляется в раскладке
// сразу и проявляется прозрачностью, а шеврон поворачивается transform

export interface CollapsibleProps
  extends Omit<CollapsiblePrimitive.CollapsibleProps, 'asChild'> {
  ref?: React.Ref<HTMLDivElement>;
}

/** Корень: open / defaultOpen / onOpenChange. Внутри — CollapsibleTrigger и CollapsibleContent */
export const Collapsible: React.FC<CollapsibleProps> = ({
  className,
  ...props
}) => (
  <CollapsiblePrimitive.Root
    {...props}
    className={cx('flex flex-col', className)}
  />
);

/** Шеврон «вниз»: kit не зависит от набора иконок, поэтому свой маленький SVG */
const ChevronGlyph: React.FC = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 16 16"
    aria-hidden
    className="text-mist-500 dark:text-mist-400"
  >
    <path
      d="M4 6l4 4 4-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Шеврон, который поворачивается на 180° при раскрытии. open не задан — поворот по data-state
 * ближайшей кнопки с классом group (триггеры Radix ставят его сами). icon — своя иконка «вниз»
 */
export const ExpandChevron: React.FC<{
  open?: boolean;
  icon?: IconComponent;
}> = ({ open, icon: Icon }) => (
  <span
    aria-hidden
    className={cx(
      'flex h-4 w-4 shrink-0 items-center justify-center transition-transform duration-180',
      open === undefined
        ? 'group-data-[state=open]:rotate-180'
        : open && 'rotate-180',
    )}
  >
    {Icon ? (
      <Icon size={14} className="text-mist-500 dark:text-mist-400" />
    ) : (
      <ChevronGlyph />
    )}
  </span>
);

/** Кнопка-строка раскрытия: фокус с клавиатуры и неактивное состояние; фон — у DisclosureRow */
export const DISCLOSURE_BUTTON =
  'group flex w-full cursor-pointer select-none text-left focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-default disabled:opacity-50 disabled:pointer-events-none';

/**
 * Строка раскрытия: подпись, иконка и шеврон, фон при наведении на кнопку (group-hover). Радиус —
 * по правилу вложенности (в карточке с отступом), вне контейнера rounded-md
 */
export const DisclosureRow: React.FC<{
  open?: boolean;
  icon?: IconComponent;
  chevron?: IconComponent;
  children?: React.ReactNode;
}> = ({ open, icon: Icon, chevron, children }) => {
  const rounded = radiusProps(useInnerRadius('md'));
  return (
    <span
      className={cx(
        'flex w-full flex-row items-center gap-2 px-3 py-2.5 transition-colors duration-100 group-hover:bg-mist-950/5 dark:group-hover:bg-mist-50/5 group-active:bg-mist-950/10 dark:group-active:bg-mist-50/10',
        rounded.className,
      )}
      style={rounded.style}
    >
      {Icon && (
        <Icon size={16} className="shrink-0 text-mist-500 dark:text-mist-400" />
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text weight="semibold" className="line-clamp-2">
            {children}
          </Text>
        ) : (
          children
        )}
      </span>
      <ExpandChevron open={open} icon={chevron} />
    </span>
  );
};

export interface CollapsibleTriggerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className'
  > {
  /** Отдать нажатие своему элементу (Button) — без оформления kit */
  asChild?: boolean;
  icon?: IconComponent;
  /** Своя иконка шеврона «вниз» */
  chevron?: IconComponent;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

/** Кнопка раскрытия: строка с шевроном или, с asChild, свой элемент */
export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  asChild,
  icon,
  chevron,
  children,
  ...props
}) => {
  // Радиус кнопки — как у строки: иначе рамка фокуса легла бы прямыми углами
  const rounded = radiusProps(useInnerRadius('md'));
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger {...props} asChild>
        {children}
      </CollapsiblePrimitive.Trigger>
    );
  }
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      className={cx(DISCLOSURE_BUTTON, rounded.className)}
      style={rounded.style}
    >
      <DisclosureRow icon={icon} chevron={chevron}>
        {children}
      </DisclosureRow>
    </CollapsiblePrimitive.Trigger>
  );
};

export interface CollapsibleContentProps {
  /** Держать в дереве и закрытым (скрыто display: none) */
  forceMount?: true;
  className?: string;
  children: React.ReactNode;
}

/** Содержимое: в раскладке сразу, проявляется прозрачностью. Строка — абзацем */
export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  forceMount,
  className,
  children,
}) => (
  <CollapsiblePrimitive.Content
    forceMount={forceMount}
    // С forceMount Radix не скрывает закрытое содержимое сам — прячем по data-state
    className={cx(
      'data-[state=open]:animate-tg-fade-in',
      forceMount && 'data-[state=closed]:hidden',
      className,
    )}
  >
    {typeof children === 'string' ? (
      <Text as="p" tone="secondary">
        {children}
      </Text>
    ) : (
      children
    )}
  </CollapsiblePrimitive.Content>
);
