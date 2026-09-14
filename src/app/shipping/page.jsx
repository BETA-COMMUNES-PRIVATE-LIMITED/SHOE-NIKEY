'use client';

import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

export default function ShippingPage() {
  const { pageContent, getPageData } = useAdmin();
  const content = pageContent?.shipping;
  const data = getPageData('shipping');

  return (
    <PageLayout title="Shipping Policy" breadcrumb="Shipping">
      {(content?.intro || content?.sections?.length > 0) && (
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          {content.intro || 'We offer fast and reliable shipping to get your new kicks to you as quickly as possible.'}
        </p>
      )}

      {/* Shipping Methods — admin-managed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {(data.methods || []).map((method, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
                <path d="M1 6h15l3 6v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" />
                <path d="M16 14h4l3 3v3h-7v-6z" />
                <circle cx="6" cy="20" r="2" /><circle cx="18" cy="20" r="2" />
              </svg>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{method.name}</h3>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{method.time}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{method.desc}</p>
            <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--accent-lime)' }}>{method.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Policies — admin-managed */}
      <div className="flex flex-col gap-6">
        {(data.policies || []).map((policy, i) => (
          <div key={i}>
            <h2 className="text-sm font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-primary)' }}>
              {policy.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {(policy.items || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
