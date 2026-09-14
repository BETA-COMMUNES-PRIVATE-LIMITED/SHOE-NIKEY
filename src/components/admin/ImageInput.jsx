'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Reads an image File and returns a compressed data URL (max ~800px,
 * JPEG q0.82) so localStorage doesn't blow up.
 */
export function fileToDataUrl(file, maxSize = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // PNG with transparency: keep PNG, else JPEG for smaller size
        const isPng = file.type === 'image/png';
        resolve(canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const inputStyle = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
};

/* ================= Single image (URL or upload) ================= */

export function ImageInput({ label = 'Image', value, onChange, previewH = 'h-32', compact = false }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = await fileToDataUrl(file, 900, 0.82);
      onChange(url);
    } catch {
      setErr('Could not process that image. Try a different file.');
    }
    setBusy(false);
  };

  const paste = (e) => {
    const item = Array.from(e.clipboardData?.items || []).find((i) => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        pick({ target: { files: [file] } });
      }
    }
  };

  return (
    <div>
      {label && (
        <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      {value ? (
        <div className={`relative w-full ${previewH} rounded-xl overflow-hidden mb-2`} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center"
            style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: '#fff' }}
            title="Remove image"
          >
            ✕
          </button>
        </div>
      ) : null}
      <div className="flex gap-2">
        <input
          type="text"
          value={typeof value === 'string' && value.startsWith('data:') ? '' : value || ''}
          onChange={(e) => onChange(e.target.value)}
          onPaste={paste}
          placeholder={value?.startsWith('data:') ? 'Uploaded image (stored in browser)' : '/images/... or https://...'}
          className="flex-1 h-10 px-3 rounded-xl text-xs outline-none"
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="h-10 px-3 rounded-xl text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        >
          {busy ? (
            <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-lime)' }} />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 8.49 8.49l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          )}
          {busy ? '...' : 'Upload'}
        </button>
      </div>
      {err && <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>{err}</p>}
      {!compact && !err && (
        <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
          Type a URL or upload from your device (auto-compressed).
        </p>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  );
}

/* ================= Multi-image gallery (up to 8) ================= */

export function MultiImageInput({ label = 'Images', value = [], onChange, max = 8, min = 0, hint }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [dragIdx, setDragIdx] = useState(null);

  const images = Array.isArray(value) ? value.filter(Boolean) : [];

  const addFiles = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    setErr('');
    try {
      const room = max - images.length;
      if (room <= 0) {
        setErr(`Maximum ${max} images per product.`);
        return;
      }
      const results = [];
      for (const file of Array.from(files).slice(0, room)) {
        try {
          results.push(await fileToDataUrl(file, 900, 0.82));
        } catch {
          /* skip invalid */
        }
      }
      if (results.length) onChange([...images, ...results]);
      if (Array.from(files).length > room) setErr(`Only ${room} more image${room === 1 ? '' : 's'} allowed (max ${max}).`);
    } finally {
      setBusy(false);
    }
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  const onDrop = (e, idx) => {
    e.preventDefault();
    const from = dragIdx;
    setDragIdx(null);
    if (from === null || from === idx) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(idx, 0, item);
    onChange(next);
  };

  const setAt = (idx, url) => {
    const next = [...images];
    next[idx] = url;
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>
          {label} <span style={{ color: 'var(--text-muted)' }}>({images.length}/{max})</span>
        </label>
        {images.length > 0 && (
          <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
            First = main photo · drag to reorder
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, idx)}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-grab"
              style={{ backgroundColor: 'var(--bg-surface)', border: idx === 0 ? '2px solid var(--accent-lime)' : '1px solid var(--border-color)' }}
              title={idx === 0 ? 'Main image' : ''}
            >
              <img src={img} alt={`img ${idx + 1}`} className="w-full h-full object-cover" draggable={false} />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[8px] font-extrabold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                  MAIN
                </span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1">
                <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0}
                  className="w-6 h-6 rounded-full text-[10px] font-bold disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>↑</button>
                <button type="button" onClick={() => move(idx, 1)} disabled={idx === images.length - 1}
                  className="w-6 h-6 rounded-full text-[10px] font-bold disabled:opacity-30"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>↓</button>
                <button type="button" onClick={() => remove(idx)}
                  className="w-6 h-6 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: 'rgba(239,68,68,0.85)', color: '#fff' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add controls */}
      {images.length < max && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex-1 h-10 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: 'var(--bg-surface)', border: `1px dashed ${busy ? 'var(--border-color)' : 'var(--text-muted)'}`, color: 'var(--text-primary)' }}
          >
            {busy ? (
              <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-lime)' }} />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            )}
            {busy ? 'Processing...' : `+ Add Photos (${images.length}/${max})`}
          </button>
        </div>
      )}

      {/* URL add (for non-uploaded images) */}
      {images.length < max && (
        <UrlAddInline onAdd={(url) => onChange([...images, url.trim()])} />
      )}

      {err && <p className="text-[10px] mt-1.5" style={{ color: '#ef4444' }}>{err}</p>}
      <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
        {hint || 'Upload 5–8 photos per product from your device or paste image URLs. First photo is the main one.'}
      </p>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
}

function UrlAddInline({ onAdd }) {
  const [url, setUrl] = useState('');
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && url.trim()) { onAdd(url); setUrl(''); } }}
        placeholder="...or paste an image URL and press Enter"
        className="flex-1 h-9 px-3 rounded-xl text-[11px] outline-none"
        style={inputStyle}
      />
      <button
        type="button"
        onClick={() => { if (url.trim()) { onAdd(url); setUrl(''); } }}
        className="h-9 px-3 rounded-xl text-[10px] font-bold"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
      >
        Add
      </button>
    </div>
  );
}

export default ImageInput;
