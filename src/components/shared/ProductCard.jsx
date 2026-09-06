'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

const ProductCard = ({ product, section }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id, section);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({ ...product, section });
  };

  return (
    <Link href={`/${section}/${product.id}`}>
      <div
        className="group relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 flex flex-col justify-between cursor-pointer card-hover h-full"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
      >
        {/* Header: Badge & Heart */}
        <div className="flex items-center justify-between w-full z-10">
          {product.isComingSoon ? (
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md badge-pulse"
              style={{ backgroundColor: 'var(--accent-red)', color: '#FFFFFF' }}
            >Coming Soon</span>
          ) : product.isNew ? (
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md badge-bounce"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000000' }}
            >NEW</span>
          ) : <div />}

          <button
            className={`p-1 sm:p-1.5 rounded-full transition-all duration-300 heart-btn ${inWishlist ? 'text-red-500' : 'text-neutral-400 hover:text-red-500'}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleWishlist}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        {/* Shoe Image */}
        <div className="relative w-full h-36 sm:h-44 lg:h-52 my-2 sm:my-4 lg:my-5 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain shoe-img"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Product Meta */}
        <div className="flex flex-col gap-0.5 sm:gap-1 mt-1 sm:mt-2">
          <h3 className="text-[11px] sm:text-xs font-bold tracking-tight transition-colors duration-300 group-hover:text-white line-clamp-1" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-[11px] line-clamp-1" style={{ color: 'var(--text-muted)' }}>
            {product.type}
          </p>

          {product.isComingSoon ? (
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-[11px] sm:text-xs font-bold" style={{ color: 'var(--accent-red)' }}>Coming Soon</span>
            </div>
          ) : (
            <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-[11px] sm:text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${product.price}</span>
              <span className="text-[11px] sm:text-xs flex items-center gap-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: '#FFD700' }}>★</span>
                <span style={{ color: 'var(--text-muted)' }}>{product.rating}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
