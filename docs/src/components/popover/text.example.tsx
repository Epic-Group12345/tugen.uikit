import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex flex-row gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">Что такое снапшот?</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          Предварительная версия игры: выходит каждую неделю, миры в ней могут
          сломаться.
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">Память</Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-64">
          <PopoverBody title="Сколько памяти дать игре">
            Для сборки до 100 модов хватит 4–6 ГБ. Больше 8 ГБ обычно не
            ускоряет игру.
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
}
