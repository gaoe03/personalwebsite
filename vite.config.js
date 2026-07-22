import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'

// Skip query imports (e.g. rice.mdx?raw for word counts) so they stay raw text
// instead of being compiled to components.
const mdxPlugin = mdx()
const mdxSkippingQueries = {
    ...mdxPlugin,
    transform(code, id) {
        if (id.includes('?')) return null
        return mdxPlugin.transform.call(this, code, id)
    },
}

export default defineConfig({
    plugins: [
        tailwindcss(),
        { enforce: 'pre', ...mdxSkippingQueries },
        react({ include: /\.(jsx?|mdx)$/ }),
    ],
})
