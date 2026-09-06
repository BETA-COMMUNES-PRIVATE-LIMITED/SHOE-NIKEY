'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import MiniCart from '@/components/shared/MiniCart';
import SearchBar from '@/components/shared/SearchBar';

const navLinks = [
  { label: 'MEN', href: '/men' },
  { label: 'WOMEN', href: '/women' },
  { label: 'KIDS', href: '/kids' },
  { label: 'SNKRS', href: '/snkrs' },
  { label: 'COLLECTIONS', href: '/collections' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, isLoaded } = useCart();
  const { wishlistCount } = useWishlist();

  const isActive = (href) => {
    if (href === '#') return false;
    return pathname.startsWith(href);
  };

  const toggleMiniCart = useCallback(() => setMiniCartOpen((prev) => !prev), []);
  const closeMiniCart = useCallback(() => setMiniCartOpen(false), []);

  return (
    <>
      <nav
        className="w-full px-6 md:px-10 lg:px-16"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 md:h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={60}
              height={24}
              className="w-12 h-auto md:w-16"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs font-bold tracking-widest transition-all relative pb-1"
                  style={{
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                    opacity: active ? 1 : 0.7,
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--text-primary)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right: Search + Wishlist + Cart */}
          <div className="hidden md:flex items-center gap-4">
            <SearchBar />

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 rounded-full transition-opacity hover:opacity-70 relative" style={{ color: 'var(--text-primary)' }} aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {isLoaded && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart — opens MiniCart */}
            <button
              onClick={toggleMiniCart}
              className="p-2 rounded-full transition-opacity hover:opacity-70 relative"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {isLoaded && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Wishlist + Cart + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/wishlist" className="p-2 rounded-full relative" style={{ color: 'var(--text-primary)' }} aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {isLoaded && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart — opens MiniCart */}
            <button
              onClick={toggleMiniCart}
              className="p-2 rounded-full relative"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {isLoaded && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg transition-opacity hover:opacity-70" style={{ color: 'var(--text-primary)' }} aria-label="Menu">
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mini Cart */}
      <MiniCart isOpen={miniCartOpen} onClose={closeMiniCart} />

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden transition-transform duration-300 ease-in-out flex flex-col`}
        style={{ backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-end p-4">
          <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-primary)' }} aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>          <div className="px-6 mb-6">
          <SearchBar isMobile onClose={() => setMobileOpen(false)} />
        </div>

        <div className="flex flex-col px-6 gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className="py-3 text-sm font-bold tracking-widest border-b transition-all"
                style={{
                  color: active ? 'var(--accent-lime)' : 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                  opacity: active ? 1 : 0.8,
                }}
                onClick={() => setMobileOpen(false)}
              >
                {active && '→ '}{link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto px-6 pb-8 flex flex-col gap-3">
          <Link href="/wishlist" className="text-xs font-semibold transition-opacity hover:opacity-70 flex items-center gap-2" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileOpen(false)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
          </Link>
          <button onClick={() => { setMobileOpen(false); toggleMiniCart(); }} className="text-xs font-semibold transition-opacity hover:opacity-70 flex items-center gap-2 text-left" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            Cart {cartCount > 0 && `(${cartCount})`}
          </button>
          <Link href="/faqs" className="text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileOpen(false)}>Help</Link>
          <Link href="/about" className="text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }} onClick={() => setMobileOpen(false)}>About Us</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
