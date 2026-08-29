import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const siteUrl = 'https://ethangao.xyz'

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const withHead = (html, head) => {
  const title = escapeHtml(head.title)
  const description = escapeHtml(head.description)
  const robots = escapeHtml(head.robots || 'index, follow')
  const canonical = escapeHtml(new URL(head.path, siteUrl).href)
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(" \/>)/, `$1${robots}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(" \/>)/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(" \/>)/, `$1${escapeHtml(head.type || 'website')}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(" \/>)/, `$1${canonical}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(" \/>)/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(" \/>)/, `$1${description}$2`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
}

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  const { prerenderHead, prerenderRoutes, render } = await vite.ssrLoadModule('/src/entry-server.jsx')

  for (const route of [...prerenderRoutes, '/404']) {
    const html = withHead(
      template.replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`),
      prerenderHead(route),
    )
    const outputPath = route === '/'
      ? path.join(dist, 'index.html')
      : route === '/404'
        ? path.join(dist, '404.html')
        : path.join(dist, route.slice(1), 'index.html')

    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html)
  }
} finally {
  await vite.close()
}
