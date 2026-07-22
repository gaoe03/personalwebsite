import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Blog from './Blog.jsx'
import BlogPost from './BlogPost.jsx'
import Lab from './lab/Lab.jsx'
import LabProjectPage from './lab/LabProjectPage.jsx'
import NotFound from './NotFound.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Lab />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/projects/:projectId" element={<LabProjectPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Analytics />
        </BrowserRouter>
    </StrictMode>,
)
