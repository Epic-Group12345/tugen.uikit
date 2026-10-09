import { useState } from 'react';
import {
  Button,
  Skeleton,
  SkeletonLines,
  Surface,
  Text,
} from '@tugen/uikit/web';

export default function Example() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Surface
        kind="card"
        aria-busy={loading}
        className="flex flex-col gap-2 p-4"
      >
        {loading ? (
          <>
            <Skeleton className="h-4 w-40" />
            <SkeletonLines lines={2} />
          </>
        ) : (
          <>
            <Text weight="semibold">Сервер «Островок»</Text>
            <Text as="p" tone="muted" className="leading-6">
              Ванильное выживание без приватов. Вайп раз в сезон, ивенты по
              выходным.
            </Text>
          </>
        )}
      </Surface>
      <Button
        variant="secondary"
        className="self-start"
        onClick={() => setLoading(!loading)}
      >
        {loading ? 'Показать содержимое' : 'Снова загрузить'}
      </Button>
    </div>
  );
}
