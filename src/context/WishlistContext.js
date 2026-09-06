'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nike-wishlist');
      if (saved) setWishlistItems(JSON.parse(saved));
    } catch {}
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nike-wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id && item.section === product.section);
      if (exists) {
        return prev.filter((item) => !(item.id === product.id && item.section === product.section));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
          image: product.image,
          section: product.section || 'men',
          rating: product.rating,
        },
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((id, section) => {
    setWishlistItems((prev) => prev.filter((item) => !(item.id === id && item.section === section)));
  }, []);

  const isInWishlist = useCallback(
    (id, section) => {
      return wishlistItems.some((item) => item.id === id && item.section === section);
    },
    [wishlistItems]
  );

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist, wishlistCount, isLoaded }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
