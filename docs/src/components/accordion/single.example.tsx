import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="build"
      className="w-full max-w-md"
    >
      <AccordionItem value="build">
        <AccordionTrigger>Что такое сборка?</AccordionTrigger>
        <AccordionContent>
          Набор модов, настроек и версии игры, который запускается одной кнопкой
          «Играть».
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="java">
        <AccordionTrigger>Нужно ли ставить Java?</AccordionTrigger>
        <AccordionContent>
          Нет, лаунчер сам скачает подходящую версию для каждой сборки.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="worlds">
        <AccordionTrigger>Где хранятся миры?</AccordionTrigger>
        <AccordionContent>
          В папке saves внутри сборки: у каждой сборки свои миры.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
