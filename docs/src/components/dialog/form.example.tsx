import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  TextField,
} from '@tugen/uikit/web';
import { Pencil } from 'lucide-react';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Выживание');
  const [saved, setSaved] = useState(name);
  const save = () => {
    setSaved(name.trim());
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" icon={Pencil}>
          {saved}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle>Переименовать сборку</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Field label="Название" description="Видно в списке слева">
            <TextField value={name} onChangeText={setName} onSubmit={save} />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button disabled={!name.trim()} onClick={save}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
