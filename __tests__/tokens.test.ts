import { readFileSync } from 'fs';
import { join } from 'path';
import source from '../tokens/tokens.json';
import { layoutModeFor, resolveColor, themes } from '../src/tokens';

it('ссылка на палитру превращается в цвет', () => {
  expect(resolveColor('blue.500')).toBe(source.palette.blue['500']);
  expect(resolveColor('white')).toBe('#ffffff');
  expect(resolveColor('mist.950/5')).toMatch(/^rgba\(\d+, \d+, \d+, 0\.05\)$/);
  expect(() => resolveColor('pink.500')).toThrow();
});

it('у светлой и тёмной темы одни и те же роли', () => {
  expect(Object.keys(themes.dark).sort()).toEqual(
    Object.keys(themes.light).sort(),
  );
});

it('css/tugen.css собран из тех же токенов', () => {
  const css = readFileSync(join(__dirname, '../css/tugen.css'), 'utf8');
  const vars = (block: string) =>
    Object.fromEntries(
      [...block.matchAll(/--tg-([\w-]+): ([^;]+);/g)].map(m => [m[1], m[2]]),
    );
  const light = vars(css.slice(0, css.indexOf('@media')));
  const dark = vars(css.slice(css.indexOf(":root[data-theme='dark']")));
  const kebab = (s: string) => s.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
  for (const [role, color] of Object.entries(themes.light)) {
    expect([role, light[kebab(role)]]).toEqual([role, color]);
  }
  for (const [role, color] of Object.entries(themes.dark)) {
    expect([role, dark[kebab(role)]]).toEqual([role, color]);
  }
});

it('режим раскладки по ширине окна', () => {
  expect(layoutModeFor(500)).toBe('compact');
  expect(layoutModeFor(720)).toBe('regular');
  expect(layoutModeFor(1400)).toBe('wide');
});
