import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { RadiusScope, radiusProps, useInnerRadius } from '../radius';
import type { IconComponent } from '../components/icon';
import { PRESSABLE } from './button';
import { cx } from './cx';
import { Text } from './text';

// Вкладки на Radix Tabs: роли tablist / tab / tabpanel, aria-selected, стрелки и выбор — из
// примитива, оформление — kit. Три вида списка:
// - segmented — дорожка rounded-lg p-0.5, сегменты по правилу радиусов rounded-md (8 − 2 = 6);
// - underline — подписи в ряд и синяя полоса под выбранной, полоса переезжает translateX + scaleX;
// - orientation='vertical' — пункты боковой панели, как вкладки лаунчера: rounded-lg и плашка иконки

export type TabsVariant = 'segmented' | 'underline';
export type TabsOrientation = 'horizontal' | 'vertical';

interface RootContext {
  orientation: TabsOrientation;
  /** TabsList сообщает свою ориентацию: по ней Radix выбирает стрелки (←→ или ↑↓) */
  setOrientation: (orientation: TabsOrientation) => void;
}

const RootCtx = createContext<RootContext>({
  orientation: 'horizontal',
  setOrientation: () => {},
});

export interface TabsProps
  extends Omit<TabsPrimitive.TabsProps, 'asChild' | 'orientation'> {
  /** Ориентация; без неё — та, что у TabsList */
  orientation?: TabsOrientation;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Корень вкладок: value / defaultValue / onValueChange. Колонка с промежутком gap-3; с вертикальным
 * списком — ряд: боковая панель слева, содержимое справа
 */
export const Tabs: React.FC<TabsProps> = ({
  orientation: orientationProp,
  className,
  children,
  ...props
}) => {
  const [reported, setOrientation] = useState<TabsOrientation>('horizontal');
  const orientation = orientationProp ?? reported;
  const context = useMemo(
    () => ({ orientation, setOrientation }),
    [orientation],
  );
  return (
    <TabsPrimitive.Root
      {...props}
      orientation={orientation}
      className={cx(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-row items-start' : 'flex-col',
        className,
      )}
    >
      <RootCtx.Provider value={context}>{children}</RootCtx.Provider>
    </TabsPrimitive.Root>
  );
};

interface ListContext {
  variant: TabsVariant;
  orientation: TabsOrientation;
  fill: boolean;
}

const ListCtx = createContext<ListContext | null>(null);

export interface TabsListProps {
  /** Вид горизонтального списка; у вертикального — свой, как в боковой панели */
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  /** Растянуть список на ширину родителя, а вкладки — поровну */
  fill?: boolean;
  /** Не переходить с последней вкладки на первую стрелкой */
  loop?: boolean;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}

// Дорожка сегментов: rounded-lg p-0.5 → сегменты 8 − 2 = 6 (rounded-md)
const TRACK_RADIUS = 'lg';
const TRACK_PADDING = '0.5';

// Классы целиком — иначе Tailwind их не найдёт при сборке. max-w-full: на узком экране
// вкладки сжимаются с многоточием, а не вылезают за край
const LIST_CLASS: Record<TabsVariant | 'vertical', string> = {
  segmented:
    'flex flex-row max-w-full gap-0.5 p-0.5 rounded-lg bg-mist-200 dark:bg-mist-800',
  underline:
    'relative flex flex-row max-w-full gap-1 border-b border-mist-200 dark:border-mist-800',
  vertical: 'flex flex-col gap-0.5 shrink-0',
};

/** Список вкладок: внутри — TabsTrigger */
export const TabsList: React.FC<TabsListProps> = ({
  variant = 'segmented',
  orientation = 'horizontal',
  fill = false,
  className,
  children,
  ...props
}) => {
  const root = useContext(RootCtx);
  const { setOrientation } = root;
  useLayoutEffect(
    () => setOrientation(orientation),
    [orientation, setOrientation],
  );
  const context = useMemo(
    () => ({ variant, orientation, fill }),
    [variant, orientation, fill],
  );
  const kind = orientation === 'vertical' ? 'vertical' : variant;
  const list = (
    <TabsPrimitive.List
      {...props}
      className={cx(
        LIST_CLASS[kind],
        !fill && kind !== 'vertical' && 'self-start',
        className,
      )}
    >
      {children}
      {kind === 'underline' ? <Underline /> : null}
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

interface Place {
  x: number;
  width: number;
}

/**
 * Полоса под выбранной вкладкой. Ширину не анимируем (это не transform): полоса шириной 1px
 * растягивается scaleX до ширины вкладки и встаёт translateX — оба меняются плавно. Место берём
 * из выбранного триггера (data-state=active) в родителе полосы — списке: ref списка в эффекте
 * ребёнка ещё пуст, React ставит ref родителя после эффектов детей
 */
const Underline: React.FC = () => {
  const ref = useRef<HTMLSpanElement>(null);
  const [place, setPlace] = useState<Place | null>(null);
  // Первое место ставим без перехода — иначе полоса «приезжала» бы от левого края
  const [moving, setMoving] = useState(false);
  useLayoutEffect(() => {
    const list = ref.current?.parentElement;
    if (!list) {
      return;
    }
    const measure = () => {
      const tab = list.querySelector<HTMLElement>(
        ':scope > [role="tab"][data-state="active"]',
      );
      setPlace(prev =>
        !tab
          ? null
          : prev && prev.x === tab.offsetLeft && prev.width === tab.offsetWidth
          ? prev
          : { x: tab.offsetLeft, width: tab.offsetWidth },
      );
    };
    measure();
    // Выбор вкладки меняет data-state, размер — шрифт и fill: следим за обоими
    const mutations = new MutationObserver(measure);
    mutations.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-state'],
    });
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    return () => {
      mutations.disconnect();
      resize.disconnect();
    };
  }, []);
  useLayoutEffect(() => {
    if (place && !moving) {
      const frame = requestAnimationFrame(() => setMoving(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [place, moving]);
  const shown = !!place && place.width > 0;
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx(
        'pointer-events-none absolute left-0 -bottom-px h-0.5 w-px origin-left bg-blue-500',
        !shown && 'opacity-0',
        moving && 'transition-transform duration-180 ease-out',
      )}
      style={
        shown
          ? { transform: `translateX(${place.x}px) scaleX(${place.width})` }
          : undefined
      }
    />
  );
};

export interface TabsTriggerProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'className' | 'children'
  > {
  value: string;
  /** Подпись; строка — текстом kit, иначе как есть */
  children?: React.ReactNode;
  icon?: IconComponent;
  ref?: React.Ref<HTMLButtonElement>;
}

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
    <UnderlineTrigger {...props} fill={list.fill} />
  ) : (
    <SegmentTrigger {...props} fill={list.fill} />
  );
};

// Цвет подписи и иконки: яркий у выбранной вкладки и при наведении
const CONTENT =
  'text-mist-500 dark:text-mist-400 hover:text-mist-950 dark:hover:text-mist-50 data-[state=active]:text-mist-950 dark:data-[state=active]:text-mist-50';

const Label: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
  typeof children === 'string' || typeof children === 'number' ? (
    // Без цвета: он наследуется от кнопки и зависит от её data-state и наведения
    <span className="truncate text-sm">{children}</span>
  ) : (
    <>{children}</>
  );

const SegmentTrigger: React.FC<TabsTriggerProps & { fill: boolean }> = ({
  icon: Icon,
  children,
  fill,
  style,
  ...props
}) => {
  // У края дорожки — по правилу радиусов (rounded-md), вне её — rounded-md как запасной
  const rounded = radiusProps(useInnerRadius('md'));
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cx(
        PRESSABLE,
        // Фон наведения и нажатия — только у невыбранной: у выбранной свой, светлый
        'min-w-0 gap-1.5 px-3 py-1 data-[state=active]:bg-mist-50 dark:data-[state=active]:bg-mist-700 data-[state=inactive]:hover:bg-mist-300 dark:data-[state=inactive]:hover:bg-mist-700 data-[state=inactive]:active:bg-mist-300 dark:data-[state=inactive]:active:bg-mist-600',
        CONTENT,
        rounded.className,
        fill && 'flex-1',
      )}
      style={rounded.style ? { ...rounded.style, ...style } : style}
    >
      {Icon && <Icon size={14} className="shrink-0" />}
      <Label>{children}</Label>
    </TabsPrimitive.Trigger>
  );
};

const UnderlineTrigger: React.FC<TabsTriggerProps & { fill: boolean }> = ({
  icon: Icon,
  children,
  fill,
  ...props
}) => (
  <TabsPrimitive.Trigger
    {...props}
    className={cx(
      // Отступ снизу — место под полосу, чтобы фон наведения её не закрывал
      'group flex min-w-0 cursor-pointer select-none pb-1 outline-none disabled:cursor-default disabled:opacity-50 disabled:pointer-events-none',
      CONTENT,
      fill && 'flex-1',
    )}
  >
    <span className="flex w-full min-w-0 flex-row items-center justify-center gap-1.5 px-3 py-1.5 rounded-md transition-colors duration-100 group-hover:bg-mist-950/5 dark:group-hover:bg-mist-50/5 group-active:bg-mist-950/10 dark:group-active:bg-mist-50/10 group-focus-visible:outline-2 group-focus-visible:outline-blue-500">
      {Icon && <Icon size={14} className="shrink-0" />}
      <Label>{children}</Label>
    </span>
  </TabsPrimitive.Trigger>
);

/**
 * Пункт боковой панели, как вкладка лаунчера. Пункт прилегает к краю панели — радиус по правилу
 * (вне контейнера rounded-lg); внутри — отступ p-1, поэтому плашка иконки 8 − 4 = 4 (rounded-sm)
 */
const VerticalTrigger: React.FC<TabsTriggerProps> = ({
  icon,
  children,
  style,
  ...props
}) => {
  const r = useInnerRadius('lg');
  const rounded = radiusProps(r);
  return (
    <TabsPrimitive.Trigger
      {...props}
      className={cx(
        // Не PRESSABLE: там justify-center, а пункт панели прижат влево
        'group flex flex-row items-center gap-2 p-1 pr-2 min-w-0 cursor-pointer select-none text-left transition-[background-color,transform] duration-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-default disabled:opacity-50 disabled:pointer-events-none hover:bg-mist-200 dark:hover:bg-mist-800 data-[state=active]:bg-mist-200 dark:data-[state=active]:bg-mist-800 active:bg-mist-300 dark:active:bg-mist-800',
        CONTENT,
        rounded.className,
      )}
      style={rounded.style ? { ...rounded.style, ...style } : style}
    >
      <RadiusScope radius={r} padding="1">
        {icon ? <IconPlate icon={icon} /> : null}
        <Label>{children}</Label>
      </RadiusScope>
    </TabsPrimitive.Trigger>
  );
};

/** Плашка иконки вертикальной вкладки: синяя у выбранной (data-state кнопки через group) */
const IconPlate: React.FC<{ icon: IconComponent }> = ({ icon: Icon }) => {
  const rounded = radiusProps(useInnerRadius('sm'));
  return (
    <span
      className={cx(
        'flex h-7 w-7 shrink-0 items-center justify-center transition-colors duration-180 bg-mist-300 dark:bg-mist-800 text-mist-600 dark:text-mist-400 dark:group-hover:text-mist-50 group-data-[state=active]:bg-blue-500 group-data-[state=active]:text-mist-50',
        rounded.className,
      )}
      style={rounded.style}
    >
      <Icon size={16} />
    </span>
  );
};

export interface TabsContentProps {
  value: string;
  /** Держать содержимое в дереве и скрытой вкладки (сохранить состояние формы) */
  forceMount?: true;
  className?: string;
  children: React.ReactNode;
}

/** Содержимое вкладки: появляется плавно (прозрачность). Скрытое с forceMount — display: none */
export const TabsContent: React.FC<TabsContentProps> = ({
  className,
  children,
  ...props
}) => {
  const { orientation } = useContext(RootCtx);
  return (
    <TabsPrimitive.Content
      {...props}
      className={cx(
        'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-sm data-[state=active]:animate-tg-fade-in',
        // С forceMount Radix не скрывает невыбранную вкладку сам — прячем по data-state
        props.forceMount && 'data-[state=inactive]:hidden',
        // Рядом с боковой панелью содержимое занимает остаток ряда
        orientation === 'vertical' && 'flex-1 min-w-0',
        className,
      )}
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TabsPrimitive.Content>
  );
};
