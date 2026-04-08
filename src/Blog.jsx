import { Link } from 'react-router-dom';
import posts from './posts.js';

export default function Blog() {
  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', marginBottom: '24px' }}>
            <Link to="/" style={{ color: '#999', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#555'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
            >home</Link>
            <span style={{ color: '#ddd' }}>/</span>
            <span style={{ color: '#555' }}>blog</span>
          </div>
          <h1 style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>Blog</h1>
        </div>

        {/* Posts */}
        <div>
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid #eee', gap: '24px' }}
              onMouseEnter={(e) => e.currentTarget.querySelector('span').style.color = '#333'}
              onMouseLeave={(e) => e.currentTarget.querySelector('span').style.color = '#666'}
            >
              <span style={{ color: '#666', fontSize: '14px', transition: 'color 0.15s' }}>{post.title}</span>
              <span style={{ color: '#bbb', fontSize: '13px', flexShrink: 0 }}>{post.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
