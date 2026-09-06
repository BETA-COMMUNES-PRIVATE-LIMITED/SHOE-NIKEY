'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

export default function PageLayout({ title, breadcrumb, children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 md:mb-6 text-xs font-semibold transition-all hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Breadcrumb */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-2 text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="hover:underline transition-all" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>{breadcrumb}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
        </div>

        {/* Content - full width for laptop */}
        <div className="w-full">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
