import { useState } from 'react';
import {
  Button,
  CheckRow,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@tugen/uikit/web';
import { ListFilter } from 'lucide-react';

export default function Example() {
  const [modded, setModded] = useState(true);
  const [vanilla, setVanilla] = useState(true);
  const [hidden, setHidden] = useState(false);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" icon={ListFilter}>
          Фильтры
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
          <SheetDescription>
            Какие сборки показывать в библиотеке
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-1">
          <CheckRow
            label="С модами"
            description="Fabric, Forge, NeoForge"
            checked={modded}
            onChange={setModded}
          />
          <CheckRow label="Без модов" checked={vanilla} onChange={setVanilla} />
          <CheckRow label="Скрытые" checked={hidden} onChange={setHidden} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary">Закрыть</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
