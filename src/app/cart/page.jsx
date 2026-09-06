'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const [removingKey, setRemovingKey] = useState(null);

  const shipping = cartTotal >= 100 ? 0 : 10;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = cartTotal + shipping + tax;

  const handleRemove = (key) => {
    setRemovingKey(key);
    setTimeout(() => {
      removeFromCart(key);
      setRemovingKey(null);
    }, 300);
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your Cart is Empty</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/men"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
            >
              Start Shopping
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
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Shopping Cart ({cartCount})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold transition-all hover:opacity-70"
            style={{ color: 'var(--accent-red)' }}
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {cartItems.map((item) => (
              <div
                key={item.key}
                className="flex gap-4 p-4 rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  opacity: removingKey === item.key ? 0.5 : 1,
                  transform: removingKey === item.key ? 'translateX(-20px)' : 'none',
                }}
              >
                {/* Image */}
                <Link href={`/${item.section}/${item.id}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link href={`/${item.section}/${item.id}`}>
                          <h3 className="text-sm font-bold truncate transition-colors hover:text-white" style={{ color: 'var(--text-primary)' }}>
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.type}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.key)}
                        className="p-1 rounded-full transition-all hover:bg-red-500/10 flex-shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Size & Color */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                        Size: {item.size}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.colorHex, border: '1px solid var(--border-color)' }} />
                        {item.colorName}
                      </span>
                    </div>
                  </div>

                  {/* Bottom: Quantity & Price */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
                        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span className="text-sm font-bold w-6 text-center" style={{ color: 'var(--text-primary)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
                        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      ${item.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl p-5 md:p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-sm font-bold tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>
                Order Summary
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Subtotal ({cartCount} items)</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Shipping</span>
                  <span className="text-xs font-semibold" style={{ color: shipping === 0 ? '#22c55e' : 'var(--text-primary)' }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tax</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className="text-[10px] font-semibold" style={{ color: '#22c55e' }}>Free shipping on orders over $100!</span>
                  </div>
                )}

                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full h-12 rounded-full text-sm font-bold flex items-center justify-center gap-2 mt-5 transition-all active:scale-[0.98] hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/men"
                className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 mt-3 transition-all active:scale-[0.98]"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-5 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Secure</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Free Returns</span>
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
