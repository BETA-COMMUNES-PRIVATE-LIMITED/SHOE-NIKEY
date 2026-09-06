'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    router.push('/admin');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid credentials. Try admin@verre.com / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/images/logo.png" alt="Logo" width={80} height={32} className="w-16 h-auto mx-auto mb-4" />
          <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Admin Panel</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@verre.com"
              required
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="mb-6">
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <div className="mt-4 p-3 rounded-xl text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Demo: <span className="font-bold" style={{ color: 'var(--text-primary)' }}>admin@verre.com</span> / <span className="font-bold" style={{ color: 'var(--text-primary)' }}>admin123</span>
            </p>
          </div>
        </form>

        <button
          onClick={() => router.push('/')}
          className="w-full mt-4 text-xs font-semibold text-center transition-all hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back to Store
        </button>
      </div>
    </div>
  );
}
