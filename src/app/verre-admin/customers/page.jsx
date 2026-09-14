'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const statusColors = {
  active: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
  vip: { bg: 'rgba(166,255,0,0.12)', text: 'var(--accent-lime)' },
  new: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa' },
  blocked: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
};

const emptyForm = { name: '', email: '', phone: '', city: '', status: 'new' };

export default function AdminCustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone || '', city: c.city || '', status: c.status });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const payload = { ...form, name: form.name.trim(), email: form.email.trim() };
    if (editingId) updateCustomer(editingId, payload);
    else addCustomer({ ...payload, orders: 0, spent: 0, joined: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const totalSpent = customers.reduce((s, c) => s + (c.spent || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Customers</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{customers.length} total · ${totalSpent.toLocaleString()} lifetime value</p>
        </div>
        <button
          onClick={openAdd}
          className="h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Customer
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-xs w-full" style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {['all', 'active', 'vip', 'new', 'blocked'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap capitalize transition-all"
              style={{
                backgroundColor: statusFilter === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: statusFilter === s ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ali Khan"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ali@example.com"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Karachi"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    {Object.keys(statusColors).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Customer'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 h-11 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Customer?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.name}&quot; will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteCustomer(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          {['Customer', 'Phone', 'City', 'Orders', 'Spent', 'Status', 'Actions'].map((h, i) => (
            <span key={h} className={`text-[10px] font-bold uppercase ${i === 0 ? 'col-span-3' : i === 6 ? 'col-span-2' : 'col-span-1.5'}`} style={{ color: 'var(--text-muted)' }}>{h}</span>
          ))}
        </div>

        {filtered.map((c, idx) => {
          const sc = statusColors[c.status] || statusColors.new;
          return (
            <div key={c.id} className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-5 py-3.5 items-center" style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div className="col-span-2 md:col-span-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: `${sc.text}20`, color: sc.text }}>
                    {c.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{c.email}</p>
                  </div>
                </div>
              </div>
              <span className="hidden md:block col-span-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.phone || '—'}</span>
              <span className="hidden md:block col-span-1.5 text-[11px] capitalize" style={{ color: 'var(--text-muted)' }}>{c.city || '—'}</span>
              <span className="hidden md:block col-span-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{c.orders || 0}</span>
              <span className="hidden md:block col-span-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${(c.spent || 0).toLocaleString()}</span>
              <span className="hidden md:block">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>{c.status}</span>
              </span>
              <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
                <button onClick={() => openEdit(c)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => setConfirmDelete(c)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No customers found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
