import { useParams, Link } from 'react-router-dom';
import posts from './posts/index.js';
import usePageTitle from './usePageTitle.js';
import BlogNav from './BlogNav.jsx';
import { formatDate } from './Blog.jsx';

const serif = "'Libre Baskerville', serif";

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  usePageTitle(post ? post.title : 'Blog');

  if (!post) {
    return (
      <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '12px' }}>Post not found.</p>
          <Link to="/blog" style={{ color: '#666', fontSize: '13px' }}>Back to blog</Link>
        </div>
      </div>
    );
  }

  const Content = post.Component;
  const dateLabel = post.status === 'growing'
    ? `Updated ${formatDate(post.updatedDate || post.date)}`
    : formatDate(post.date);

  return (
    <div style={{ backgroundColor: '#fbfcfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <BlogNav />
      <style>{`
        .post-content p { margin: 0 0 1.4em; }
        .post-content p:last-child { margin-bottom: 0; }
        .post-content h2 { font-size: 17px; font-weight: 600; color: #222; margin: 2em 0 0.6em; }
        .post-content h3 { font-size: 15px; font-weight: 600; color: #222; margin: 1.6em 0 0.5em; }
        .post-content a { color: #333; text-decoration: underline; text-underline-offset: 2px; text-decoration-color: #ccc; }
        .post-content a:hover { text-decoration-color: #333; }
        .post-content ul, .post-content ol { margin: 0 0 1.4em; padding-left: 1.4em; }
        .post-content li { margin-bottom: 0.4em; }
        .post-content code { background: #f5f5f5; padding: 1px 5px; border-radius: 3px; font-size: 0.9em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        .post-content blockquote { border-left: 2px solid #eee; padding-left: 14px; color: #666; margin: 0 0 1.4em; }
        .post-content .intro-image { float: right; width: 180px; margin: 4px 0 12px 24px; border-radius: 10px; border: 1px solid #eee; padding: 8px 8px 6px; background: #fff; }
        .post-content .intro-image img { width: 100%; display: block; border-radius: 4px; }
        .post-content .intro-image figcaption { text-align: center; font-size: 11px; color: #999; margin-top: 6px; font-style: italic; }
        .post-content .feature-image { margin: 0 0 1.8em; }
        .post-content .feature-image img { width: 100%; display: block; border-radius: 8px; }
        .post-content .feature-image figcaption { text-align: center; font-size: 12px; color: #999; margin-top: 8px; font-style: italic; }
        @media (max-width: 600px) {
          .post-content .intro-image { float: none; display: block; margin: 0 auto 20px; width: 55%; max-width: 180px; }
          .post-content .feature-image { margin-bottom: 1.5em; }
        }
      `}</style>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '120px 28px 100px' }}>

        {/* Post */}
        <article>
          <h1 style={{ fontFamily: serif, fontSize: '26px', fontWeight: 400, color: '#232323', lineHeight: 1.3, marginBottom: '8px' }}>
            {post.title}
          </h1>
          <p style={{ color: '#bbb', fontSize: '13px', marginBottom: '40px' }}>{dateLabel}</p>
          <div className="post-content" style={{ fontSize: '16px', lineHeight: 1.85, color: '#444' }}>
            <Content />
          </div>
        </article>

        {/* Back link */}
        <div style={{ marginTop: '56px', paddingTop: '24px', borderTop: '1px solid #ececea' }}>
          <Link to="/blog" style={{ color: '#999', fontSize: '14px', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#3d6b4a'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
          >&larr; back to blog</Link>
        </div>
      </div>
    </div>
  );
}
