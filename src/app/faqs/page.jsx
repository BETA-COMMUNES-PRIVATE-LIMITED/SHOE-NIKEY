'use client';

import { useState } from 'react';
import PageLayout from '@/components/shared/PageLayout';

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse our collection, select your size and color, and click "Add to Cart". When you\'re ready, head to checkout, fill in your shipping details, and complete payment. You\'ll receive an order confirmation email right away.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Nike Gift Cards. All transactions are encrypted and secure.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5-7 business days. Express shipping delivers within 2-3 business days. Free standard shipping is available on orders over $100.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes! Once your order ships, you\'ll receive a tracking number via email. You can also track your order in the "My Orders" section of your account dashboard.',
  },
  {
    q: 'How do I return an item?',
    a: 'We offer a 30-day return policy. Items must be unworn and in original packaging. Visit our Returns page to initiate a return, and we\'ll provide a prepaid shipping label.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Currently, we ship within the United States. International shipping is coming soon. Sign up for our newsletter to be the first to know when we expand.',
  },
  {
    q: 'What sizes are available?',
    a: 'We offer sizes 5-14 for men, 5-11 for women, and 0yr-7yr for kids. Check our Size Guide for detailed measurements and fit recommendations.',
  },
  {
    q: 'How do I use a promo code?',
    a: 'Enter your promo code at checkout in the "Discount Code" field and click "Apply". Only one promo code can be used per order.',
  },
  {
    q: 'Are the products authentic?',
    a: 'Absolutely. Every product on our site is 100% authentic and sourced directly from Nike. We stand behind the quality of everything we sell.',
  },
  {
    q: 'How do I contact customer support?',
    a: 'You can reach us via email at support@verre.com, through live chat on our website, or by calling 1-800-VERRE during business hours (Mon-Fri, 9AM-6PM EST).',
  },
];

export default function FAQsPage() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <PageLayout title="Frequently Asked Questions" breadcrumb="FAQs">
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Find answers to the most common questions about shopping with us.
      </p>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl overflow-hidden transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left transition-all"
            >
              <span className="text-sm font-bold pr-4" style={{ color: 'var(--text-primary)' }}>
                {faq.q}
              </span>
              <svg
                className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{
                  color: 'var(--text-muted)',
                  transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{
                maxHeight: openIdx === idx ? '200px' : '0px',
                opacity: openIdx === idx ? 1 : 0,
              }}
            >
              <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div
        className="mt-10 p-6 rounded-2xl text-center"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Still have questions?
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Our support team is here to help you with anything you need.
        </p>
        <a
          href="mailto:support@verre.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          Contact Support
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </PageLayout>
  );
}
