import React from 'react';
import { Path, Svg } from 'react-native-svg';
import { ICON_DATA } from './icon-data';

// Иконки для компонентов Reusables: набор Gravity UI (как у всего kit), а не lucide. Размер — size,
// цвет — color (классы Tailwind внутри SVG не разбираются). Имена — как у lucide, чтобы код компонентов не менялся

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export type LucideIcon = React.ComponentType<IconProps>;

const makeIcon = (name: keyof typeof ICON_DATA, rotation = 0): LucideIcon => {
  const data = ICON_DATA[name];
  const Icon: LucideIcon = ({ size = 16, color = 'currentColor' }) => (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${data.size} ${data.size}`}
      style={rotation ? { transform: [{ rotate: `${rotation}deg` }] } : undefined}
    >
      {data.paths.map((p, i) => (
        <Path key={i} d={p.d} fill={color} fillRule={p.evenOdd ? 'evenodd' : 'nonzero'} />
      ))}
    </Svg>
  );
  return Icon;
};

export const ChevronDown = makeIcon('ChevronDown');
export const ChevronRight = makeIcon('ChevronRight');
/** Шеврон вверх — тот же шеврон вниз, повёрнутый на 180° */
export const ChevronUp = makeIcon('ChevronDown', 180);
/** Стрелка вправо — шеврон вправо (в наборе лаунчера отдельной стрелки нет) */
export const ArrowRight = makeIcon('ChevronRight');
export const Check = makeIcon('Check');
export const X = makeIcon('X');

/** Имена lucide, которыми пользуются компоненты Reusables (select.tsx) */
export const ChevronDownIcon = ChevronDown;
export const ChevronUpIcon = ChevronUp;
export type LucideProps = IconProps;
