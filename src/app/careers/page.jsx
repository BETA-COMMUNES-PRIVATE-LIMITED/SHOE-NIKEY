'use client';

import PageLayout from '@/components/shared/PageLayout';

const departments = [
  { name: 'Engineering', count: 2 },
  { name: 'Design', count: 1 },
  { name: 'Marketing', count: 2 },
  { name: 'Operations', count: 1 },
];

const openRoles = [
  {
    title: 'Senior Full-Stack Engineer',
    team: 'Engineering',
    location: 'Remote / New York',
    type: 'Full-time',
    level: 'Senior',
    desc: 'Build and scale our e-commerce platform. You\'ll work with Next.js, React, and modern cloud infrastructure to deliver fast, reliable experiences to millions of users.',
  },
  {
    title: 'Frontend Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid',
    desc: 'Craft performant, pixel-perfect interfaces across our web and mobile platforms. Strong focus on accessibility, animation, and responsive design.',
  },
  {
    title: 'UI/UX Designer',
    team: 'Design',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    level: 'Mid-Senior',
    desc: 'Design intuitive, visually striking interfaces that millions of sneakerheads interact with daily. Own the full design process from research to handoff.',
  },
  {
    title: 'Brand Marketing Lead',
    team: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    level: 'Lead',
    desc: 'Shape the Vére brand voice across all channels. Lead campaigns, partnerships, and community initiatives that resonate with our audience.',
  },
  {
    title: 'Content Strategist',
    team: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid',
    desc: 'Create compelling narratives that connect our products to our community. Develop content across editorial, social, and email channels.',
  },
  {
    title: 'Supply Chain Coordinator',
    team: 'Operations',
    location: 'Chicago, IL',
    type: 'Full-time',
    level: 'Mid',
    desc: 'Optimize our logistics network to deliver products faster and more sustainably. Work with global vendors, warehouses, and shipping partners.',
  },
];

const values = [
  {
    title: 'Obsess Over Craft',
    desc: 'We sweat the details — from the stitch on a shoe to the pixel on screen. Quality is not negotiable.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: 'Move Fast, Stay Sharp',
    desc: 'We ship quickly, learn from results, and iterate. Speed and quality are partners, not opposites.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Own Your Impact',
    desc: 'Every role here matters. You\'ll see your work shape real products, real revenue, and real customer experiences.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'Better Together',
    desc: 'Collaboration is our superpower. We share knowledge, challenge assumptions, and celebrate wins as a team.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const perks = [
  {
    title: 'Remote-First Culture',
    desc: 'Work from anywhere. We trust you to deliver your best work wherever you are most productive.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Competitive Compensation',
    desc: 'Top-of-market salary, equity options, and annual performance bonuses that reward your contributions.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Health & Wellness',
    desc: 'Full medical, dental, vision, and mental health coverage for you and your dependents.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: 'Product Access',
    desc: 'Up to 50% employee discount on all products, plus early access to limited-edition releases.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    title: 'Growth Budget',
    desc: '$2,500 annual stipend for courses, conferences, books, and tools to accelerate your career.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    title: 'Flexible Time Off',
    desc: 'Generous PTO policy with a minimum 3-week recommendation, plus 4 wellness days and company holidays.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Senior Engineer',
    years: '2 years',
    quote: 'The engineering culture here is unlike anywhere I\'ve worked. We ship fast, but we never cut corners. Every sprint I\'m solving real problems that impact real customers.',
  },
  {
    name: 'Marcus Williams',
    role: 'Brand Designer',
    years: '1.5 years',
    quote: 'Creative freedom at Vére is genuine. I pitched a completely new visual direction for our homepage and it shipped within two weeks. That\'s how fast things move here.',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    years: '3 years',
    quote: 'What sets Vére apart is the people. Everyone is deeply passionate about what they build, and there\'s a real sense of ownership across every team.',
  },
];

export default function CareersPage() {
  return (
    <PageLayout title="Careers" breadcrumb="Careers">
      {/* Intro */}
      <div className="mb-12">
        <p className="text-sm leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          Vére is redefining how people discover and buy footwear online. We&apos;re a small, high-impact team that moves fast, cares deeply about craft, and is building something that matters. If that excites you, we&apos;d love to talk.
        </p>
      </div>

      {/* Values */}
      <h2 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
        What We Stand For
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {values.map((v) => (
          <div key={v.title} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="mb-3">{v.icon}</div>
            <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Perks */}
      <h2 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
        Benefits & Perks
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
        {perks.map((perk) => (
          <div key={perk.title} className="flex gap-4 p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex-shrink-0 mt-0.5">{perk.icon}</div>
            <div>
              <h3 className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{perk.title}</h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <h2 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
        From the Team
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-14">
        {testimonials.map((t) => (
          <div key={t.name} className="p-6 rounded-2xl flex flex-col" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <svg className="w-5 h-5 mb-4 opacity-15" fill="var(--accent-lime)" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xs leading-relaxed flex-1 mb-5" style={{ color: 'var(--text-muted)' }}>
              &quot;{t.quote}&quot;
            </p>
            <div className="pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.role} · {t.years}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Open Roles */}
      <div id="openings">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
            Open Roles
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
            {openRoles.length} positions
          </span>
        </div>

        {/* Department Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
            All ({openRoles.length})
          </span>
          {departments.map((d) => (
            <span key={d.name} className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              {d.name} ({d.count})
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {openRoles.map((job, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl transition-all hover:bg-white/[0.02]"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{job.title}</h3>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{job.desc}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(166, 255, 0, 0.08)', color: 'var(--accent-lime)', border: '1px solid rgba(166, 255, 0, 0.15)' }}>
                      {job.team}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                      {job.type}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                      {job.level}
                    </span>
                    <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.location}
                    </span>
                  </div>
                </div>
                <button
                  className="px-5 py-2.5 rounded-full text-[11px] font-bold flex-shrink-0 transition-all active:scale-95"
                  style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div>
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Don&apos;t see your perfect role?</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            We&apos;re always interested in meeting exceptional people. Send us your resume and we&apos;ll keep you in mind.
          </p>
        </div>
        <a
          href="mailto:careers@verre.com"
          className="px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 flex-shrink-0"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          Send Resume
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </PageLayout>
  );
}
