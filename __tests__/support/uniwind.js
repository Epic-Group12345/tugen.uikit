// Заглушка Uniwind для тестов в jsdom: классы Tailwind здесь не компилируются. Радиусы
// rounded-* переводим в числа (их читают слои стекла), остальное — пусто
const RADIUS = { 'rounded-md': 6, 'rounded-lg': 8, 'rounded-xl': 12, 'rounded-2xl': 16, 'rounded-full': 99999 };

const useResolveClassNames = (className = '') => {
  const borderRadius = className.split(/\s+/).map(name => RADIUS[name]).find(v => v !== undefined);
  return borderRadius === undefined ? {} : { borderRadius };
};

// Обёртка компонента классами Uniwind: в тестах стилей нет, компонент возвращается как есть
const withUniwind = (Component) => Component;

module.exports = { useResolveClassNames, withUniwind };
