'use client';

import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AdminProvider } from '@/context/AdminContext';

export default function Providers({ children }) {
  return (
    <AdminProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AdminProvider>
  );
}
