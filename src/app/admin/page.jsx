'use client';

import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';

const statusColors = {
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
  processing: { bg: 'rgba(96, 165, 250, 0.1)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.2)' },
  shipped: { bg: 'rgba(166, 255, 0, 0.1)', text: 'var(--accent-lime)', border: 'rgba(166, 255, 0, 0.2)' },
  delivered: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
};

function CircularProgress({ value, max, color, size = 60, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? (value / max) * 100 : 0;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { orders, totalRevenue, totalOrders, pendingOrders, deliveredOrders } = useAdmin();

  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeColor: '#22c55e',
      color: '#60a5fa',
      progress: totalRevenue,
      max: 50000,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#60a5fa' }}>
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      change: '+8 this week',
      changeColor: '#22c55e',
      color: '#22c55e',
      progress: totalOrders,
      max: 50,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
      ),
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      change: 'Needs attention',
      changeColor: '#fbbf24',
      color: '#fbbf24',
      progress: pendingOrders,
      max: totalOrders || 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#fbbf24' }}>
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Delivered',
      value: deliveredOrders,
      change: `${totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}% rate`,
      changeColor: '#22c55e',
      color: '#a855f7',
      progress: deliveredOrders,
      max: totalOrders || 1,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: '#a855f7' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ];

  // Fake recent updates for UI
  const recentUpdates = [
    { name: 'Mike T.', action: 'placed a new order', time: '2m ago', color: '#60a5fa' },
    { name: 'Sarah K.', action: 'completed payment', time: '15m ago', color: '#22c55e' },
    { name: 'Alex R.', action: 'requested return', time: '1h ago', color: '#fbbf24' },
    { name: 'Jordan M.', action: 'left a review', time: '2h ago', color: '#a855f7' },
  ];

  const salesData = [
    { label: 'Men', value: 45, color: '#60a5fa' },
    { label: 'Women', value: 30, color: '#22c55e' },
    { label: 'Kids', value: 25, color: '#a855f7' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main Grid: Stats + Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stats + Orders */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-2xl flex flex-col gap-3"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                  {stat.icon}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <CircularProgress value={stat.progress} max={stat.max} color={stat.color} size={52} strokeWidth={4} />
                </div>
                <p className="text-[10px] font-semibold" style={{ color: stat.changeColor }}>{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
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
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
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
              })
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Updates + Sales Analytics */}
        <div className="flex flex-col gap-6">
          {/* Recent Updates */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Updates</h3>
            <div className="flex flex-col gap-4">
              {recentUpdates.map((update, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ backgroundColor: `${update.color}20`, color: update.color }}
                  >
                    {update.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      <span style={{ color: update.color }}>{update.name}</span> {update.action}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Analytics */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Sales Analytics</h3>
            <div className="flex flex-col gap-4">
              {salesData.map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mini Bar Chart */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <p className="text-[10px] font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Weekly Overview</p>
              <div className="flex items-end gap-1.5 h-16">
                {[35, 55, 40, 70, 45, 80, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-500"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 5 ? 'var(--accent-lime)' : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 mt-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[8px]" style={{ color: 'var(--text-muted)' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
