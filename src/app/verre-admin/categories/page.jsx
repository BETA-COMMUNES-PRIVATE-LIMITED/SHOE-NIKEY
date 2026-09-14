'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { ImageInput } from '@/components/admin/ImageInput';

const sections = ['men', 'women', 'kids'];

const emptyForm = { name: '', image: '', section: 'men', active: true };

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, image: cat.image, section: cat.section, active: cat.active });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.image.trim()) return;
    if (editingId) {
      updateCategory(editingId, { ...form, name: form.name.trim(), image: form.image.trim() });
    } else {
      addCategory({ ...form, name: form.name.trim(), image: form.image.trim() });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Categories</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {categories.length} categories · Shown in &quot;Shop by Category&quot; on homepage
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
          Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Running"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <ImageInput label="Category Image *" value={form.image} onChange={(image) => setForm({ ...form, image })} previewH="h-32" />

              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Links To Section</label>
                <select
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Visible on homepage</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.name.trim() || !form.image.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Category'}
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
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Category?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.name}&quot; will be removed from the homepage.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteCategory(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="relative w-full aspect-square" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <Image src={cat.image} alt={cat.name} fill className="object-contain p-4" />
              {!cat.active && (
                <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Hidden</span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <div>
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{cat.name}</p>
                <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>Links to /{cat.section}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => setConfirmDelete(cat)} className="flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No categories</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add your first category to show it on the homepage.</p>
        </div>
      )}
    </div>
  );
}
