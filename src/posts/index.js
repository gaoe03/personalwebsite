const modules = import.meta.glob('./*.mdx', { eager: true });

const posts = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.replace(/^\.\//, '').replace(/\.mdx$/, ''),
    Component: mod.default,
    ...mod.meta,
  }))
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

export default posts;
