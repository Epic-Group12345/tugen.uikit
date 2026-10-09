import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  Animated,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import * as TabsPrimitive from '@rn-primitives/tabs';
import {
  StateLayers,
  useAnimatedFlag,
  useAppear,
  useFlipOffset,
  usePressFeedback,
} from '../animation';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import { motion } from '../tokens';
import type { IconComponent } from './icon';
import { Text } from './text';

// Вкладки на @rn-primitives/tabs: роли tablist / tab / tabpanel, aria-selected и выбор — из
// примитива, оформление — kit. Три вида списка:
// - segmented — дорожка rounded-lg p-0.5, сегменты по правилу радиусов rounded-md (8 − 2 = 6);
// - underline — подписи в ряд и синяя полоса под выбранной, полоса переезжает FLIP-сдвигом;
// - orientation='vertical' — пункты боковой панели, как вкладки лаунчера: rounded-lg и плашка иконки

export type TabsVariant = 'segmented' | 'underline';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsProps
  extends Omit<
    TabsPrimitive.RootProps,
    'value' | 'onValueChange' | 'asChild' | 'children'
  > {
  /** Выбранная вкладка (управляемый режим) */
  value?: string;
  /** Вкладка по умолчанию (неуправляемый режим) */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Раскладка классами Uniwind: gap-3, flex-row для боковой панели */
  className?: string;
  children: React.ReactNode;
}

/**
 * Корень вкладок. Примитив умеет только управляемый режим — здесь ещё и defaultValue,
 * чтобы простые вкладки не требовали состояния у приложения
 */
export const Tabs: React.FC<TabsProps> = ({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  className = '',
  children,
  ...props
}) => {
  const [own, setOwn] = useState(defaultValue);
  const value = valueProp ?? own;
  const change = useCallback(
    (next: string) => {
      if (valueProp === undefined) {
        setOwn(next);
      }
      onValueChange?.(next);
    },
    [valueProp, onValueChange],
  );
  return (
    <TabsPrimitive.Root {...props} value={value} onValueChange={change} asChild>
      <View className={`gap-3 ${className}`}>{children}</View>
    </TabsPrimitive.Root>
  );
};

interface Layout {
  x: number;
  width: number;
}

interface ListContext {
  variant: TabsVariant;
  orientation: TabsOrientation;
  fill: boolean;
  /** underline: триггер сообщает своё место в ряду — по нему встаёт полоса */
  report: (value: string, layout: Layout) => void;
}

const ListCtx = createContext<ListContext | null>(null);

export interface TabsListProps {
  /** Вид горизонтального списка; у вертикального — свой, как в боковой панели */
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  /** Растянуть список на ширину родителя, а вкладки — поровну */
  fill?: boolean;
  className?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

// Дорожка сегментов: rounded-lg p-0.5 → сегменты 8 − 2 = 6 (rounded-md)
const TRACK_RADIUS = 'lg';
const TRACK_PADDING = '0.5';

// Классы целиком — иначе Uniwind их не найдёт при сборке
const LIST_CLASS: Record<TabsVariant | 'vertical', string> = {
  segmented: 'flex-row gap-0.5 p-0.5 rounded-lg bg-mist-200 dark:bg-mist-800',
  underline: 'flex-row gap-1 border-b border-mist-200 dark:border-mist-800',
  vertical: 'gap-0.5',
};

/** Список вкладок: внутри — TabsTrigger */
export const TabsList: React.FC<TabsListProps> = ({
  variant = 'segmented',
  orientation = 'horizontal',
  fill = false,
  className = '',
  accessibilityLabel,
  children,
}) => {
  const root = TabsPrimitive.useRootContext();
  const [layouts, setLayouts] = useState<Record<string, Layout>>({});
  const report = useCallback((value: string, layout: Layout) => {
    setLayouts(prev => {
      const old = prev[value];
      return old && old.x === layout.x && old.width === layout.width
        ? prev
        : { ...prev, [value]: layout };
    });
  }, []);
  const context = useMemo(
    () => ({ variant, orientation, fill, report }),
    [variant, orientation, fill, report],
  );
  const kind = orientation === 'vertical' ? 'vertical' : variant;
  const active = layouts[root.value];
  const list = (
    <TabsPrimitive.List asChild aria-label={accessibilityLabel}>
      <View
        className={`${LIST_CLASS[kind]} ${
          fill || orientation === 'vertical' ? '' : 'self-start'
        } ${className}`}
      >
        {children}
        {kind === 'underline' && active && active.width > 0 ? (
          <Underline x={active.x} width={active.width} />
        ) : null}
      </View>
    </TabsPrimitive.List>
  );
  return (
    <ListCtx.Provider value={context}>
      {kind === 'segmented' ? (
        <RadiusScope radius={TRACK_RADIUS} padding={TRACK_PADDING}>
          {list}
        </RadiusScope>
      ) : (
        list
      )}
    </ListCtx.Provider>
  );
};

/**
 * Полоса под выбранной вкладкой. Ширину не анимируем (это не transform): раскладка сразу ставит
 * новые место и ширину, а FLIP-сдвиги возвращают полосу с прежних. Ширина — через scaleX от
 * центра, поэтому к сдвигу левого края добавляется половина сдвига ширины
 */
const Underline: React.FC<Layout> = ({ x, width }) => {
  const dx = useFlipOffset(x, motion.layout);
  const dw = useFlipOffset(width, motion.layout);
  const style = useMemo(
    () => ({
      left: x,
      width,
      transform: [
        { translateX: Animated.add(dx, Animated.multiply(dw, 0.5)) },
        {
          scaleX: dw.interpolate({
            inputRange: [0, width],
            outputRange: [1, 2],
            extrapolate: 'extend' as const,
          }),
        },
      ],
    }),
    [x, width, dx, dw],
  );
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', bottom: -1, height: 2 }, style]}
    >
      <View className="flex-1 rounded-full bg-blue-500" />
    </Animated.View>
  );
};

export interface TabsTriggerProps {
  value: string;
  /** Подпись; строка — текстом kit, иначе как есть */
  children?: React.ReactNode;
  icon?: IconComponent;
  disabled?: boolean;
  /** Подпись для экранного диктора, если видна только иконка */
  accessibilityLabel?: string;
}

const DIMMED = { opacity: motion.dimmed };
const FILL: ViewStyle = { flex: 1 };

/** Вкладка в TabsList */
export const TabsTrigger: React.FC<TabsTriggerProps> = props => {
  const list = useContext(ListCtx);
  if (!list) {
    throw new Error('TabsTrigger должен стоять внутри TabsList');
  }
  if (list.orientation === 'vertical') {
    return <VerticalTrigger {...props} />;
  }
  return list.variant === 'underline' ? (
    <UnderlineTrigger {...props} report={list.report} fill={list.fill} />
  ) : (
    <SegmentTrigger {...props} fill={list.fill} />
  );
};

/** Выбрана ли вкладка и плавный флаг выбора для слоя фона */
const useSelected = (value: string) => {
  const root = TabsPrimitive.useRootContext();
  const selected = root.value === value;
  const active = useAnimatedFlag(selected, {
    in: motion.layout,
    out: motion.deselect,
  });
  return { selected, active };
};

// Цвет подписи и иконки: яркий у выбранной вкладки и при наведении
const contentClass = (bright: boolean) =>
  bright
    ? 'text-mist-950 dark:text-mist-50'
    : 'text-mist-500 dark:text-mist-400';

const Label: React.FC<{ children?: React.ReactNode; className: string }> = ({
  children,
  className,
}) =>
  typeof children === 'string' || typeof children === 'number' ? (
    <Text numberOfLines={1} className={className}>
      {children}
    </Text>
  ) : (
    <>{children}</>
  );

const SegmentTrigger: React.FC<TabsTriggerProps & { fill: boolean }> = ({
  value,
  children,
  icon: Icon,
  disabled = false,
  accessibilityLabel,
  fill,
}) => {
  const { hovered, hover, press, pressStyle, handlers } = usePressFeedback({
    disabled,
  });
  const { selected, active } = useSelected(value);
  // У края дорожки — по правилу радиусов (rounded-md), вне её — rounded-md как запасной
  const rounded = radiusProps(useInnerRadius('md'));
  const content = contentClass(selected || hovered);
  const style: StyleProp<ViewStyle> = [fill && FILL, disabled && DIMMED];
  return (
    <TabsPrimitive.Trigger
      {...handlers}
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      <Animated.View style={pressStyle}>
        <StateLayers
          className={rounded.className}
          style={rounded.style}
          layers={[
            { className: 'bg-mist-300 dark:bg-mist-700', progress: hover },
            { className: 'bg-mist-50 dark:bg-mist-700', progress: active },
            { className: 'bg-mist-300 dark:bg-mist-600', progress: press },
          ]}
        />
        <View className="flex-row items-center justify-center gap-1.5 px-3 py-1">
          {Icon && <Icon size={14} className={content} />}
          <Label className={content}>{children}</Label>
        </View>
      </Animated.View>
    </TabsPrimitive.Trigger>
  );
};

const UnderlineTrigger: React.FC<
  TabsTriggerProps & {
    report: ListContext['report'];
    fill: boolean;
  }
> = ({
  value,
  children,
  icon: Icon,
  disabled = false,
  accessibilityLabel,
  report,
  fill,
}) => {
  const { hovered, hover, press, handlers } = usePressFeedback({ disabled });
  const { selected } = useSelected(value);
  const content = contentClass(selected || hovered);
  const onLayout = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    report(value, { x, width });
  };
  return (
    <TabsPrimitive.Trigger
      {...handlers}
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      onLayout={onLayout}
      style={[fill && FILL, disabled && DIMMED]}
    >
      {/* Отступ снизу — место под полосу, чтобы фон наведения её не закрывал */}
      <View className="pb-1">
        <View>
          <StateLayers
            className="rounded-md"
            layers={[
              { className: 'bg-mist-950/5 dark:bg-mist-50/5', progress: hover },
              {
                className: 'bg-mist-950/10 dark:bg-mist-50/10',
                progress: press,
              },
            ]}
          />
          <View className="flex-row items-center justify-center gap-1.5 px-3 py-1.5">
            {Icon && <Icon size={14} className={content} />}
            <Label className={content}>{children}</Label>
          </View>
        </View>
      </View>
    </TabsPrimitive.Trigger>
  );
};

/**
 * Пункт боковой панели, как вкладка лаунчера. Пункт прилегает к краю панели — радиус по правилу
 * (вне контейнера rounded-lg); внутри — отступ p-1, поэтому плашка иконки 8 − 4 = 4 (rounded-sm)
 */
const VerticalTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  icon: Icon,
  disabled = false,
  accessibilityLabel,
}) => {
  const { hovered, pressed, hover, press, pressStyle, handlers } =
    usePressFeedback({ disabled });
  const { selected, active } = useSelected(value);
  const r = useInnerRadius('lg');
  const rounded = radiusProps(r);
  const iconColor = selected
    ? 'text-mist-50'
    : pressed
    ? 'text-mist-700 dark:text-mist-300'
    : hovered
    ? 'text-mist-600 dark:text-mist-50'
    : 'text-mist-600 dark:text-mist-400';
  return (
    <TabsPrimitive.Trigger
      {...handlers}
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={disabled ? DIMMED : undefined}
    >
      <Animated.View style={pressStyle}>
        <StateLayers
          className={rounded.className}
          style={rounded.style}
          layers={[
            { className: 'bg-mist-200 dark:bg-mist-800', progress: hover },
            { className: 'bg-mist-200 dark:bg-mist-800', progress: active },
            { className: 'bg-mist-300 dark:bg-mist-800', progress: press },
          ]}
        />
        <RadiusScope radius={r} padding="1">
          <View className="flex-row items-center gap-2 p-1 pr-2">
            {Icon ? (
              <IconPlate icon={Icon} active={active} color={iconColor} />
            ) : null}
            <Label className={contentClass(selected || hovered)}>
              {children}
            </Label>
          </View>
        </RadiusScope>
      </Animated.View>
    </TabsPrimitive.Trigger>
  );
};

/** Плашка иконки вертикальной вкладки: синяя у выбранной */
const IconPlate: React.FC<{
  icon: IconComponent;
  active: Animated.Value;
  color: string;
}> = ({ icon: Icon, active, color }) => {
  const rounded = radiusProps(useInnerRadius('sm'));
  return (
    <View className="h-7 w-7 items-center justify-center">
      <StateLayers
        className={rounded.className}
        style={rounded.style}
        layers={[
          { className: 'bg-mist-300 dark:bg-mist-800' },
          { className: 'bg-blue-500', progress: active },
        ]}
      />
      <Icon size={16} className={color} />
    </View>
  );
};

export interface TabsContentProps {
  value: string;
  /** Держать содержимое в дереве и скрытой вкладки (сохранить состояние формы) */
  forceMount?: true;
  className?: string;
  children: React.ReactNode;
}

/** Содержимое вкладки: появляется плавно (прозрачность) */
export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  forceMount,
  className = '',
  children,
}) => {
  const root = TabsPrimitive.useRootContext();
  const hidden = forceMount && root.value !== value;
  return (
    <TabsPrimitive.Content value={value} forceMount={forceMount} asChild>
      <View
        className={className}
        style={hidden ? { display: 'none' } : undefined}
      >
        <FadeIn>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
        </FadeIn>
      </View>
    </TabsPrimitive.Content>
  );
};

const FadeIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shown = useAppear(motion.appear);
  return <Animated.View style={{ opacity: shown }}>{children}</Animated.View>;
};
