import { Avatar } from '@tugen/uikit/web';

// Голова скина 8×8 — в приложении здесь адрес картинки игрока
const head = (skin: string, eyes: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges"><rect width="8" height="8" fill="${skin}"/><rect width="8" height="2" fill="#4a2f1b"/><rect x="1" y="4" width="2" height="1" fill="${eyes}"/><rect x="5" y="4" width="2" height="1" fill="${eyes}"/><rect x="3" y="6" width="2" height="1" fill="#7a4a33"/></svg>`,
  )}`;

export default function Example() {
  return (
    <div className="flex flex-row items-center gap-3">
      <Avatar alt="Steve" size="lg" src={head('#c69c6d', '#3b3bbf')} />
      <Avatar
        alt="Alex"
        size="lg"
        shape="rounded"
        src={head('#e8b88f', '#2f8a3e')}
      />
      {/* Картинка не загрузилась — инициалы */}
      <Avatar alt="Херобрин" size="lg" src="/no-such-skin.png" />
    </div>
  );
}
