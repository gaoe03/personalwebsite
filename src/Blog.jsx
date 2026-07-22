import { useRef } from 'react';
import { Link } from 'react-router-dom';
import posts from './posts/index.js';
import usePageTitle from './usePageTitle.js';
import BlogNav from './BlogNav.jsx';
import { useWobbleLoop } from './portfolioVisuals.jsx';
import { BlogWobbleDefs, Cover } from './blogArt.jsx';
import { useLabAccent } from './lab/accentTheme.js';
import { CustomCursor } from './lab/SiteChrome.jsx';
import './blog.css';

export const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Kicker = ({ category }) => category ? (
  <p className="blog-kicker">{category.toLowerCase()}</p>
) : null;

const MetaLine = ({ post }) => (
  <p className="blog-date">{formatDate(post.date)}</p>
);

export default function Blog() {
  usePageTitle('Writing, Ethan Gao', {
    description: "Thoughts and things I'm learning.",
    path: '/blog',
  });
  const rootRef = useRef(null);
  useLabAccent();
  useWobbleLoop(rootRef);
  const visible = posts.filter((p) => p.status !== 'draft');
  const [feature, ...rest] = visible;

  return (
    <div ref={rootRef} className="lab-page blog-page">
      <BlogWobbleDefs />
      <CustomCursor />
      <BlogNav />

      <main className="blog-shell">

        {/* Masthead */}
        <header className="blog-masthead">
          <div>
            <h1>Writing</h1>
            <p>Thoughts and things I'm learning.</p>
          </div>
          <p>{visible.length} posts</p>
        </header>

        {visible.length === 0 ? (
          <div className="blog-empty">
            Nothing here yet.
          </div>
        ) : (
          <>
            {/* Feature: newest post */}
            <Link to={`/blog/${feature.slug}`} className="blog-post-link blog-feature">
              <div className="blog-feature-layout">
                <div className="blog-feature-copy">
                  <Kicker category={feature.category} />
                  <h2 className="blog-post-title">{feature.title}</h2>
                  {feature.excerpt && <p className="blog-excerpt">{feature.excerpt}</p>}
                  <MetaLine post={feature} />
                </div>
                <div className="blog-feature-image">
                  <Cover slug={feature.slug} aspect="16 / 10" />
                </div>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-post-link blog-grid-card">
                    <Cover slug={post.slug} aspect="16 / 9" />
                    <div className="blog-grid-copy">
                      <Kicker category={post.category} />
                      <h3 className="blog-post-title">{post.title}</h3>
                      {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
                      <MetaLine post={post} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
