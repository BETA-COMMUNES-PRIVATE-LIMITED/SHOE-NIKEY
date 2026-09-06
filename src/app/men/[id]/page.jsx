'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import productsData from '@/data/menProducts';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const product = productsData.find((p) => p.id === Number(params.id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = product ? isInWishlist(product.id, 'men') : false;

  // Get current images based on selected color
  const currentColor = product?.colors?.[selectedColorIdx];
  const currentImages = currentColor?.images || product?.images || [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Product not found</h1>
            <Link href="/men" className="text-sm underline" style={{ color: 'var(--accent-lime)' }}>Back to Men</Link>
          </div>
        </main>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(
      { ...product, section: 'men' },
      selectedSize,
      currentColor?.name || product.colorName,
      currentColor?.hex || product.colorHex
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({ ...product, section: 'men' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 md:py-6">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-4 md:mb-6 text-xs font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">

          {/* ═══ LEFT: Image Gallery ═══ */}
          <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4">
            {/* Thumbnails */}
            {currentImages.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all active:scale-95"
                    style={{
                      border: selectedImage === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                      opacity: selectedImage === idx ? 1 : 0.5,
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
              {product.isNew && (
                <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-md" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>NEW</span>
              )}
              <Image
                src={currentImages[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-8 transition-all duration-500"
                priority
              />
              {/* Navigation arrows */}
              {currentImages.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : currentImages.length - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                      <path d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button onClick={() => setSelectedImage(selectedImage < currentImages.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ═══ RIGHT: Product Info ═══ */}
          <div className="flex flex-col gap-4 md:gap-5">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {product.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{product.type}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${product.price}</span>
              {product.rating && (
                <span className="flex items-center gap-1.5 text-sm">
                  <span style={{ color: '#FFD700' }}>★</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({product.reviews})</span>
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {product.description}
            </p>

            {/* Color */}
            {product.colors && product.colors.length > 1 && (
              <div>
                <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  COLOR: <span style={{ color: 'var(--text-muted)' }}>{currentColor?.name}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedColorIdx(idx); setSelectedImage(0); }}
                      className="w-8 h-8 rounded-full transition-all active:scale-90"
                      style={{
                        backgroundColor: col.hex,
                        border: selectedColorIdx === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                        boxShadow: selectedColorIdx === idx ? '0 0 0 2px var(--bg-primary), 0 0 0 4px var(--text-primary)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  SIZE: <span style={{ color: 'var(--text-muted)' }}>{selectedSize ? `US ${selectedSize}` : 'Select'}</span>
                </p>
                <button className="text-xs underline" style={{ color: 'var(--text-muted)' }}>Size Guide</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className="h-11 rounded-xl text-sm font-medium flex items-center justify-center transition-all active:scale-95"
                    style={{
                      backgroundColor: selectedSize === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
                      color: selectedSize === s ? '#000' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      fontWeight: selectedSize === s ? '700' : '500',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>Select a size</p>}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full h-12 rounded-full text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-40"
              style={{
                backgroundColor: addedToCart ? '#22c55e' : 'var(--accent-lime)',
                color: '#000',
              }}
            >
              {addedToCart ? '✓ Added to Cart' : selectedSize ? 'Add to Cart' : 'Select a Size'}
            </button>

            {/* Favorite / Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{
                border: '1px solid var(--border-color)',
                color: inWishlist ? '#ef4444' : 'var(--text-primary)',
                backgroundColor: inWishlist ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              }}
            >
              <svg className="w-4 h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {inWishlist ? 'Wishlisted' : 'Favorite'}
            </button>

            {/* Shipping & Returns */}
            <div className="flex flex-col gap-3 mt-2 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Free Shipping</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" /><path d="M12 8v4l3 3" />
                </svg>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Easy Returns</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Secure Payment</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>100% secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
