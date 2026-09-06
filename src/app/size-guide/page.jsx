'use client';

import { useState } from 'react';
import PageLayout from '@/components/shared/PageLayout';

const sizeCharts = {
  Men: {
    headers: ['US', 'EU', 'UK', 'CM'],
    rows: [
      ['7', '40', '6', '25'],
      ['8', '41', '7', '26'],
      ['8.5', '42', '7.5', '26.5'],
      ['9', '42.5', '8', '27'],
      ['10', '44', '9', '28'],
      ['11', '45', '10', '29'],
      ['12', '46', '11', '30'],
      ['13', '47.5', '12', '31'],
      ['14', '48.5', '13', '32'],
    ],
  },
  Women: {
    headers: ['US', 'EU', 'UK', 'CM'],
    rows: [
      ['5', '35.5', '2.5', '22'],
      ['6', '36.5', '3.5', '23'],
      ['7', '38', '4.5', '24'],
      ['8', '39', '5.5', '25'],
      ['9', '40', '6.5', '26'],
      ['10', '41', '7.5', '27'],
      ['11', '42.5', '8.5', '28'],
    ],
  },
  Kids: {
    headers: ['Size', 'US', 'EU', 'CM'],
    rows: [
      ['0yr', '1', '16', '8.5'],
      ['1yr', '2', '17.5', '9.5'],
      ['2yr', '3', '19', '10.5'],
      ['3yr', '4', '20', '11.5'],
      ['4yr', '5', '21.5', '12.5'],
      ['5yr', '6', '22.5', '13.5'],
      ['6yr', '7', '24', '14.5'],
      ['7yr', '8', '25.5', '15.5'],
    ],
  },
};

const tabs = Object.keys(sizeCharts);

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState('Men');
  const chart = sizeCharts[activeTab];

  return (
    <PageLayout title="Size Guide" breadcrumb="Size Guide">
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        Find your perfect fit. Measure your foot and match it to our size charts below.
      </p>

      {/* How to Measure */}
      <div className="p-5 rounded-2xl mb-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>How to Measure</h2>
        <div className="flex flex-col gap-2">
          {[
            'Stand on a piece of paper and trace the outline of your foot.',
            'Measure the length from heel to the tip of your longest toe in centimeters.',
            'Use that measurement to find your size in the chart below.',
            'If you\'re between sizes, we recommend going half a size up.',
          ].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                {idx + 1}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
            style={{
              backgroundColor: activeTab === tab ? 'var(--accent-lime)' : 'var(--bg-surface)',
              color: activeTab === tab ? '#000' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Size Chart Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {/* Table Header */}
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${chart.headers.length}, 1fr)` }}>
          {chart.headers.map((header) => (
            <div key={header} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
              {header}
            </div>
          ))}
        </div>

        {/* Table Rows */}
        {chart.rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-0 transition-all hover:bg-white/[0.03]"
            style={{ gridTemplateColumns: `repeat(${chart.headers.length}, 1fr)` }}
          >
            {row.map((cell, cellIdx) => (
              <div
                key={cellIdx}
                className="px-4 py-3 text-xs"
                style={{
                  color: cellIdx === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: cellIdx === 0 ? '700' : '400',
                  borderBottom: rowIdx < chart.rows.length - 1 ? '1px solid var(--border-color)' : 'none',
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Fit Tips</h3>
        <div className="flex flex-col gap-2">
          {[
            'Running shoes typically fit snug — consider half a size up if you prefer a roomier fit.',
            'Lifestyle and basketball shoes tend to run true to size.',
            'Kids\' sizes are based on age but actual foot size may vary — always measure.',
            'When in doubt, visit a store to try on or use our easy returns policy.',
          ].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
