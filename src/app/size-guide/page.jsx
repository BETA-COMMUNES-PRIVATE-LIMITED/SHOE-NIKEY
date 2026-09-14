'use client';

import { useState } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import { useAdmin } from '@/context/AdminContext';

export default function SizeGuidePage() {
  const { pageContent, getPageData } = useAdmin();
  const content = pageContent?.['size-guide'];
  const data = getPageData('size-guide');

  const charts = data.charts || [];
  const [activeTab, setActiveTab] = useState(charts[0]?.name || 'Men');
  const chart = charts.find((c) => c.name === activeTab) || charts[0];

  return (
    <PageLayout title="Size Guide" breadcrumb="Size Guide">
      {(content?.intro || content?.sections?.length > 0) && (
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {content.intro || 'Find your perfect fit. Measure your foot and match it to our size charts below.'}
        </p>
      )}

      {/* How to Measure — admin-managed tips */}
      <div className="p-5 rounded-2xl mb-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>How to Measure</h2>
        <div className="flex flex-col gap-2">
          {(data.tips || []).map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                {idx + 1}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs — admin-managed charts */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {charts.map((c) => (
          <button
            key={c.name}
            onClick={() => setActiveTab(c.name)}
            className="px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
            style={{
              backgroundColor: activeTab === c.name ? 'var(--accent-lime)' : 'var(--bg-surface)',
              color: activeTab === c.name ? '#000' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Chart table */}
      {chart && (
        <div className="rounded-2xl overflow-hidden mb-10" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${chart.headers?.length || 1}, 1fr)` }}>
            {(chart.headers || []).map((h, i) => (
              <span key={i} className="text-[10px] font-bold uppercase px-4 py-3 text-center" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                {h}
              </span>
            ))}
            {(chart.rows || []).map((row, r) =>
              row.map((cell, c) => (
                <span key={`${r}-${c}`} className="text-xs font-semibold px-4 py-2.5 text-center" style={{ color: 'var(--text-primary)', borderBottom: r < chart.rows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  {cell}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Admin-managed sections */}
      {content?.sections?.length > 0 && (
        <div className="flex flex-col gap-6">
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
