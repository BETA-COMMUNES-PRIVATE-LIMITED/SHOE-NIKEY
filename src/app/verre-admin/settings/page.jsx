'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings({
      storeName: form.storeName.trim() || 'Vére',
      tagline: form.tagline.trim(),
      supportEmail: form.supportEmail.trim(),
      supportPhone: form.supportPhone.trim(),
      currency: form.currency,
      freeShipThreshold: Number(form.freeShipThreshold) || 0,
      taxRate: Number(form.taxRate) || 0,
      codEnabled: form.codEnabled,
      maintenance: form.maintenance,
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
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Store configuration — changes apply across the website</p>
        </div>
        {saved && (
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
            ✓ Saved!
          </span>
        )}
      </div>

      {/* Store Identity */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Store Identity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Store Name</label>
            <input type="text" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              placeholder="Vére" className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle}
            />
            <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Shown in footer copyright</p>
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Tagline</label>
            <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="Just Do It." className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle}
            />
            <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Shown in admin footer</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Support Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Support Email</label>
            <input type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              placeholder="support@verre.com" className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Support Phone</label>
            <input type="text" value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
              placeholder="1-800-VERRE" className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Commerce */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Commerce Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Currency</label>
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer" style={inputStyle}
            >
              <option value="USD">USD ($)</option>
              <option value="PKR">PKR (₨)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Free Shipping Over ($)</label>
            <input type="number" value={form.freeShipThreshold} onChange={(e) => setForm({ ...form, freeShipThreshold: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle}
            />
            <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Used at checkout</p>
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Tax Rate (%)</label>
            <input type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-sm outline-none" style={inputStyle}
            />
            <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Applied to order subtotal</p>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <h3 className="text-sm font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Features</h3>
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-between cursor-pointer gap-4">
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Cash on Delivery</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Show COD option at checkout</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, codEnabled: !form.codEnabled })}
              className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
              style={{ backgroundColor: form.codEnabled ? 'var(--accent-lime)' : 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <span
                className="absolute top-0.5 w-4.5 h-4.5 w-[18px] h-[18px] rounded-full transition-all"
                style={{ left: form.codEnabled ? '22px' : '3px', backgroundColor: form.codEnabled ? '#000' : 'var(--text-muted)' }}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer gap-4">
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Maintenance Mode</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Hide store pages from visitors (demo)</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, maintenance: !form.maintenance })}
              className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
              style={{ backgroundColor: form.maintenance ? 'var(--accent-red)' : 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
            >
              <span
                className="absolute top-0.5 w-[18px] h-[18px] rounded-full transition-all"
                style={{ left: form.maintenance ? '22px' : '3px', backgroundColor: form.maintenance ? '#fff' : 'var(--text-muted)' }}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="h-12 rounded-xl text-sm font-bold transition-all active:scale-[0.98] w-fit px-10"
        style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
      >
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
