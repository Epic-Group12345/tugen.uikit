import { useState } from 'react';
import { Checkbox, Label } from '@tugen/uikit/web';

export default function Example() {
  const [agree, setAgree] = useState(false);

  return (
    <div className="flex flex-row items-center gap-2">
      <Checkbox id="eula" checked={agree} onCheckedChange={setAgree} />
      <Label htmlFor="eula">Принимаю лицензию Minecraft (EULA)</Label>
    </div>
  );
}
