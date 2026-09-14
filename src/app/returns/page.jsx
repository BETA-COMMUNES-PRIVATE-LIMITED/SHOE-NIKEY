'use client';

import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

export default function ReturnsPage() {
  const { pageContent, getPageData } = useAdmin();
  const content = pageContent?.returns;
  const data = getPageData('returns');

  return (
    <PageLayout title="Returns & Exchanges" breadcrumb="Returns">
      {(content?.intro || content?.sections?.length > 0) && (
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {content.intro || 'Not 100% satisfied? No worries — returns are easy and free within 30 days.'}
        </p>
      )}

      {/* How it Works — admin-managed steps */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {(data.steps || []).map((step, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className="text-[10px] font-bold" style={{ color: 'var(--accent-lime)' }}>Step {String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Return Policy — admin-managed bullets */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Return Policy</h2>
      <div className="flex flex-col gap-3 mb-8">
        {(data.policy || []).map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-5 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Need help with a return?</p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Our team is ready to assist you.</p>
        <Link href="/faqs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
          Visit FAQs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
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
