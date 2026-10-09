import { Skeleton, Surface } from '@tugen/uikit/web';

export default function Example() {
  return (
    <Surface
      kind="card"
      className="flex w-full max-w-sm flex-row items-center gap-3 p-4"
    >
      <Skeleton className="h-12 w-12 shrink-0" rounded="rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-20" rounded="rounded-lg" />
    </Surface>
  );
}
