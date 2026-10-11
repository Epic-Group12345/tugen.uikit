import { Pill } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Pill>Технические</Pill>
      <Pill tone="amber">Бета</Pill>
      <Pill tone="green">Совместим</Pill>
      <Pill tone="red">Несовместим</Pill>
      <Pill tone="violet">Fabric</Pill>
      <Pill tone="danger">Мошенник</Pill>
    </div>
  );
}
