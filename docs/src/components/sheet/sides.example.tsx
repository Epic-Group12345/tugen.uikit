import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Text,
  type SheetSide,
} from '@tugen/uikit/web';

const SIDES: { side: SheetSide; label: string }[] = [
  { side: 'left', label: 'Слева' },
  { side: 'right', label: 'Справа' },
  { side: 'bottom', label: 'Снизу' },
];

export default function Example() {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-2">
      {SIDES.map(({ side, label }) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary">{label}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Загрузки</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col px-3 pb-2">
              <Text tone="secondary">Fabric Optimized — 42 из 120 файлов</Text>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="secondary">Скрыть</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
