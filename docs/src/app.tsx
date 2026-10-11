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
import { findPage, pages, sections, type Page } from './registry';
import { href, useRoute } from './router';
import { ComponentPage } from './ui/component-page';

// Каркас сайта: шапка, боковая навигация (на узком экране — панель Sheet), страница и ссылки
// «назад / дальше». Тема — переключатель в шапке, выбор помнится в localStorage

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
    <nav className="flex flex-col gap-6" aria-label="Разделы">
      <TextField
        value={query}
        onChangeText={setQuery}
        icon={Search}
        type="search"
        placeholder="Найти"
        aria-label="Найти страницу"
      />
      {sections.map(section => {
        const items = found.filter(page => page.section === section);
        if (!items.length) return null;
        return (
          <div key={section} className="flex flex-col gap-1">
            <span className="px-3 pb-1 text-xs font-medium tracking-wide text-mist-500 uppercase dark:text-mist-400">
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
                    'rounded-lg px-3 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-blue-500/10 font-medium text-blue-700 dark:text-blue-300'
                      : 'text-mist-700 hover:bg-mist-950/5 dark:text-mist-300 dark:hover:bg-mist-50/5',
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

const Pager: React.FC<{ page: Page }> = ({ page }) => {
  const index = pages.indexOf(page);
  const prev = pages[index - 1];
  const next = pages[index + 1];
  return (
    <div className="mt-16 flex flex-row gap-3 border-t border-mist-200 pt-6 dark:border-mist-800">
      {prev && (
        <a
          href={href(prev.path)}
          className="flex flex-1 flex-col gap-0.5 rounded-xl border border-mist-200 px-4 py-3 hover:bg-mist-950/5 dark:border-mist-800 dark:hover:bg-mist-50/5"
        >
          <span className="flex flex-row items-center gap-1 text-xs text-mist-500 dark:text-mist-400">
            <ArrowLeft size={12} /> Назад
          </span>
          <span className="text-sm font-medium">{prev.title}</span>
        </a>
      )}
      {next && (
        <a
          href={href(next.path)}
          className="flex flex-1 flex-col items-end gap-0.5 rounded-xl border border-mist-200 px-4 py-3 text-right hover:bg-mist-950/5 dark:border-mist-800 dark:hover:bg-mist-50/5"
        >
          <span className="flex flex-row items-center gap-1 text-xs text-mist-500 dark:text-mist-400">
            Дальше <ArrowRight size={12} />
          </span>
          <span className="text-sm font-medium">{next.title}</span>
        </a>
      )}
    </div>
  );
};

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
          <a href={href('')} className="flex flex-row items-baseline gap-2">
            <span className="text-base font-bold tracking-tight">TUGEN</span>
            <span className="text-sm text-mist-500 dark:text-mist-400">
              UI-kit
            </span>
          </a>
          <div className="flex-1" />
          <a
            href="https://github.com/Epic-Group12345/tugen.uikit"
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
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto px-4 py-8 lg:block">
          <Nav route={page.path} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
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

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-72 overflow-y-auto">
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
