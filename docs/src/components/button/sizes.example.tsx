import { Button } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button size="sm">Маленькая</Button>
      <Button size="md">Обычная</Button>
      <Button size="lg" variant="play">
        Играть
      </Button>
    </div>
  );
}
