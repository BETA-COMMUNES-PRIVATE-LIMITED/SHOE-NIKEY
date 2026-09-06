'use client';

import PageLayout from '@/components/shared/PageLayout';

const values = [
  {
    title: 'Innovation',
    desc: 'We push boundaries in design and technology to create products that redefine what footwear can be.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: 'Quality',
    desc: 'Every product is crafted with premium materials and rigorous testing to ensure it meets the highest standards.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Community',
    desc: 'We believe in the power of sport to bring people together and create positive change in communities worldwide.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: 'Sustainability',
    desc: 'We are committed to protecting the planet through sustainable practices and eco-friendly materials.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5" /><path d="M12 7V2" />
      </svg>
    ),
  },
];

const stats = [
  { number: '500+', label: 'Products' },
  { number: '50K+', label: 'Happy Customers' },
  { number: '100%', label: 'Authentic' },
  { number: '4.8★', label: 'Average Rating' },
];

export default function AboutPage() {
  return (
    <PageLayout title="About Us" breadcrumb="About Us">
      {/* Story */}
      <div className="mb-10">
        <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Vére was born from a simple idea: everyone deserves access to the best footwear without compromise. We curate the finest collection of sneakers and shoes from the world&apos;s top brands, bringing them to you with unbeatable prices and exceptional service.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Founded in 2024, we quickly grew from a small online store to a trusted destination for sneakerheads and casual shoppers alike. Our passion for quality, style, and customer satisfaction drives everything we do.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-xl font-extrabold mb-1" style={{ color: 'var(--accent-lime)' }}>{stat.number}</p>
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {values.map((value) => (
          <div key={value.title} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              {value.icon}
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value.title}</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{value.desc}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h2 className="text-sm font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--accent-lime)' }}>Our Mission</h2>
        <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
          To make the world&apos;s best footwear accessible to everyone, while building a community that celebrates style, performance, and self-expression.
        </p>
      </div>
    </PageLayout>
  );
}
