import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverRow,
  PopoverTrigger,
} from '@tugen/uikit/web';
import { FolderOpen, Info } from 'lucide-react';

export default function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" icon={Info}>
          О сборке
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <PopoverBody title="Fabric Optimized">
          <PopoverRow label="Версия игры" value="1.21.4" />
          <PopoverRow label="Загрузчик" value="Fabric 0.16.9" />
          <PopoverRow label="Модов" value="42" />
        </PopoverBody>
        <Button variant="secondary" icon={FolderOpen} grow>
          Открыть папку
        </Button>
      </PopoverContent>
    </Popover>
  );
}
