'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAdmin } from '@/context/AdminContext';
import PasswordInput from '@/components/shared/PasswordInput';

export default function AdminProfilePage() {
  const { adminProfile, updateProfile, changePassword, logout } = useAdmin();

  const [form, setForm] = useState(adminProfile);
  const [infoSaved, setInfoSaved] = useState(false);
  const [infoError, setInfoError] = useState('');

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState({ type: '', message: '' });

  const fileInputRef = useRef(null);
  const [avatarError, setAvatarError] = useState('');

  // WhatsApp-style full-screen photo viewer
  const [viewerOpen, setViewerOpen] = useState(false);

  // Close viewer with Escape key
  const handleViewerKey = useCallback((e) => {
    if (e.key === 'Escape') setViewerOpen(false);
  }, []);

  useEffect(() => {
    if (!viewerOpen) return;
    window.addEventListener('keydown', handleViewerKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleViewerKey);
      document.body.style.overflow = '';
    };
  }, [viewerOpen, handleViewerKey]);

  const initials = (adminProfile.name || 'A')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleAvatarUpload = (e) => {
    setAvatarError('');
    const file = e.target.files && e.target.files[0];
    // Reset so picking the same file again re-triggers onChange
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image must be smaller than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        // Square center-crop + downscale to 256x256 so localStorage stays small
        const SIZE = 256;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updateProfile({ avatar: dataUrl });
        } catch {
          setAvatarError('Could not process this image. Try another one.');
        }
      };
      img.onerror = () => setAvatarError('Could not read this image. Try another one.');
      img.src = reader.result;
    };
    reader.onerror = () => setAvatarError('Could not read this file. Try another one.');
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatarError('');
    updateProfile({ avatar: null });
  };

  const handleInfoSave = () => {
    setInfoError('');
    if (!form.name.trim()) {
      setInfoError('Name is required');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setInfoError('Valid email is required');
      return;
    }
    updateProfile({ name: form.name.trim(), email: form.email.trim() });
    setForm((f) => ({ ...f, name: form.name.trim(), email: form.email.trim() }));
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    setPwStatus({ type: '', message: '' });
    if (pwForm.next !== pwForm.confirm) {
      setPwStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    const res = changePassword(pwForm.current, pwForm.next);
    if (!res.ok) {
      setPwStatus({ type: 'error', message: res.error });
      return;
    }
    setPwStatus({ type: 'success', message: 'Password updated successfully!' });
    setPwForm({ current: '', next: '', confirm: '' });
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  };

  const cardStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Manage your admin account details</p>
      </div>

      {/* Hero profile card */}
      <div className="rounded-3xl overflow-hidden" style={cardStyle}>
        {/* Banner strip */}
        <div className="h-20 sm:h-24 relative" style={{ background: 'linear-gradient(120deg, rgba(166,255,0,0.22), rgba(166,255,0,0.04) 55%), var(--bg-surface)' }}>
          <div className="absolute inset-0 opacity-[0.35]" style={{ background: 'radial-gradient(ellipse at 85% -40%, rgba(166,255,0,0.35), transparent 60%)' }} />
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Avatar overlapping the banner — only the avatar rises into the banner, text stays below it */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="relative flex-shrink-0 mx-auto sm:mx-0 -mt-10 sm:-mt-12">
              <button
                type="button"
                onClick={() => adminProfile.avatar && setViewerOpen(true)}
                className={`relative block rounded-full focus:outline-none transition-transform hover:scale-[1.04] ${adminProfile.avatar ? 'cursor-zoom-in' : 'cursor-default'}`}
                aria-label={adminProfile.avatar ? 'View profile picture' : 'Profile picture'}
                title={adminProfile.avatar ? 'Click to view photo' : undefined}
              >
                {adminProfile.avatar ? (
                  <img
                    src={adminProfile.avatar}
                    alt="Admin profile picture"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                    style={{ border: '3px solid var(--bg-card)', boxShadow: '0 0 0 2px var(--accent-lime), 0 12px 32px rgba(0,0,0,0.45)' }}
                  />
                ) : (
                  <span
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-2xl font-extrabold"
                    style={{ backgroundColor: 'var(--accent-lime)', color: '#000', border: '3px solid var(--bg-card)', boxShadow: '0 0 0 2px var(--accent-lime), 0 12px 32px rgba(0,0,0,0.45)' }}
                  >
                    {initials}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                aria-label="Change profile picture"
                title="Change profile picture"
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000', border: '2.5px solid var(--bg-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>

            {/* Name + role — always below the banner */}
            <div className="min-w-0 text-center sm:text-left sm:pt-3">
              <p className="text-lg font-extrabold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>{adminProfile.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{adminProfile.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(166,255,0,0.12)', color: 'var(--accent-lime)', border: '1px solid rgba(166,255,0,0.25)' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4 7.2 16.9l.9-5.4L4.2 7.7l5.4-.8z" />
                  </svg>
                  {adminProfile.role}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.22)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Actions row */}
          <div className="mt-5 pt-4 flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span className="text-[10px] text-center sm:text-left" style={{ color: 'var(--text-muted)' }}>
              JPG, PNG or WebP — max 5MB
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="h-8 px-3.5 rounded-full text-[11px] font-semibold transition-all hover:bg-white/[0.06] active:scale-95"
                style={{ color: 'var(--accent-lime)' }}
              >
                {adminProfile.avatar ? 'Change' : 'Upload'}
              </button>
              {adminProfile.avatar && (
                <>
                  <span className="w-px h-4 flex-shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />
                  <button
                    type="button"
                    onClick={() => setViewerOpen(true)}
                    className="h-8 px-3.5 rounded-full text-[11px] font-semibold transition-all hover:bg-white/[0.06] active:scale-95"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    View
                  </button>
                  <span className="w-px h-4 flex-shrink-0" style={{ backgroundColor: 'var(--border-color)' }} />
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    className="h-8 px-3.5 rounded-full text-[11px] font-semibold transition-all hover:bg-red-500/10 active:scale-95"
                    style={{ color: '#ef4444' }}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
          {avatarError && (
            <p className="mt-3 text-[11px] font-semibold text-center sm:text-left" style={{ color: '#ef4444' }}>{avatarError}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Account Information */}
      <div className="rounded-3xl p-4 sm:p-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-1">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(166,255,0,0.1)', border: '1px solid rgba(166,255,0,0.2)' }}>
            <svg className="w-4 h-4" fill="none" stroke="var(--accent-lime)" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a7 7 0 0 1 16 0v1" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Account Information</h3>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Your public identity in the panel</p>
          </div>
          {infoSaved && (
            <span className="ml-auto text-[10px] font-bold px-3 py-1.5 rounded-full animate-fadeIn" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
              ✓ Saved!
            </span>
          )}
        </div>

        {infoError && (
          <div className="mt-4 mb-2 p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            {infoError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all focus:border-[var(--accent-lime)]"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all focus:border-[var(--accent-lime)]"
              style={inputStyle}
            />
            <p className="text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>Used to sign in to the admin panel</p>
          </div>
        </div>

        <button
          onClick={handleInfoSave}
          className="mt-5 h-11 px-8 rounded-full text-xs font-bold transition-all active:scale-95 w-full sm:w-fit hover:shadow-[0_8px_28px_rgba(166,255,0,0.25)]"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          {infoSaved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Change Password */}
      <div className="rounded-3xl p-4 sm:p-6" style={cardStyle}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(166,255,0,0.1)', border: '1px solid rgba(166,255,0,0.2)' }}>
            <svg className="w-4 h-4" fill="none" stroke="var(--accent-lime)" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Default is <span className="font-bold" style={{ color: 'var(--text-primary)' }}>admin123</span> — change it to secure your panel
            </p>
          </div>
        </div>

        {pwStatus.message && (
          <div
            className="mt-4 p-3 rounded-xl text-xs font-semibold animate-fadeIn"
            style={
              pwStatus.type === 'error'
                ? { backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
                : { backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
            }
          >
            {pwStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Current Password</label>
            <PasswordInput
              value={pwForm.current}
              onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
              className="w-full h-11 px-4 pr-11 rounded-xl text-sm outline-none transition-all focus:border-[var(--accent-lime)]"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>New Password</label>
            <PasswordInput
              value={pwForm.next}
              onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
              className="w-full h-11 px-4 pr-11 rounded-xl text-sm outline-none transition-all focus:border-[var(--accent-lime)]"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Confirm New Password</label>
            <PasswordInput
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              className="w-full h-11 px-4 pr-11 rounded-xl text-sm outline-none transition-all focus:border-[var(--accent-lime)]"
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={!pwForm.current || !pwForm.next || !pwForm.confirm}
          className="mt-5 h-11 px-8 rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-40 w-full sm:w-fit hover:shadow-[0_8px_28px_rgba(166,255,0,0.25)]"
          style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
        >
          Update Password
        </button>
      </div>

      {/* Session */}
      <div className="rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <svg className="w-4 h-4" fill="none" stroke="#ef4444" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-bold" style={{ color: '#ef4444' }}>Session</h3>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Sign out of the admin panel on this device</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="h-10 px-6 rounded-full text-xs font-bold transition-all active:scale-95 hover:bg-red-500/10 w-full sm:w-fit flex-shrink-0"
          style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          Logout
        </button>
      </div>

      {/* WhatsApp-style full-screen photo viewer */}
      {viewerOpen && adminProfile.avatar && (
        <div
          className="fixed inset-0 z-[100] flex flex-col animate-fadeIn"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={() => setViewerOpen(false)}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-14 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={adminProfile.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                style={{ border: '1.5px solid var(--accent-lime)' }}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: '#fff' }}>{adminProfile.name}</p>
                <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{adminProfile.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewerOpen(false)}
              aria-label="Close viewer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-90 flex-shrink-0"
              style={{ color: '#fff' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Full photo */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <img
              src={adminProfile.avatar}
              alt={`${adminProfile.name} profile picture`}
              className="max-w-full max-h-full object-contain rounded-2xl animate-zoomIn"
              style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-center gap-3 pb-8 pt-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                fileInputRef.current && fileInputRef.current.click();
                setViewerOpen(false);
              }}
              className="h-10 px-5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={() => {
                handleAvatarRemove();
                setViewerOpen(false);
              }}
              className="h-10 px-5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              Remove Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
