'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AdminProvider, useAdmin } from '@/context/AdminContext';

/* Applies the admin-selected accent color site-wide and keeps it in sync */
function ThemeSync() {
  const { settings, isLoaded } = useAdmin();

  useEffect(() => {
    if (isLoaded && settings?.accentColor) {
      document.documentElement.style.setProperty('--accent-lime', settings.accentColor);
    }
  }, [isLoaded, settings?.accentColor]);

  return null;
}

/* Blocks the public storefront when admin enables Maintenance Mode */
function MaintenanceGate({ children }) {
  const { settings, isLoaded, isAdmin } = useAdmin();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Admin pages always stay accessible to the logged-in admin
  const isAdminArea = pathname.startsWith('/verre-admin');

  if (isLoaded && settings?.maintenance && !isAdmin && !isAdminArea) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.12)' }}>
            <svg className="w-10 h-10" fill="none" stroke="#fbbf24" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2z" /><line x1="12" y1="10" x2="12" y2="14" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>We&apos;ll Be Right Back</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            {settings.storeName || 'Vére'} is undergoing maintenance. Please check back soon.
          </p>
          <a href={`mailto:${settings.supportEmail || 'support@verre.com'}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return children;
}

function InnerProviders({ children }) {
  return (
    <>
      <ThemeSync />
      <MaintenanceGate>{children}</MaintenanceGate>
    </>
  );
}

export default function Providers({ children }) {
  return (
    <AdminProvider>
      <CartProvider>
        <WishlistProvider>
          <InnerProviders>{children}</InnerProviders>
        </WishlistProvider>
      </CartProvider>
    </AdminProvider>
  );
}
