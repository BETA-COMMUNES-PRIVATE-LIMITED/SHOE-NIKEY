'use client';

import Link from 'next/link';
import PageLayout from '@/components/shared/PageLayout';

const steps = [
  {
    num: '01',
    title: 'Initiate Your Return',
    desc: 'Log into your account, go to "My Orders", and select the item you want to return. Or contact our support team.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Pack & Ship',
    desc: 'Print your prepaid shipping label, pack the item in its original packaging, and drop it off at the nearest carrier location.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M1 6h15l3 6v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" />
        <path d="M16 14h4l3 3v3h-7v-6z" />
        <circle cx="6" cy="20" r="2" /><circle cx="18" cy="20" r="2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Get Your Refund',
    desc: 'Once we receive and inspect your return, your refund will be processed within 5-7 business days to your original payment method.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export default function ReturnsPage() {
  return (
    <PageLayout title="Returns & Exchanges" breadcrumb="Returns">
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Not 100% satisfied? No worries — returns are easy and free within 30 days.
      </p>

      {/* How it Works */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {steps.map((step) => (
          <div key={step.num} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-3">
              {step.icon}
              <span className="text-[10px] font-bold" style={{ color: 'var(--accent-lime)' }}>Step {step.num}</span>
            </div>
            <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Policy Details */}
      <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Return Policy</h2>
      <div className="flex flex-col gap-3 mb-8">
        {[
          'Items must be returned within 30 days of delivery.',
          'Items must be unworn, unwashed, and in original packaging with all tags attached.',
          'Free return shipping is provided for all U.S. orders.',
          'Refunds are processed to the original payment method within 5-7 business days.',
          'Exchanges are available for different sizes of the same item.',
          'Final sale items marked as "Clearance" cannot be returned.',
        ].map((item, idx) => (
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
    </PageLayout>
  );
}
