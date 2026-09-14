'use client';

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';

const emptyForm = { code: '', type: 'percent', value: '', minOrder: 0, usageLimit: 100, expires: '', active: true };

export default function AdminCouponsPage() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      code: c.code, type: c.type, value: c.value, minOrder: c.minOrder,
      usageLimit: c.usageLimit, expires: c.expires || '', active: c.active,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.code.trim()) return;
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value) || 0,
      minOrder: Number(form.minOrder) || 0,
      usageLimit: Number(form.usageLimit) || 0,
      expires: form.expires,
      active: form.active,
    };
    if (editingId) updateCoupon(editingId, payload);
    else addCoupon({ ...payload, used: 0 });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const typeLabel = (c) => {
    if (c.type === 'percent') return `${c.value}% off`;
    if (c.type === 'fixed') return `$${c.value} off`;
    return 'Free Shipping';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Coupons & Offers</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {coupons.filter((c) => c.active).length} active · Customers can apply these codes at checkout
          </p>
        </div>
        <button
          onClick={openAdd}
          className="h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Coupon
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Coupon' : 'Add New Coupon'}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Code *</label>
                  <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none uppercase font-bold"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="percent">Percent Discount</option>
                    <option value="fixed">Fixed Amount Off</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {form.type !== 'shipping' && (
                  <div>
                    <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{form.type === 'percent' ? 'Percent' : 'Amount ($)'}</label>
                    <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="10"
                      className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  </div>
                )}
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Min Order ($)</label>
                  <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="0"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="100"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Expires On</label>
                <input type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Active (usable at checkout)</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.code.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Coupon'}
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
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Coupon?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              Code &quot;{confirmDelete.code}&quot; will stop working immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteCoupon(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          {['Code', 'Discount', 'Min Order', 'Usage', 'Expires', 'Status', 'Actions'].map((h, i) => (
            <span key={h} className={`text-[10px] font-bold uppercase ${i === 0 ? 'col-span-2' : i === 6 ? 'col-span-2' : 'col-span-1.5'}`} style={{ color: 'var(--text-muted)' }}>{h}</span>
          ))}
        </div>

        {coupons.map((c, idx) => {
          const expired = c.expires && new Date(c.expires) < new Date();
          const exhausted = c.usageLimit > 0 && c.used >= c.usageLimit;
          return (
            <div key={c.id} className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4 px-5 py-3.5 items-center" style={{ borderBottom: idx < coupons.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div className="col-span-2 md:col-span-2">
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg inline-block" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--accent-lime)', border: '1px dashed var(--accent-lime)' }}>
                  {c.code}
                </span>
              </div>
              <span className="hidden md:block col-span-1.5 text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{typeLabel(c)}</span>
              <span className="hidden md:block col-span-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.minOrder > 0 ? `$${c.minOrder}+` : 'Any'}</span>
              <span className="hidden md:block col-span-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.used}/{c.usageLimit || '∞'}</span>
              <span className="hidden md:block col-span-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.expires || 'Never'}</span>
              <span className="hidden md:block">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md capitalize" style={{
                  backgroundColor: !c.active || expired || exhausted ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
                  color: !c.active || expired || exhausted ? '#ef4444' : '#22c55e',
                }}>
                  {!c.active ? 'Disabled' : expired ? 'Expired' : exhausted ? 'Exhausted' : 'Active'}
                </span>
              </span>
              <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => updateCoupon(c.id, { active: !c.active })}
                  className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ color: c.active ? '#fbbf24' : '#22c55e', border: '1px solid var(--border-color)' }}
                >
                  {c.active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => openEdit(c)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => setConfirmDelete(c)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
              </div>
            </div>
          );
        })}

        {coupons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No coupons</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Create your first discount code.</p>
          </div>
        )}
      </div>
    </div>
  );
}
