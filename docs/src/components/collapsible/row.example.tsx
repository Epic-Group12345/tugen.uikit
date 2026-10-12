import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Icons,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger icon={Icons.Sliders}>
        Дополнительные параметры
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-2">
        Аргументы JVM: -Xmx4G -XX:+UseG1GC
      </CollapsibleContent>
    </Collapsible>
  );
}
