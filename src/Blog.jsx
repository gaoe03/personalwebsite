import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import posts from './posts/index.js';

const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      fontSize: '13px',
      padding: '6px 14px',
      borderRadius: '16px',
      background: active ? '#222' : '#fff',
      color: active ? '#fff' : '#666',
      border: `1px solid ${active ? '#222' : '#eee'}`,
      fontWeight: active ? 500 : 400,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit',
    }}
  >
    {label}
  </button>
);

const PostCard = ({ post }) => {
  const Preview = post.previewComponent;
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
        border: '1px solid #eee',
        borderRadius: '10px',
        marginBottom: '12px',
        background: '#fff',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="post-title" style={{
            fontSize: '20px',
            color: '#222',
            fontWeight: 500,
            lineHeight: 1.35,
            marginBottom: '10px',
            transition: 'color 0.15s',
          }}>
            {post.title}
          </h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>{dateLabel}</p>
        </div>
        {Preview && (
          <div style={{
            flex: '0 0 auto',
            width: '90px',
            height: '68px',
            background: '#fafafa',
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
          }}>
            <Preview />
          </div>
        )}
      </div>
    </Link>
  );
};

export default function Blog() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(posts.filter((p) => p.status !== 'draft').map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const visible = posts.filter((p) => {
    if (p.status === 'draft') return false;
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#333' }}>
      <style>{`
        .post-card:hover { border-color: #ccc !important; }
        .post-card:hover .post-title { color: #000; }
        .filter-row::-webkit-scrollbar { display: none; }
        .filter-row { scrollbar-width: none; }
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
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', color: '#222', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: '6px' }}>
            Blog
          </h1>
          <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.5 }}>
            Thoughts and things I'm learning.
          </p>
        </div>

        {/* Filter row */}
        <div className="filter-row" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '20px', alignItems: 'center' }}>
          <FilterChip
            label="Thoughts"
            active={typeFilter === 'thoughts'}
            onClick={() => setTypeFilter(typeFilter === 'thoughts' ? 'all' : 'thoughts')}
          />
          <FilterChip
            label="Learning"
            active={typeFilter === 'learning'}
            onClick={() => setTypeFilter(typeFilter === 'learning' ? 'all' : 'learning')}
          />
          {categories.length > 0 && (
            <div style={{ width: '1px', height: '16px', background: '#e5e5e5', margin: '0 6px', flexShrink: 0 }} />
          )}
          {categories.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={categoryFilter === c}
              onClick={() => setCategoryFilter(categoryFilter === c ? 'all' : c)}
            />
          ))}
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
