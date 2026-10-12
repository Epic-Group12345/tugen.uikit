import { Icons, Pill } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Pill tone="green">
        <Icons.CircleFill size={8} />
        Онлайн
      </Pill>
      <Pill>
        <Icons.Persons size={12} />
        128 / 200
      </Pill>
      <Pill tone="amber">
        <Icons.StarFill size={12} />
        4,8
      </Pill>
    </div>
  );
}
