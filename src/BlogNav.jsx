import { Link } from 'react-router-dom';

const pill = {
  backgroundColor: 'rgba(250,249,246,0.85)',
  border: '1px solid rgba(139,115,85,0.15)',
  backdropFilter: 'blur(8px)',
};

export default function BlogNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-10 py-4">
      <Link to="/" className="px-3 md:px-4 py-2 rounded-full flex items-center gap-2" style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '1.2rem', color: '#2d2d2d', textDecoration: 'none', ...pill }}>
        <img src="/favicon.png" alt="Whale" style={{ width: '24px', height: '24px' }} />
        <span className="hidden sm:inline">Ethan Gao</span>
      </Link>
      <div className="flex items-center gap-1 md:gap-3 px-3 md:px-4 py-2 rounded-full" style={pill}>
        <Link to="/" className="text-xs md:text-sm font-medium transition-all duration-200 px-2 md:px-3 py-1 hover:scale-110" style={{ color: '#555', textDecoration: 'none' }}>Home</Link>
        <Link to="/blog" className="text-xs md:text-sm font-medium transition-all duration-200 px-2 md:px-3 py-1 hover:scale-110" style={{ color: '#555', textDecoration: 'none' }}>Blog</Link>
      </div>
    </nav>
  );
}
