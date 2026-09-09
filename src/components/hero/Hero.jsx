'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    label: 'NEW ARRIVAL',
    title: (
      <>
        JUST <br /> DO IT.
      </>
    ),
    subtitle: 'NIKE AIR MAX 270',
    desc: 'Iconic style. Unmatched comfort. Designed to keep you moving forward.',
    image: '/images/hero1.png',
    alt: 'Nike Air Max 270',
    imageClassName: 'object-cover',
    imageStyle: { objectPosition: 'center 40%' },
  },
  {
    label: 'TRENDING NOW',
    title: (
      <>
        BREAK <br /> LIMITS.
      </>
    ),
    subtitle: 'NIKE AIR MAX 90',
    desc: 'Classic design meets modern performance. Built for those who never stop.',
    image: '/images/hero2.png',
    alt: 'Nike Air Max 90',
    imageClassName: 'object-contain object-center',
    imageStyle: { transform: 'scale(1.15)' },
  },
  {
    label: 'TRAINING',
    title: (
      <>
        TRAIN <br /> HARD.
      </>
    ),
    subtitle: 'NIKE TRAINING COLLECTION',
    desc: 'Push your boundaries. Every rep, every set, every day.',
    image: '/images/training.png',
    alt: 'Nike Training Collection',
    imageClassName: 'object-contain object-center',
    imageStyle: { transform: 'scale(1.15)' },
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      if (index === current || isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    },
    [current, isTransitioning]
  );

  // Auto-play every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToSlide]);

  const features = [
    {
      title: 'FREE SHIPPING',
      desc: 'On orders over $100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
          <path d="M1 3h15v13H1z" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      title: 'EASY RETURNS',
      desc: '30 days return policy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
          <path d="M1 4v6h6" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      ),
    },
    {
      title: 'SECURE PAYMENT',
      desc: '100% secure checkout',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: '24/7 SUPPORT',
      desc: "We're here anytime",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  const slide = slides[current];

  return (
    <section className="w-full flex flex-col gap-10 py-8">
      {/* Main Banner */}
      <div className="relative w-full px-5 py-12 sm:px-8 sm:py-14 md:px-16 md:py-16 overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[360px] sm:min-h-[400px] md:min-h-[480px]">
        {/* Left Content */}
        <div
          className={`relative z-20 flex flex-col items-start gap-4 max-w-md transition-all duration-500 ease-in-out ${
            isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
          }`}
        >
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--accent-lime)' }}>
            {slide.label}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none" style={{ color: 'var(--text-primary)' }}>
            {slide.title}
          </h1>
          <div className="mt-2">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{slide.subtitle}</h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {slide.desc}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Link href="/collections">
              <button
                className="px-6 py-3 rounded-full text-xs font-bold text-black uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'var(--accent-lime)' }}
              >
                SHOP NOW
              </button>
            </Link>
            <Link href="/men">
              <button
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors cursor-pointer"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                EXPLORE
              </button>
            </Link>
          </div>
        </div>

        {/* Right Shoe Display */}
        <div className="absolute inset-0 md:relative md:w-1/2 h-full min-h-[260px] md:min-h-[400px] flex items-center justify-center md:mt-0">
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: 'var(--accent-red)' }} />
          {/* Shoe Image with fade transition */}
          <div
            className={`relative z-10 flex items-center justify-center transition-all duration-500 ease-in-out w-[65vw] h-[65vw] sm:w-[50vw] sm:h-[50vw] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className={slide.imageClassName}
              style={slide.imageStyle || undefined}
              priority
            />
          </div>
        </div>

        {/* Slide Indicators - Clickable Dots */}
        <div className="absolute right-4 md:right-6 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex flex-row md:flex-col gap-3 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="group relative text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
              style={{
                backgroundColor: idx === current ? 'var(--accent-lime)' : 'transparent',
                color: idx === current ? '#000' : 'var(--text-muted)',
                boxShadow: idx === current ? '0 0 12px rgba(166, 255, 0, 0.4)' : 'none',
              }}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="transition-opacity duration-300">
                {String(idx + 1).padStart(2, '0')}
              </span>
              {/* Hover ring */}
              <span
                className="absolute inset-0 rounded-full border transition-all duration-300 group-hover:scale-125"
                style={{
                  borderColor: idx === current ? 'var(--accent-lime)' : 'var(--border-color)',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {item.icon}
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase leading-tight" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;