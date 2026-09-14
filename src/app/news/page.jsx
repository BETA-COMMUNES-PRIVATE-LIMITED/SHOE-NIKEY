'use client';

import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

const categoryColors = {
  'Product Launch': 'var(--accent-lime)',
  'Collection': '#FFD700',
  'Sustainability': '#22c55e',
  'Community': '#818cf8',
  'Style Guide': '#f472b6',
};

export default function NewsPage() {
  const { pageContent, getPageData } = useAdmin();
  const content = pageContent?.news;
  const data = getPageData('news');
  const articles = data.articles || [];

  return (
    <PageLayout title="News & Stories" breadcrumb="News">
      {(content?.intro || content?.sections?.length > 0) && (
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {content.intro || 'The latest from Vére — product drops, stories, and everything happening in our world.'}
        </p>
      )}

      {/* Featured Article — admin-managed */}
      {articles.filter((a) => a.featured).map((article, i) => (
        <div key={i} className="p-6 rounded-2xl mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(166, 255, 0, 0.15)', color: 'var(--accent-lime)' }}>
              Featured
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: categoryColors[article.category] || 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              {article.category}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{article.date}</span>
          </div>
          <h2 className="text-lg font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>{article.title}</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{article.excerpt}</p>
          <button className="text-xs font-bold flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ color: 'var(--accent-lime)' }}>
            Read More
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ))}

      {/* Other Articles — admin-managed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {articles.filter((a) => !a.featured).map((article, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl flex flex-col"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: categoryColors[article.category] || 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                {article.category}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{article.date}</span>
            </div>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{article.title}</h3>
            <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>{article.excerpt}</p>
            <button className="mt-4 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:gap-2.5" style={{ color: 'var(--accent-lime)' }}>
              Read More
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Stay in the Loop</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Subscribe to get the latest news and exclusive drops delivered to your inbox.</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-11 px-4 rounded-full text-xs outline-none"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          />
          <button className="h-11 px-5 rounded-full text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
            Subscribe
          </button>
        </div>
      </div>

      {/* Admin-managed sections */}
      {content?.sections?.length > 0 && (
        <div className="flex flex-col gap-6 mt-10">
          {content.sections.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-sm font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-primary)' }}>{s.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
