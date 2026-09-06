'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import productsDataMen from '@/data/menProducts';
import productsDataWomen from '@/data/womenProducts';
import productsDataKids from '@/data/kidsProducts';

const allProducts = [
  ...productsDataMen.map((p) => ({ ...p, section: 'men', sectionLabel: 'Men' })),
  ...productsDataWomen.map((p) => ({ ...p, section: 'women', sectionLabel: 'Women' })),
  ...productsDataKids.map((p) => ({ ...p, section: 'kids', sectionLabel: 'Kids' })),
];

export default function SearchBar({ className = '', isMobile = false, onClose }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sectionLabel.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && activeIdx >= 0 && results[activeIdx]) {
      e.preventDefault();
      navigateTo(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const navigateTo = (product) => {
    setQuery('');
    setIsOpen(false);
    setActiveIdx(-1);
    router.push(`/${product.section}/${product.id}`);
    if (onClose) onClose();
  };

  const handleViewAll = () => {
    if (!query.trim()) return;
    setQuery('');
    setIsOpen(false);
    router.push(`/men?search=${encodeURIComponent(query)}`);
    if (onClose) onClose();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
        style={{
          backgroundColor: isOpen ? 'var(--bg-card)' : 'transparent',
          border: isOpen ? '1px solid var(--accent-lime)' : '1px solid var(--border-color)',
          minWidth: isMobile ? '100%' : '160px',
        }}
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: isOpen ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search shoes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none w-full"
          style={{
            color: 'var(--text-primary)',
            fontSize: isMobile ? '14px' : '12px',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); inputRef.current?.focus(); }}
            className="flex-shrink-0 p-0.5 rounded-full transition-all hover:bg-white/10"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim() && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[60] max-h-[400px] overflow-y-auto animate-dropdown"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            ...(isMobile ? { position: 'fixed', left: '16px', right: '16px', top: 'auto', marginTop: '8px' } : {}),
          }}
        >
          {results.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>No results found</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Try searching for something else</p>
            </div>
          ) : (
            <>
              {/* Results header */}
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  ↑↓ to navigate · ↵ to select
                </span>
              </div>

              {/* Results list */}
              {results.map((product, idx) => (
                <button
                  key={`${product.section}-${product.id}`}
                  onClick={() => navigateTo(product)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left"
                  style={{
                    backgroundColor: activeIdx === idx ? 'var(--bg-surface)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  {/* Image */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{product.type}</p>
                  </div>

                  {/* Price + Section */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>${product.price}</p>
                    <p className="text-[9px] font-semibold" style={{ color: 'var(--accent-lime)' }}>{product.sectionLabel}</p>
                  </div>

                  {/* Arrow */}
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}

              {/* View All */}
              <button
                onClick={handleViewAll}
                className="w-full px-4 py-3 text-xs font-bold text-center transition-all hover:bg-white/[0.03]"
                style={{ color: 'var(--accent-lime)' }}
              >
                View all results for &quot;{query}&quot; →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
