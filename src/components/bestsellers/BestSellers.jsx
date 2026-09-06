import React from 'react';
import Image from 'next/image';

const BestSellers = () => {
  const products = [
    { name: 'Nike Air Max 270', type: "Men's Shoes", price: '$170', rating: '4.8', image: '/images/lifestyle-1.png' },
    { name: 'Nike Air Force 1 \'07', type: "Men's Shoes", price: '$120', rating: '4.6', image: '/images/c2.png' },
    { name: 'Nike React Infinity Run', type: "Men's Road Running Shoes", price: '$160', rating: '4.7', image: '/images/c33.png', imageStyle: { objectPosition: 'center 15%' } },
    { name: 'Nike Air Zoom Pegasus 40', type: "Men's Road Running Shoes", price: '$150', rating: '4.7', image: '/images/c3.png' },
  ];

  return (
    <section className="w-full py-6 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
          BEST SELLERS
        </h2>
        <a href="/men" className="text-xs flex items-center gap-1 hover:underline" style={{ color: 'var(--text-muted)' }}>
          View all <span>→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item, idx) => (
          <div 
            key={idx}
            className="group relative flex flex-col p-4 rounded-2xl transition-all duration-300 hover:bg-[#1A1A1A] hover:scale-105 hover:shadow-lg hover:shadow-black/30 cursor-pointer"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            {/* Heart / Wishlist Icon */}
            <button className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white" aria-label="Add to wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>

            {/* Shoe Card Image */}
            <div className="h-48 md:h-52 w-full relative my-4">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-1"
                style={item.imageStyle || undefined}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-1 mt-auto">
              <h3 className="text-xs font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {item.name}
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{item.type}</p>
              
              <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid #2A2A2A' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.price}</span>
                <span className="text-xs flex items-center gap-1 font-semibold">
                  <span style={{ color: '#FFD700' }}>★</span> <span style={{ color: 'var(--text-muted)' }}>{item.rating}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;