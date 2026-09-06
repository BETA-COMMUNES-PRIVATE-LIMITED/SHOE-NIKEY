'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import productsDataMen from '@/data/menProducts';
import productsDataWomen from '@/data/womenProducts';
import productsDataKids from '@/data/kidsProducts';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedKeys, setAddedKeys] = useState({});

  const allProducts = [...productsDataMen, ...productsDataWomen, ...productsDataKids];

  const handleAddToCart = (item) => {
    const product = allProducts.find((p) => p.id === item.id);
    if (!product) return;

    const defaultSize = product.sizes?.[0] || null;
    const defaultColor = product.colors?.[0];

    addToCart(
      { ...product, section: item.section },
      defaultSize,
      defaultColor?.name || product.colorName || 'Default',
      defaultColor?.hex || product.colorHex || '#000'
    );

    setAddedKeys((prev) => ({ ...prev, [`${item.id}-${item.section}`]: true }));
    setTimeout(() => {
      setAddedKeys((prev) => ({ ...prev, [`${item.id}-${item.section}`]: false }));
    }, 2000);
  };

  const [removingKey, setRemovingKey] = useState(null);

  const handleRemove = (id, section) => {
    const key = `${id}-${section}`;
    setRemovingKey(key);
    setTimeout(() => {
      removeFromWishlist(id, section);
      setRemovingKey(null);
    }, 300);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your Wishlist is Empty</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Save items you love to come back to them later.</p>
            <Link
              href="/men"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
            >
              Explore Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistItems.map((item) => {
            const key = `${item.id}-${item.section}`;
            const isAdded = addedKeys[key];
            const isRemoving = removingKey === key;

            return (
              <div
                key={key}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  opacity: isRemoving ? 0.4 : 1,
                  transform: isRemoving ? 'scale(0.95)' : 'none',
                }}
              >
                {/* Image */}
                <Link href={`/${item.section}/${item.id}`} className="block relative">
                  <div className="relative w-full aspect-square" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <Image src={item.image} alt={item.name} fill className="object-contain p-6" />

                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(item.id, item.section); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 hover:bg-red-500/20"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-color)' }}
                      aria-label="Remove from wishlist"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#ef4444' }}>
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>

                    {/* Rating */}
                    {item.rating && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                        <span style={{ color: '#FFD700', fontSize: '10px' }}>★</span>
                        <span className="text-[10px] font-bold" style={{ color: '#fff' }}>{item.rating}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/${item.section}/${item.id}`}>
                    <h3 className="text-sm font-bold truncate hover:underline mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>{item.type}</p>
                  <p className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>${item.price}</p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/${item.section}/${item.id}`}
                      className="flex-1 h-10 rounded-full text-[11px] font-bold flex items-center justify-center transition-all active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 h-10 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                      style={{
                        backgroundColor: isAdded ? '#22c55e' : 'var(--bg-surface)',
                        color: isAdded ? '#fff' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {isAdded ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                          Added
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
