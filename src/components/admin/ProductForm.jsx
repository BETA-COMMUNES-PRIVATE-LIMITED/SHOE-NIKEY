'use client';

import { useState, useEffect } from 'react';
import { MultiImageInput } from '@/components/admin/ImageInput';

const categories = ['Lifestyle', 'Running', 'Basketball', 'Training', 'Slides'];

const emptyForm = {
  name: '', type: '', category: 'Lifestyle', section: 'men', price: '',
  description: '', images: [], colorName: 'Default', colorHex: '#000000', moreColors: [],
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
      const imgs = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image ? [product.image] : [];
      setForm({
        name: product.name || '',
        type: product.type || '',
        category: product.category || 'Lifestyle',
        section: product.section || section || 'men',
        price: product.price || '',
        description: product.description || '',
        images: imgs,
        colorName: product.colors?.[0]?.name || product.colorName || 'Default',
        colorHex: product.colors?.[0]?.hex || product.colorHex || '#000000',
        moreColors: (product.colors || []).slice(1).map((c) => ({
          name: c.name || '',
          hex: c.hex || '#000000',
          images: Array.isArray(c.images) ? c.images.filter(Boolean) : [],
        })),
        sizes: product.sizes ? product.sizes.join(', ') : '',
        isNew: product.isNew || false,
        isComingSoon: product.isComingSoon || false,
      });
    } else {
      setForm({ ...emptyForm, section: section || 'men' });
    }
  }, [product, section]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Valid price is required';
    if (form.images.length === 0) newErrors.images = 'At least 1 photo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);

    const activeSection = form.section || section || 'men';
    const sizes = form.sizes
      ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : activeSection === 'kids' ? ['0yr', '1yr', '2yr', '3yr', '4yr', '5yr', '6yr', '7yr']
      : activeSection === 'women' ? [5, 6, 7, 8, 9, 10, 11]
      : [7, 8, 9, 10, 11, 12];

    const first = form.images[0];

    // Build the colors array the storefront reads: colors[0] is the default
    // (owns the main photo set); extra colors may carry their own photo set —
    // when they don't, the storefront falls back to the main photos.
    const extraColors = form.moreColors
      .map((c, i) => ({
        name: (c.name || `Color ${i + 2}`).trim(),
        hex: c.hex || '#000000',
        images: (c.images || []).filter(Boolean),
      }))
      .map((c) => (c.images.length > 0 ? c : { name: c.name, hex: c.hex }));
    const colors = [
      { name: (form.colorName || 'Default').trim(), hex: form.colorHex || '#000000', images: form.images },
      ...extraColors,
    ];

    const productData = {
      name: form.name.trim(),
      type: form.type.trim() || `${form.section === 'men' ? "Men's" : form.section === 'women' ? "Women's" : "Kids'"} Shoes`,
      category: form.category,
      section: activeSection,
      price: Number(form.price),
      description: form.description.trim() || `${form.name} — Premium quality footwear.`,
      image: first,
      images: form.images,
      sizes,
      colorName: colors[0].name,
      colorHex: colors[0].hex,
      colors,
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
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{section ? `${sectionLabel} Collection` : 'All Collections'}</p>
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
          {/* Default color + its photos */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>
              Default Color <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="flex items-center gap-2 mb-3">
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
            <MultiImageInput
              label={`Photos — ${form.colorName || 'Default color'} (main)`}
              value={form.images}
              onChange={(images) => { setForm((p) => ({ ...p, images })); setErrors((prev) => ({ ...prev, images: null })); }}
              max={8}
              hint="Shown on cards and when no color-specific set exists. First photo is the main one."
            />
            {errors.images && <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>{errors.images}</p>}
          </div>

          {/* Additional colors, each with its own photo set */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
                Additional Colors <span style={{ color: 'var(--text-muted)' }}>({form.moreColors.length})</span>
              </label>
              <button type="button" onClick={() => setForm((p) => ({ ...p, moreColors: [...p.moreColors, { name: '', hex: '#cccccc', images: [] }] }))}
                className="h-8 px-3 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Color
              </button>
            </div>
            {form.moreColors.length === 0 && (
              <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Optional. Each color can have its own side-view photos — shown when the customer picks that swatch.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {form.moreColors.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="color" value={c.hex}
                      onChange={(e) => setForm((p) => ({ ...p, moreColors: p.moreColors.map((x, i) => (i === idx ? { ...x, hex: e.target.value } : x)) }))}
                      className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                    <input type="text" value={c.name} placeholder={`Color ${idx + 2} (e.g. Black)`}
                      onChange={(e) => setForm((p) => ({ ...p, moreColors: p.moreColors.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)) }))}
                      className="flex-1 h-9 px-3 rounded-lg text-xs outline-none"
                      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, moreColors: p.moreColors.filter((_, i) => i !== idx) }))}
                      className="w-8 h-8 rounded-full text-[11px] font-bold flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(239,68,68,0.85)', color: '#fff' }}
                      title="Remove color"
                    >
                      ✕
                    </button>
                  </div>
                  <MultiImageInput
                    label={`Photos for ${c.name || `Color ${idx + 2}`}`}
                    value={c.images}
                    onChange={(images) => setForm((p) => ({ ...p, moreColors: p.moreColors.map((x, i) => (i === idx ? { ...x, images } : x)) }))}
                    max={8}
                    hint="Leave empty to reuse the main photos for this color."
                  />
                </div>
              ))}
            </div>
          </div>

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

          {/* Section (only when the form isn't scoped to a fixed section page) */}
          {!section && (
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Section</label>
              <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>
          )}

          {/* Sizes */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Sizes (comma separated)</label>
            <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              placeholder={(form.section || section) === 'kids' ? '0yr, 1yr, 2yr, 3yr' : '7, 8, 9, 10, 11, 12'}
              className="w-full h-11 px-4 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
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
