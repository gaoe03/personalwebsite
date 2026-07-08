const modules = import.meta.glob('./*.mdx', { eager: true });
const raws = import.meta.glob('./*.mdx', { query: '?raw', import: 'default', eager: true });

const readMinutes = (raw) => {
  const words = (raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

const posts = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace(/^\.\//, '').replace(/\.mdx$/, ''),
    Component: mod.default,
    minutes: readMinutes(raws[path]),
    ...mod.meta,
  }))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

export default posts;
