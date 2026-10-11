import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig, type PropItem } from 'react-docgen-typescript';
import type { Plugin } from 'vite';

// Таблицы свойств документации собираются из типов kit (react-docgen-typescript), а не пишутся руками:
// описание свойства — его JSDoc в исходниках. Отдаются модулем virtual:uikit-props — по библиотеке на платформу

const ID = 'virtual:uikit-props';
const root = fileURLToPath(new URL('..', import.meta.url));

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

export interface ComponentProps {
  description: string;
  props: PropDoc[];
}

export type PropsLibrary = Record<string, ComponentProps>;

// Свойства из DOM, React и примитивов не показываем: их сотни, а описаны они у себя
const own = (prop: PropItem) =>
  !prop.declarations?.length
    ? !prop.parent?.fileName.includes('node_modules')
    : prop.declarations.some(d => !d.fileName.includes('node_modules'));

const typeOf = (prop: PropItem) => {
  const { type } = prop;
  if (type.name === 'enum' && Array.isArray(type.value)) {
    const values = (type.value as { value: string }[]).map(v => v.value);
    // Длинный перечень (все тона, все шаги шкалы) короче показать именем типа
    return values.length > 8 && type.raw ? type.raw : values.join(' | ');
  }
  return type.name;
};

const parse = (dir: string): PropsLibrary => {
  const parser = withCustomConfig(`${root}/tsconfig.json`, {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: own,
  });
  const files = readdirSync(`${root}/${dir}`)
    .filter(f => f.endsWith('.tsx'))
    .map(f => `${root}/${dir}/${f}`);
  const library: PropsLibrary = {};
  for (const doc of parser.parse(files)) {
    // Константы и хуки docgen тоже отдаёт — без свойств и описания они не нужны
    if (!/^[A-Z][a-z]/.test(doc.displayName)) continue;
    library[doc.displayName] = {
      description: doc.description,
      props: Object.values(doc.props)
        .map(prop => ({
          name: prop.name,
          type: typeOf(prop),
          default: prop.defaultValue?.value?.toString(),
          required: prop.required,
          description: prop.description,
        }))
        .sort((a, b) => Number(b.required) - Number(a.required)),
    };
  }
  return library;
};

export const propsPlugin = (): Plugin => {
  let code: string | undefined;
  return {
    name: 'uikit-props',
    resolveId: id => (id === ID ? `\0${ID}` : undefined),
    load(id) {
      if (id !== `\0${ID}`) return;
      code ??= `export const web = ${JSON.stringify(parse('src/web'))};
export const native = ${JSON.stringify(parse('src/components'))};`;
      return code;
    },
    // Правка компонента kit — новые таблицы без перезапуска
    handleHotUpdate({ file, server }) {
      if (!file.startsWith(`${root}/src/`) || !file.endsWith('.tsx')) return;
      code = undefined;
      const mod = server.moduleGraph.getModuleById(`\0${ID}`);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
};
