import React, { createContext, useContext, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import * as CollapsiblePrimitive from '@rn-primitives/collapsible';
import {
  StateLayers,
  useAnimatedFlag,
  useAppear,
  usePressFeedback,
} from '../animation';
import { radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import type { IconComponent } from './icon';
import { Text } from './text';

// Раскрывающийся блок на @rn-primitives/collapsible: aria-expanded и состояние — из примитива.
// Высоту не анимируем (только opacity и transform): содержимое появляется сразу в раскладке
// и проявляется прозрачностью, а шеврон поворачивается transform на нативном драйвере

export interface CollapsibleProps
  extends Omit<CollapsiblePrimitive.RootProps, 'asChild' | 'children'> {
  className?: string;
  children: React.ReactNode;
}

// Состояние открытия дублируем в своём контексте: примитив свой контекст не экспортирует, а он
// нужен шеврону и скрытию содержимого с forceMount
const OpenContext = createContext(false);

/** Корень: open / defaultOpen / onOpenChange. Внутри — CollapsibleTrigger и CollapsibleContent */
export const Collapsible: React.FC<CollapsibleProps> = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className = '',
  children,
  ...props
}) => {
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const change = (next: boolean) => {
    if (openProp === undefined) {
      setOwn(next);
    }
    onOpenChange?.(next);
  };
  return (
    <OpenContext.Provider value={open}>
      <CollapsiblePrimitive.Root
        {...props}
        open={open}
        onOpenChange={change}
        asChild
      >
        <View className={className}>{children}</View>
      </CollapsiblePrimitive.Root>
    </OpenContext.Provider>
  );
};

/** Шеврон «вниз» из уголка рамки: kit не зависит от набора иконок */
const ChevronGlyph: React.FC = () => (
  <View
    style={{
      width: 7,
      height: 7,
      marginTop: -4,
      transform: [{ rotate: '45deg' }],
    }}
    className="border-r-2 border-b-2 border-mist-500 dark:border-mist-400"
  />
);

/**
 * Шеврон, который поворачивается на 180° при раскрытии. icon — своя иконка «вниз»
 * (`Icons.ChevronDown`), без неё — уголок
 */
export const ExpandChevron: React.FC<{
  open: boolean;
  icon?: IconComponent;
}> = ({ open, icon: Icon }) => {
  const turn = useAnimatedFlag(open, { in: motion.layout });
  const style = useMemo(
    () => ({
      transform: [
        {
          rotate: turn.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    }),
    [turn],
  );
  return (
    <Animated.View style={style}>
      <View className="h-4 w-4 items-center justify-center">
        {Icon ? (
          <Icon size={14} className="text-mist-500 dark:text-mist-400" />
        ) : (
          <ChevronGlyph />
        )}
      </View>
    </Animated.View>
  );
};

/**
 * Строка-кнопка раскрытия: подпись, иконка и шеврон, фон при наведении. Радиус — по правилу
 * вложенности (в карточке с отступом), вне контейнера rounded-md
 */
export const DisclosureRow: React.FC<{
  open: boolean;
  hover: Animated.Value;
  press: Animated.Value;
  icon?: IconComponent;
  chevron?: IconComponent;
  children?: React.ReactNode;
}> = ({ open, hover, press, icon: Icon, chevron, children }) => {
  const rounded = radiusProps(useInnerRadius('md'));
  return (
    <View>
      <StateLayers
        className={rounded.className}
        style={rounded.style}
        layers={[
          { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
          { className: 'bg-mist-950/10 dark:bg-mist-50/10', progress: press },
        ]}
      />
      <View className="flex-row items-center gap-2 px-3 py-2.5">
        {Icon && (
          <Icon size={16} className="text-mist-500 dark:text-mist-400" />
        )}
        <View className="flex-1">
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text weight="semibold" numberOfLines={2}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
        <ExpandChevron open={open} icon={chevron} />
      </View>
    </View>
  );
};

export interface CollapsibleTriggerProps {
  /** Отдать нажатие своему элементу (Button) — без оформления kit */
  asChild?: boolean;
  icon?: IconComponent;
  /** Своя иконка шеврона «вниз» */
  chevron?: IconComponent;
  disabled?: boolean;
  accessibilityLabel?: string;
  children?: React.ReactNode;
}

/** Кнопка раскрытия: строка с шевроном или, с asChild, свой элемент */
export const CollapsibleTrigger: React.FC<CollapsibleTriggerProps> = ({
  asChild,
  icon,
  chevron,
  disabled = false,
  accessibilityLabel,
  children,
}) => {
  const open = useContext(OpenContext);
  const { hover, press, handlers } = usePressFeedback({ disabled });
  if (asChild) {
    return (
      <CollapsiblePrimitive.Trigger asChild disabled={disabled}>
        {children}
      </CollapsiblePrimitive.Trigger>
    );
  }
  return (
    <CollapsiblePrimitive.Trigger
      {...handlers}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={disabled ? { opacity: motion.dimmed } : undefined}
    >
      <DisclosureRow
        open={open}
        hover={hover}
        press={press}
        icon={icon}
        chevron={chevron}
      >
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

/** Содержимое: в раскладке сразу, проявляется прозрачностью */
export const CollapsibleContent: React.FC<CollapsibleContentProps> = ({
  forceMount,
  className = '',
  children,
}) => {
  const open = useContext(OpenContext);
  const body =
    typeof children === 'string' ? (
      <Text tone="secondary">{children}</Text>
    ) : (
      children
    );
  return (
    <CollapsiblePrimitive.Content forceMount={forceMount} asChild>
      <View
        className={className}
        style={!open ? { display: 'none' } : undefined}
      >
        {open ? <FadeIn>{body}</FadeIn> : body}
      </View>
    </CollapsiblePrimitive.Content>
  );
};

/** Проявление при монтировании раскрытого содержимого */
const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shown = useAppear(motion.appear);
  return <Animated.View style={{ opacity: shown }}>{children}</Animated.View>;
};
