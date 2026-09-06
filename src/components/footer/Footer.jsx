'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  const shopLinks = [
    { label: 'Men', href: '/men' },
    { label: 'Women', href: '/women' },
    { label: 'Kids', href: '/kids' },
    { label: 'SNKRS', href: '/snkrs' },
    { label: 'Collections', href: '/collections' },
  ];
  const helpLinks = [
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ];
  const aboutLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'News', href: '/news' },
  ];

  return (
    <footer 
      className="w-full mt-auto rounded-3xl p-8 md:p-12"
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-color)' 
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Logo Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              vére
            </h2>
          </div>

          {/* Shop Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              SHOP
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {shopLinks.map((item) => {
                const active = item.href !== '#' && pathname.startsWith(item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors"
                      style={{ color: active ? 'var(--accent-lime)' : 'var(--text-muted)' }}
                    >
                      {active && '→ '}{item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Help Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              HELP
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              {helpLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors"
                      style={{ color: active ? 'var(--accent-lime)' : 'var(--text-muted)' }}
                    >
                      {active && '→ '}{item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* About Column */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              ABOUT
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              {aboutLinks.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors"
                      style={{ color: active ? 'var(--accent-lime)' : 'var(--text-muted)' }}
                    >
                      {active && '→ '}{item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 flex flex-col gap-3 lg:border-r" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              FOLLOW US
            </h3>
            <div className="flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              {/* Instagram */}
              <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </Link>
              {/* Twitter / X */}
              <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              {/* YouTube */}
              <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <polygon points="10 15 15 12 10 9"/>
                </svg>
              </Link>
              {/* TikTok */}
              <Link href="#" className="hover:opacity-80 transition-opacity" aria-label="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Newsletter Column */}
          <div 
            className="col-span-2 md:col-span-6 lg:col-span-3 flex flex-col gap-3 lg:pl-6"
          >
            <h3 className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              NEWSLETTER
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Get updates on new drops and exclusive offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full text-xs px-4 py-3 rounded-xl outline-none transition-all placeholder:text-neutral-500"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Subscribe"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>© 2026 Vére, Inc. All Rights Reserved.</span>
          <Link href="/admin" className="text-[10px] opacity-30 hover:opacity-60 transition-opacity">Admin</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;