import { Link } from 'react-router-dom';
import usePageTitle from './usePageTitle.js';
import { CustomCursor, SiteNav } from './lab/SiteChrome.jsx';
import { useLabAccent } from './lab/accentTheme.js';
import './lab/lab.css';

export default function NotFound() {
  useLabAccent();
  usePageTitle('Page not found', {
    description: 'The requested page could not be found.',
    path: window.location.pathname,
    robots: 'noindex, follow',
  });

  return (
    <div className="lab-page">
      <CustomCursor />
      <SiteNav />
      <main className="lab-project-missing">
        <div>
          <h1>Page not found</h1>
          <Link to="/">Back home</Link>
        </div>
      </main>
    </div>
  );
}
