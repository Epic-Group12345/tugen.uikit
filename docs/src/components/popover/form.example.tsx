import { useState } from 'react';
import {
  Button,
  Field,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  TextField,
} from '@tugen/uikit/web';
import { Plus } from 'lucide-react';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');
  const add = () => {
    setAddress('');
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button icon={Plus}>Добавить сервер</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverBody>
          <Field label="Адрес сервера">
            <TextField
              value={address}
              onChangeText={setAddress}
              placeholder="play.example.ru"
              mono
              onSubmit={add}
            />
          </Field>
        </PopoverBody>
        <Button disabled={!address.trim()} onClick={add} grow>
          Добавить
        </Button>
      </PopoverContent>
    </Popover>
  );
}
