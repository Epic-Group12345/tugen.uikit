import { EmptyState, Icons } from '@tugen/uikit/web';

export default function Example() {
  return (
    <EmptyState
      icon={Icons.TShirt}
      title="Скины — скоро"
      text="Здесь можно будет менять скин и плащ, не выходя из лаунчера."
    />
  );
}
