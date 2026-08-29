import { renderToString } from 'react-dom/server'
import { App } from './main.jsx'
import posts from './posts/index.js'
import { projectDetails } from './lab/projectDetails.js'
import { projects } from './portfolioVisuals.jsx'

export const render = (url) => renderToString(<App location={url} />)

export const prerenderRoutes = [
  '/',
  '/blog',
  ...posts.filter((post) => post.status !== 'draft').map((post) => `/blog/${post.slug}`),
  ...Object.entries(projectDetails)
    .filter(([, detail]) => detail.hasPage)
    .map(([projectId]) => `/projects/${projectId}`),
]

export const prerenderHead = (route) => {
  if (route === '/') {
    return {
      title: 'Ethan Gao',
      description: 'Portfolio of Ethan Gao, a Deloitte Digital analyst and software builder working across iOS, data pipelines, web tools, and automation.',
      path: '/',
      type: 'website',
    }
  }

  if (route === '/blog') {
    return { title: 'Writing, Ethan Gao', description: "Thoughts and things I'm learning.", path: route, type: 'website' }
  }

  const post = route.startsWith('/blog/')
    ? posts.find((item) => `/blog/${item.slug}` === route)
    : null
  if (post) {
    return {
      title: `${post.title}, Ethan Gao`,
      description: post.excerpt || 'Thoughts and things I\'m learning.',
      path: route,
      type: 'article',
    }
  }

  const projectId = route.startsWith('/projects/') ? route.slice('/projects/'.length) : null
  const project = projectId && projects.find((item) => item.id === projectId)
  const detail = projectId && projectDetails[projectId]
  if (project && detail?.hasPage) {
    return { title: `${project.title}, Ethan Gao`, description: project.desc, path: route, type: 'article' }
  }

  return {
    title: 'Page not found',
    description: 'The requested page could not be found.',
    path: route,
    robots: 'noindex, follow',
    type: 'website',
  }
}
