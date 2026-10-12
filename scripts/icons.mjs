// Генерирует набор иконок kit из Gravity UI (@gravity-ui/icons, MIT):
//   src/web/icons.ts        — компоненты Icons.<Имя> веб-слоя (size, className — как IconComponent)
//   src/web/icon-catalog.ts — список иконок с категориями и ключевыми словами для поиска
// Запуск: yarn icons — после обновления @gravity-ui/icons в package.json

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { version } = require('@gravity-ui/icons/package.json');
const { icons } = require('@gravity-ui/icons/metadata.json');

const sorted = [...icons].sort((a, b) =>
  a.componentName < b.componentName ? -1 : 1,
);

const header = `// Файл генерирует scripts/icons.mjs (yarn icons) — не редактировать вручную.
// Иконки Gravity UI ${version} (@gravity-ui/icons, MIT, © YANDEX LLC)`;

// Каждая иконка — отдельный экспорт с пометкой PURE: сборщик (Vite, Rollup) оставит в бандле
// только те, к которым обращается код (Icons.Gear), а не все ${icons.length}
const components = `${header}

import * as G from '@gravity-ui/icons';
import { glyph } from './glyph';

${sorted
  .map(i => `export const ${i.componentName} = /*#__PURE__*/ glyph(G.${i.componentName});`)
  .join('\n')}
`;

const catalog = `${header}

import type { IconInfo } from './glyph';

/** Все иконки набора: имя (Icons.<имя>), категории и ключевые слова Gravity UI для поиска */
export const ICON_CATALOG: readonly IconInfo[] = [
${sorted
  .map(
    i =>
      `  { name: '${i.componentName}', categories: ${JSON.stringify(
        i.categories,
      ).replace(/"/g, "'")}, keywords: ${JSON.stringify(i.keywords).replace(
        /"/g,
        "'",
      )} },`,
  )
  .join('\n')}
];
`;

const write = (file, content) =>
  fs.writeFileSync(path.join(ROOT, file), content, 'utf8');

write('src/web/icons.ts', components);
write('src/web/icon-catalog.ts', catalog);
console.log(`Иконок Gravity UI ${version}: ${icons.length}`);
