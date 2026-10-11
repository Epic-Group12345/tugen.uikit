import { Avatar } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row items-center gap-3">
        <Avatar alt="Алекс Стив" size="sm" />
        <Avatar alt="Алекс Стив" size="md" />
        <Avatar alt="Алекс Стив" size="lg" />
      </div>
      <div className="flex flex-row items-center gap-3">
        <Avatar alt="Островок" size="sm" shape="rounded" />
        <Avatar alt="Островок" size="md" shape="rounded" />
        <Avatar alt="Островок" size="lg" shape="rounded" />
      </div>
    </div>
  );
}
