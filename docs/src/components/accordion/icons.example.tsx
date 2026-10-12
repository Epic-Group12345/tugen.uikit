import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Icons,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="mods">
        <AccordionTrigger icon={Icons.Box}>Моды · 42</AccordionTrigger>
        <AccordionContent>
          Sodium, Lithium, Iris, Fabric API и ещё 38
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="servers">
        <AccordionTrigger icon={Icons.Server}>Серверы · 2</AccordionTrigger>
        <AccordionContent>«Остров» и локальный сервер друга</AccordionContent>
      </AccordionItem>
      <AccordionItem value="backups" disabled>
        <AccordionTrigger icon={Icons.ShieldExclamation}>
          Резервные копии
        </AccordionTrigger>
        <AccordionContent>Появятся после первого запуска</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
