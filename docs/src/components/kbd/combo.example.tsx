import { KbdCombo, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex flex-row items-center justify-between gap-4">
        <Text>Поиск</Text>
        <KbdCombo keys={['Ctrl', 'K']} />
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <Text>Новая сборка</Text>
        <KbdCombo keys={['Ctrl', 'Shift', 'N']} />
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <Text>Перейти к сборкам</Text>
        <KbdCombo keys={['G', 'B']} separator="затем" />
      </div>
    </div>
  );
}
