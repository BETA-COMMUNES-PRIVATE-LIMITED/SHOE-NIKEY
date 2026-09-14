'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { PAGE_SCHEMAS } from '@/data/pageDefaults';

/* ================= FAQs Tab ================= */

const faqEmptyForm = { q: '', a: '', active: true };

function FaqsTab() {
  const { faqs, addFaq, updateFaq, deleteFaq } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(faqEmptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(faqEmptyForm);
    setShowForm(true);
  };

  const openEdit = (f) => {
    setEditingId(f.id);
    setForm({ q: f.q, a: f.a, active: f.active });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.q.trim() || !form.a.trim()) return;
    const payload = { q: form.q.trim(), a: form.a.trim(), active: form.active };
    if (editingId) updateFaq(editingId, payload);
    else addFaq(payload);
    setShowForm(false);
    setEditingId(null);
    setForm(faqEmptyForm);
  };

  return (
    <>
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Pages</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {faqs.length} FAQ questions · Shown on /faqs page
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
          Add FAQ
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-dropdown" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Question *</label>
                <input type="text" value={form.q} onChange={(e) => setForm({ ...form, q: e.target.value })} placeholder="How do I place an order?"
                  className="w-full h-11 px-4 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Answer *</label>
                <textarea value={form.a} onChange={(e) => setForm({ ...form, a: e.target.value })} rows={4} placeholder="Browse our collection, select your size..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Visible on FAQs page</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.q.trim() || !form.a.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add FAQ'}
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
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete FAQ?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.q}&quot; will be removed from the FAQs page.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteFaq(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="flex flex-col gap-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
                  {!faq.active && <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>Hidden</span>}
                </div>
                <p className="text-[11px] mt-1.5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateFaq(faq.id, { active: !faq.active })}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: faq.active ? 'rgba(34,197,94,0.1)' : 'var(--bg-surface)',
                    color: faq.active ? '#22c55e' : 'var(--text-muted)',
                    border: `1px solid ${faq.active ? 'rgba(34,197,94,0.2)' : 'var(--border-color)'}`,
                  }}
                >
                  {faq.active ? 'Live' : 'Off'}
                </button>
                <button onClick={() => openEdit(faq)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-blue-500/10" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => setConfirmDelete(faq)} className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No FAQs</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add your first FAQ to show it on the site.</p>
        </div>
      )}
    </>
  );
}

/* ================= Content Pages Tab ================= */

const contentEmptySection = { title: '', body: '' };

function ContentPageTab({ slug, label }) {
  const { pageContent, savePageContent } = useAdmin();
  const current = pageContent[slug] || { intro: '', sections: [], data: {} };
  const [intro, setIntro] = useState(current.intro || '');
  const [sections, setSections] = useState(current.sections || []);
  // Built-in page blocks (cards/charts/articles) — edited via Page Data below
  const [pageData, setPageData] = useState(current.data || {});
  const [saved, setSaved] = useState(false);
  const [sectionForm, setSectionForm] = useState(contentEmptySection);
  const [editingIdx, setEditingIdx] = useState(null);

  // Reset local state when switching pages
  useEffect(() => {
    const c = pageContent[slug] || { intro: '', sections: [], data: {} };
    setIntro(c.intro || '');
    setSections(c.sections || []);
    setPageData(c.data || {});
    setSectionForm(contentEmptySection);
    setEditingIdx(null);
  }, [pageContent, slug]);

  const handleAddOrUpdateSection = () => {
    if (!sectionForm.title.trim() || !sectionForm.body.trim()) return;
    const s = { title: sectionForm.title.trim(), body: sectionForm.body.trim() };
    if (editingIdx !== null) {
      setSections((prev) => prev.map((item, i) => (i === editingIdx ? s : item)));
    } else {
      setSections((prev) => [...prev, s]);
    }
    setSectionForm(contentEmptySection);
    setEditingIdx(null);
  };

  const handleSave = () => {
    savePageContent(slug, {
      intro: intro.trim(),
      sections: sections.filter((s) => s.title && s.body),
      data: pageData,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };

  return (
    <>
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Pages — {label}</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Edit the intro and content sections shown on /{slug}</p>
        </div>
        {saved && (
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
            ✓ Saved!
          </span>
        )}
      </div>

      {/* Intro */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Page Intro</h3>
        <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>The paragraph shown directly under the page title.</p>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={3}
          placeholder="Page introduction..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      {/* Content Sections */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Content Sections</h3>
        <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>Each section renders as a heading with a paragraph. Leave empty to keep the page&apos;s built-in design content.</p>

        {/* Section editor */}
        <div className="flex flex-col gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <input
            type="text"
            value={sectionForm.title}
            onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            placeholder="Section heading (e.g. Our Return Policy)"
            className="w-full h-11 px-4 rounded-xl text-sm outline-none"
            style={inputStyle}
          />
          <textarea
            value={sectionForm.body}
            onChange={(e) => setSectionForm({ ...sectionForm, body: e.target.value })}
            rows={3}
            placeholder="Section text..."
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={inputStyle}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddOrUpdateSection}
              disabled={!sectionForm.title.trim() || !sectionForm.body.trim()}
              className="h-9 px-4 rounded-full text-[10px] font-bold transition-all active:scale-95 disabled:opacity-40"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
            >
              {editingIdx !== null ? 'Update Section' : '+ Add Section'}
            </button>
            {editingIdx !== null && (
              <button
                onClick={() => { setEditingIdx(null); setSectionForm(contentEmptySection); }}
                className="h-9 px-4 rounded-full text-[10px] font-semibold transition-all active:scale-95"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Sections list */}
        {sections.length === 0 ? (
          <p className="text-[11px] text-center py-4" style={{ color: 'var(--text-muted)' }}>No custom sections yet — the page shows its default content.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sections.map((s, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="min-w-0">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                  <p className="text-[10px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => { setEditingIdx(idx); setSectionForm(s); }}
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:bg-blue-500/10"
                    style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSections((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:bg-red-500/10"
                    style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="h-12 rounded-xl text-sm font-bold transition-all active:scale-[0.98] w-fit px-10"
        style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
      >
        {saved ? '✓ Saved!' : `Save ${label} Page`}
      </button>

      {/* Page Data — built-in blocks (cards / charts / articles) */}
      {(PAGE_SCHEMAS[slug] || []).map((schema) => (
        <PageDataBlock key={schema.key} slug={slug} schema={schema} pageData={pageData} setPageData={setPageData} />
      ))}
    </>
  );
}

/* ================= Page Data block editor ================= */

function PageDataBlock({ slug, schema, pageData, setPageData }) {
  const current = pageData[schema.key];
  const items = Array.isArray(current) ? current : current != null && typeof current === 'object' ? null : null;
  // 'single' type is one string value, not a list
  const isSingle = schema.type === 'single';
  const list = items || [];

  const [editingIdx, setEditingIdx] = useState(null);
  const [form, setForm] = useState({});
  const [showForm, setShowForm] = useState(false);

  const inputStyle = { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' };

  const emptyForm = () => {
    if (schema.type === 'lines') return '';
    const f = {};
    (schema.fields || []).forEach((fd) => { f[fd.name] = fd.type === 'check' ? false : ''; });
    return f;
  };

  const openAdd = () => {
    setEditingIdx(null);
    setForm(emptyForm());
    setShowForm(true);
  };
  const openEdit = (item, idx) => {
    setEditingIdx(idx);
    if (schema.type === 'lines') setForm(item);
    else {
      const f = {};
      (schema.fields || []).forEach((fd) => {
        let v = item[fd.name] ?? '';
        if (fd.type === 'csv') v = Array.isArray(v) ? v.join(', ') : v;
        if (fd.type === 'lines' && fd.csvLines) v = Array.isArray(v) ? v.map((r) => (Array.isArray(r) ? r.join(',') : r)).join('\n') : v;
        if (fd.type === 'lines') v = Array.isArray(v) ? v.join('\n') : v;
        f[fd.name] = v;
      });
      setForm(f);
    }
    setShowForm(true);
  };

  const serialize = () => {
    if (schema.type === 'lines') return form.split('\n').map((l) => l.trim()).filter(Boolean);
    const out = {};
    (schema.fields || []).forEach((fd) => {
      let v = form[fd.name];
      if (fd.type === 'csv') v = String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
      else if (fd.type === 'lines' && fd.csvLines) v = String(v || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => l.split(',').map((c) => c.trim()));
      else if (fd.type === 'lines') v = String(v || '').split('\n').map((l) => l.trim()).filter(Boolean);
      else if (fd.type === 'check') v = Boolean(v);
      else v = String(v ?? '').trim();
      out[fd.name] = v;
    });
    return out;
  };

  const valid = () => {
    if (schema.type === 'lines') return String(form).trim().length > 0;
    return (schema.fields || []).every((fd) => fd.type === 'check' || String(form[fd.name] ?? '').trim().length > 0);
  };

  const apply = () => {
    const val = serialize();
    const next = Array.isArray(pageData[schema.key]) ? [...pageData[schema.key]] : [];
    if (isSingle) {
      setPageData({ ...pageData, [schema.key]: schema.type === 'single' ? val : val });
      setShowForm(false);
      return;
    }
    if (editingIdx !== null) next[editingIdx] = val;
    else next.push(val);
    setPageData({ ...pageData, [schema.key]: next });
    setShowForm(false);
    setEditingIdx(null);
    setForm(emptyForm());
  };

  const remove = (idx) => {
    setPageData({ ...pageData, [schema.key]: pageData[schema.key].filter((_, i) => i !== idx) });
  };
  const move = (idx, dir) => {
    const next = [...pageData[schema.key]];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setPageData({ ...pageData, [schema.key]: next });
  };
  const resetBlock = () => {
    setPageData({ ...pageData, [schema.key]: undefined });
  };

  const labelOf = (item) => {
    if (schema.type === 'lines') return Array.isArray(item) ? item.join(' · ') : String(item);
    if (schema.type === 'single') return String(item);
    return item.title || item.name || item.number || item.quote || item.date || 'Item';
  };
  const subOf = (item) => {
    if (schema.type === 'lines' || schema.type === 'single') return '';
    return item.desc || item.excerpt || item.quote || item.role || item.items?.join(' · ') || '';
  };

  // Single-value block (e.g. mission statement) — inline textarea
  if (isSingle) {
    return (
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{schema.label}</h3>
        <textarea
          value={pageData[schema.key] ?? ''}
          onChange={(e) => setPageData({ ...pageData, [schema.key]: e.target.value })}
          rows={3}
          placeholder={schema.label}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{schema.label}</h3>
        <div className="flex items-center gap-2">
          {pageData[schema.key] !== undefined && (
            <button onClick={resetBlock} title="Restore defaults" className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-70 cursor-pointer" style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              Reset
            </button>
          )}
          <button onClick={openAdd} className="text-[10px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
            + Add
          </button>
        </div>
      </div>
      <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>
        {list.length} item{list.length === 1 ? '' : 's'} · These render on the public page. Changes save with “Save Page” above.
      </p>

      {/* List */}
      {list.length === 0 ? (
        <p className="text-[11px] text-center py-4" style={{ color: 'var(--text-muted)' }}>Using default content — Add to customize, or leave as is.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
              <div className="min-w-0">
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{labelOf(item)}</p>
                {subOf(item) && <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{subOf(item)}</p>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} title="Move up" className="w-6 h-6 rounded-md text-[10px] disabled:opacity-30 cursor-pointer" style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>↑</button>
                <button onClick={() => move(idx, 1)} disabled={idx === list.length - 1} title="Move down" className="w-6 h-6 rounded-md text-[10px] disabled:opacity-30 cursor-pointer" style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>↓</button>
                <button onClick={() => openEdit(item, idx)} className="text-[10px] font-bold px-2 py-1.5 rounded-lg cursor-pointer" style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>Edit</button>
                <button onClick={() => remove(idx)} className="text-[10px] font-bold px-2 py-1.5 rounded-lg cursor-pointer" style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="flex flex-col gap-2.5 mt-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          {schema.type === 'lines' ? (
            <textarea value={form} onChange={(e) => setForm(e.target.value)} rows={5} placeholder="One item per line..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
          ) : (
            (schema.fields || []).map((fd) => (
              <div key={fd.name}>
                {fd.type === 'check' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(form[fd.name])} onChange={(e) => setForm({ ...form, [fd.name]: e.target.checked })} className="w-4 h-4" />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{fd.label}</span>
                  </label>
                ) : (
                  <>
                    <label className="text-[10px] font-bold mb-1 block" style={{ color: 'var(--text-muted)' }}>{fd.label}</label>
                    {fd.type === 'textarea' || fd.type === 'lines' || fd.type === 'csv' ? (
                      <textarea value={form[fd.name] ?? ''} onChange={(e) => setForm({ ...form, [fd.name]: e.target.value })} rows={fd.type === 'textarea' ? 3 : 4}
                        placeholder={fd.label}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
                    ) : (
                      <input type="text" value={form[fd.name] ?? ''} onChange={(e) => setForm({ ...form, [fd.name]: e.target.value })}
                        placeholder={fd.label}
                        className="w-full h-10 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
                    )}
                  </>
                )}
              </div>
            ))
          )}
          <div className="flex gap-2">
            <button onClick={apply} disabled={!valid()} className="h-9 px-4 rounded-full text-[10px] font-bold transition-all active:scale-95 disabled:opacity-40 cursor-pointer" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
              {editingIdx !== null ? 'Update' : 'Add'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingIdx(null); setForm(emptyForm()); }} className="h-9 px-4 rounded-full text-[10px] font-semibold transition-all active:scale-95 cursor-pointer" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Careers / Jobs Tab ================= */

const jobEmptyForm = { title: '', team: 'Engineering', location: '', type: 'Full-time', level: 'Mid', desc: '', open: true };

function JobsTab() {
  const { jobOpenings, addJob, updateJob, deleteJob, applications, updateApplicationStatus, deleteApplication, settings, updateSettings } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(jobEmptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [emailDraft, setEmailDraft] = useState(settings.careersEmail || '');
  const [emailSaved, setEmailSaved] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(jobEmptyForm);
    setShowForm(true);
  };
  const openEdit = (j) => {
    setEditingId(j.id);
    setForm({ title: j.title, team: j.team, location: j.location, type: j.type, level: j.level, desc: j.desc, open: j.open !== false });
    setShowForm(true);
  };
  const handleSave = () => {
    if (!form.title.trim() || !form.desc.trim() || !form.location.trim()) return;
    if (editingId) updateJob(editingId, { ...form, title: form.title.trim(), desc: form.desc.trim(), location: form.location.trim() });
    else addJob({ ...form, title: form.title.trim(), desc: form.desc.trim(), location: form.location.trim() });
    setShowForm(false);
    setEditingId(null);
    setForm(jobEmptyForm);
  };
  const saveEmail = () => {
    updateSettings({ careersEmail: emailDraft.trim() });
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const teams = [...new Set(jobOpenings.map((j) => j.team))];
  const openCount = jobOpenings.filter((j) => j.open !== false).length;
  const inputStyle = { backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' };

  return (
    <>
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Pages — Careers Jobs</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {jobOpenings.length} roles ({openCount} open) · Shown on /careers
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
          Add Job
        </button>
      </div>

      {/* Applications inbox */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Applications Received</h3>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>
            {applications.filter((a) => a.status === 'new').length} new
          </span>
        </div>
        <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>Resumes submitted from the public /careers page.</p>
        {applications.length === 0 ? (
          <p className="text-[11px] text-center py-4" style={{ color: 'var(--text-muted)' }}>No applications yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {applications.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                <div className="min-w-0">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{a.name} <span className="font-normal" style={{ color: 'var(--text-muted)' }}>→ {a.role}</span></p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.email} {a.phone && `· ${a.phone}`}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--accent-lime)' }}>📎 {a.fileName}</p>
                  {a.coverNote && <p className="text-[10px] mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>&ldquo;{a.coverNote}&rdquo;</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <select
                    value={a.status}
                    onChange={(e) => updateApplicationStatus(a.id, e.target.value)}
                    className="text-[9px] font-bold px-1.5 py-1.5 rounded-lg outline-none cursor-pointer"
                    style={{ backgroundColor: a.status === 'new' ? 'rgba(251,191,36,0.12)' : a.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)', color: a.status === 'new' ? '#fbbf24' : a.status === 'rejected' ? '#ef4444' : '#22c55e', border: '1px solid var(--border-color)' }}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => deleteApplication(a.id)}
                    title="Delete application"
                    className="w-6 h-6 rounded-md text-[10px] font-bold cursor-pointer"
                    style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume email */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Resume Email</h3>
        <p className="text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>Applications and the &quot;Send Resume&quot; button go to this address.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={emailDraft}
            onChange={(e) => setEmailDraft(e.target.value)}
            placeholder="careers@verre.com"
            className="flex-1 h-11 px-4 rounded-xl text-sm outline-none"
            style={inputStyle}
          />
          <button
            onClick={saveEmail}
            className="h-11 px-6 rounded-xl text-xs font-bold transition-all active:scale-95 w-fit"
            style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
          >
            {emailSaved ? '✓ Saved!' : 'Save Email'}
          </button>
        </div>
      </div>

      {/* Jobs list */}
      <div className="flex flex-col gap-2">
        {jobOpenings.length === 0 && (
          <p className="text-[11px] text-center py-8" style={{ color: 'var(--text-muted)' }}>No job openings — the /careers page will show none.</p>
        )}
        {jobOpenings.map((j) => (
          <div key={j.id} className="flex items-start justify-between gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', opacity: j.open === false ? 0.5 : 1 }}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{j.title}</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: j.open === false ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)', color: j.open === false ? '#ef4444' : '#22c55e' }}>
                  {j.open === false ? 'Closed' : 'Open'}
                </span>
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{j.team} · {j.type} · {j.level} · 📍 {j.location}</p>
              <p className="text-[10px] mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{j.desc}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => updateJob(j.id, { open: j.open === false })}
                title={j.open === false ? 'Reopen position' : 'Close position'}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-70"
                style={{ color: j.open === false ? '#22c55e' : '#fbbf24', border: '1px solid var(--border-color)' }}
              >
                {j.open === false ? 'Reopen' : 'Close'}
              </button>
              <button
                onClick={() => openEdit(j)}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:bg-blue-500/10"
                style={{ color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(j)}
                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:bg-red-500/10"
                style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Job form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 animate-dropdown my-8" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>{editingId ? 'Edit Job' : 'Add New Job'}</h3>
            <div className="flex flex-col gap-3">
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Job title *"
                className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} className="h-11 px-3 rounded-xl text-xs outline-none cursor-pointer" style={inputStyle}>
                  {['Engineering', 'Design', 'Marketing', 'Operations', 'Sales', 'Support'].map((t) => <option key={t}>{t}</option>)}
                </select>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-11 px-3 rounded-xl text-xs outline-none cursor-pointer" style={inputStyle}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((t) => <option key={t}>{t}</option>)}
                </select>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="h-11 px-3 rounded-xl text-xs outline-none cursor-pointer" style={inputStyle}>
                  {['Junior', 'Mid', 'Mid-Senior', 'Senior', 'Lead'].map((t) => <option key={t}>{t}</option>)}
                </select>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location *"
                  className="h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle} />
              </div>
              <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={4} placeholder="Role description *"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inputStyle} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.open} onChange={(e) => setForm({ ...form, open: e.target.checked })} className="w-4 h-4" />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Accepting applications</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={!form.title.trim() || !form.desc.trim() || !form.location.trim()}
                className="flex-1 h-11 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {editingId ? 'Save Changes' : 'Add Job'}
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

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-sm font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>Delete Job?</h3>
            <p className="text-xs text-center mb-6" style={{ color: 'var(--text-muted)' }}>
              &quot;{confirmDelete.title}&quot; will be removed from the /careers page.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-10 rounded-full text-xs font-semibold transition-all active:scale-95" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>Cancel</button>
              <button onClick={() => { deleteJob(confirmDelete.id); setConfirmDelete(null); }} className="flex-1 h-10 rounded-full text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: '#ef4444', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= Main ================= */

const contentPages = [
  { slug: 'shipping', label: 'Shipping' },
  { slug: 'returns', label: 'Returns' },
  { slug: 'size-guide', label: 'Size Guide' },
  { slug: 'about', label: 'About' },
  { slug: 'sustainability', label: 'Sustainability' },
  { slug: 'careers', label: 'Careers' },
  { slug: 'news', label: 'News' },
];

export default function AdminPagesPage() {
  const [tab, setTab] = useState('faqs');

  const tabBtn = (id, lbl) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      className="px-3.5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95"
      style={{
        backgroundColor: tab === id ? 'var(--accent-lime)' : 'var(--bg-surface)',
        color: tab === id ? '#000' : 'var(--text-muted)',
        border: '1px solid var(--border-color)',
      }}
    >
      {lbl}
    </button>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {tabBtn('faqs', 'FAQs')}
        <div className="w-px h-5 flex-shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />
        {tabBtn('jobs', 'Careers Jobs')}
        {contentPages.map((p) => tabBtn(p.slug, p.label))}
      </div>

      {tab === 'faqs' ? <FaqsTab /> : tab === 'jobs' ? <JobsTab /> : <ContentPageTab slug={tab} label={contentPages.find((p) => p.slug === tab)?.label || tab} />}
    </div>
  );
}
