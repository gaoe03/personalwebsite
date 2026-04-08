import { useParams, Link } from 'react-router-dom';
import posts from './posts.js';

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '14px', marginBottom: '12px' }}>Post not found.</p>
          <Link to="/blog" style={{ color: '#666', fontSize: '13px' }}>Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', marginBottom: '32px' }}>
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
          <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#333', marginBottom: '6px', lineHeight: 1.4 }}>
            {post.title}
          </h1>
          <p style={{ color: '#bbb', fontSize: '13px', marginBottom: '36px' }}>{post.date}</p>
          <div style={{ fontSize: '15px', lineHeight: 1.9, color: '#444', whiteSpace: 'pre-line' }}>
            {post.content}
          </div>
        </article>
      </div>
    </div>
  );
}
