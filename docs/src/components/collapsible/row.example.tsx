import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@tugen/uikit/web';
import { SlidersHorizontal } from 'lucide-react';

export default function Example() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger icon={SlidersHorizontal}>
        Дополнительные параметры
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-2">
        Аргументы JVM: -Xmx4G -XX:+UseG1GC
      </CollapsibleContent>
    </Collapsible>
  );
}
