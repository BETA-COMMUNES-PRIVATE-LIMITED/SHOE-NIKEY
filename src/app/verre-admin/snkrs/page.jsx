'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { MultiImageInput } from '@/components/admin/ImageInput';

const sections = ['men', 'women', 'kids'];
const statuses = [
  { value: 'live', label: 'Live Now' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'sold-out', label: 'Sold Out' },
];
const statusColors = {
  live: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  upcoming: { bg: 'rgba(166,255,0,0.12)', color: 'var(--accent-lime)' },
  'sold-out': { bg: 'var(--bg-surface)', color: 'var(--text-muted)' },
};

const emptyForm = {
  name: '', type: '', price: '', images: [], section: 'men', productId: '',
  date: '', time: '10:00 AM EST', status: 'upcoming', tag: '', active: true,
};

const inputStyle = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
};

export default function AdminSnkrsPage() {
  const { drops, addDrop, updateDrop, deleteDrop, customProducts } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name || '',
      type: d.type || '',
      price: d.price ?? '',
      images: Array.isArray(d.images) && d.images.length ? d.images : d.image ? [d.image] : [],
      section: d.section || 'men',
      productId: d.productId || '',
      date: d.date || '',
      time: d.time || '10:00 AM EST',
      status: d.status || 'upcoming',
      tag: d.tag || '',
      active: d.active !== false,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || form.images.length === 0) return;
    const payload = {
      name: form.name.trim(),
      type: form.type.trim() || `${form.section === 'men' ? "Men's" : form.section === 'women' ? "Women's" : "Kids'"} Shoes`,
      price: Number(form.price) || 0,
      image: form.images[0],
      images: form.images,
      section: form.section,
      productId: form.productId.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      status: form.status,
      tag: form.tag.trim() || statuses.find((s) => s.value === form.status)?.label || 'Drop',
      active: form.active,
    };
    if (editingId) updateDrop(editingId, payload);
    else addDrop(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const liveCount = drops.filter((d) => d.status === 'live' && d.active !== false).length;
  const upcomingCount = drops.filter((d) => d.status === 'upcoming' && d.active !== false).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>SNKRS Drops</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {drops.length} drops · {liveCount} live · {upcomingCount} upcoming · Shown on /snkrs
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
          Add Drop
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Drop' : 'Add New Drop'}
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Drop Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nike Air Max Pulse"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>

              <div>
                <MultiImageInput label="Drop Photos" value={form.images} onChange={(images) => setForm({ ...form, images })} max={8} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Type</label>
                  <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Men's Shoes"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="180"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Launch Date</label>
                  <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Sep 12, 2026"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Time</label>
                  <input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM EST"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer" style={inputStyle}>
                    {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Badge Tag</label>
                  <input type="text" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Exclusive"
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Section</label>
                  <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer" style={inputStyle}>
                    {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Links To Product ID</label>
                  <input type="text" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}
                    placeholder={form.section === 'men' ? 'men-12' : form.section === 'women' ? 'women-1' : 'kids-1'}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                  {customProducts.filter((p) => p.section === form.section).length > 0 && (
                    <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Your custom {form.section} products: {customProducts.filter((p) => p.section === form.section).map((p) => `${form.section}-${p.id}`).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Show on SNKRS page</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.name.trim() || form.images.length === 0}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Drop'}
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
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Drop?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.name}&quot; will be removed from the SNKRS page.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteDrop(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Drops List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drops.map((d) => {
          const sc = statusColors[d.status] || statusColors.upcoming;
          return (
            <div key={d.id} className="rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', opacity: d.active === false ? 0.5 : 1 }}>
              <div className="relative w-full aspect-[4/3]" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <Image src={d.images?.[0] || d.image} alt={d.name} fill className="object-contain p-4" />
                <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color, border: '1px solid var(--border-color)' }}>
                  {d.status === 'live' && '● '}{d.tag || d.status}
                </span>
                {(d.images?.length || 0) > 1 && (
                  <span className="absolute bottom-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                    +{(d.images?.length || 1) - 1} pics
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{d.type} · ${d.price}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.date} · {d.time}</p>
                <p className="text-[10px]" style={{ color: 'var(--accent-lime)' }}>Links to: /{d.section}/{(d.productId || '').replace(`${d.section}-`, '') || '—'}</p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button
                    onClick={() => updateDrop(d.id, { active: d.active === false })}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: d.active !== false ? 'rgba(34,197,94,0.1)' : 'var(--bg-surface)',
                      color: d.active !== false ? '#22c55e' : 'var(--text-muted)',
                      border: `1px solid ${d.active !== false ? 'rgba(34,197,94,0.2)' : 'var(--border-color)'}`,
                    }}
                  >
                    {d.active !== false ? 'Live' : 'Off'}
                  </button>
                  <button onClick={() => openEdit(d)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                  <button onClick={() => setConfirmDelete(d)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {drops.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No drops</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add your first drop to show it on /snkrs.</p>
        </div>
      )}
    </div>
  );
}
