import { useParams, Link } from 'react-router-dom';
import posts from './posts/index.js';
import usePageTitle from './usePageTitle.js';
import BlogNav from './BlogNav.jsx';
import { formatDate } from './Blog.jsx';
import { useLabAccent } from './lab/accentTheme.js';
import { CustomCursor } from './lab/SiteChrome.jsx';
import './blog.css';

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);
  useLabAccent();
  usePageTitle(post ? `${post.title}, Ethan Gao` : 'Post not found', {
    description: post?.excerpt || 'The requested post could not be found.',
    path: `/blog/${slug}`,
    robots: post ? 'index, follow' : 'noindex, follow',
    type: 'article',
  });

  if (!post) {
    return (
      <div className="lab-page blog-page">
        <CustomCursor />
        <BlogNav />
        <main className="blog-missing">
          <h1>Post not found</h1>
          <Link to="/blog">Back to writing</Link>
        </main>
      </div>
    );
  }

  const Content = post.Component;
  const dateLabel = post.status === 'growing'
    ? `Updated ${formatDate(post.updatedDate || post.date)}`
    : formatDate(post.date);

  return (
    <div className="lab-page blog-page">
      <CustomCursor />
      <BlogNav />
      <main className="blog-article-shell">

        {/* Post */}
        <article>
          <h1>{post.title}</h1>
          <p className="blog-article-date">{dateLabel}</p>
          <div className="post-content">
            <Content />
          </div>
        </article>

        {/* Back link */}
        <div className="blog-back">
          <Link to="/blog">← Back to writing</Link>
        </div>
      </main>
    </div>
  );
}
