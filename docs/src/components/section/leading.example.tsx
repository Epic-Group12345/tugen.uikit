import { Avatar, Button, Row, Section, Text } from '@tugen/uikit/web';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Section title="Аккаунт">
        <Row
          title="Steve"
          description="Лицензия Minecraft"
          leading={<Avatar alt="Steve" size="lg" status="online" />}
        >
          <Button variant="secondary">Выйти</Button>
        </Row>
      </Section>
      <Section title="Папки">
        <Row title="Папка игры" wide>
          <Text mono truncate className="block">
            C:\Users\Steve\AppData\Roaming\.tugen
          </Text>
        </Row>
      </Section>
    </div>
  );
}
