import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tugen/uikit/web';
import { Play } from 'lucide-react';

export default function Example() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="play" icon={Play}>
          Играть
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        Выживание 1.21.4 · Ctrl+Enter
      </TooltipContent>
    </Tooltip>
  );
}
