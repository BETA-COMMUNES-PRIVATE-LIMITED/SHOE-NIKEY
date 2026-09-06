'use client';

import Link from 'next/link';

const Breadcrumb = ({ title, section }) => {
  return (
    <div className="mb-5 sm:mb-6 md:mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h1>
      <p className="text-[11px] sm:text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        {' / '}
        <span style={{ color: 'var(--text-primary)' }}>{section}</span>
      </p>
    </div>
  );
};

export default Breadcrumb;
