'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const drops = [
  {
    id: 1,
    name: 'Air Jordan 8 Retro "Chrome"',
    type: "Men's Shoes",
    price: 215,
    image: '/images/p1-1.png',
    section: 'men',
    date: 'Sep 12, 2026',
    time: '10:00 AM EST',
    status: 'upcoming',
    tag: 'Exclusive',
  },
  {
    id: 6,
    name: 'Nike Metcon 9',
    type: "Men's Training Shoes",
    price: 140,
    image: '/images/training.png',
    section: 'men',
    date: 'Sep 8, 2026',
    time: '10:00 AM EST',
    status: 'upcoming',
    tag: 'New Drop',
  },
  {
    id: 4,
    name: 'Nike Revolution 7',
    type: "Women's Road Running Shoes",
    price: 75,
    image: '/images/rc.png',
    section: 'women',
    date: 'Sep 15, 2026',
    time: '09:00 AM EST',
    status: 'upcoming',
    tag: 'Coming Soon',
  },
  {
    id: 12,
    name: 'Nike Air Max Pulse',
    type: "Men's Shoes",
    price: 180,
    image: '/images/c33.png',
    section: 'men',
    date: 'Sep 5, 2026',
    time: '10:00 AM EST',
    status: 'live',
    tag: 'Live Now',
  },
  {
    id: 1,
    name: 'Sabrina 4 "Light Work"',
    type: "Women's Shoes",
    price: 130,
    image: '/images/women1-1 bb.png',
    section: 'women',
    date: 'Sep 1, 2026',
    time: '10:00 AM EST',
    status: 'live',
    tag: 'Live Now',
  },
  {
    id: 2,
    name: 'Nike Dunk Low Kids',
    type: "Kids' Shoes",
    price: 85,
    image: '/images/pic2 kid.png',
    section: 'kids',
    date: 'Sep 3, 2026',
    time: '10:00 AM EST',
    status: 'live',
    tag: 'Live Now',
  },
  {
    id: 9,
    name: 'Nike Victori One',
    type: "Men's Slides",
    price: 55,
    image: '/images/ssss1.png',
    section: 'men',
    date: 'Aug 28, 2026',
    time: '10:00 AM EST',
    status: 'sold-out',
    tag: 'Sold Out',
  },
  {
    id: 5,
    name: 'Nike Air Max 270 G',
    type: "Women's Shoes",
    price: 170,
    image: '/images/r1.png',
    section: 'women',
    date: 'Aug 25, 2026',
    time: '10:00 AM EST',
    status: 'sold-out',
    tag: 'Sold Out',
  },
];

const filters = ['All', 'Live Now', 'Upcoming', 'Sold Out'];

export default function SNKRSPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? drops : drops.filter((d) => {
    if (activeFilter === 'Live Now') return d.status === 'live';
    if (activeFilter === 'Upcoming') return d.status === 'upcoming';
    if (activeFilter === 'Sold Out') return d.status === 'sold-out';
    return true;
  });

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
                  ({drops.filter((d) => {
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
        {activeFilter === 'All' && (
          <div className="mb-8">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              Featured Drop
            </h2>
            <Link href="/men/12" className="block rounded-2xl overflow-hidden transition-all hover:scale-[1.01]" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <Image src="/images/c33.png" alt="Nike Air Max Pulse" fill className="object-contain p-8" />
                  <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    ● LIVE NOW
                  </span>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent-lime)' }}>Exclusive Release</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Nike Air Max Pulse</h3>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Men&apos;s Shoes</p>
                  <p className="text-2xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>$180</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Launch Date</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Sep 5, 2026</p>
                    </div>
                    <div className="w-px h-8" style={{ backgroundColor: 'var(--border-color)' }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Time</p>
                      <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>10:00 AM EST</p>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto h-11 px-8 rounded-full text-sm font-bold transition-all active:scale-[0.98]" style={{ backgroundColor: '#22c55e', color: '#fff' }}>
                    Notify Me
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
              key={`${drop.section}-${drop.id}`}
              href={`/${drop.section}/${drop.id}`}
              className="rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              {/* Image */}
              <div className="relative aspect-square" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <Image src={drop.image} alt={drop.name} fill className="object-contain p-6" />

                {/* Status badge */}
                <span
                  className="absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: statusBg(drop.status),
                    color: statusColor(drop.status),
                    border: `1px solid ${drop.status === 'live' ? 'rgba(34,197,94,0.3)' : drop.status === 'upcoming' ? 'rgba(166,255,0,0.2)' : 'var(--border-color)'}`,
                  }}
                >
                  {drop.status === 'live' && '● '}{drop.tag}
                </span>
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
