import type { Ref } from 'react';
import { Button, Icons, useDropdownMenu } from '@tugen/uikit/web';

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
        { label: 'Открыть папку', icon: Icons.FolderOpen, onSelect: () => {} },
        { label: 'Журнал запуска', icon: Icons.FileText, onSelect: () => {} },
        {
          label: 'Очистить кеш',
          icon: Icons.TrashBin,
          destructive: true,
          onSelect: () => {},
        },
      ])}
    </>
  );
}
