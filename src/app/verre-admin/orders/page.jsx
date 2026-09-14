'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered'];
const statusColors = {
  pending: { bg: 'rgba(251, 191, 36, 0.1)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.2)' },
  processing: { bg: 'rgba(96, 165, 250, 0.1)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.2)' },
  shipped: { bg: 'rgba(166, 255, 0, 0.1)', text: 'var(--accent-lime)', border: 'rgba(166, 255, 0, 0.2)' },
  delivered: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Orders</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {['all', ...statusOptions].map((s) => {
          const count = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95 capitalize"
              style={{
                backgroundColor: filterStatus === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: filterStatus === s ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-3">
        {sorted.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No orders found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try a different filter.</p>
          </div>
        )}

        {sorted.map((order) => {
          const sc = statusColors[order.status] || statusColors.pending;
          const expanded = expandedId === order.id;

          return (
            <div
              key={order.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              {/* Order Row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.02]"
                onClick={() => setExpandedId(expanded ? null : order.id)}
              >
                {/* Expand icon */}
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform"
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ color: 'var(--text-muted)', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>

                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--accent-lime)' }}>{order.id}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{order.customer.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{order.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${order.total}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full w-fit capitalize"
                    style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded && (
                <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Customer Details</h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Name</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{order.customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Phone</span>
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{order.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Address</span>
                          <span className="text-xs font-semibold text-right" style={{ color: 'var(--text-primary)' }}>{order.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Order Items</h4>
                      <div className="flex flex-col gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                            <div>
                              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Size: {item.size} · {item.color} · Qty: {item.quantity}</p>
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                    {/* Status Update */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>Update Status:</span>
                      {statusOptions.map((s) => {
                        const ssc = statusColors[s];
                        const isCurrent = order.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => updateOrderStatus(order.id, s)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize transition-all active:scale-95"
                            style={{
                              backgroundColor: isCurrent ? ssc.bg : 'var(--bg-surface)',
                              color: isCurrent ? ssc.text : 'var(--text-muted)',
                              border: `1px solid ${isCurrent ? ssc.border : 'var(--border-color)'}`,
                              opacity: isCurrent ? 1 : 0.6,
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => { if (confirm('Delete this order?')) deleteOrder(order.id); }}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 hover:bg-red-500/10"
                      style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
