import { Link } from 'react-router-dom';
import posts from './posts/index.js';

const PostCard = ({ post }) => {
  const dateLabel = post.status === 'growing'
    ? `Updated ${post.updatedDate || post.date}`
    : post.date;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="post-card"
      style={{
        display: 'block',
        textDecoration: 'none',
        padding: '14px 22px',
        border: '1px solid #e3e5e2',
        borderRadius: '10px',
        marginBottom: '12px',
        background: '#fff',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
    >
      <h3 className="post-title" style={{
        fontFamily: "'Libre Baskerville', serif",
        fontSize: '19px',
        color: '#232323',
        fontWeight: 400,
        lineHeight: 1.35,
        marginBottom: '10px',
        transition: 'color 0.15s',
      }}>
        {post.title}
      </h3>
      <p style={{ color: '#aaa', fontSize: '14px' }}>{dateLabel}</p>
    </Link>
  );
};

export default function Blog() {
  const visible = posts.filter((p) => p.status !== 'draft');

  return (
    <div style={{ backgroundColor: '#fbfcfb', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <style>{`
        .post-card:hover { border-color: rgba(74,124,89,0.45) !important; }
        .post-card:hover .post-title { color: #3d6b4a; }
      `}</style>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '72px 28px 120px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '14px', marginBottom: '40px' }}>
          <Link to="/" style={{ color: '#999', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#555'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
          >home</Link>
          <span style={{ color: '#ddd' }}>/</span>
          <span style={{ color: '#555' }}>blog</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '32px', color: '#232323', fontWeight: 400, marginBottom: '6px' }}>
            Blog
          </h1>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.5 }}>
            Thoughts and things I'm learning.
          </p>
        </div>

        {/* Posts */}
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999', fontSize: '13px' }}>
            Nothing here yet.
          </div>
        ) : (
          <div>
            {visible.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        )}

      </div>
    </div>
  );
}
