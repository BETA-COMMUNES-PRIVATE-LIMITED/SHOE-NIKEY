'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ═══ MOBILE BOTTOM SHEET ═══ */
const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    document.addEventListener('touchstart', h);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('mousedown', h);
      document.removeEventListener('touchstart', h);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden flex items-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div ref={ref} className="w-full animate-slideUp rounded-t-3xl px-5 pt-3 pb-8 max-h-[75vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: 'var(--border-color)' }} />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} className="p-1" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ═══ DESKTOP DROPDOWN ═══ */
const DesktopDropdown = ({ label, icon, children, isOpen, onToggle }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onToggle(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen, onToggle]);

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        onClick={() => onToggle(!isOpen)}
        className="flex items-center gap-2 text-[13px] font-medium transition-all hover:text-white"
        style={{ color: isOpen ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        {icon}
        <span>{label}</span>
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-4 z-50 rounded-2xl p-4 min-w-[220px] shadow-2xl animate-dropdown"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const Chevron = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
);

const CloseIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ═══ MAIN ═══ */
const FilterBar = ({
  categories,
  sizes,
  colorOptions,
  sortOptions,
  searchQuery, setSearchQuery,
  sortBy, setSortBy,
  selectedCategory, setSelectedCategory,
  selectedSize, setSelectedSize,
  selectedColor, setSelectedColor,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileSheet, setMobileSheet] = useState(null);
  const toggleDesktop = useCallback((n) => (o) => setOpenDropdown(o ? n : null), []);

  const clearAll = () => {
    setSelectedCategory('All Shoes');
    setSelectedSize(null);
    setSelectedColor(null);
  };

  const activeCount = [selectedCategory !== 'All Shoes', !!selectedSize, !!selectedColor].filter(Boolean).length;

  /* ─── Mobile Pill ─── */
  const PillButton = ({ name, icon, label }) => (
    <button onClick={() => setMobileSheet(name)}
      className="md:hidden flex items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap px-3 py-2 rounded-full flex-shrink-0 active:scale-95 transition-transform"
      style={{ color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
      {icon}{label}<Chevron />
    </button>
  );

  /* ─── Shared Options ─── */
  const CategoryOptions = ({ onSelect }) => (
    <div className="flex flex-col gap-1">
      {categories.map((cat) => (
        <button key={cat} onClick={() => onSelect(cat)}
          className="text-left text-sm px-4 py-3 rounded-xl transition-all active:scale-95"
          style={{
            backgroundColor: selectedCategory === cat ? 'var(--accent-lime)' : 'transparent',
            color: selectedCategory === cat ? '#000' : 'var(--text-primary)',
            fontWeight: selectedCategory === cat ? '700' : '500',
          }}>{cat}</button>
      ))}
    </div>
  );

  const SizeOptions = ({ onSelect }) => (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map((s) => (
        <button key={s} onClick={() => onSelect(s)}
          className="h-11 rounded-xl text-sm font-medium flex items-center justify-center transition-all active:scale-95"
          style={{
            backgroundColor: selectedSize === s ? 'var(--accent-lime)' : 'var(--bg-surface)',
            color: selectedSize === s ? '#000' : 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          }}>{s}</button>
      ))}
    </div>
  );

  const ColorOptions = ({ onSelect }) => (
    <div className="flex flex-col gap-2">
      {colorOptions.map((col) => (
        <button key={col.name} onClick={() => onSelect(col.name)}
          className="flex items-center gap-3 text-sm px-4 py-3 rounded-xl transition-all active:scale-95"
          style={{
            backgroundColor: selectedColor === col.name ? 'var(--accent-lime)' : 'transparent',
            color: selectedColor === col.name ? '#000' : 'var(--text-primary)',
            fontWeight: selectedColor === col.name ? '700' : '500',
          }}>
          <span className="w-5 h-5 rounded-full flex-shrink-0 border" style={{ backgroundColor: col.hex, borderColor: 'var(--border-color)' }} />
          {col.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mb-5 sm:mb-6">
      {/* ═══ MOBILE: Scrollable pills ═══ */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ color: 'var(--text-primary)' }}>
        <PillButton name="filter" icon={<FilterIcon />} label="Filter" />
        <PillButton name="category" label="Category" />
        <PillButton name="size" label="Size" />
        <PillButton name="color" label="Color" />
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
            style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
            {activeCount} active <CloseIcon />
          </button>
        )}
      </div>

      {/* ═══ DESKTOP: Clean filter row ═══ */}
      <div className="hidden md:flex items-center justify-between">
        {/* Left: Filter buttons */}
        <div className="flex items-center gap-1">
          <DesktopDropdown label="Filter" icon={<FilterIcon />} isOpen={openDropdown === 'filter'} onToggle={toggleDesktop('filter')}>
            <p className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: 'var(--text-muted)' }}>Quick Filters</p>
            <div className="flex flex-col gap-1">
              {['All', 'New Arrivals', 'On Sale'].map((item) => (
                <button key={item} onClick={() => { clearAll(); setOpenDropdown(null); }} className="text-left text-xs px-3 py-2 rounded-lg hover:bg-[var(--bg-surface)] transition-all" style={{ color: 'var(--text-primary)' }}>{item}</button>
              ))}
            </div>
          </DesktopDropdown>

          <span className="mx-3 text-[10px]" style={{ color: 'var(--border-color)' }}>|</span>

          <DesktopDropdown label="Category" isOpen={openDropdown === 'category'} onToggle={toggleDesktop('category')}>
            <CategoryOptions onSelect={(cat) => { setSelectedCategory(cat); setOpenDropdown(null); }} />
          </DesktopDropdown>

          <span className="mx-3 text-[10px]" style={{ color: 'var(--border-color)' }}>|</span>

          <DesktopDropdown label="Size" isOpen={openDropdown === 'size'} onToggle={toggleDesktop('size')}>
            <SizeOptions onSelect={(s) => { setSelectedSize(selectedSize === s ? null : s); setOpenDropdown(null); }} />
            {selectedSize && <button onClick={() => { setSelectedSize(null); setOpenDropdown(null); }} className="w-full mt-3 text-[10px] py-1.5 rounded-lg hover:opacity-80" style={{ color: 'var(--accent-lime)' }}>Clear size</button>}
          </DesktopDropdown>

          <span className="mx-3 text-[10px]" style={{ color: 'var(--border-color)' }}>|</span>

          <DesktopDropdown label="Color" isOpen={openDropdown === 'color'} onToggle={toggleDesktop('color')}>
            <ColorOptions onSelect={(c) => { setSelectedColor(selectedColor === c ? null : c); setOpenDropdown(null); }} />
            {selectedColor && <button onClick={() => { setSelectedColor(null); setOpenDropdown(null); }} className="w-full mt-3 text-[10px] py-1.5 rounded-lg hover:opacity-80" style={{ color: 'var(--accent-lime)' }}>Clear color</button>}
          </DesktopDropdown>

          {/* Active badge */}
          {activeCount > 0 && (
            <>
              <span className="mx-3 text-[10px]" style={{ color: 'var(--border-color)' }}>|</span>
              <button onClick={clearAll} className="text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all hover:scale-105"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                {activeCount} active <CloseIcon />
              </button>
            </>
          )}
        </div>

        {/* Right: Sort */}
        <div className="text-[13px] flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          Sort by:
          <DesktopDropdown label={sortOptions.find(o => o.value === sortBy)?.label || 'Featured'} isOpen={openDropdown === 'sort'} onToggle={toggleDesktop('sort')}>
            <div className="flex flex-col gap-1">
              {sortOptions.map((opt) => (
                <button key={opt.value} onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                  className="text-left text-xs px-3 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: sortBy === opt.value ? 'var(--accent-lime)' : 'transparent',
                    color: sortBy === opt.value ? '#000' : 'var(--text-primary)',
                    fontWeight: sortBy === opt.value ? '700' : '500',
                  }}>{opt.label}</button>
              ))}
            </div>
          </DesktopDropdown>
        </div>
      </div>

      {/* ═══ MOBILE: Sort ═══ */}
      <div className="md:hidden flex items-center mt-2">
        <button onClick={() => setMobileSheet('sort')}
          className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
          Sort by: <span style={{ color: 'var(--text-primary)' }}>{sortOptions.find(o => o.value === sortBy)?.label}</span>
          <Chevron />
        </button>
      </div>

      {/* ═══ MOBILE BOTTOM SHEETS ═══ */}
      <BottomSheet isOpen={mobileSheet === 'filter'} onClose={() => setMobileSheet(null)} title="Quick Filters">
        <div className="flex flex-col gap-2">
          {['All', 'New Arrivals', 'On Sale'].map((item) => (
            <button key={item} onClick={() => { clearAll(); setMobileSheet(null); }} className="text-left text-sm px-4 py-3.5 rounded-xl active:scale-95 transition-transform" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>{item}</button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={mobileSheet === 'category'} onClose={() => setMobileSheet(null)} title="Category">
        <CategoryOptions onSelect={(cat) => { setSelectedCategory(cat); setMobileSheet(null); }} />
      </BottomSheet>

      <BottomSheet isOpen={mobileSheet === 'size'} onClose={() => setMobileSheet(null)} title="Size">
        <SizeOptions onSelect={(s) => { setSelectedSize(selectedSize === s ? null : s); setMobileSheet(null); }} />
        {selectedSize && <button onClick={() => { setSelectedSize(null); setMobileSheet(null); }} className="w-full mt-4 text-sm py-3 rounded-xl active:scale-95 transition-transform" style={{ color: 'var(--accent-lime)', backgroundColor: 'var(--bg-surface)' }}>Clear size</button>}
      </BottomSheet>

      <BottomSheet isOpen={mobileSheet === 'sort'} onClose={() => setMobileSheet(null)} title="Sort By">
        <div className="flex flex-col gap-1">
          {sortOptions.map((opt) => (
            <button key={opt.value} onClick={() => { setSortBy(opt.value); setMobileSheet(null); }}
              className="text-left text-sm px-4 py-3 rounded-xl transition-all active:scale-95"
              style={{
                backgroundColor: sortBy === opt.value ? 'var(--accent-lime)' : 'var(--bg-surface)',
                color: sortBy === opt.value ? '#000' : 'var(--text-primary)',
                fontWeight: sortBy === opt.value ? '700' : '500',
              }}>{opt.label}</button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={mobileSheet === 'color'} onClose={() => setMobileSheet(null)} title="Color">
        <ColorOptions onSelect={(c) => { setSelectedColor(c); setMobileSheet(null); }} />
        {selectedColor && <button onClick={() => { setSelectedColor(null); setMobileSheet(null); }} className="w-full mt-4 text-sm py-3 rounded-xl active:scale-95 transition-transform" style={{ color: 'var(--accent-lime)', backgroundColor: 'var(--bg-surface)' }}>Clear color</button>}
      </BottomSheet>
    </div>
  );
};

export default FilterBar;
