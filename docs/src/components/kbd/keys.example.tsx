import { Kbd, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Kbd>Esc</Kbd>
        <Text tone="muted">закрыть окно</Text>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Kbd>F5</Kbd>
        <Text tone="muted">обновить список серверов</Text>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Kbd>Enter</Kbd>
        <Text tone="muted">запустить выбранную сборку</Text>
      </div>
    </div>
  );
}
