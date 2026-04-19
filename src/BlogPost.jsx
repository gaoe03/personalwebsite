import { useParams, Link } from 'react-router-dom';
import posts from './posts/index.js';

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

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
    ? `Updated ${post.updatedDate || post.date}`
    : post.date;

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
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
        @media (max-width: 600px) {
          .post-content .intro-image { float: none; display: block; margin: 0 auto 20px; width: 55%; max-width: 180px; }
        }
      `}</style>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '72px 28px 120px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '14px', marginBottom: '40px' }}>
          <Link to="/" style={{ color: '#999', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
          >home</Link>
          <span style={{ color: '#ddd' }}>/</span>
          <Link to="/blog" style={{ color: '#999', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
          >blog</Link>
          <span style={{ color: '#ddd' }}>/</span>
          <span style={{ color: '#555' }}>{post.slug}</span>
        </div>

        {/* Post */}
        <article>
          <p style={{
            color: '#aaa',
            fontSize: '11.5px',
            fontWeight: 500,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            {post.type} · {post.category}
            {post.status === 'growing' && (
              <span style={{ marginLeft: '8px', color: '#bbb', letterSpacing: '0.3px', textTransform: 'none', fontSize: '12px', fontStyle: 'italic' }}>growing</span>
            )}
          </p>
          <h1 style={{ fontSize: '24px', fontWeight: 500, color: '#222', marginBottom: '8px', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
            {post.title}
          </h1>
          <p style={{ color: '#bbb', fontSize: '13px', marginBottom: '40px' }}>{dateLabel}</p>
          <div className="post-content" style={{ fontSize: '16px', lineHeight: 1.85, color: '#444' }}>
            <Content />
          </div>
        </article>
      </div>
    </div>
  );
}
