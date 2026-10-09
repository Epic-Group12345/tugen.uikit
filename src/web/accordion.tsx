import React, { createContext, useContext } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from '../components/icon';
import { DISCLOSURE_BUTTON, DisclosureRow } from './collapsible';
import { cx } from './cx';
import { Text } from './text';

// Аккордеон на Radix Accordion: type single | multiple, collapsible, aria-expanded, стрелки
// между заголовками и заголовок h3 — из примитива. Высоту не анимируем (переменная
// --radix-accordion-content-height — это анимация высоты): панель появляется в раскладке сразу
// и проявляется прозрачностью, шеврон поворачивается transform

export type AccordionVariant = 'line' | 'card';

const VariantContext = createContext<AccordionVariant>('line');

interface AccordionOwnProps {
  /**
   * line — пункты через линию, без фона; card — карточка rounded-xl p-1, заголовки пунктов у
   * её края по правилу радиусов rounded-lg (12 − 4 = 8)
   */
  variant?: AccordionVariant;
  className?: string;
  children: React.ReactNode;
}

type Own = 'asChild' | 'children' | 'className';

export type AccordionProps =
  | (Omit<AccordionPrimitive.AccordionSingleProps, Own> & AccordionOwnProps)
  | (Omit<AccordionPrimitive.AccordionMultipleProps, Own> & AccordionOwnProps);

// Классы целиком — иначе Tailwind их не найдёт при сборке
const ROOT_CLASS: Record<AccordionVariant, string> = {
  line: 'flex flex-col',
  card: 'flex flex-col gap-0.5 p-1 rounded-xl bg-mist-100 dark:bg-mist-900',
};

const ITEM_CLASS: Record<AccordionVariant, string> = {
  line: 'border-b border-mist-200 dark:border-mist-800',
  card: '',
};

/** Корень: внутри — AccordionItem */
export const Accordion: React.FC<AccordionProps> = ({
  variant = 'line',
  className,
  ...props
}) => {
  const body = (
    <AccordionPrimitive.Root
      {...(props as AccordionPrimitive.AccordionSingleProps)}
      className={cx(ROOT_CLASS[variant], className)}
    />
  );
  return (
    <VariantContext.Provider value={variant}>
      {variant === 'card' ? (
        <RadiusScope radius="xl" padding="1">
          {body}
        </RadiusScope>
      ) : (
        body
      )}
    </VariantContext.Provider>
  );
};

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Пункт: AccordionTrigger и AccordionContent */
export const AccordionItem: React.FC<AccordionItemProps> = ({
  className,
  ...props
}) => {
  const variant = useContext(VariantContext);
  return (
    <AccordionPrimitive.Item
      {...props}
      className={cx('flex flex-col', ITEM_CLASS[variant], className)}
    />
  );
};

export interface AccordionTriggerProps {
  icon?: IconComponent;
  /** Своя иконка шеврона «вниз» */
  chevron?: IconComponent;
  'aria-label'?: string;
  children?: React.ReactNode;
}

/** Заголовок пункта: подпись и шеврон, который поворачивается при раскрытии (по data-state) */
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  icon,
  chevron,
  children,
  ...props
}) => {
  const rounded = radiusProps(useInnerRadius('md'));
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        {...props}
        className={cx(DISCLOSURE_BUTTON, rounded.className)}
        style={rounded.style}
      >
        <DisclosureRow icon={icon} chevron={chevron}>
          {children}
        </DisclosureRow>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

export interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

/** Панель пункта: отступы как у подписи заголовка, проявляется прозрачностью. Строка — абзацем */
export const AccordionContent: React.FC<AccordionContentProps> = ({
  className,
  children,
}) => (
  <AccordionPrimitive.Content
    className={cx('px-3 pb-3 data-[state=open]:animate-tg-fade-in', className)}
  >
    {typeof children === 'string' ? (
      <Text as="p" tone="secondary" className="leading-5">
        {children}
      </Text>
    ) : (
      children
    )}
  </AccordionPrimitive.Content>
);
