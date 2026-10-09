import { EmptyState } from '@tugen/uikit/web';
import { Shirt } from 'lucide-react';

export default function Example() {
  return (
    <EmptyState
      icon={Shirt}
      title="Скины — скоро"
      text="Здесь можно будет менять скин и плащ, не выходя из лаунчера."
    />
  );
}
