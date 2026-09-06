'use client';

import PageLayout from '@/components/shared/PageLayout';

const articles = [
  {
    date: 'Aug 28, 2026',
    category: 'Product Launch',
    title: 'Introducing the Nike Air Max Pulse — Available Now',
    excerpt: 'The Air Max Pulse brings visible Air technology to a new generation. Inspired by the London music scene, it delivers energy and style in every step.',
    featured: true,
  },
  {
    date: 'Aug 20, 2026',
    category: 'Collection',
    title: 'Back to School: The Best Kids\' Sneakers for 2026',
    excerpt: 'From the court to the classroom, check out our top picks for the new school year. Durable, stylish, and ready for anything.',
    featured: false,
  },
  {
    date: 'Aug 15, 2026',
    category: 'Sustainability',
    title: 'Our Journey to Zero Waste: Mid-Year Update',
    excerpt: 'We\'re on track to reduce packaging waste by 50%. Here\'s a look at what we\'ve accomplished so far and what\'s next.',
    featured: false,
  },
  {
    date: 'Aug 10, 2026',
    category: 'Community',
    title: 'Vére x Local Artists: Sneaker Customization Event',
    excerpt: 'We partnered with local artists for an exclusive sneaker customization workshop. See the amazing one-of-a-kind designs that were created.',
    featured: false,
  },
  {
    date: 'Aug 5, 2026',
    category: 'Product Launch',
    title: 'Jordan 6 Rings — Now Available in New Colorways',
    excerpt: 'The iconic Jordan 6 Rings returns with fresh colorways. Six championship rings, one bold silhouette.',
    featured: false,
  },
  {
    date: 'Jul 28, 2026',
    category: 'Style Guide',
    title: 'Summer to Fall: How to Transition Your Sneaker Rotation',
    excerpt: 'The seasons are changing, but your sneaker game doesn\'t have to. Our guide to keeping it fresh from August to October.',
    featured: false,
  },
];

const categoryColors = {
  'Product Launch': 'var(--accent-lime)',
  'Collection': '#FFD700',
  'Sustainability': '#22c55e',
  'Community': '#818cf8',
  'Style Guide': '#f472b6',
};

export default function NewsPage() {
  return (
    <PageLayout title="News & Stories" breadcrumb="News">
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        The latest from Vére — product drops, stories, and everything happening in our world.
      </p>

      {/* Featured Article */}
      {articles.filter(a => a.featured).map((article) => (
        <div key={article.title} className="p-6 rounded-2xl mb-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
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

      {/* Other Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {articles.filter(a => !a.featured).map((article, idx) => (
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
    </PageLayout>
  );
}
