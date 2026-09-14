'use client';

import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

export default function AboutPage() {
  const { pageContent, getPageData } = useAdmin();
  const content = pageContent?.about;
  const data = getPageData('about');

  return (
    <PageLayout title="About Us" breadcrumb="About Us">
      {/* Story — admin-managed via intro */}
      <div className="mb-10">
        <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
        <div className="flex flex-col gap-3">
          {content?.intro ? (
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>{content.intro}</p>
          ) : (
            <>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Vére was born from a simple idea: everyone deserves access to the best footwear without compromise. We curate the finest collection of sneakers and shoes from the world&apos;s top brands, bringing them to you with unbeatable prices and exceptional service.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Founded in 2024, we quickly grew from a small online store to a trusted destination for sneakerheads and casual shoppers alike. Our passion for quality, style, and customer satisfaction drives everything we do.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Stats — admin-managed */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {(data.stats || []).map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-xl font-extrabold mb-1" style={{ color: 'var(--accent-lime)' }}>{stat.number}</p>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values — admin-managed */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {(data.values || []).map((value, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value.title}</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{value.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission — admin-managed */}
      {data.mission && (
        <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-sm font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--accent-lime)' }}>Our Mission</h2>
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            {data.mission}
          </p>
        </div>
      )}

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
