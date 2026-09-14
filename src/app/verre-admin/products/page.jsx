'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import productsDataMen from '@/data/menProducts';
import productsDataWomen from '@/data/womenProducts';
import productsDataKids from '@/data/kidsProducts';
import ProductForm from '@/components/admin/ProductForm';

const builtInProducts = [
  ...productsDataMen.map((p) => ({ ...p, section: 'men', sectionLabel: 'Men', isBuiltIn: true })),
  ...productsDataWomen.map((p) => ({ ...p, section: 'women', sectionLabel: 'Women', isBuiltIn: true })),
  ...productsDataKids.map((p) => ({ ...p, section: 'kids', sectionLabel: 'Kids', isBuiltIn: true })),
];

const sections = ['All', 'Men', 'Women', 'Kids'];
const categories = ['All', 'Lifestyle', 'Running', 'Basketball', 'Training', 'Slides'];

export default function AdminProductsPage() {
  const { customProducts, applyProductOverrides, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saved, setSaved] = useState(false);

  const [activeSection, setActiveSection] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const allProducts = [
    ...applyProductOverrides(builtInProducts),
    ...customProducts.map((p) => ({ ...p, sectionLabel: p.section === 'men' ? 'Men' : p.section === 'women' ? 'Women' : 'Kids', isBuiltIn: false })),
  ];

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

  const handleSave = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
      setEditingProduct(null);
    }, 900);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
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
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Product Form Modal (shared with men/women/kids — supports multiple photos) */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}

      {/* Success toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl text-xs font-semibold flex items-center gap-2 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
          Product saved successfully!
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
