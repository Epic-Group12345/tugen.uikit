import { Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <Text size="xs" tone="muted">
          Папка игры
        </Text>
        <Text
          mono
          truncate
          title="C:\Users\Steve\AppData\Roaming\.tugen\builds"
        >
          C:\Users\Steve\AppData\Roaming\.tugen\builds
        </Text>
      </div>
      <div className="flex flex-col gap-0.5">
        <Text size="xs" tone="muted">
          Аргументы JVM
        </Text>
        <Text mono size="xs" tone="secondary">
          -Xmx4G -XX:+UseG1GC
        </Text>
      </div>
    </div>
  );
}
