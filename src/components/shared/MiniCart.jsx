'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function MiniCart({ isOpen, onClose }) {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[70] md:hidden"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        ref={ref}
        className="fixed top-0 right-0 h-full w-[340px] z-[80] flex flex-col animate-slideIn"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
            Cart ({cartCount})
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        {cartCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Cart is Empty</p>
            <p className="text-[11px] mb-4" style={{ color: 'var(--text-muted)' }}>Add something fresh to your cart!</p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3">
              {cartItems.map((item) => (
                <div key={item.key} className="flex gap-3 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {/* Image */}
                  <Link href={`/${item.section}/${item.id}`} onClick={onClose} className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link href={`/${item.section}/${item.id}`} onClick={onClose}>
                        <p className="text-xs font-bold truncate hover:underline" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                      </Link>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Size: {item.size} · {item.colorName}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded-md flex items-center justify-center disabled:opacity-30 transition-all active:scale-90"
                          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <span className="text-[11px] font-bold w-4 text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center transition-all active:scale-90"
                          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${item.price * item.quantity}</span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="flex-shrink-0 p-1 rounded-md transition-all hover:bg-red-500/10 self-start"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full h-11 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                Checkout — ${cartTotal.toFixed(2)}
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full h-11 rounded-full text-xs font-semibold flex items-center justify-center mt-2 transition-all active:scale-[0.98]"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
