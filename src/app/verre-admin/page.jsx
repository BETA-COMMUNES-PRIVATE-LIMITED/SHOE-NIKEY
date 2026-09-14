'use client';

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import menProducts from '@/data/menProducts';
import womenProducts from '@/data/womenProducts';
import kidsProducts from '@/data/kidsProducts';

const statusColors = {
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
  processing: { bg: 'rgba(96, 165, 250, 0.1)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.2)' },
  shipped: { bg: 'rgba(166, 255, 0, 0.1)', text: 'var(--accent-lime)', border: 'rgba(166, 255, 0, 0.2)' },
  delivered: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
};

/* Mini sparkline */
function Spark({ color, points }) {
  const w = 80, h = 28;
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * w},${h - (p / 100) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminDashboard() {
  const { orders, totalRevenue, totalOrders, customProducts, customers, visitorsByRange, adminProfile, addProduct, updateProduct, deleteProduct, applyProductOverrides } = useAdmin();

  // Real built-in catalog (with admin overrides + deletions applied)
  const builtIn = useMemo(
    () => [
      ...applyProductOverrides(menProducts).map((p) => ({ ...p, isBuiltIn: true, section: 'men' })),
      ...applyProductOverrides(womenProducts).map((p) => ({ ...p, isBuiltIn: true, section: 'women' })),
      ...applyProductOverrides(kidsProducts).map((p) => ({ ...p, isBuiltIn: true, section: 'kids' })),
    ],
    [applyProductOverrides]
  );

  // Track clicked quick action — its icon changes color
  const [activeAction, setActiveAction] = useState(null);
  const [showAllActions, setShowAllActions] = useState(false);
  const quickActionsRef = useRef(null);

  // Recent Products: real catalog, selectable rows + working row actions
  const catalog = [...customProducts, ...builtIn].slice(0, 5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const allSelected = selectedRows.length === catalog.length && catalog.length > 0;

  const toggleRow = (id) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };
  const toggleAll = () => {
    setSelectedRows(allSelected ? [] : catalog.map((p) => p.id));
  };
  // Duplicate a product (works for custom + built-in via updateProduct override)
  const duplicateRow = (p) => {
    if (p.isBuiltIn) {
      addProduct({ ...p, name: `${p.name} (Copy)`, isBuiltIn: false });
    } else {
      addProduct({ ...p, name: `${p.name} (Copy)` });
    }
  };
  // Permanently removes custom products; built-ins are hidden from admin + storefront
  const deleteRow = (id) => {
    deleteProduct(id);
    setSelectedRows((prev) => prev.filter((r) => r !== id));
    setConfirmDelete(null);
  };

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  /* ---------- Sales Overview: real daily revenue from orders ---------- */
  const [range, setRange] = useState(30);
  const salesData = useMemo(() => {
    const days = range;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const start = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    start.setHours(0, 0, 0, 0);
    const buckets = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      buckets.push({ label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: 0 });
    }
    orders.forEach((o) => {
      const od = new Date(o.date);
      const idx = Math.floor((od - start) / (24 * 60 * 60 * 1000));
      if (idx >= 0 && idx < days) buckets[idx].revenue += o.total;
    });
    const windowRevenue = buckets.reduce((s, b) => s + b.revenue, 0);
    // Trend: compare first half of the window vs second half
    const half = Math.floor(days / 2);
    const firstHalf = buckets.slice(0, half).reduce((s, b) => s + b.revenue, 0);
    const secondHalf = buckets.slice(half).reduce((s, b) => s + b.revenue, 0);
    const trend = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : secondHalf > 0 ? 100 : 0;
    return { buckets, windowRevenue, trend };
  }, [orders, range]);
  const maxBucket = Math.max(...salesData.buckets.map((b) => b.revenue), 1);
  // Show ~7 x-axis labels regardless of range
  const xLabels = salesData.buckets.filter((_, i) => i % Math.ceil(salesData.buckets.length / 7) === 0);

  const salesTrend = salesData.trend;
  const visitors7d = visitorsByRange(7);
  const visitors30d = visitorsByRange(30);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const newCustomers = customers.filter((c) => new Date(c.joined) >= monthStart).length;

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: salesTrend >= 0 ? `+${salesTrend}%` : `${salesTrend}%`,
      href: '/verre-admin/orders',
      spark: '#A6FF00',
      points: [30, 45, 38, 55, 48, 70, 62, 85],
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: 'Total Customers',
      value: customers.length.toLocaleString(),
      change: `+${newCustomers} this month`,
      href: '/verre-admin/customers',
      spark: '#A6FF00',
      points: [25, 40, 35, 52, 44, 60, 75, 82],
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: salesTrend >= 0 ? `+${salesTrend}%` : `${salesTrend}%`,
      href: '/verre-admin/analytics',
      spark: '#A6FF00',
      points: [20, 35, 30, 48, 42, 58, 52, 72],
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13h2M8 13h2M16 17h2M8 17h2" />
        </svg>
      ),
    },
    {
      label: 'Website Visitors',
      value: visitors30d.toLocaleString(),
      change: `+${visitors7d} this week`,
      href: '/verre-admin/analytics',
      spark: '#A6FF00',
      points: [22, 38, 33, 50, 46, 64, 58, 80],
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/verre-admin/products', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /> },
    { label: 'Manage Categories', href: '/verre-admin/categories', icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></> },
    { label: 'Upload Banner', href: '/verre-admin/banners', icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></> },
    { label: 'View Orders', href: '/verre-admin/orders', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></> },
    { label: 'Manage Reviews', href: '/verre-admin/reviews', icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
    { label: 'Edit Theme', href: '/verre-admin/theme', icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20z" /></> },
    // Extra actions revealed by "View All"
    { label: 'Collections', href: '/verre-admin/collections', icon: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> },
    { label: 'Customers', href: '/verre-admin/customers', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> },
    { label: 'Coupons', href: '/verre-admin/coupons', icon: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></> },
    { label: 'Pages', href: '/verre-admin/pages', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></> },
    { label: 'Analytics', href: '/verre-admin/analytics', icon: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></> },
    { label: 'Settings', href: '/verre-admin/settings', icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></> },
  ];
  const visibleActions = showAllActions ? quickActions : quickActions.slice(0, 6);

  const recentProducts = [
    { name: 'Nike Air Max 270', category: 'Running', price: 170, stock: 25, image: '/images/r1.png' },
    { name: "Nike Air Force 1 '07", category: 'Lifestyle', price: 120, stock: 18, image: '/images/p4-1.png' },
    { name: 'Nike React Infinity Run', category: 'Running', price: 160, stock: 12, image: '/images/b1.png' },
    { name: 'Nike Air Zoom Pegasus 40', category: 'Training', price: 150, stock: 8, image: '/images/tt1.png' },
  ];

  // Top Categories: computed from the real catalog (built-in + custom)
  const topCategories = useMemo(() => {
    const byCat = {};
    [...builtIn, ...customProducts].forEach((p) => {
      const cat = p.category || p.type || 'Other';
      byCat[cat] = (byCat[cat] || 0) + 1;
    });
    const total = Object.values(byCat).reduce((s, n) => s + n, 0) || 1;
    return Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, count: `${count} Product${count === 1 ? '' : 's'}`, pct: Math.round((count / total) * 100) }));
  }, [builtIn, customProducts]);

  // Fallback rows when there are no orders yet — real customers, real catalog prices
  const recentCustomers = customers.slice(0, 5).map((c) => ({
    id: `C-${c.id}`, name: c.name, amount: `$${(c.spent || 0).toLocaleString()}`, status: c.status === 'vip' ? 'delivered' : 'pending', date: c.joined,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome Back, {adminProfile.name.split(' ')[0]}!
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Keep going. Great things take time.</p>
          </div>
          <Link
            href="/verre-admin/products"
            className="h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-5 rounded-2xl flex items-start justify-between gap-3 transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.99] cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                  {stat.icon}
                </span>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              </div>
              <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: '#22c55e' }}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" transform="rotate(180 12 12)" />
                </svg>
                {stat.change}
              </span>
            </div>
            <Spark color={stat.spark} points={stat.points} />
          </Link>
        ))}
      </div>

      {/* Middle: Homepage Banner + Sales Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Homepage Banner */}
        <div className="xl:col-span-2 rounded-2xl relative overflow-hidden p-6 md:p-8 flex flex-col sm:flex-row sm:items-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(166,255,0,0.12), transparent 60%)' }}
          />
          <div className="relative z-10 flex flex-col gap-3 w-full sm:max-w-[60%]">
            <h3 className="text-lg md:text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Manage Your Homepage</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Update banners, featured products and content.</p>
            <Link
              href="/verre-admin/banners"
              className="w-fit mt-2 h-10 px-6 rounded-xl text-xs font-bold flex items-center transition-all active:scale-95"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
            >
              Edit Homepage
            </Link>
          </div>
          {/* Shoe + tagline — visible on mobile, tablet and laptop */}
          <div className="relative z-10 h-32 w-full mt-4 sm:mt-0 sm:absolute sm:inset-y-0 sm:right-0 sm:w-[50%] sm:h-auto pointer-events-none">
            {/* Shoe — centered in the space left of the tagline */}
            <div className="absolute inset-y-0 left-0 right-16 sm:inset-y-2">
              <Image src="/images/shoe-dashboard.png" alt="Featured shoe" fill style={{ objectFit: 'contain', objectPosition: 'center' }} className="drop-shadow-2xl" />
            </div>
            {/* Tagline — pinned right, vertically centered */}
            <span className="absolute right-1 top-1/2 -translate-y-1/2 sm:right-4 text-right text-xl md:text-2xl font-extrabold italic tracking-tighter leading-[0.95]" style={{ color: 'var(--text-primary)' }}>
              JUST<br />DO IT.
            </span>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Sales Overview</h3>
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="text-[10px] font-bold px-2 py-1.5 rounded-lg outline-none cursor-pointer"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
            >
              <option value={30}>Last 30 Days</option>
              <option value={7}>Last 7 Days</option>
              <option value={90}>Last 90 Days</option>
            </select>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>${salesData.windowRevenue.toLocaleString()}</p>
            <span className="text-[10px] font-bold" style={{ color: salesTrend >= 0 ? '#22c55e' : '#ef4444' }}>
              {salesTrend >= 0 ? '↗' : '↘'} {salesTrend >= 0 ? '+' : ''}{salesTrend}%
            </span>
          </div>
          {/* Real daily-revenue bars: highlighted = had sales that day */}
          <div className="flex items-end gap-[3px] h-24">
            {salesData.buckets.map((b, i) => (
              <div
                key={i}
                title={`${b.label}: $${b.revenue.toLocaleString()}`}
                className="flex-1 rounded-sm transition-all duration-500"
                style={{ height: `${Math.max((b.revenue / maxBucket) * 100, 3)}%`, backgroundColor: b.revenue > 0 ? 'rgba(166,255,0,0.85)' : 'rgba(255,255,255,0.14)' }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[8px]" style={{ color: 'var(--text-muted)' }}>
            {xLabels.map((b) => <span key={b.label}>{b.label}</span>)}
          </div>
        </div>
      </div>

      {/* Quick Actions + Top Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="xl:col-span-2 rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
            <button
              onClick={() => {
                setShowAllActions((prev) => !prev);
                if (!showAllActions) {
                  // Scroll the expanded grid into view after it renders
                  setTimeout(() => quickActionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
                }
              }}
              className="text-[11px] font-semibold cursor-pointer transition-all hover:opacity-70"
              style={{ color: 'var(--accent-lime)' }}
            >
              {showAllActions ? 'Show Less ←' : 'View All →'}
            </button>
          </div>
          <div ref={quickActionsRef} className={`grid gap-3 ${showAllActions ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6' : 'grid-cols-3 sm:grid-cols-6'}`}>
            {visibleActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                onClick={() => setActiveAction((prev) => (prev === a.label ? null : a.label))}
                role="button"
                tabIndex={0}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300"
                  style={{
                    backgroundColor: activeAction === a.label ? 'rgba(96,165,250,0.15)' : 'var(--bg-card)',
                    color: activeAction === a.label ? '#60a5fa' : 'var(--accent-lime)',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">{a.icon}</svg>
                </span>
                <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: activeAction === a.label ? '#60a5fa' : 'var(--text-muted)' }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Top Categories</h3>
            <Link href="/verre-admin/categories" className="text-[11px] font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>View All →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {topCategories.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="text-[11px] font-semibold w-20 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>{c.label}</span>
                <span className="text-[9px] w-20 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{c.count}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${c.pct}%`, backgroundColor: 'var(--accent-lime)' }} />
                </div>
                <span className="text-[10px] font-bold w-7 text-right" style={{ color: 'var(--text-muted)' }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Products */}
        <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Products</h3>
            <Link href="/verre-admin/products" className="text-[11px] font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>View All →</Link>
          </div>
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-2.5 items-center" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <label className="col-span-1 flex items-center cursor-pointer">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-3.5 h-3.5 rounded cursor-pointer" aria-label="Select all" />
            </label>
            {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h, i) => (
              <span key={h} className={`text-[10px] font-bold uppercase ${i === 0 ? 'col-span-3' : i === 5 ? 'col-span-2' : 'col-span-1.5'}`} style={{ color: 'var(--text-muted)' }}>{h}</span>
            ))}
          </div>
          {catalog.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No products to show.</p>
            </div>
          )}
          {catalog.map((p, idx) => (
            <div key={`${p.section}-${p.id}`} className="grid grid-cols-12 gap-3 px-5 py-3 items-center transition-colors" style={{ borderBottom: idx < catalog.length - 1 ? '1px solid var(--border-color)' : 'none', backgroundColor: selectedRows.includes(p.id) ? 'rgba(96,165,250,0.05)' : 'transparent' }}>
              <label className="col-span-1 flex items-center cursor-pointer">
                <input type="checkbox" checked={selectedRows.includes(p.id)} onChange={() => toggleRow(p.id)} className="w-3.5 h-3.5 rounded cursor-pointer" aria-label={`Select ${p.name}`} />
              </label>
              <div className="col-span-7 md:col-span-3 flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <Image src={p.image} alt={p.name} fill className="object-contain p-0.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold truncate block" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                  <span className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{p.section}</span>
                </div>
              </div>
              <span className="hidden md:block col-span-2 text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{p.category || p.type}</span>
              <span className="hidden md:block col-span-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${p.price}</span>
              <span className="hidden md:block col-span-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.isComingSoon ? '—' : 'In stock'}</span>
              <span className="hidden md:flex col-span-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>Active</span>
              </span>
              <div className="hidden md:flex col-span-2 items-center gap-1.5 justify-end">
                {/* Edit — opens the product in its section editor */}
                <Link
                  href={`/verre-admin/products/${p.section}?edit=${p.id}`}
                  title="Edit product"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70 cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Link>
                {/* Duplicate */}
                <button
                  onClick={() => duplicateRow(p)}
                  title="Duplicate product"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70 cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                {/* Delete */}
                <button
                  onClick={() => setConfirmDelete(p)}
                  title="Delete product"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70 cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-surface)', color: '#ef4444' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {/* Bulk actions bar */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{selectedRows.length} selected</span>
              <button
                onClick={() => { catalog.filter((p) => selectedRows.includes(p.id)).forEach(deleteRow); }}
                className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer"
                style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
              >Delete selected</button>
            </div>
          )}
          {/* Delete confirmation */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
              <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Product?</h3>
                <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
                  &quot;{confirmDelete.name}&quot; will be removed from the admin and the public site.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold transition-all active:scale-95" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
                  <button onClick={() => deleteRow(confirmDelete.id)} className="flex-1 h-10 rounded-full text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Orders</h3>
            <Link href="/verre-admin/orders" className="text-[11px] font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>View All →</Link>
          </div>
          <div className="flex flex-col">
            {(recentOrders.length > 0
              ? recentOrders.map((o) => ({
                  id: o.id,
                  name: o.customer.name,
                  amount: `$${o.total}`,
                  status: o.status, // display real status; colors resolved below
                  date: new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                }))
              : recentCustomers
            ).map((o, idx) => {
              const sc = statusColors[o.status.toLowerCase()] || statusColors.pending;
              return (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: idx < 4 ? '1px solid var(--border-color)' : 'none' }}>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{o.id}</span>
                  <span className="text-[11px] font-semibold flex-1 min-w-0 truncate" style={{ color: 'var(--text-primary)' }}>{o.name}</span>
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>{o.amount}</span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                    style={{ backgroundColor: sc.bg, color: sc.text }}
                  >
                    {o.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
