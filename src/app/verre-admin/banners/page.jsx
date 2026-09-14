'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { ImageInput } from '@/components/admin/ImageInput';

const emptyForm = { label: '', title: '', subtitle: '', desc: '', image: '', active: true };

export default function AdminBannersPage() {
  const { slides, addSlide, updateSlide, deleteSlide } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({ label: s.label, title: s.title, subtitle: s.subtitle, desc: s.desc, image: s.image, active: s.active });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.image.trim()) return;
    const payload = {
      label: form.label.trim().toUpperCase() || 'FEATURED',
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      desc: form.desc.trim(),
      image: form.image.trim(),
      active: form.active,
    };
    if (editingId) updateSlide(editingId, payload);
    else addSlide(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const activeCount = slides.filter((s) => s.active).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Banners / Sliders</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {slides.length} slides · {activeCount} live on homepage hero carousel
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
          Add Slide
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Slide' : 'Add New Slide'}
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Badge Label</label>
                <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="NEW ARRIVAL"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Headline *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="JUST DO IT."
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Subheadline</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="NIKE AIR MAX 270"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Description</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={2} placeholder="Iconic style. Unmatched comfort."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <ImageInput label="Slide Image *" value={form.image} onChange={(image) => setForm({ ...form, image })} previewH="h-36" />

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Show in hero carousel</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.title.trim() || !form.image.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Slide'}
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
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Slide?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.title}&quot; will be removed from the hero carousel.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteSlide(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="flex flex-col gap-4">
        {slides.map((slide, idx) => (
          <div key={slide.id} className="rounded-2xl overflow-hidden flex flex-col sm:flex-row" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {/* Preview */}
            <div className="relative w-full sm:w-56 h-36 sm:h-auto flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <Image src={slide.image} alt={slide.title} fill className="object-contain p-3" />
              <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                {idx + 1}
              </span>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--accent-lime)' }}>{slide.label}</span>
                {!slide.active && <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Hidden</span>}
              </div>
              <p className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>{slide.title}</p>
              <p className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{slide.subtitle}</p>
              <p className="text-[10px] line-clamp-2" style={{ color: 'var(--text-muted)' }}>{slide.desc}</p>

              {/* Toggle + Actions */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateSlide(slide.id, { active: !slide.active })}
                  className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: slide.active ? 'rgba(34,197,94,0.1)' : 'var(--bg-surface)',
                    color: slide.active ? '#22c55e' : 'var(--text-muted)',
                    border: `1px solid ${slide.active ? 'rgba(34,197,94,0.2)' : 'var(--border-color)'}`,
                  }}
                >
                  <span className={`w-2 h-2 rounded-full ${slide.active ? 'bg-current' : ''}`} style={{ backgroundColor: slide.active ? '#22c55e' : 'var(--border-color)' }} />
                  {slide.active ? 'Live' : 'Off'}
                </button>
                <button onClick={() => openEdit(slide)} className="text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => setConfirmDelete(slide)} className="text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No slides</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add a slide to show in the hero carousel.</p>
        </div>
      )}
    </div>
  );
}
