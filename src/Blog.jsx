import { useRef } from 'react';
import { Link } from 'react-router-dom';
import posts from './posts/index.js';
import usePageTitle from './usePageTitle.js';
import BlogNav from './BlogNav.jsx';
import { useWobbleLoop } from './App.jsx';
import { BlogWobbleDefs, SoftFrame, Cover } from './blogArt.jsx';

const serif = "'Libre Baskerville', serif";

export const formatDate = (iso) => {
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Kicker = ({ category }) => category ? (
  <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '14px', color: '#75806f', margin: '0 0 8px' }}>
    {category.toLowerCase()}
  </p>
) : null;

const MetaLine = ({ post }) => (
  <p style={{ color: '#9a9d97', fontSize: '13px', margin: '10px 0 0' }}>
    {formatDate(post.date)}
  </p>
);

export default function Blog() {
  usePageTitle('Blog');
  const rootRef = useRef(null);
  useWobbleLoop(rootRef);
  const visible = posts.filter((p) => p.status !== 'draft');
  const [feature, ...rest] = visible;

  return (
    <div ref={rootRef} style={{ backgroundColor: '#fbfcfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <BlogWobbleDefs />
      <BlogNav />
      <style>{`
        .post-link { display: block; text-decoration: none; position: relative; background: #fff; border-radius: 14px; }
        .post-link .post-title { transition: color 0.15s; }
        .post-link:hover .post-title { color: #3d6b4a; }
        .post-link > .soft-frame rect { transition: stroke 0.15s; }
        .post-link:hover > .soft-frame rect { stroke: rgba(74,124,89,0.5); }
        .feat { display: flex; gap: 32px; align-items: center; }
        .feat-text { flex: 1; min-width: 0; }
        .feat-img { width: 46%; flex-shrink: 0; }
        .blog-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
        @media (max-width: 700px) {
          .feat { flex-direction: column-reverse; gap: 18px; align-items: stretch; }
          .feat-img { width: 100%; }
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '116px 28px 120px' }}>

        {/* Masthead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
          <div>
            <h1 style={{ fontFamily: serif, fontSize: '30px', color: '#232323', fontWeight: 400, marginBottom: '4px' }}>
              Blog
            </h1>
            <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.5 }}>
              Thoughts and things I'm learning.
            </p>
          </div>
          <p style={{ color: '#9a9d97', fontSize: '13px' }}>{visible.length} posts</p>
        </div>
        <div style={{ height: '2px', background: '#232323', marginBottom: '32px' }} />

        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '13px' }}>
            Nothing here yet.
          </div>
        ) : (
          <>
            {/* Feature: newest post */}
            <Link to={`/blog/${feature.slug}`} className="post-link" style={{ padding: '22px 26px' }}>
              <SoftFrame radius={13} />
              <div className="feat">
                <div className="feat-text">
                  <Kicker category={feature.category} />
                  <h2 className="post-title" style={{ fontFamily: serif, fontSize: '29px', color: '#232323', fontWeight: 400, lineHeight: 1.28, margin: '0 0 12px' }}>
                    {feature.title}
                  </h2>
                  {feature.excerpt && (
                    <p style={{ color: '#565a53', fontSize: '15.5px', lineHeight: 1.6, margin: 0 }}>{feature.excerpt}</p>
                  )}
                  <MetaLine post={feature} />
                </div>
                <div className="feat-img">
                  <Cover slug={feature.slug} aspect="16 / 10" />
                </div>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="blog-grid" style={{ marginTop: '26px' }}>
                {rest.map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="post-link" style={{ padding: '18px 20px 22px' }}>
                    <SoftFrame radius={13} />
                    <Cover slug={post.slug} aspect="16 / 9" />
                    <div style={{ padding: '16px 4px 0' }}>
                      <Kicker category={post.category} />
                      <h3 className="post-title" style={{ fontFamily: serif, fontSize: '21px', color: '#232323', fontWeight: 400, lineHeight: 1.3, margin: '0 0 8px' }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{ color: '#565a53', fontSize: '14.5px', lineHeight: 1.55, margin: 0 }}>{post.excerpt}</p>
                      )}
                      <MetaLine post={post} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
