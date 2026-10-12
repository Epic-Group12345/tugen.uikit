import {
  Button,
  Icons,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@tugen/uikit/web';

export default function Example() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="play" icon={Icons.Play}>
          Играть
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        Выживание 1.21.4 · Ctrl+Enter
      </TooltipContent>
    </Tooltip>
  );
}
