'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = ['Lifestyle', 'Running', 'Basketball', 'Training', 'Slides'];

const emptyForm = {
  name: '', type: '', category: 'Lifestyle', price: '',
  description: '', image: '', colorName: 'Default', colorHex: '#000000',
  sizes: '', isNew: false, isComingSoon: false,
};

export default function ProductForm({ section, product, onSave, onClose }) {
  const isEdit = !!product;
  const sectionLabel = section === 'men' ? "Men's" : section === 'women' ? "Women's" : "Kids'";

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        type: product.type || '',
        category: product.category || 'Lifestyle',
        price: product.price || '',
        description: product.description || '',
        image: product.image || '',
        colorName: product.colorName || 'Default',
        colorHex: product.colorHex || '#000000',
        sizes: product.sizes ? product.sizes.join(', ') : '',
        isNew: product.isNew || false,
        isComingSoon: product.isComingSoon || false,
      });
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Valid price is required';
    if (!form.image.trim()) newErrors.image = 'Image URL is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    const sizes = form.sizes
      ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : section === 'kids' ? ['0yr', '1yr', '2yr', '3yr', '4yr', '5yr', '6yr', '7yr']
      : section === 'women' ? [5, 6, 7, 8, 9, 10, 11]
      : [7, 8, 9, 10, 11, 12];

    const productData = {
      name: form.name.trim(),
      type: form.type.trim() || `${sectionLabel} Shoes`,
      category: form.category,
      section,
      price: Number(form.price),
      description: form.description.trim() || `${form.name} — Premium quality footwear.`,
      image: form.image.trim(),
      images: [form.image.trim()],
      sizes,
      colorName: form.colorName,
      colorHex: form.colorHex,
      colors: [{ name: form.colorName, hex: form.colorHex }],
      isNew: form.isNew,
      isComingSoon: form.isComingSoon,
    };

    setTimeout(() => {
      onSave(productData);
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    }, 400);
  };

  const handleImageError = () => {
    setErrors((prev) => ({ ...prev, image: 'Invalid image URL' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-dropdown"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isEdit ? 'rgba(96, 165, 250, 0.1)' : 'rgba(166, 255, 0, 0.1)' }}>
              {isEdit ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#60a5fa' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--accent-lime)' }}>
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{sectionLabel} Collection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-all hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
            {isEdit ? 'Product updated successfully!' : 'Product added successfully!'}
          </div>
        )}

        {/* Form */}
        <div className="p-6 flex flex-col gap-4">
          {/* Image Preview */}
          {form.image && (
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-card)' }}>
                <Image src={form.image} alt="Preview" fill className="object-contain p-1" onError={handleImageError} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{form.name || 'Product Name'}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{form.type || `${sectionLabel} Shoes`} · {form.category}</p>
                <p className="text-xs font-bold mt-1" style={{ color: 'var(--accent-lime)' }}>${form.price || '0'}</p>
              </div>
            </div>
          )}

          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                Product Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => ({ ...p, name: null })); }}
                placeholder="Nike Air Max 2026"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${errors.name ? '#ef4444' : 'var(--border-color)'}`,
                  color: 'var(--text-primary)',
                }}
              />
              {errors.name && <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
            </div>
            <div>
              <label className="text-[11px] font-bold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                Price ($) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input type="number" value={form.price} onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrors((p) => ({ ...p, price: null })); }}
                placeholder="120"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${errors.price ? '#ef4444' : 'var(--border-color)'}`,
                  color: 'var(--text-primary)',
                }}
              />
              {errors.price && <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>{errors.price}</p>}
            </div>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Type</label>
              <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder={`${sectionLabel} Shoes`}
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
              Image URL <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input type="text" value={form.image} onChange={(e) => { setForm({ ...form, image: e.target.value }); setErrors((p) => ({ ...p, image: null })); }}
              placeholder="/images/r1.png or https://..."
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${errors.image ? '#ef4444' : 'var(--border-color)'}`,
                color: 'var(--text-primary)',
              }}
            />
            {errors.image && <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>{errors.image}</p>}
          </div>

          {/* Sizes & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Sizes (comma separated)</label>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder={section === 'kids' ? '0yr, 1yr, 2yr, 3yr' : '7, 8, 9, 10, 11, 12'}
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  className="w-11 h-11 rounded-xl cursor-pointer border-0 p-0"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                />
                <input type="text" value={form.colorName} onChange={(e) => setForm({ ...form, colorName: e.target.value })}
                  placeholder="White"
                  className="flex-1 h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Premium quality footwear with modern design..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="sr-only" />
                <div className="w-10 h-5 rounded-full transition-all" style={{ backgroundColor: form.isNew ? 'var(--accent-lime)' : 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ left: form.isNew ? '22px' : '2px', backgroundColor: form.isNew ? '#000' : 'var(--text-muted)' }} />
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>New Arrival</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={form.isComingSoon} onChange={(e) => setForm({ ...form, isComingSoon: e.target.checked })} className="sr-only" />
                <div className="w-10 h-5 rounded-full transition-all" style={{ backgroundColor: form.isComingSoon ? '#fbbf24' : 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ left: form.isComingSoon ? '22px' : '2px', backgroundColor: form.isComingSoon ? '#000' : 'var(--text-muted)' }} />
                </div>
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Coming Soon</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onClose}
            className="h-11 px-6 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || saved}
            className="h-11 px-8 rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: saved ? '#22c55e' : 'var(--accent-lime)', color: '#000' }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: '#000' }} />
                Saving...
              </>
            ) : saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                Saved!
              </>
            ) : (
              isEdit ? 'Update Product' : 'Add Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
