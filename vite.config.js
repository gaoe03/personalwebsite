import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

// https://vite.dev/config/
// Dev-only: serve the static archive at the clean /projects/erewhon/ URL.
// (In production Vercel serves the folder before the SPA rewrite; the Vite dev
// server otherwise falls through to the React app, which has no route for it.)
const serveStaticSubpaths = {
    name: 'serve-static-subpaths',
    configureServer(server) {
        server.middlewares.use((req, _res, next) => {
            if (req.url === '/projects/erewhon' || req.url === '/projects/erewhon/') {
                req.url = '/projects/erewhon/index.html'
            }
            next()
        })
    },
}

export default defineConfig({
    plugins: [
        serveStaticSubpaths,
        { enforce: 'pre', ...mdx() },
        react({ include: /\.(jsx?|mdx)$/ }),
    ],
})
