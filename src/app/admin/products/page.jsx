'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import productsDataMen from '@/data/menProducts';
import productsDataWomen from '@/data/womenProducts';
import productsDataKids from '@/data/kidsProducts';

const builtInProducts = [
  ...productsDataMen.map((p) => ({ ...p, section: 'men', sectionLabel: 'Men', isBuiltIn: true })),
  ...productsDataWomen.map((p) => ({ ...p, section: 'women', sectionLabel: 'Women', isBuiltIn: true })),
  ...productsDataKids.map((p) => ({ ...p, section: 'kids', sectionLabel: 'Kids', isBuiltIn: true })),
];

const sections = ['All', 'Men', 'Women', 'Kids'];
const categories = ['All', 'Lifestyle', 'Running', 'Basketball', 'Training', 'Slides'];

const emptyForm = {
  name: '', type: '', category: 'Lifestyle', section: 'men', price: '',
  description: '', image: '', colorName: 'Default', colorHex: '#000000',
  sizes: '', isNew: false, isComingSoon: false,
};

export default function AdminProductsPage() {
  const { customProducts, addProduct, deleteProduct } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeSection, setActiveSection] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const allProducts = [...builtInProducts, ...customProducts.map((p) => ({ ...p, sectionLabel: p.section === 'men' ? 'Men' : p.section === 'women' ? 'Women' : 'Kids', isBuiltIn: false }))];

  let filtered = allProducts;

  if (activeSection !== 'All') {
    filtered = filtered.filter((p) => p.sectionLabel === activeSection);
  }
  if (activeCategory !== 'All') {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)
    );
  }

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
    return 0;
  });

  const totalProducts = allProducts.length;
  const inStock = allProducts.filter((p) => !p.isComingSoon).length;
  const comingSoon = allProducts.filter((p) => p.isComingSoon).length;
  const avgPrice = totalProducts > 0 ? Math.round(allProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts) : 0;

  const handleSave = () => {
    if (!form.name || !form.price || !form.image) return;
    setSaving(true);

    const sizes = form.sizes
      ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      : ['S', 'M', 'L', 'XL'];

    addProduct({
      name: form.name,
      type: form.type || "Men's Shoes",
      category: form.category,
      section: form.section,
      price: Number(form.price),
      description: form.description || `${form.name} — Premium quality footwear from Vére.`,
      image: form.image,
      images: [form.image],
      sizes,
      colorName: form.colorName,
      colorHex: form.colorHex,
      colors: [{ name: form.colorName, hex: form.colorHex }],
      isNew: form.isNew,
      isComingSoon: form.isComingSoon,
    });

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowForm(false);
        setForm(emptyForm);
      }, 1500);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Products</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage your product catalog · {customProducts.length} custom</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Add New Product</h3>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="p-1 rounded-lg transition-all hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              Product added successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nike Air Max 2026"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Type */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Type</label>
              <input type="text" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Men's Shoes"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Price ($) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="120"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Image URL */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Image URL *</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/r1.png or https://..."
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Section */}
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

            {/* Sizes */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Sizes (comma separated)</label>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                placeholder="7, 8, 9, 10, 11, 12"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Color Name */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Color Name</label>
              <input type="text" value={form.colorName} onChange={(e) => setForm({ ...form, colorName: e.target.value })}
                placeholder="White"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Color Hex */}
            <div>
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  className="w-11 h-11 rounded-xl cursor-pointer border-0 p-0"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                />
                <input type="text" value={form.colorHex} onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                  className="flex-1 h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Premium quality footwear with modern design and all-day comfort..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  className="w-4 h-4 rounded accent-lime-400"
                />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>New Arrivals</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isComingSoon} onChange={(e) => setForm({ ...form, isComingSoon: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Coming Soon</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {form.image && (
            <div className="mt-4 flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-card)' }}>
                <Image src={form.image} alt="Preview" fill className="object-contain p-1" />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{form.name || 'Product Name'}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{form.type || "Men's Shoes"} · {form.category}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: 'var(--accent-lime)' }}>${form.price || '0'}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <button onClick={handleSave} disabled={!form.name || !form.price || !form.image || saving}
              className="h-11 px-6 rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Product'}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
              className="h-11 px-6 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: totalProducts, color: 'var(--accent-lime)' },
          { label: 'In Stock', value: inStock, color: '#22c55e' },
          { label: 'Coming Soon', value: comingSoon, color: '#fbbf24' },
          { label: 'Avg Price', value: `$${avgPrice}`, color: 'var(--text-primary)' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-xs w-full"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            {sections.map((s) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
                style={{
                  backgroundColor: activeSection === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
                  color: activeSection === s ? '#000' : 'var(--text-muted)',
                  border: '1px solid var(--border-color)',
                }}
              >{s}</button>
            ))}
          </div>
          <div className="w-px h-5" style={{ backgroundColor: 'var(--border-color)' }} />
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all active:scale-95"
                style={{
                  backgroundColor: activeCategory === c ? 'var(--bg-surface)' : 'transparent',
                  color: activeCategory === c ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: `1px solid ${activeCategory === c ? 'var(--border-color)' : 'transparent'}`,
                }}
              >{c}</button>
            ))}
          </div>
          <div className="w-px h-5" style={{ backgroundColor: 'var(--border-color)' }} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full text-[10px] font-bold outline-none cursor-pointer"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Image</span>
          <span className="col-span-3 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Product</span>
          <span className="col-span-2 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Category</span>
          <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Section</span>
          <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Price</span>
          <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Rating</span>
          <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Sizes</span>
          <span className="col-span-2 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No products found</p>
          </div>
        )}

        {filtered.map((product) => (
          <div key={`${product.section}-${product.id}`}
            className="grid grid-cols-12 gap-4 px-5 py-3 items-center transition-all hover:bg-white/[0.02]"
            style={{ borderBottom: '1px solid var(--border-color)' }}
          >
            <div className="col-span-12 md:col-span-1">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
              </div>
            </div>
            <div className="col-span-6 md:col-span-3">
              <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{product.type}</p>
            </div>
            <div className="col-span-3 md:col-span-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                {product.category}
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 hidden md:block">
              <span className="text-[10px] font-bold" style={{ color: 'var(--accent-lime)' }}>{product.sectionLabel}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${product.price}</span>
            </div>
            <div className="col-span-1 md:col-span-1 hidden md:block">
              {product.rating ? (
                <span className="text-[10px] flex items-center gap-1">
                  <span style={{ color: '#FFD700' }}>★</span>
                  <span style={{ color: 'var(--text-muted)' }}>{product.rating}</span>
                </span>
              ) : <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}
            </div>
            <div className="col-span-1 md:col-span-1 hidden md:block">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{product.sizes?.length || 0}</span>
            </div>
            <div className="col-span-12 md:col-span-2 flex items-center gap-2">
              {product.isBuiltIn ? (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  Built-in
                </span>
              ) : (
                <>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'rgba(166, 255, 0, 0.1)', color: 'var(--accent-lime)', border: '1px solid rgba(166, 255, 0, 0.2)' }}>
                    Custom
                  </span>
                  <button onClick={() => { if (confirm('Delete this product?')) deleteProduct(product.id); }}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md transition-all hover:bg-red-500/10"
                    style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
