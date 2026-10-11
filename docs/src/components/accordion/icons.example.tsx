import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@tugen/uikit/web';
import { Package, Server, ShieldAlert } from 'lucide-react';

export default function Example() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="mods">
        <AccordionTrigger icon={Package}>Моды · 42</AccordionTrigger>
        <AccordionContent>
          Sodium, Lithium, Iris, Fabric API и ещё 38
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="servers">
        <AccordionTrigger icon={Server}>Серверы · 2</AccordionTrigger>
        <AccordionContent>«Остров» и локальный сервер друга</AccordionContent>
      </AccordionItem>
      <AccordionItem value="backups" disabled>
        <AccordionTrigger icon={ShieldAlert}>Резервные копии</AccordionTrigger>
        <AccordionContent>Появятся после первого запуска</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
