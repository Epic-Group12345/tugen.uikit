import React, { createContext, useContext } from 'react';
import { Animated, View } from 'react-native';
import * as AccordionPrimitive from '@rn-primitives/accordion';
import { useAppear, usePressFeedback } from '../animation';
import { RadiusScope } from '../radius';
import { motion } from '../tokens';
import { DisclosureRow } from './collapsible';
import type { IconComponent } from './icon';
import { Text } from './text';

// Аккордеон на @rn-primitives/accordion: type single | multiple, collapsible, aria-expanded и
// роль heading у заголовка — из примитива. Высоту не анимируем: панель появляется в раскладке
// сразу и проявляется прозрачностью, шеврон поворачивается transform

export type AccordionVariant = 'line' | 'card';

const VariantContext = createContext<AccordionVariant>('line');

export type AccordionProps = Omit<
  AccordionPrimitive.RootProps,
  'asChild' | 'children'
> & {
  /**
   * line — пункты через линию, без фона; card — карточка rounded-xl p-1, заголовки пунктов у
   * её края по правилу радиусов rounded-lg (12 − 4 = 8)
   */
  variant?: AccordionVariant;
  className?: string;
  children: React.ReactNode;
};

// Классы целиком — иначе Uniwind их не найдёт при сборке
const ROOT_CLASS: Record<AccordionVariant, string> = {
  line: '',
  card: 'gap-0.5 p-1 rounded-xl bg-mist-100 dark:bg-mist-900',
};

const ITEM_CLASS: Record<AccordionVariant, string> = {
  line: 'border-b border-mist-200 dark:border-mist-800',
  card: '',
};

/** Корень: внутри — AccordionItem */
export const Accordion: React.FC<AccordionProps> = ({
  variant = 'line',
  className = '',
  children,
  ...props
}) => {
  const body = (
    <AccordionPrimitive.Root {...(props as AccordionPrimitive.RootProps)}>
      <View className={`${ROOT_CLASS[variant]} ${className}`}>{children}</View>
    </AccordionPrimitive.Root>
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
  value,
  disabled,
  className = '',
  children,
}) => {
  const variant = useContext(VariantContext);
  return (
    <AccordionPrimitive.Item value={value} disabled={disabled} asChild>
      <View className={`${ITEM_CLASS[variant]} ${className}`}>{children}</View>
    </AccordionPrimitive.Item>
  );
};

export interface AccordionTriggerProps {
  icon?: IconComponent;
  /** Своя иконка шеврона «вниз» (`Icons.ChevronDown`) */
  chevron?: IconComponent;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

/** Заголовок пункта: подпись и шеврон, который поворачивается при раскрытии */
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  icon,
  chevron,
  accessibilityLabel,
  children,
}) => {
  const root = AccordionPrimitive.useRootContext();
  const item = AccordionPrimitive.useItemContext();
  const disabled = !!(root.disabled || item.disabled);
  const { hover, press, handlers } = usePressFeedback({ disabled });
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        {...handlers}
        accessibilityLabel={accessibilityLabel}
        style={disabled ? { opacity: motion.dimmed } : undefined}
      >
        <DisclosureRow
          open={item.isExpanded}
          hover={hover}
          press={press}
          icon={icon}
          chevron={chevron}
        >
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
  className = '',
  children,
}) => (
  <AccordionPrimitive.Content asChild>
    <View className={`px-3 pb-3 ${className}`}>
      <FadeIn>
        {typeof children === 'string' ? (
          <Text tone="secondary" className="leading-5">
            {children}
          </Text>
        ) : (
          children
        )}
      </FadeIn>
    </View>
  </AccordionPrimitive.Content>
);

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shown = useAppear(motion.appear);
  return <Animated.View style={{ opacity: shown }}>{children}</Animated.View>;
};
