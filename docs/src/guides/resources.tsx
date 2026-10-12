import React from 'react';
import {
  Button,
  Icons,
  Kbd,
  Pill,
  Surface,
  Text,
  Toggle,
  palette,
  type IconComponent,
} from '@tugen/uikit/web';
import tokensJson from '../../../tokens/tokens.json?raw';
import { href } from '../router';
import { ResourceBlock, Steps, download } from '../ui/blocks';
import { Code } from '../ui/code';
import { Logo } from '../ui/logo';
import { A, C, H1, H2, Lead } from '../ui/prose';

// Ресурсы — первая страница, как «Общее • Ресурсы» у Gravity UI: что взять, чтобы рисовать и
// собирать интерфейс TUGEN. У нас вместо библиотек Figma — пакет, токены, иконки, шрифты и логотип

const REPO = 'https://github.com/Epic-Group12345/tugen.uikit';

/** Ссылка-кнопка: снаружи — ссылка, внутри — кнопка kit без своего фокуса */
const LinkButton: React.FC<{
  href: string;
  variant?: 'primary' | 'secondary';
  icon?: IconComponent;
  children: React.ReactNode;
}> = ({ href: to, variant = 'secondary', icon, children }) => (
  <a
    href={to}
    target={to.startsWith('http') ? '_blank' : undefined}
    rel="noreferrer"
    className="flex rounded-lg"
  >
    <Button variant={variant} icon={icon} tabIndex={-1}>
      {children}
    </Button>
  </a>
);

const KitPreview: React.FC = () => {
  const [music, setMusic] = React.useState(true);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Surface kind="card" padding="4" className="flex flex-col gap-3">
        <div className="flex flex-row items-center gap-2">
          <Pill tone="green">В сети</Pill>
          <Pill tone="violet">Fabric</Pill>
        </div>
        <Text size="lg" weight="semibold">
          Выживание · 1.21.4
        </Text>
        <div className="flex flex-row gap-2">
          <Button variant="play" icon={Icons.Play} grow>
            Играть
          </Button>
          <Button variant="secondary">Настроить</Button>
        </div>
      </Surface>
      <Surface
        kind="card"
        padding="4"
        className="flex flex-row items-center gap-3"
      >
        <div className="flex flex-1 flex-col">
          <Text weight="semibold">Музыка</Text>
          <Text size="xs" tone="muted">
            Фоновая музыка в лаунчере
          </Text>
        </div>
        <Toggle value={music} onChange={setMusic} aria-label="Музыка" />
      </Surface>
    </div>
  );
};

const SWATCHES = ['mist', 'blue', 'green', 'red', 'amber', 'violet'] as const;

const TokensPreview: React.FC = () => (
  <div className="grid w-full max-w-sm grid-cols-6 gap-2">
    {SWATCHES.map(name =>
      (['300', '500', '700'] as const).map(shade => (
        <div
          key={`${name}${shade}`}
          className="aspect-square rounded-xl border border-mist-950/5 dark:border-mist-50/10"
          style={{ backgroundColor: palette[name][shade] }}
          title={`${name}-${shade}`}
        />
      )),
    )}
  </div>
);

const ICONS = [
  Icons.Play,
  Icons.Gear,
  Icons.Persons,
  Icons.Bell,
  Icons.Magnifier,
  Icons.Heart,
  Icons.ArrowDownToLine,
  Icons.Cube,
];

const IconsPreview: React.FC = () => (
  <div className="grid grid-cols-4 gap-3">
    {ICONS.map((Icon, i) => (
      <div
        key={i}
        className="flex size-14 items-center justify-center rounded-2xl bg-mist-100 text-mist-700 dark:bg-mist-900 dark:text-mist-300"
      >
        <Icon size={24} />
      </div>
    ))}
  </div>
);

const FontsPreview: React.FC = () => (
  <div className="flex w-full max-w-sm flex-row items-end justify-between gap-6">
    <div className="flex flex-col gap-1">
      <span className="font-sans text-7xl leading-none font-bold">Аа</span>
      <span className="text-sm text-mist-500 dark:text-mist-400">
        Ubuntu Sans
      </span>
    </div>
    <div className="flex flex-col items-end gap-2">
      <span className="font-mono text-2xl">1.21.4</span>
      <div className="flex flex-row items-center gap-1">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </div>
      <span className="text-sm text-mist-500 dark:text-mist-400">
        Ubuntu Mono
      </span>
    </div>
  </div>
);

const BrandPreview: React.FC = () => (
  <div className="flex w-full flex-col items-center gap-6">
    <Logo size="lg" />
    <div className="flex flex-row gap-3">
      <div className="flex rounded-2xl bg-mist-950 px-5 py-4">
        <Logo tone="light" />
      </div>
      <div className="flex rounded-2xl border border-mist-200 bg-mist-50 px-5 py-4 dark:border-mist-800">
        <Logo tone="dark" />
      </div>
    </div>
  </div>
);

export const Resources: React.FC = () => (
  <article>
    <H1>Ресурсы</H1>
    <Lead>
      Всё, что нужно, чтобы рисовать и собирать интерфейс TUGEN: пакет
      компонентов, токены, иконки, шрифты и логотип. Лаунчер, мини-приложения
      игр и сайты берут их из одного места, поэтому выглядят одинаково.
    </Lead>

    <ResourceBlock
      id="package"
      title="Библиотека компонентов"
      actions={
        <>
          <LinkButton href={href('components/button')} variant="primary">
            Компоненты
          </LinkButton>
          <LinkButton href={REPO} icon={Icons.CodeFork}>
            GitHub
          </LinkButton>
        </>
      }
      preview={<KitPreview />}
    >
      <p>
        Пакет <C>@tugen/uikit</C>: компоненты React Native для лаунчера и
        мини-приложений и веб-слой <C>@tugen/uikit/web</C> на React DOM и Radix
        — с одними именами, вариантами и размерами.
      </p>
    </ResourceBlock>

    <ResourceBlock
      id="tokens"
      title="Токены"
      actions={
        <>
          <Button
            variant="primary"
            icon={Icons.ArrowDownToLine}
            onClick={() =>
              download('tokens.json', tokensJson, 'application/json')
            }
          >
            tokens.json
          </Button>
          <LinkButton href={href('tokens')}>Все токены</LinkButton>
        </>
      }
      preview={<TokensPreview />}
    >
      <p>
        Палитра, роли цветов в светлой и тёмной теме, скругления, отступы,
        размеры текста и длительности анимаций — один JSON. Из него читают и
        Tailwind, и React Native.
      </p>
    </ResourceBlock>

    <ResourceBlock
      id="icons"
      title="Иконки"
      actions={
        <>
          <LinkButton href={href('icons')} variant="primary">
            Все иконки
          </LinkButton>
          <LinkButton
            href="https://gravity-ui.com/icons"
            icon={Icons.ArrowUpRightFromSquare}
          >
            Gravity UI Icons
          </LinkButton>
        </>
      }
      preview={<IconsPreview />}
    >
      <p>
        Один набор для лаунчера и сайтов — Gravity UI Icons, его держит kit:{' '}
        <C>Icons.Gear</C>. Размеры: 12 — шевроны и крестики, 14 — в кнопках с
        текстом, 16 — кнопки-иконки и пункты меню, 24 — пустые состояния.
      </p>
    </ResourceBlock>

    <ResourceBlock
      id="fonts"
      title="Шрифты"
      actions={
        <>
          <LinkButton
            href="https://fonts.google.com/specimen/Ubuntu+Sans"
            icon={Icons.ArrowUpRightFromSquare}
          >
            Ubuntu Sans
          </LinkButton>
          <LinkButton
            href="https://fonts.google.com/specimen/Ubuntu+Mono"
            icon={Icons.ArrowUpRightFromSquare}
          >
            Ubuntu Mono
          </LinkButton>
        </>
      }
      preview={<FontsPreview />}
    >
      <p>
        Сайты TUGEN набраны Ubuntu Sans, код и клавиши — Ubuntu Mono. Лаунчер на
        Windows берёт системный Segoe UI. Подробнее —{' '}
        <A href={href('typography')}>Типографика</A>.
      </p>
    </ResourceBlock>

    <ResourceBlock
      id="logo"
      title="Логотип"
      actions={
        <LinkButton href={href('branding')} variant="primary">
          Брендирование
        </LinkButton>
      }
      preview={<BrandPreview />}
    >
      <p>
        Знак и надпись TUGEN в цветном, светлом и тёмном вариантах, охранное
        поле и правила использования. Файлы SVG — на странице брендирования.
      </p>
    </ResourceBlock>

    <H2>Порядок использования</H2>
    <Steps
      items={[
        <>
          Добавьте пакет в проект на Vite + React:
          <Code
            language="bash"
            code="yarn add github:Epic-Group12345/tugen.uikit"
          />
        </>,
        <>
          Подключите стили kit в CSS приложения рядом с Tailwind:{' '}
          <C>@import '@tugen/uikit/web.css'</C>. Подробности —{' '}
          <A href={href('web')}>Веб: Vite + React</A>.
        </>,
        <>
          Берите компоненты из <C>@tugen/uikit/web</C>, а цвета, отступы и
          радиусы — классами Tailwind из палитры kit.
        </>,
        <>
          В лаунчере kit уже подключён сабмодулем <C>uikit/</C> — см.{' '}
          <A href={href('native')}>Лаунчер: React Native</A>.
        </>,
        <>
          Новый элемент сначала ищите среди{' '}
          <A href={href('components/button')}>компонентов</A>: если подходящего
          нет, соберите его по <A href={href('radius')}>правилу скругления</A> и
          добавьте в kit в обе библиотеки.
        </>,
      ]}
    />
  </article>
);
