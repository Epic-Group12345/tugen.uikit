import { useState } from 'react';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueOption,
} from '@tugen/uikit/web';

export default function Example() {
  const [version, setVersion] = useState<SelectValueOption>();
  return (
    <div className="flex w-full max-w-xs flex-col">
      <SelectRoot value={version} onValueChange={setVersion}>
        <SelectTrigger aria-label="Версия игры">
          <SelectValue placeholder="Версия игры" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Релизы</SelectLabel>
            <SelectItem value="1.21.4" label="1.21.4" />
            <SelectItem value="1.20.1" label="1.20.1" />
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Снапшоты</SelectLabel>
            <SelectItem value="25w14a" label="25w14a" />
            <SelectItem value="24w44a" label="24w44a" disabled />
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
    </div>
  );
}
