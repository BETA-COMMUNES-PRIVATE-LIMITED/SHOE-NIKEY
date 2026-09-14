'use client';

import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

export default function SustainabilityPage() {
  const { pageContent, getPageData } = useAdmin();
  const content = pageContent?.sustainability;
  const data = getPageData('sustainability');

  return (
    <PageLayout title="Sustainability" breadcrumb="Sustainability">
      {(content?.intro || content?.sections?.length > 0) && (
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {content.intro || "We believe great shoes shouldn't cost the earth. Here's how we're working to make a positive impact."}
        </p>
      )}

      {/* Initiatives — admin-managed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {(data.initiatives || []).map((item, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M8 12s1.5 2 4 2 4-2 4-2" />
                <path d="M2 12h2M20 12h2M12 2v2M12 20v2" />
              </svg>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            <div className="pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-lg font-extrabold" style={{ color: '#22c55e' }}>{item.stat}</span>
              <span className="text-[10px] ml-2" style={{ color: 'var(--text-muted)' }}>{item.statLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Goals — admin-managed */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Our 2027 Goals</h2>
      <div className="flex flex-col gap-3 mb-8">
        {(data.goals || []).map((goal, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#22c55e', color: '#000' }}>
              {idx + 1}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{goal}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Join Us in Making a Difference</p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Every purchase supports our sustainability mission.</p>
        <a href="/men" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105" style={{ backgroundColor: '#22c55e', color: '#000' }}>
          Shop Sustainably
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
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
