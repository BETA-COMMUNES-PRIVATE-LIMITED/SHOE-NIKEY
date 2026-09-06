'use client';

import PageLayout from '@/components/shared/PageLayout';

const initiatives = [
  {
    title: 'Eco-Friendly Materials',
    desc: 'We prioritize products made with recycled and sustainable materials, reducing our reliance on virgin resources.',
    stat: '40%',
    statLabel: 'recycled materials',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 12s1.5 2 4 2 4-2 4-2" />
        <path d="M2 12h2M20 12h2M12 2v2M12 20v2" />
      </svg>
    ),
  },
  {
    title: 'Carbon Neutral Shipping',
    desc: 'Every shipment is carbon-offset through verified environmental projects, making your delivery impact-neutral.',
    stat: '100%',
    statLabel: 'carbon offset',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
        <path d="M17 8l4 4-4 4" /><path d="M3 12h18" />
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
  },
  {
    title: 'Minimal Packaging',
    desc: 'We use 100% recyclable packaging and have eliminated single-use plastics from our supply chain.',
    stat: '0',
    statLabel: 'single-use plastic',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    title: 'Giving Back',
    desc: 'We donate 2% of every sale to environmental nonprofits working to protect our planet for future generations.',
    stat: '2%',
    statLabel: 'donated per sale',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const goals = [
  'Achieve 100% recycled or renewable materials by 2027.',
  'Reduce packaging waste by 50% by end of 2026.',
  'Plant 10,000 trees through our reforestation partners.',
  'Achieve net-zero carbon emissions across all operations.',
];

export default function SustainabilityPage() {
  return (
    <PageLayout title="Sustainability" breadcrumb="Sustainability">
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        We believe great shoes shouldn&apos;t cost the earth. Here&apos;s how we&apos;re working to make a positive impact.
      </p>

      {/* Initiatives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {initiatives.map((item) => (
          <div key={item.title} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
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

      {/* Goals */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Our 2027 Goals</h2>
      <div className="flex flex-col gap-3 mb-8">
        {goals.map((goal, idx) => (
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
    </PageLayout>
  );
}
