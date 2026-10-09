import { Skeleton, SkeletonLines } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Skeleton className="h-5 w-48" />
      <SkeletonLines lines={4} />
    </div>
  );
}
