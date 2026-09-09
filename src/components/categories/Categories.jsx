'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Categories = () => {
  const categories = [
    { name: 'Running', image: '/images/running.png', section: 'men' },
    { name: 'Lifestyle', image: '/images/lifestyle-1.png', section: 'men' },
    { name: 'Basketball', image: '/images/basketball.png', section: 'men' },
    { name: 'Nike 24.7', image: '/images/tt1.png', section: 'women' },
    { name: 'Nike Metcon 9', image: '/images/training.png', section: 'men' },
    { name: 'Nike Court Heritage', image: '/images/ll1.png', section: 'women' },
    { name: 'Nike Air Rift', image: '/images/li-1.png', section: 'women' },
    { name: 'Nike Shox Z', image: '/images/lif-1.png', section: 'women' },
  ];

  return (
    <section className="w-full py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
          SHOP BY CATEGORY
        </h2>
        <a href="/men" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--text-muted)' }}>
          View all <span>→</span>
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-4">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/${cat.section}`}
            className="flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-[#1A1A1A] hover:scale-105 hover:shadow-lg hover:shadow-black/30"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <div className="h-32 md:h-36 w-full relative">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-xs font-semibold mt-3" style={{ color: 'var(--text-primary)' }}>
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;