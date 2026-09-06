'use client';

import PageLayout from '@/components/shared/PageLayout';

const shippingMethods = [
  {
    name: 'Standard Shipping',
    time: '5–7 business days',
    price: 'Free on orders over $100',
    desc: 'Our standard shipping option delivers your order within 5-7 business days. Available for all U.S. addresses.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
        <path d="M1 6h15l3 6v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" />
        <path d="M16 14h4l3 3v3h-7v-6z" />
        <circle cx="6" cy="20" r="2" /><circle cx="18" cy="20" r="2" />
      </svg>
    ),
  },
  {
    name: 'Express Shipping',
    time: '2–3 business days',
    price: '$15 flat rate',
    desc: 'Need it faster? Express shipping gets your order to you in just 2-3 business days.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-red)' }}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

const policies = [
  {
    title: 'Order Processing',
    items: [
      'Orders placed before 2PM EST are processed the same business day.',
      'Orders placed after 2PM EST or on weekends are processed the next business day.',
      'You\'ll receive an email confirmation immediately after placing your order.',
    ],
  },
  {
    title: 'Shipping Restrictions',
    items: [
      'We currently ship to all 50 U.S. states and territories.',
      'P.O. Boxes are accepted for standard shipping only.',
      'Some remote areas may experience slightly longer delivery times.',
    ],
  },
  {
    title: 'Order Tracking',
    items: [
      'Tracking information is sent via email once your order ships.',
      'Track your order anytime from your account dashboard.',
      'Our carrier partners include UPS, FedEx, and USPS.',
    ],
  },
];

export default function ShippingPage() {
  return (
    <PageLayout title="Shipping Policy" breadcrumb="Shipping">
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        We offer fast and reliable shipping to get your new kicks to you as quickly as possible.
      </p>

      {/* Shipping Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {shippingMethods.map((method) => (
          <div
            key={method.name}
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-3">
              {method.icon}
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

      {/* Policies */}
      <div className="flex flex-col gap-6">
        {policies.map((policy) => (
          <div key={policy.title}>
            <h2 className="text-sm font-bold tracking-wider uppercase mb-3" style={{ color: 'var(--text-primary)' }}>
              {policy.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {policy.items.map((item, idx) => (
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
    </PageLayout>
  );
}
