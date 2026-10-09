import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  const [open, setOpen] = useState(['memory']);

  return (
    <Accordion
      type="multiple"
      variant="card"
      value={open}
      onValueChange={setOpen}
      className="w-full max-w-md"
    >
      <AccordionItem value="memory">
        <AccordionTrigger>Память</AccordionTrigger>
        <AccordionContent>Выделено 4 ГБ из 16 ГБ</AccordionContent>
      </AccordionItem>
      <AccordionItem value="jvm">
        <AccordionTrigger>Аргументы JVM</AccordionTrigger>
        <AccordionContent>
          -XX:+UseG1GC -XX:MaxGCPauseMillis=50
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="window">
        <AccordionTrigger>Окно игры</AccordionTrigger>
        <AccordionContent>1280 × 720, без полного экрана</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
