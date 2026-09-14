'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/verre-admin',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Products',
    href: '/verre-admin/products',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/verre-admin/categories',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Collections',
    href: '/verre-admin/collections',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: 'SNKRS Drops',
    href: '/verre-admin/snkrs',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/verre-admin/orders',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: 'Customers',
    href: '/verre-admin/customers',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    href: '/verre-admin/reviews',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: 'Banners / Sliders',
    href: '/verre-admin/banners',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    label: 'Pages',
    href: '/verre-admin/pages',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Theme & Design',
    href: '/verre-admin/theme',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Coupons & Offers',
    href: '/verre-admin/coupons',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/verre-admin/analytics',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/verre-admin/settings',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isLoaded, logout, orders, reviews, customers, notifsRead, markNotifsRead, adminProfile } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Build notifications from real store data
  const notifications = [
    ...orders.filter((o) => o.status === 'pending').map((o) => ({
      id: `order-${o.id}`,
      type: 'order',
      title: 'New order pending',
      desc: `${o.customer?.name || 'Customer'} · ${o.id} · $${o.total}`,
      date: o.date,
      href: '/verre-admin/orders',
    })),
    ...reviews.filter((r) => r.status === 'pending').map((r) => ({
      id: `review-${r.id}`,
      type: 'review',
      title: 'Review awaiting approval',
      desc: `${r.customer} on ${r.product}`,
      date: r.date,
      href: '/verre-admin/reviews',
    })),
    ...customers.filter((c) => c.status === 'new').map((c) => ({
      id: `customer-${c.id}`,
      type: 'customer',
      title: 'New customer registered',
      desc: `${c.name} · ${c.email}`,
      date: c.joined,
      href: '/verre-admin/customers',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
  const readSet = new Set(notifsRead);
  const unreadNotifications = notifications.filter((n) => !readSet.has(n.id));
  const notifCount = unreadNotifications.length;

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Login page - no layout wrapper
  if (pathname === '/verre-admin/login') {
    return <>{children}</>;
  }

  // Loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-lime)' }} />
      </div>
    );
  }

  // Not logged in — redirect is safe during render (router.push is not)
  if (!isAdmin) {
    redirect('/verre-admin/login');
  }

  const isActive = (href) => {
    if (href === '/verre-admin') return pathname === '/verre-admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="verre-admin min-h-screen lg:flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-color)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <svg className="w-9 h-9 flex-shrink-0" viewBox="0 0 24 24" fill="#fff">
            <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.481-.754-.313-1.875.331-3.053.63-1.152 1.49-2.006 2.224-2.348-.637.955-1.05 1.945-.771 2.605.24.566.848.75 1.672.414l11.04-4.693L21 8.719z"/>
          </svg>
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-tight" style={{ color: 'var(--text-primary)' }}>Vére Admin</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Manage Your Store</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  backgroundColor: active ? 'var(--accent-lime)' : 'transparent',
                  color: active ? '#000' : 'var(--text-muted)',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Promo Card */}
        <Link
          href="/verre-admin/theme"
          onClick={() => setSidebarOpen(false)}
          className="mx-3 mb-3 p-4 rounded-2xl relative overflow-hidden group transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
        >
          <div className="relative z-10">
            <p className="text-xs font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>Elevate<br />Your Brand</p>
            <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Just Do It.</p>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5" style={{ backgroundColor: 'var(--accent-lime)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="#000" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </Link>

        {/* Bottom */}
        <div className="px-3 pb-4 flex flex-col gap-1">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:bg-red-500/10 w-full text-left"
            style={{ color: '#ef4444' }}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 h-16"
          style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
              </svg>
            </button>

            {/* Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 h-10 px-3 sm:px-4 rounded-xl text-xs transition-all max-w-md w-full lg:w-96 min-w-0 flex-shrink"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="truncate min-w-0 hidden sm:inline">Search products, orders, customers...</span>
              <span className="ml-auto hidden sm:flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                Ctrl K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                aria-label="Notifications"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}>
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div
                    className="fixed left-2 right-2 top-16 w-auto sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-80 rounded-2xl z-50 animate-dropdown overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                      {notifCount > 0 ? (
                        <button
                          onClick={() => markNotifsRead(unreadNotifications.map((n) => n.id))}
                          className="text-[10px] font-bold px-2 py-1 rounded-full transition-all hover:opacity-70"
                          style={{ backgroundColor: 'rgba(166,255,0,0.12)', color: 'var(--accent-lime)' }}
                        >
                          ✓ Mark all as read
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                          All read
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-hide">
                      {notifCount === 0 ? (
                        <p className="px-4 py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                          You&apos;re all caught up
                        </p>
                      ) : (
                        notifications.map((n) => {
                          const isUnread = !readSet.has(n.id);
                          return (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 transition-all hover:bg-white/[0.04]"
                            style={{ opacity: isUnread ? 1 : 0.55 }}
                          >
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: n.type === 'order' ? 'rgba(166,255,0,0.12)' : n.type === 'review' ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.12)',
                                color: n.type === 'order' ? 'var(--accent-lime)' : n.type === 'review' ? '#fbbf24' : '#60a5fa',
                              }}
                            >
                              {n.type === 'order' ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                              ) : n.type === 'review' ? (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{n.title}</span>
                              <span className="block text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{n.desc}</span>
                            </span>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: 'var(--accent-red)' }} title="Unread" />
                            )}
                          </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 h-10 pl-1.5 pr-2 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
              >
                {adminProfile.avatar ? (
                  <img
                    src={adminProfile.avatar}
                    alt="Admin"
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                    {(adminProfile.name || 'A').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                )}
                <span className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{adminProfile.name}</span>
                  <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{adminProfile.role}</span>
                </span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div
                    className="absolute right-0 top-12 w-48 rounded-2xl p-2 z-50 animate-dropdown"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
                  >
                    <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/[0.04]" style={{ color: 'var(--text-primary)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      View Store
                    </Link>
                    <Link href="/verre-admin/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/[0.04]" style={{ color: 'var(--text-primary)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 16 0v1" />
                      </svg>
                      My Profile
                    </Link>
                    <Link href="/verre-admin/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/[0.04]" style={{ color: 'var(--text-primary)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="my-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-red-500/10 text-left"
                      style={{ color: '#ef4444' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 md:px-6 py-4 text-[11px]" style={{ borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          <span>© 2026 Vére Store. All rights reserved.</span>
          <span className="font-extrabold tracking-tight text-sm" style={{ color: 'var(--text-primary)' }}>JUST DO IT.</span>
        </footer>
      </div>

      {/* Search Modal (Ctrl+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSearchOpen(false)}>
          <div
            className="w-full max-w-xl rounded-2xl overflow-hidden animate-dropdown"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 h-14" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, orders, customers..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--text-primary)' }}
              />
              <button onClick={() => setSearchOpen(false)} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                ESC
              </button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto scrollbar-hide">
              {menuItems
                .filter((m) => m.label.toLowerCase().includes(search.toLowerCase()))
                .map((m) => (
                  <button
                    key={m.label}
                    onClick={() => { setSearchOpen(false); setSearch(''); router.push(m.href); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/[0.04] text-left"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{m.icon}</span>
                    {m.label}
                    <span className="ml-auto text-[10px]" style={{ color: 'var(--text-muted)' }}>Page</span>
                  </button>
                ))}
              {menuItems.filter((m) => m.label.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                <p className="px-3 py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No results for &quot;{search}&quot;</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
