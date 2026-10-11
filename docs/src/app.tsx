import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  IconButton,
  ToggleGroup,
  ToggleGroupItem,
  Sheet,
  SheetContent,
  SheetTitle,
  TextField,
  Toaster,
  cx,
  setTheme,
  type WebTheme,
} from '@tugen/uikit/web';
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  Monitor,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import {
  SECTIONS,
  findPage,
  pages,
  sectionStart,
  type Page,
  type Section,
} from './registry';
import { href, useRoute } from './router';
import { Kicker } from './ui/blocks';
import { ComponentPage } from './ui/component-page';
import { Mark } from './ui/logo';

// Каркас сайта по образцу дизайн-сайта Gravity UI: шапка с вкладками разделов, боковая навигация
// группами (на узком экране — панель Sheet), подпись «Раздел • Страница» над заголовком, ссылки
// «Назад / Далее» и подвал. Тема — переключатель в шапке, выбор помнится в localStorage

const REPO = 'https://github.com/Epic-Group12345/tugen.uikit';

/** Вкладки шапки: «Общее» — это дизайн, как раздел «Дизайн» у Gravity UI */
const TAB_LABEL: Record<Section, string> = {
  Общее: 'Дизайн',
  Разработка: 'Разработка',
  Компоненты: 'Компоненты',
};

const THEME_KEY = 'tugen-docs-theme';

const readTheme = (): WebTheme => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
  } catch {
    return 'system';
  }
};

const THEMES = [
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'system', label: 'Как в системе', icon: Monitor },
  { value: 'dark', label: 'Тёмная', icon: Moon },
] as const;

const ThemeSwitch: React.FC = () => {
  const [theme, setValue] = useState<WebTheme>(readTheme);
  useEffect(() => {
    setTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Без хранилища (приватное окно) тема просто не запомнится
    }
  }, [theme]);
  return (
    <ToggleGroup
      type="single"
      shape="pill"
      value={theme}
      // Повторное нажатие снимает выбор — тему оставляем прежней
      onValueChange={next => next && setValue(next as WebTheme)}
      aria-label="Тема"
    >
      {THEMES.map(item => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          icon={item.icon}
          aria-label={item.label}
        />
      ))}
    </ToggleGroup>
  );
};

const Nav: React.FC<{ route: string; onNavigate?: () => void }> = ({
  route,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? pages.filter(page => page.title.toLowerCase().includes(q))
      : pages;
  }, [query]);
  return (
    <nav className="flex flex-col gap-7" aria-label="Разделы">
      <TextField
        value={query}
        onChangeText={setQuery}
        icon={Search}
        type="search"
        placeholder="Найти"
        aria-label="Найти страницу"
      />
      {SECTIONS.map(section => {
        const items = found.filter(page => page.section === section);
        if (!items.length) return null;
        return (
          <div key={section} className="flex flex-col gap-0.5">
            <span className="px-3 pb-2 text-sm font-semibold text-mist-950 dark:text-mist-50">
              {section}
            </span>
            {items.map(page => {
              const active = page.path === route;
              return (
                <a
                  key={page.path}
                  href={href(page.path)}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'rounded-lg px-3 py-1.5 text-[15px] transition-colors',
                    active
                      ? 'bg-mist-200 font-medium text-mist-950 dark:bg-mist-800 dark:text-mist-50'
                      : 'text-mist-600 hover:bg-mist-950/5 hover:text-mist-950 dark:text-mist-400 dark:hover:bg-mist-50/5 dark:hover:text-mist-50',
                  )}
                >
                  {page.title}
                </a>
              );
            })}
          </div>
        );
      })}
      {!found.length && (
        <span className="px-3 text-sm text-mist-500 dark:text-mist-400">
          Ничего не нашлось
        </span>
      )}
    </nav>
  );
};

/** «Назад / Далее», как у Gravity UI: крупное название соседней страницы */
const Pager: React.FC<{ page: Page }> = ({ page }) => {
  const index = pages.indexOf(page);
  const prev = pages[index - 1];
  const next = pages[index + 1];
  return (
    <div className="mt-20 flex flex-row gap-4 border-t border-mist-200 pt-8 dark:border-mist-800">
      {prev && (
        <a
          href={href(prev.path)}
          className="group flex flex-1 flex-col items-start gap-1"
        >
          <span className="flex flex-row items-center gap-1.5 text-sm text-mist-500 dark:text-mist-400">
            <ArrowLeft size={14} /> Назад
          </span>
          <span className="text-lg font-semibold text-mist-950 group-hover:text-blue-600 sm:text-xl dark:text-mist-50 dark:group-hover:text-blue-400">
            {prev.title}
          </span>
        </a>
      )}
      {next && (
        <a
          href={href(next.path)}
          className="group flex flex-1 flex-col items-end gap-1 text-right"
        >
          <span className="flex flex-row items-center gap-1.5 text-sm text-mist-500 dark:text-mist-400">
            Далее <ArrowRight size={14} />
          </span>
          <span className="text-lg font-semibold text-mist-950 group-hover:text-blue-600 sm:text-xl dark:text-mist-50 dark:group-hover:text-blue-400">
            {next.title}
          </span>
        </a>
      )}
    </div>
  );
};

/** Вкладки разделов в шапке — ведут на первую страницу раздела */
const Tabs: React.FC<{ current: Section }> = ({ current }) => (
  <nav
    className="hidden flex-row items-center gap-1 md:flex"
    aria-label="Разделы сайта"
  >
    {SECTIONS.map(section => {
      const active = section === current;
      return (
        <a
          key={section}
          href={href(sectionStart(section).path)}
          aria-current={active ? 'page' : undefined}
          className={cx(
            'rounded-full px-3.5 py-1.5 text-sm transition-colors',
            active
              ? 'bg-mist-950 font-medium text-mist-50 dark:bg-mist-50 dark:text-mist-950'
              : 'text-mist-600 hover:bg-mist-950/5 hover:text-mist-950 dark:text-mist-400 dark:hover:bg-mist-50/5 dark:hover:text-mist-50',
          )}
        >
          {TAB_LABEL[section]}
        </a>
      );
    })}
  </nav>
);

const Footer: React.FC = () => (
  <footer className="border-t border-mist-200 dark:border-mist-800">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center">
      <div className="flex flex-row items-center gap-2">
        <Mark size={20} />
        <span className="text-sm font-semibold">TUGEN UI-kit</span>
      </div>
      <div className="flex-1" />
      <div className="flex flex-row flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist-500 dark:text-mist-400">
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="hover:text-mist-950 dark:hover:text-mist-50"
        >
          GitHub
        </a>
        <a
          href={href('branding')}
          className="hover:text-mist-950 dark:hover:text-mist-50"
        >
          Брендирование
        </a>
        <span>© {new Date().getFullYear()} TUGEN</span>
      </div>
    </div>
  </footer>
);

export const App: React.FC = () => {
  const route = useRoute();
  const page = findPage(route);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.title = page.path
      ? `${page.title} · TUGEN UI-kit`
      : 'TUGEN UI-kit';
    window.scrollTo(0, 0);
  }, [page]);

  const Guide = page.guide;
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-mist-200 bg-mist-50/90 backdrop-blur dark:border-mist-800 dark:bg-mist-950/90">
        <div className="mx-auto flex h-14 max-w-7xl flex-row items-center gap-3 px-4">
          <div className="lg:hidden">
            <IconButton
              icon={Menu}
              aria-label="Разделы"
              onClick={() => setMenu(true)}
            />
          </div>
          <a href={href('')} className="flex flex-row items-center gap-2">
            <Mark size={24} />
            <span className="text-base font-bold tracking-wide">TUGEN</span>
            <span className="text-sm text-mist-500 dark:text-mist-400">
              UI-kit
            </span>
          </a>
          <div className="ml-4 flex-1">
            <Tabs current={page.section} />
          </div>
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex"
          >
            <Button variant="ghost" size="sm" tabIndex={-1}>
              GitHub
            </Button>
          </a>
          <ThemeSwitch />
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-row">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-mist-200 px-4 py-8 lg:block dark:border-mist-800">
          <Nav route={page.path} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
          <div className="mx-auto max-w-4xl">
            <Kicker parts={[page.section, page.kicker ?? page.title]} />
            {Guide ? (
              <Guide />
            ) : (
              page.doc && (
                <ComponentPage slug={page.path.split('/')[1]} doc={page.doc} />
              )
            )}
            <Pager page={page} />
          </div>
        </main>
      </div>
      <Footer />

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetTitle>Разделы</SheetTitle>
          <div className="mt-4">
            <Nav route={page.path} onNavigate={() => setMenu(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <Toaster />
    </>
  );
};
