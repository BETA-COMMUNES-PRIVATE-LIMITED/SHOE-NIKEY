'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useAdmin } from '@/context/AdminContext';
import menProducts from '@/data/menProducts';
import womenProducts from '@/data/womenProducts';
import kidsProducts from '@/data/kidsProducts';

export default function CollectionsPage() {
  const { collections, customProducts, applyProductOverrides, hiddenProducts, isLoaded, pageContent } = useAdmin();

  // Admin-editable page intro (Admin → Collections → Page Intro)
  const intro = pageContent['collections-header']?.intro || 'Curated groups of shoes for every occasion, season, and style. Find the perfect pair.';

  // Build a full product index from every section catalog, then layer
  // admin custom products + overrides on top. Keyed by `${section}-${id}`
  // because ids repeat across catalogs (each section starts at id 1).
  const productIndex = {};
  const addAll = (section, list) => {
    // applyProductOverrides layers admin edits (name/price/image/images) on top
    // of the built-in catalog, so collection tiles reflect admin changes.
    (applyProductOverrides(list) || []).forEach((p) => {
      productIndex[`${section}-${p.id}`] = {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0] || p.image,
        section,
      };
    });
  };
  addAll('men', menProducts);
  addAll('women', womenProducts);
  addAll('kids', kidsProducts);
  customProducts.forEach((p) => {
    productIndex[`${p.section}-${p.id}`] = { name: p.name, price: p.price, image: p.images?.[0] || p.image, section: p.section };
  });
  const isHidden = (key) => (hiddenProducts || []).includes(key);

  const visible = (isLoaded ? collections : collections.filter((c) => c.active !== false))
    .filter((c) => c.active !== false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Collections
          </h1>
          <p className="text-sm max-w-lg" style={{ color: 'var(--text-muted)' }}>
            {intro}
          </p>
        </div>

        {/* Collections */}
        <div className="flex flex-col gap-8">
          {visible.map((col) => {
            // Resolve linked products — supports both plain ids (legacy)
            // and section-scoped keys like "men-8". Deduped in case old
            // saved data contains both forms of the same product.
            const seen = new Set();
            const items = (col.productIds || [])
              .map((id) => {
                if (typeof id === 'string' && productIndex[id]) return productIndex[id];
                const sec = col.section || 'men';
                return productIndex[`${sec}-${id}`];
              })
              .filter(Boolean)
              .filter((item) => {
                const key = `${item.section}-${item.id}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              })
              .filter((item) => !isHidden(`${item.section}-${item.id}`));

            return (
              <div key={col.id}>
                {/* Collection Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: col.color }} />
                  <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
                    {col.title}
                  </h2>
                  <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {items.length} items
                  </span>
                </div>

                {/* Featured Card */}
                <div className="rounded-2xl overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-5">
                    {/* Large Image */}
                    <div className="relative md:col-span-2 aspect-square md:aspect-auto" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <Image src={col.image} alt={col.title} fill className="object-contain p-8" />
                      <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 30% 50%, ${col.color}, transparent 60%)` }} />
                    </div>

                    {/* Items Preview */}
                    <div className="md:col-span-3 p-5">
                      <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{col.desc}</p>
                      {items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {items.map((item) => (
                            <Link
                              key={`${col.id}-${item.section}-${item.id}`}
                              href={`/${item.section}/${item.id}`}
                              className="group rounded-xl p-2 transition-all hover:bg-white/[0.03]"
                              style={{ border: '1px solid var(--border-color)' }}
                            >
                              <div className="relative aspect-square mb-2" style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '0.75rem' }}>
                                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                              </div>
                              <p className="text-[10px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                              <p className="text-[10px] font-bold" style={{ color: col.color }}>${item.price}</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl p-6 text-center" style={{ border: '1px dashed var(--border-color)' }}>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No products linked to this collection yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {visible.length === 0 && (
            <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No collections yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Check back soon for curated drops.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
