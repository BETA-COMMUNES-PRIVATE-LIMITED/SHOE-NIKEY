'use client';

import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';

const statusColors = {
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
  processing: { bg: 'rgba(96, 165, 250, 0.1)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.2)' },
  shipped: { bg: 'rgba(166, 255, 0, 0.1)', text: 'var(--accent-lime)', border: 'rgba(166, 255, 0, 0.2)' },
  delivered: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
};

export default function AdminDashboard() {
  const { orders, totalRevenue, totalOrders, pendingOrders, deliveredOrders } = useAdmin();

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      change: '+12.5%',
      changeColor: '#22c55e',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
      change: '+8 this week',
      changeColor: 'var(--accent-lime)',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#fbbf24' }}>
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      change: 'Needs attention',
      changeColor: '#fbbf24',
    },
    {
      label: 'Delivered',
      value: deliveredOrders,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      change: `${totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}% rate`,
      changeColor: '#22c55e',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="text-[10px] font-semibold" style={{ color: stat.changeColor }}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Orders</h3>
          <Link href="/admin/orders" className="text-[11px] font-semibold transition-all hover:opacity-70" style={{ color: 'var(--accent-lime)' }}>
            View All →
          </Link>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span className="text-[10px] font-bold uppercase tracking-wider col-span-2" style={{ color: 'var(--text-muted)' }}>Order</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Customer</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total</span>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Status</span>
        </div>

        {/* Rows */}
        {recentOrders.map((order) => {
          const sc = statusColors[order.status] || statusColors.pending;
          return (
            <div key={order.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 px-5 py-3.5 items-center transition-all hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <span className="text-xs font-bold col-span-2 md:col-span-2" style={{ color: 'var(--accent-lime)' }}>{order.id}</span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{order.customer.name}</span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{order.date}</span>
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${order.total}</span>
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full w-fit capitalize"
                style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
              >
                {order.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
