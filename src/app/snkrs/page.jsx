'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useAdmin } from '@/context/AdminContext';

const filters = ['All', 'Live Now', 'Upcoming', 'Sold Out'];

export default function SNKRSPage() {
  const { drops, isLoaded } = useAdmin();
  const [activeFilter, setActiveFilter] = useState('All');

  // Only active drops; when context hasn't loaded yet show nothing to avoid
  // flashing defaults that the admin may have changed.
  const visible = (isLoaded ? drops : []).filter((d) => d.active !== false);

  const filtered = activeFilter === 'All' ? visible : visible.filter((d) => {
    if (activeFilter === 'Live Now') return d.status === 'live';
    if (activeFilter === 'Upcoming') return d.status === 'upcoming';
    if (activeFilter === 'Sold Out') return d.status === 'sold-out';
    return true;
  });

  // Featured drop = first live drop (or first visible)
  const featured = filtered.find((d) => d.status === 'live') || filtered[0];

  const statusColor = (status) => {
    if (status === 'live') return '#22c55e';
    if (status === 'upcoming') return 'var(--accent-lime)';
    return 'var(--text-muted)';
  };

  const statusBg = (status) => {
    if (status === 'live') return 'rgba(34, 197, 94, 0.1)';
    if (status === 'upcoming') return 'rgba(166, 255, 0, 0.1)';
    return 'var(--bg-surface)';
  };

  const hrefFor = (d) => {
    if (d.productId && typeof d.productId === 'string' && d.productId.includes('-')) {
      const [sec, id] = d.productId.split('-');
      return `/${sec}/${id}`;
    }
    return `/${d.section}/${d.id}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              SNKRS
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(166, 255, 0, 0.15)', color: 'var(--accent-lime)' }}>
              LAUNCH CALENDAR
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Exclusive drops, limited releases, and the freshest kicks. Don&apos;t miss out.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all active:scale-95"
              style={{
                backgroundColor: activeFilter === f ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: activeFilter === f ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >
              {f}
              {f !== 'All' && (
                <span className="ml-1.5 text-[9px] opacity-70">
                  ({visible.filter((d) => {
                    if (f === 'Live Now') return d.status === 'live';
                    if (f === 'Upcoming') return d.status === 'upcoming';
                    if (f === 'Sold Out') return d.status === 'sold-out';
                    return true;
                  }).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Featured Drop */}
        {activeFilter === 'All' && featured && (
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              Featured Drop
            </h2>
            <Link href={hrefFor(featured)} className="block rounded-2xl overflow-hidden transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <Image src={featured.images?.[0] || featured.image} alt={featured.name} fill className="object-contain p-8" />
                  <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: statusBg(featured.status), color: statusColor(featured.status), border: `1px solid ${featured.status === 'live' ? 'rgba(34,197,94,0.3)' : 'var(--border-color)'}` }}>
                    {featured.status === 'live' && '● '}{featured.tag || featured.status}
                  </span>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-lime)' }}>
                    {featured.status === 'live' ? 'Live Release' : 'Exclusive Release'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>{featured.name}</h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{featured.type}</p>
                  <p className="text-2xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>${featured.price}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Launch Date</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{featured.date || '—'}</p>
                    </div>
                    <div className="w-px h-8" style={{ backgroundColor: 'var(--border-color)' }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Time</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{featured.time || '—'}</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto h-11 px-8 rounded-full text-sm font-bold transition-all active:scale-[0.98]" style={{ backgroundColor: featured.status === 'live' ? '#22c55e' : 'var(--accent-lime)', color: featured.status === 'live' ? '#fff' : '#000' }}>
                    {featured.status === 'live' ? 'Shop Now' : 'Notify Me'}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Drops Grid */}
        <h2 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
          {activeFilter === 'All' ? 'All Drops' : activeFilter}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {filtered.map((drop) => (
            <Link
              key={drop.id}
              href={hrefFor(drop)}
              className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              {/* Image */}
              <div className="relative aspect-square" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <Image src={drop.images?.[0] || drop.image} alt={drop.name} fill className="object-contain p-6" />

                {/* Status badge */}
                <span
                  className="absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: statusBg(drop.status),
                    color: statusColor(drop.status),
                    border: `1px solid ${drop.status === 'live' ? 'rgba(34,197,94,0.3)' : drop.status === 'upcoming' ? 'rgba(166,255,0,0.2)' : 'var(--border-color)'}`,
                  }}
                >
                  {drop.status === 'live' && '● '}{drop.tag || drop.status}
                </span>
                {(drop.images?.length || 0) > 1 && (
                  <span className="absolute bottom-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                    {drop.images.length} pics
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-xs font-bold truncate mb-0.5" style={{ color: 'var(--text-primary)' }}>{drop.name}</h3>
                <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{drop.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${drop.price}</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{drop.date}</span>
                </div>

                {drop.status === 'upcoming' && (
                  <button
                    className="w-full h-9 rounded-full text-[10px] font-bold mt-3 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: 'rgba(166, 255, 0, 0.1)', color: 'var(--accent-lime)', border: '1px solid rgba(166, 255, 0, 0.2)' }}
                  >
                    Notify Me
                  </button>
                )}
                {drop.status === 'live' && (
                  <button
                    className="w-full h-9 rounded-full text-[10px] font-bold mt-3 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}
                  >
                    Shop Now
                  </button>
                )}
                {drop.status === 'sold-out' && (
                  <div
                    className="w-full h-9 rounded-full text-[10px] font-bold mt-3 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                  >
                    Sold Out
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No drops found</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Check back soon for new releases.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
