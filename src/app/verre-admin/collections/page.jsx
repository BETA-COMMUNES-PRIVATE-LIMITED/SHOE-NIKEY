'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import { ImageInput } from '@/components/admin/ImageInput';
import productsDataMen from '@/data/menProducts';
import productsDataWomen from '@/data/womenProducts';
import productsDataKids from '@/data/kidsProducts';

const sections = ['men', 'women', 'kids'];

// Full product pool across every section so the admin can link anything.
// `thumb` prefers images[0] (same resolution as the storefront) so the picker
// preview matches what shoppers see.
const builtInPool = [
  ...productsDataMen.map((p) => ({ id: `men-${p.id}`, name: p.name, thumb: p.images?.[0] || p.image, section: 'men', price: p.price })),
  ...productsDataWomen.map((p) => ({ id: `women-${p.id}`, name: p.name, thumb: p.images?.[0] || p.image, section: 'women', price: p.price })),
  ...productsDataKids.map((p) => ({ id: `kids-${p.id}`, name: p.name, thumb: p.images?.[0] || p.image, section: 'kids', price: p.price })),
];

const emptyForm = { title: '', desc: '', image: '', color: '#FFD700', section: 'men', productIds: [], active: true };

export default function AdminCollectionsPage() {
  const { collections, addCollection, updateCollection, deleteCollection, customProducts, applyProductOverrides, hiddenProducts, pageContent, savePageContent } = useAdmin();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [poolSection, setPoolSection] = useState('all');

  // Page header (title + intro) editing
  const header = pageContent['collections-header'] || { intro: 'Curated groups of shoes for every occasion, season, and style. Find the perfect pair.' };
  const [introDraft, setIntroDraft] = useState(header.intro);
  const [headerSaved, setHeaderSaved] = useState(false);

  const saveHeader = () => {
    savePageContent('collections-header', { intro: introDraft.trim() });
    setHeaderSaved(true);
    setTimeout(() => setHeaderSaved(false), 2000);
  };

  // Picker pool: layer admin overrides on built-ins (so renamed/edited
  // products show correctly), drop admin-hidden products entirely, and append
  // custom products.
  const productPool = applyProductOverrides(
    productsDataMen.map((p) => ({ ...p, id: `men-${p.id}`, section: 'men' })),
  )
    .concat(
      applyProductOverrides(
        productsDataWomen.map((p) => ({ ...p, id: `women-${p.id}`, section: 'women' })),
      ),
      applyProductOverrides(
        productsDataKids.map((p) => ({ ...p, id: `kids-${p.id}`, section: 'kids' })),
      ),
    )
    .filter((p) => !(hiddenProducts || []).includes(p.id))
    .map((p) => ({ id: p.id, name: p.name, thumb: p.images?.[0] || p.image, section: p.section, price: p.price }))
    .concat(
      customProducts.map((p) => ({ id: `${p.section}-${p.id}`, name: p.name, thumb: p.images?.[0] || p.image, section: p.section, price: p.price })),
    );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (col) => {
    setEditingId(col.id);
    setForm({
      title: col.title, desc: col.desc, image: col.image, color: col.color,
      section: col.section || 'men', productIds: [...(col.productIds || [])], active: col.active,
    });
    setShowForm(true);
  };

  const toggleProduct = (id) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((x) => x !== id)
        : [...prev.productIds, id],
    }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.image.trim()) return;
    const payload = {
      title: form.title.trim(),
      desc: form.desc.trim(),
      image: form.image.trim(),
      color: form.color,
      section: form.section,
      productIds: form.productIds,
      active: form.active,
    };
    if (editingId) updateCollection(editingId, payload);
    else addCollection(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const filteredPool = productPool
    .filter((p) => poolSection === 'all' || p.section === poolSection)
    .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()));

  // Products currently selected in the form, resolved for the live preview
  const selectedItems = form.productIds
    .map((id) => productPool.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Collections</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {collections.length} collections · Shown on /collections page
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
          Add Collection
        </button>
      </div>

      {/* Page Intro Editor */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Collections Page Intro</h3>
        <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>The paragraph shown under the &quot;Collections&quot; title on the storefront.</p>
        <textarea
          value={introDraft}
          onChange={(e) => setIntroDraft(e.target.value)}
          rows={2}
          placeholder="Curated groups of shoes for every occasion..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none mb-3"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
        <button
          onClick={saveHeader}
          className="h-9 px-5 rounded-full text-[11px] font-bold transition-all active:scale-95 w-fit"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          {headerSaved ? '✓ Saved!' : 'Save Intro'}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Collection' : 'Add New Collection'}
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Summer Essentials"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Description</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={2}
                  placeholder="Lightweight picks for warm days..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <ImageInput label="Collection Image *" value={form.image} onChange={(image) => setForm({ ...form, image })} previewH="h-40" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Accent Color</label>
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full h-11 rounded-xl cursor-pointer border-0 p-0"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Section</label>
                  <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Product Picker */}
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>
                  Products ({form.productIds.length} selected)
                </label>
                <div className="flex items-center gap-1.5 mb-2">
                  {['all', 'men', 'women', 'kids'].map((s) => (
                    <button key={s} onClick={() => setPoolSection(s)}
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-all"
                      style={{
                        backgroundColor: poolSection === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
                        color: poolSection === s ? '#000' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                      }}
                    >{s}</button>
                  ))}
                </div>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search all products..."
                  className="w-full h-10 px-4 rounded-xl text-xs outline-none mb-1"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <p className="text-[9px] mb-2" style={{ color: 'var(--text-muted)' }}>
                  Tiles on /collections use each product&apos;s main photo. Change it in Admin → Products → Edit → Product Photos.
                </p>
                <div className="max-h-44 overflow-y-auto flex flex-col gap-1.5 p-2 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  {filteredPool.map((p) => (
                    <label key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/[0.03]">
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="w-4 h-4"
                      />
                      <div className="relative w-7 h-7 rounded-md overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-card)' }}>
                        <Image src={p.thumb} alt={p.name} fill className="object-contain p-0.5" />
                      </div>
                      <span className="text-[11px] font-semibold flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                      <span className="text-[9px] font-bold uppercase flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{p.section}</span>
                      <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>${p.price}</span>
                    </label>
                  ))}
                  {filteredPool.length === 0 && (
                    <p className="text-[10px] text-center py-2" style={{ color: 'var(--text-muted)' }}>No products match</p>
                  )}
                </div>
              </div>

              {/* Live preview of the storefront card */}
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>
                  Preview — how the card appears on /collections
                </label>
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <div className="grid grid-cols-5">
                    {/* Banner (left) */}
                    <div className="relative col-span-2 aspect-square" style={{ backgroundColor: 'var(--bg-card)' }}>
                      {form.image ? (
                        <img src={form.image} alt="Banner preview" className="absolute inset-0 w-full h-full object-contain p-3" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>No banner image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 30% 50%, ${form.color}, transparent 60%)` }} />
                    </div>
                    {/* Description + product tiles (right) */}
                    <div className="col-span-3 p-3">
                      <p className="text-[9px] mb-2 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                        {form.desc || 'Description goes here…'}
                      </p>
                      {selectedItems.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1.5">
                          {selectedItems.slice(0, 8).map((item) => (
                            <div key={item.id} className="rounded-lg p-1" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                              <div className="relative aspect-square mb-1" style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.375rem' }}>
                                <img src={item.thumb} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-0.5" />
                              </div>
                              <p className="text-[7px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                              <p className="text-[7px] font-bold" style={{ color: form.color }}>${item.price}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-lg p-3 text-center" style={{ border: '1px dashed var(--border-color)' }}>
                          <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>No products linked — tiles appear here</p>
                        </div>
                      )}
                      {selectedItems.length > 8 && (
                        <p className="text-[8px] mt-1" style={{ color: 'var(--text-muted)' }}>+{selectedItems.length - 8} more</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Visible on collections page</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.title.trim() || !form.image.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Collection'}
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
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Collection?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.title}&quot; will be removed from the collections page.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteCollection(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-4">
        {collections.map((col) => (
          <div key={col.id} className="rounded-2xl overflow-hidden flex flex-col sm:flex-row" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="relative w-full sm:w-44 h-36 sm:h-auto flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <Image src={col.image} alt={col.title} fill className="object-contain p-3" />
            </div>
            <div className="flex-1 p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full" style={{ backgroundColor: col.color }} />
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{col.title}</p>
                {!col.active && <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Hidden</span>}
              </div>
              <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{col.desc}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {(col.productIds || []).length} products linked · Section: {col.section}
              </p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => openEdit(col)} className="text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => setConfirmDelete(col)} className="text-[10px] font-bold px-4 py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
