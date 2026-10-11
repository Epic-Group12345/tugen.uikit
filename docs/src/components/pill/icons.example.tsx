import { Pill } from '@tugen/uikit/web';
import { Circle, Star, Users } from 'lucide-react';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Pill tone="green">
        <Circle size={8} className="fill-current" />
        Онлайн
      </Pill>
      <Pill>
        <Users size={12} />
        128 / 200
      </Pill>
      <Pill tone="amber">
        <Star size={12} className="fill-current" />
        4,8
      </Pill>
    </div>
  );
}
