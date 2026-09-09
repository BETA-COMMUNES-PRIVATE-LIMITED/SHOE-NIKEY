'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import productsDataKids from '@/data/kidsProducts';
import ProductForm from '@/components/admin/ProductForm';

const categories = ['All', 'Lifestyle', 'Running', 'Basketball', 'Training', 'Slides'];

export default function AdminKidsProductsPage() {
  const { customProducts, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const builtIn = productsDataKids.map((p) => ({ ...p, section: 'kids', isBuiltIn: true }));
  const custom = customProducts.filter((p) => p.section === 'kids').map((p) => ({ ...p, isBuiltIn: false }));
  const allProducts = [...builtIn, ...custom];

  let filtered = allProducts;
  if (activeCategory !== 'All') filtered = filtered.filter((p) => p.category === activeCategory);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
  }

  const totalProducts = allProducts.length;
  const inStock = allProducts.filter((p) => !p.isComingSoon).length;
  const comingSoon = allProducts.filter((p) => p.isComingSoon).length;
  const avgPrice = totalProducts > 0 ? Math.round(allProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts) : 0;

  const handleSave = (productData) => {
    if (editingProduct) updateProduct(editingProduct.id, productData);
    else addProduct(productData);
  };
  const handleEdit = (product) => { setEditingProduct(product); setShowForm(true); };
  const handleDelete = (id) => { deleteProduct(id); setDeleteConfirm(null); };
  const handleCloseForm = () => { setShowForm(false); setEditingProduct(null); };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Kids&apos; Products</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{totalProducts} products · {custom.length} custom added</p>
        </div>
        <button onClick={() => { setEditingProduct(null); setShowForm(true); }}
          className="px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95"
          style={{ backgroundColor: '#a855f7', color: '#fff' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {showForm && <ProductForm section="kids" product={editingProduct} onSave={handleSave} onClose={handleCloseForm} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Product?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>&quot;{deleteConfirm.name}&quot; will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-full text-xs font-semibold transition-all active:scale-95" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 h-10 rounded-full text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ label: 'Total', value: totalProducts, color: '#a855f7' }, { label: 'In Stock', value: inStock, color: '#22c55e' }, { label: 'Coming Soon', value: comingSoon, color: '#fbbf24' }, { label: 'Avg Price', value: `$${avgPrice}`, color: 'var(--text-primary)' }].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-xs w-full" style={{ color: 'var(--text-primary)' }} />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setViewMode('grid')} className="p-2 rounded-lg transition-all" style={{ backgroundColor: viewMode === 'grid' ? '#a855f7' : 'transparent', color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className="p-2 rounded-lg transition-all" style={{ backgroundColor: viewMode === 'list' ? '#a855f7' : 'transparent', color: viewMode === 'list' ? '#fff' : 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)} className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all active:scale-95"
              style={{ backgroundColor: activeCategory === c ? '#a855f7' : 'var(--bg-surface)', color: activeCategory === c ? '#fff' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{c}</button>
          ))}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={`${product.section}-${product.id}`} className="group rounded-2xl overflow-hidden transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="relative w-full aspect-square" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                {product.isNew && <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#a855f7', color: '#fff' }}>NEW</span>}
                {product.isComingSoon && <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}>SOON</span>}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button onClick={() => handleEdit(product)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#fff' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  {!product.isBuiltIn && (
                    <button onClick={() => setDeleteConfirm(product)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: 'rgba(239, 68, 68, 0.3)', backdropFilter: 'blur(4px)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#ef4444' }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{product.type}</p>
                <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${product.price}</span>
                  <span className="text-[10px] flex items-center gap-1"><span style={{ color: '#FFD700' }}>★</span><span style={{ color: 'var(--text-muted)' }}>{product.rating || '—'}</span></span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{product.category}</span>
                  {product.isBuiltIn ? <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)' }}>Built-in</span> : <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(166, 255, 0, 0.1)', color: 'var(--accent-lime)', border: '1px solid rgba(166, 255, 0, 0.2)' }}>Custom</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Image</span>
            <span className="col-span-3 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Product</span>
            <span className="col-span-2 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Category</span>
            <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Price</span>
            <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Rating</span>
            <span className="col-span-1 text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Status</span>
            <span className="col-span-3 text-[10px] font-bold uppercase text-right" style={{ color: 'var(--text-muted)' }}>Actions</span>
          </div>
          {filtered.map((product) => (
            <div key={`${product.section}-${product.id}`} className="grid grid-cols-12 gap-4 px-5 py-3 items-center transition-all hover:bg-white/[0.02]" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="col-span-12 md:col-span-1"><div className="relative w-12 h-12 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}><Image src={product.image} alt={product.name} fill className="object-contain p-1" /></div></div>
              <div className="col-span-6 md:col-span-3"><p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p><p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{product.type}</p></div>
              <div className="col-span-3 md:col-span-2"><span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>{product.category}</span></div>
              <div className="col-span-2 md:col-span-1"><span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${product.price}</span></div>
              <div className="col-span-1 md:col-span-1 hidden md:block">{product.rating ? <span className="text-[10px] flex items-center gap-1"><span style={{ color: '#FFD700' }}>★</span><span style={{ color: 'var(--text-muted)' }}>{product.rating}</span></span> : <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>—</span>}</div>
              <div className="col-span-2 md:col-span-1 hidden md:block">{product.isComingSoon ? <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>Soon</span> : product.isNew ? <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>New</span> : <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>Active</span>}</div>
              <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-2">
                <button onClick={() => handleEdit(product)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>Edit
                </button>
                {!product.isBuiltIn && (
                  <button onClick={() => setDeleteConfirm(product)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No products found</p>
        </div>
      )}
    </div>
  );
}
