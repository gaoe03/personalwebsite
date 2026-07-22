import { useEffect } from 'react';

const SITE_URL = 'https://ethangao.xyz';

const setMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

export default function usePageTitle(title, {
  description = 'Portfolio of Ethan Gao, a Deloitte Digital analyst and software builder.',
  path = '/',
  robots = 'index, follow',
  type = 'website',
} = {}) {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = new URL(path, SITE_URL).href;
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
  }, [description, path, robots, title, type]);
}
