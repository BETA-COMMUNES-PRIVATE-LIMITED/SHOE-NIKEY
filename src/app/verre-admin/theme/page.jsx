'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';

const PRESETS = [
  { name: 'Vére Lime', accent: '#A6FF00' },
  { name: 'Volt Blue', accent: '#3B82F6' },
  { name: 'Court Purple', accent: '#A855F7' },
  { name: 'Ember Red', accent: '#FF3B30' },
  { name: 'Gold', accent: '#FFD700' },
  { name: 'Mint', accent: '#34D399' },
];

export default function AdminThemePage() {
  const { settings, updateSettings } = useAdmin();
  const [accent, setAccent] = useState(settings.accentColor || '#A6FF00');
  const [saved, setSaved] = useState(false);

  // Apply accent live to preview
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-preview', accent);
  }, [accent]);

  // Apply saved accent on mount so the panel reflects the persisted theme
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent-lime', settings.accentColor);
    }
  }, [settings.accentColor]);

  const handleSave = () => {
    updateSettings({ accentColor: accent });
    // Apply globally — persisted in settings, restored on every page load via Providers
    document.documentElement.style.setProperty('--accent-lime', accent);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isCustom = !PRESETS.some((p) => p.accent.toLowerCase() === accent.toLowerCase());

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Theme & Design</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Customize store accent color — applied site-wide</p>
        </div>
        {saved && (
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
            ✓ Applied!
          </span>
        )}
      </div>

      {/* Accent Presets */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Accent Color</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setAccent(p.accent)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: accent.toLowerCase() === p.accent.toLowerCase() ? `2px solid ${p.accent}` : '1px solid var(--border-color)',
              }}
            >
              <span className="w-8 h-8 rounded-full" style={{ backgroundColor: p.accent }} />
              <span className="text-[9px] font-semibold text-center leading-tight" style={{ color: 'var(--text-muted)' }}>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Custom color */}
        <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)}
            className="w-11 h-11 rounded-xl cursor-pointer border-0 p-0"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          />
          <input type="text" value={accent} onChange={(e) => setAccent(e.target.value)}
            placeholder="#A6FF00"
            className="flex-1 max-w-[160px] h-11 px-4 rounded-xl text-sm outline-none font-mono"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          />
          {isCustom && <span className="text-[10px] font-bold" style={{ color: 'var(--accent-lime)' }}>Custom color</span>}
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Live Preview</h3>
        <div className="rounded-xl p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="flex items-center gap-3">
            <span className="h-9 px-5 rounded-full text-xs font-bold flex items-center" style={{ backgroundColor: accent, color: '#000' }}>
              Add to Cart
            </span>
            <span className="h-9 px-5 rounded-full text-xs font-bold flex items-center" style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              Wishlist
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accent }}>NEW ARRIVAL</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-2 w-3/4 rounded-full" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: accent }} />
            </div>
            <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="h-full rounded-full" style={{ width: '35%', backgroundColor: accent, opacity: 0.6 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="h-12 rounded-xl text-sm font-bold transition-all active:scale-[0.98] w-fit px-10"
        style={{ backgroundColor: accent, color: '#000' }}
      >
        {saved ? '✓ Applied to Store!' : 'Apply Theme'}
      </button>
    </div>
  );
}
