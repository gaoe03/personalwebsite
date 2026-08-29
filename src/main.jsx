import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, StaticRouter } from 'react-router'
import { Analytics } from '@vercel/analytics/react'
import Blog from './Blog.jsx'
import BlogPost from './BlogPost.jsx'
import Lab from './lab/Lab.jsx'
import LabProjectPage from './lab/LabProjectPage.jsx'
import NotFound from './NotFound.jsx'
import './index.css'

export const AppRoutes = () => (
    <>
        <Routes>
            <Route path="/" element={<Lab />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/projects/:projectId" element={<LabProjectPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
    </>
)

export const App = ({ location }) => {
    const Router = location ? StaticRouter : BrowserRouter
    const routerProps = location ? { location } : undefined

    return (
        <StrictMode>
            <Router {...routerProps}>
                <AppRoutes />
            </Router>
        </StrictMode>
    )
}

if (typeof document !== 'undefined') {
    hydrateRoot(document.getElementById('root'), <App />)
}
