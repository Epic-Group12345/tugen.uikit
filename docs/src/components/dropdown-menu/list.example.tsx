import type { Ref } from 'react';
import { Button, useDropdownMenu } from '@tugen/uikit/web';
import { FileText, FolderOpen, Trash2 } from 'lucide-react';

export default function Example() {
  const { anchorRef, isOpen, onClick, menu } = useDropdownMenu({
    matchWidth: true,
  });
  return (
    <>
      <Button
        ref={anchorRef as Ref<HTMLButtonElement>}
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onClick}
      >
        Файлы сборки
      </Button>
      {menu([
        { label: 'Открыть папку', icon: FolderOpen, onSelect: () => {} },
        { label: 'Журнал запуска', icon: FileText, onSelect: () => {} },
        {
          label: 'Очистить кеш',
          icon: Trash2,
          destructive: true,
          onSelect: () => {},
        },
      ])}
    </>
  );
}
