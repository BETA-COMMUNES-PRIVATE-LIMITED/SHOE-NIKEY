'use client';

import { useAdmin } from '@/context/AdminContext';

export default function AdminAnalyticsPage() {
  const { orders, customers, reviews, customProducts, totalRevenue } = useAdmin();

  // Revenue by status
  const byStatus = ['pending', 'processing', 'shipped', 'delivered'].map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
    revenue: orders.filter((o) => o.status === s).reduce((sum, o) => sum + o.total, 0),
  }));
  const maxRevenue = Math.max(...byStatus.map((s) => s.revenue), 1);

  // Top products from order items
  const productSales = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSales[item.name]) productSales[item.name] = { name: item.name, qty: 0, revenue: 0 };
      productSales[item.name].qty += item.quantity;
      productSales[item.name].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  // Reviews breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((r) => ({
    rating: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }));
  const totalReviews = reviews.length || 1;

  const kpis = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`, color: 'var(--accent-lime)' },
    { label: 'Avg Order Value', value: `$${orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}`, sub: 'per order', color: '#60a5fa' },
    { label: 'Customers', value: customers.length, sub: `${customers.filter((c) => c.status === 'vip').length} VIP`, color: '#a855f7' },
    { label: 'Avg Rating', value: reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—', sub: `${reviews.length} reviews`, color: '#FFD700' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Live insights from your real store data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-[10px] font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>{k.label}</p>
            <p className="text-xl font-extrabold" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Status */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Revenue by Order Status</h3>
          <div className="flex flex-col gap-3.5">
            {byStatus.map((s) => (
              <div key={s.status} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold capitalize" style={{ color: 'var(--text-muted)' }}>
                    {s.status} <span style={{ opacity: 0.6 }}>({s.count})</span>
                  </span>
                  <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>${s.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(s.revenue / maxRevenue) * 100}%`, backgroundColor: 'var(--accent-lime)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Customer Ratings</h3>
          <div className="flex flex-col gap-3">
            {ratingBreakdown.map((r) => (
              <div key={r.rating} className="flex items-center gap-3">
                <span className="text-[11px] font-bold w-10" style={{ color: 'var(--text-primary)' }}>{r.rating} ★</span>
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(r.count / totalReviews) * 100}%`, backgroundColor: '#FFD700' }} />
                </div>
                <span className="text-[11px] font-semibold w-6 text-right" style={{ color: 'var(--text-muted)' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Best Selling Products</h3>
        {topProducts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {topProducts.map((p, idx) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold w-5 flex-shrink-0" style={{ color: 'var(--accent-lime)' }}>#{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                    <span className="text-[10px] font-bold flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>{p.qty} sold · ${p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(p.revenue / maxProductRevenue) * 100}%`, backgroundColor: 'var(--accent-lime)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>No sales data yet.</p>
        )}
      </div>

      {/* Custom products note */}
      <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
        {customProducts.length} custom products in catalog · Analytics update in real-time as orders change
      </p>
    </div>
  );
}
