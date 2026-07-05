import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Dev-only: serve the static project pages at their clean /projects/<name>/ URL.
// (In production Vercel serves the folders before the SPA rewrite; the Vite dev
// server otherwise falls through to the React app, which has no route for them.)
const serveStaticSubpaths = {
    name: 'serve-static-subpaths',
    configureServer(server) {
        server.middlewares.use((req, _res, next) => {
            const m = req.url.match(/^\/projects\/([^/.?]+)\/?$/)
            if (m) {
                req.url = `/projects/${m[1]}/index.html`
            }
            next()
        })
    },
}

export default defineConfig({
    plugins: [
        serveStaticSubpaths,
        tailwindcss(),
        { enforce: 'pre', ...mdx() },
        react({ include: /\.(jsx?|mdx)$/ }),
    ],
})
