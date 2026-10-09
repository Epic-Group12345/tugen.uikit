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

it('режим раскладки по ширине окна', () => {
  expect(layoutModeFor(500)).toBe('compact');
  expect(layoutModeFor(720)).toBe('regular');
  expect(layoutModeFor(1400)).toBe('wide');
});
