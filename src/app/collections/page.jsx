'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';

const collections = [
  {
    title: 'Summer Essentials',
    desc: 'Lightweight picks for warm days. Breathable, comfortable, and ready for anything.',
    image: '/images/s1.png',
    color: '#FFD700',
    items: [
      { name: 'Nike Calm 2.0', price: 65, image: '/images/s1.png', section: 'men', id: 8 },
      { name: 'Nike Victori One', price: 55, image: '/images/ssss1.png', section: 'men', id: 9 },
      { name: 'Jordan Franchies', price: 110, image: '/images/sss1.png', section: 'men', id: 10 },
      { name: 'Nike Calm Slide', price: 50, image: '/images/sssss1.png', section: 'men', id: 11 },
    ],
  },
  {
    title: 'Built for the Court',
    desc: 'Performance basketball shoes engineered for speed, support, and style on the hardwood.',
    image: '/images/basketball.png',
    color: '#ef4444',
    items: [
      { name: 'Nike Air Max Pulse', price: 180, image: '/images/c33.png', section: 'men', id: 12 },
      { name: 'Jordan 13 Retro Kids', price: 110, image: '/images/pic6 kid.png', section: 'kids', id: 6 },
      { name: 'Tatum 44 Kids', price: 95, image: '/images/pic15 kid.png', section: 'kids', id: 4 },
      { name: 'Jordan 6 Rings Kids', price: 120, image: '/images/pic8 kid.png', section: 'kids', id: 8 },
    ],
  },
  {
    title: 'Running Essentials',
    desc: 'Cushioned, responsive, and lightweight. Made for daily runs and long miles.',
    image: '/images/running.png',
    color: '#818cf8',
    items: [
      { name: 'Nike 24.7', price: 120, image: '/images/tt1.png', section: 'men', id: 2 },
      { name: "A'Two", price: 160, image: '/images/b1.png', section: 'men', id: 3 },
      { name: 'Nike Air Griffey Max 1', price: 100, image: '/images/pic7 kid.png', section: 'kids', id: 7 },
      { name: 'Nike Flex', price: 55, image: '/images/pic9 kid.png', section: 'kids', id: 9 },
    ],
  },
  {
    title: 'Women\'s Favorites',
    desc: 'Top-rated picks loved by our community. Style meets performance.',
    image: '/images/women1-1 bb.png',
    color: '#f472b6',
    items: [
      { name: 'Sabrina 4 "Light Work"', price: 130, image: '/images/women1-1 bb.png', section: 'women', id: 1 },
      { name: 'Luka 5 "Venom"', price: 115, image: '/images/women 2-1 bb.png', section: 'women', id: 2 },
      { name: 'Book 1 "Scorpion"', price: 130, image: '/images/women 31 bb.png', section: 'women', id: 3 },
      { name: 'Nike Air Rift', price: 130, image: '/images/li-1.png', section: 'women', id: 10 },
    ],
  },
  {
    title: 'Kids\' Top Picks',
    desc: 'Durable, fun, and built for play. The best kicks for the next generation.',
    image: '/images/pic2 kid.png',
    color: '#22c55e',
    items: [
      { name: 'Air Jordan 3 Retro', price: 155, image: '/images/pic1 kid.png', section: 'kids', id: 1 },
      { name: 'Nike Dunk Low Kids', price: 85, image: '/images/pic2 kid.png', section: 'kids', id: 2 },
      { name: 'Nike Giannis Immortality 4', price: 75, image: '/images/pic13 kid.png', section: 'kids', id: 5 },
      { name: 'Nike Star', price: 55, image: '/images/pic14 kid.png', section: 'kids', id: 13 },
    ],
  },
  {
    title: 'Lifestyle Icons',
    desc: 'Classic silhouettes reimagined. From street to studio, these never go out of style.',
    image: '/images/lifestyle-1.png',
    color: '#FFD700',
    items: [
      { name: "Nike Air Force 1 '07 LV8", price: 110, image: '/images/p4-1.png', section: 'men', id: 5 },
      { name: 'Nike Waffle Racer', price: 150, image: '/images/product3(c-1).png', section: 'men', id: 4 },
      { name: 'Nike Court Heritage', price: 100, image: '/images/ll1.png', section: 'women', id: 12 },
      { name: 'Nike Shox Z', price: 110, image: '/images/lif-1.png', section: 'women', id: 11 },
    ],
  },
];

export default function CollectionsPage() {
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
            Curated groups of shoes for every occasion, season, and style. Find the perfect pair.
          </p>
        </div>

        {/* Collections */}
        <div className="flex flex-col gap-8">
          {collections.map((col, idx) => (
            <div key={col.title}>
              {/* Collection Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: col.color }} />
                <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
                  {col.title}
                </h2>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {col.items.length} items
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {col.items.map((item) => (
                        <Link
                          key={`${item.section}-${item.id}`}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
