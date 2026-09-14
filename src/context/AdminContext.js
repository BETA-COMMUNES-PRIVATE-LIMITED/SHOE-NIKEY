'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { pageDataDefaults } from '@/data/pageDefaults';

const AdminContext = createContext();

const ADMIN_CREDENTIALS = { email: 'admin@verre.com', password: 'admin123' };

// Default admin profile (editable via /verre-admin/profile)
// avatar: base64 data URL of the profile picture (null = show initials)
const DEFAULT_ADMIN_PROFILE = {
  name: 'Umaid Ali',
  email: ADMIN_CREDENTIALS.email,
  role: 'Administrator',
  avatar: null,
};

// Storage keys
const K = {
  auth: 'verre-admin-auth',
  orders: 'verre-admin-orders',
  products: 'verre-admin-products',
  overrides: 'verre-admin-product-overrides',
  hidden: 'verre-admin-hidden-products',
  visitors: 'verre-admin-visitors',
  jobs: 'verre-admin-jobs',
  applications: 'verre-admin-applications',
  notifsRead: 'verre-admin-notifs-read',
  profile: 'verre-admin-profile',
  password: 'verre-admin-password',
  pageContent: 'verre-admin-page-content',
  slides: 'verre-admin-slides',
  categories: 'verre-admin-categories',
  collections: 'verre-admin-collections',
  customers: 'verre-admin-customers',
  reviews: 'verre-admin-reviews',
  pages: 'verre-admin-pages',
  drops: 'verre-admin-drops',
  coupons: 'verre-admin-coupons',
  settings: 'verre-admin-settings',
};

const lsGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded etc */
  }
};

/* ===================== DEFAULT DATA ===================== */

const demoOrders = [
  { id: 'VR-A1B2C3', customer: { name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567' }, items: [{ name: 'Nike Air Max 270 G', price: 170, quantity: 1, size: '10', color: 'White' }, { name: 'Nike Calm 2.0', price: 65, quantity: 2, size: '9', color: 'Green' }], total: 300, status: 'delivered', date: '2026-08-28', address: '123 Main St, New York, NY 10001' },
  { id: 'VR-D4E5F6', customer: { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '(555) 987-6543' }, items: [{ name: 'Sabrina 4 "Light Work"', price: 130, quantity: 1, size: '8', color: 'White' }], total: 130, status: 'shipped', date: '2026-09-01', address: '456 Oak Ave, Los Angeles, CA 90001' },
  { id: 'VR-G7H8I9', customer: { name: 'Mike Chen', email: 'mike@example.com', phone: '(555) 456-7890' }, items: [{ name: 'Air Jordan 8 Retro', price: 215, quantity: 1, size: '11', color: 'Black' }, { name: 'Nike Victori One', price: 55, quantity: 1, size: '10', color: 'White' }], total: 270, status: 'processing', date: '2026-09-04', address: '789 Pine Rd, Chicago, IL 60601' },
  { id: 'VR-J1K2L3', customer: { name: 'Emily Davis', email: 'emily@example.com', phone: '(555) 321-6549' }, items: [{ name: 'Nike Dunk Low Kids', price: 85, quantity: 2, size: '3yr', color: 'Blue' }], total: 170, status: 'delivered', date: '2026-08-25', address: '321 Elm St, Houston, TX 77001' },
  { id: 'VR-M4N5O6', customer: { name: 'Alex Johnson', email: 'alex@example.com', phone: '(555) 789-0123' }, items: [{ name: "A'Two", price: 160, quantity: 1, size: '9', color: 'Red/Black' }], total: 160, status: 'pending', date: '2026-09-05', address: '654 Maple Dr, Phoenix, AZ 85001' },
  { id: 'VR-P7Q8R9', customer: { name: 'Lisa Park', email: 'lisa@example.com', phone: '(555) 234-5678' }, items: [{ name: 'Jordan 6 Rings Kids', price: 120, quantity: 1, size: '5yr', color: 'White' }, { name: 'Nike Star', price: 55, quantity: 1, size: '4yr', color: 'Blue' }], total: 175, status: 'shipped', date: '2026-09-03', address: '987 Cedar Ln, Philadelphia, PA 19101' },
];

const defaultSlides = [
  { id: 1, label: 'NEW ARRIVAL', title: 'JUST DO IT.', subtitle: 'NIKE AIR MAX 270', desc: 'Iconic style. Unmatched comfort. Designed to keep you moving forward.', image: '/images/hero1.png', active: true },
  { id: 2, label: 'TRENDING NOW', title: 'BREAK LIMITS.', subtitle: 'NIKE AIR MAX 90', desc: 'Classic design meets modern performance. Built for those who never stop.', image: '/images/hero2.png', active: true },
  { id: 3, label: 'TRAINING', title: 'TRAIN HARD.', subtitle: 'NIKE TRAINING COLLECTION', desc: 'Push your boundaries. Every rep, every set, every day.', image: '/images/training.png', active: true },
];

const defaultCategories = [
  { id: 1, name: 'Running', image: '/images/running.png', section: 'men', active: true },
  { id: 2, name: 'Lifestyle', image: '/images/lifestyle-1.png', section: 'men', active: true },
  { id: 3, name: 'Basketball', image: '/images/basketball.png', section: 'men', active: true },
  { id: 4, name: 'Nike 24.7', image: '/images/tt1.png', section: 'women', active: true },
  { id: 5, name: 'Nike Metcon 9', image: '/images/training.png', section: 'men', active: true },
  { id: 6, name: 'Nike Court Heritage', image: '/images/ll1.png', section: 'women', active: true },
  { id: 7, name: 'Nike Air Rift', image: '/images/li-1.png', section: 'women', active: true },
  { id: 8, name: 'Nike Shox Z', image: '/images/lif-1.png', section: 'women', active: true },
];

// SNKRS launch-calendar drops (shown on /snkrs; fully admin-editable)
const defaultDrops = [
  { id: 1, name: 'Air Jordan 8 Retro "Chrome"', type: "Men's Shoes", price: 215, images: ['/images/p1-1.png'], section: 'men', productId: 'men-7', date: 'Sep 12, 2026', time: '10:00 AM EST', status: 'upcoming', tag: 'Exclusive', active: true },
  { id: 2, name: 'Nike Metcon 9', type: "Men's Training Shoes", price: 140, images: ['/images/training.png'], section: 'men', productId: 'men-6', date: 'Sep 8, 2026', time: '10:00 AM EST', status: 'upcoming', tag: 'New Drop', active: true },
  { id: 3, name: 'Nike Revolution 7', type: "Women's Road Running Shoes", price: 75, images: ['/images/rc.png'], section: 'women', productId: 'women-6', date: 'Sep 15, 2026', time: '09:00 AM EST', status: 'upcoming', tag: 'Coming Soon', active: true },
  { id: 4, name: 'Nike Air Max Pulse', type: "Men's Shoes", price: 180, images: ['/images/c33.png'], section: 'men', productId: 'men-12', date: 'Sep 5, 2026', time: '10:00 AM EST', status: 'live', tag: 'Live Now', active: true },
  { id: 5, name: 'Sabrina 4 "Light Work"', type: "Women's Shoes", price: 130, images: ['/images/women1-1 bb.png'], section: 'women', productId: 'women-1', date: 'Sep 1, 2026', time: '10:00 AM EST', status: 'live', tag: 'Live Now', active: true },
  { id: 6, name: 'Nike Dunk Low Kids', type: "Kids' Shoes", price: 85, images: ['/images/pic2 kid.png'], section: 'kids', productId: 'kids-2', date: 'Sep 3, 2026', time: '10:00 AM EST', status: 'live', tag: 'Live Now', active: true },
  { id: 7, name: 'Nike Victori One', type: "Men's Slides", price: 55, images: ['/images/ssss1.png'], section: 'men', productId: 'men-9', date: 'Aug 28, 2026', time: '10:00 AM EST', status: 'sold-out', tag: 'Sold Out', active: true },
  { id: 8, name: 'Nike Air Max 270 G', type: "Women's Shoes", price: 170, images: ['/images/r1.png'], section: 'women', productId: 'women-5', date: 'Aug 25, 2026', time: '10:00 AM EST', status: 'sold-out', tag: 'Sold Out', active: true },
];

const defaultCollections = [
  { id: 1, title: 'Summer Essentials', desc: 'Lightweight picks for warm days. Breathable, comfortable, and ready for anything.', image: '/images/s1.png', color: '#FFD700', productIds: ['men-8', 'men-9', 'men-10', 'men-11'], section: 'men', active: true },
  { id: 2, title: 'Built for the Court', desc: 'Performance basketball shoes engineered for speed, support, and style on the hardwood.', image: '/images/basketball.png', color: '#ef4444', productIds: ['men-12', 'men-6'], section: 'men', active: true },
  { id: 3, title: "Women's Favorites", desc: 'Top-rated picks loved by our community. Style meets performance.', image: '/images/women1-1 bb.png', color: '#f472b6', productIds: ['women-1', 'women-2', 'women-3', 'women-4'], section: 'women', active: true },
  { id: 4, title: "Kids' Top Picks", desc: 'Durable, fun, and built for play. The best kicks for the next generation.', image: '/images/pic2 kid.png', color: '#22c55e', productIds: ['kids-1', 'kids-2', 'kids-3', 'kids-4'], section: 'kids', active: true },
];

const defaultCustomers = [
  { id: 1, name: 'Ali Khan', email: 'ali@example.com', phone: '(555) 111-2222', city: 'Karachi', orders: 5, spent: 850, joined: '2026-06-12', status: 'active' },
  { id: 2, name: 'Sara Ahmed', email: 'sara@example.com', phone: '(555) 333-4444', city: 'Lahore', orders: 3, spent: 420, joined: '2026-07-01', status: 'active' },
  { id: 3, name: 'Usman Raza', email: 'usman@example.com', phone: '(555) 555-6666', city: 'Islamabad', orders: 8, spent: 1520, joined: '2026-03-22', status: 'vip' },
  { id: 4, name: 'Ayesha Malik', email: 'ayesha@example.com', phone: '(555) 777-8888', city: 'Karachi', orders: 1, spent: 140, joined: '2026-08-30', status: 'new' },
  { id: 5, name: 'Bilal Haider', email: 'bilal@example.com', phone: '(555) 999-0000', city: 'Multan', orders: 0, spent: 0, joined: '2026-09-08', status: 'new' },
];

const defaultReviews = [
  { id: 1, product: 'Nike Air Max 270 G', customer: 'Ali Khan', rating: 5, text: 'Super comfortable, perfect fit. Worth every rupee!', date: '2026-09-08', status: 'approved' },
  { id: 2, product: 'Nike Air Force 1 07', customer: 'Sara Ahmed', rating: 4, text: 'Classic look, great quality. Slightly tight at first.', date: '2026-09-06', status: 'approved' },
  { id: 3, product: 'A Two', customer: 'Usman Raza', rating: 3, text: 'Decent but expected more cushioning for the price.', date: '2026-09-04', status: 'pending' },
  { id: 4, product: 'Nike Dunk Low Kids', customer: 'Ayesha Malik', rating: 5, text: 'My son loves them. Very durable for school.', date: '2026-09-02', status: 'approved' },
  { id: 5, product: 'Nike Metcon 9', customer: 'Bilal Haider', rating: 2, text: 'Sizing runs small, had to exchange.', date: '2026-08-29', status: 'pending' },
];

const defaultFaqs = [
  { id: 1, q: 'How do I place an order?', a: "Browse our collection, select your size and color, and click Add to Cart. When you're ready, head to checkout, fill in your shipping details, and complete payment.", active: true },
  { id: 2, q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Gift Cards.', active: true },
  { id: 3, q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping delivers within 2-3 business days. Free standard shipping on orders over $100.', active: true },
  { id: 4, q: 'How do I return an item?', a: "We offer a 30-day return policy. Items must be unworn and in original packaging. Visit our Returns page to initiate a return.", active: true },
];

const defaultCoupons = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, usageLimit: 100, used: 23, active: true, expires: '2026-12-31' },
  { id: 2, code: 'FREESHIP', type: 'shipping', value: 0, minOrder: 100, usageLimit: 50, used: 12, active: true, expires: '2026-10-31' },
  { id: 3, code: 'SUMMER25', type: 'fixed', value: 25, minOrder: 150, usageLimit: 30, used: 30, active: false, expires: '2026-09-01' },
];

// Admin-editable content for the static/footer pages (intro + content sections)
const defaultPageContent = {
  shipping: { intro: 'We offer fast and reliable shipping to get your new kicks to you as quickly as possible.', sections: [] },
  returns: { intro: 'Not 100% satisfied? No worries — returns are easy and free within 30 days.', sections: [] },
  'size-guide': { intro: 'Find your perfect fit. Measure your foot and match it to our size charts below.', sections: [] },
  about: { intro: '', sections: [] },
  sustainability: { intro: "We believe great shoes shouldn't cost the earth. Here's how we're working to make a positive impact.", sections: [] },
  careers: { intro: "Vére is redefining how people discover and buy footwear online. We're a small, high-impact team that moves fast, cares deeply about craft, and is building something that matters. If that excites you, we'd love to talk.", sections: [] },
  news: { intro: 'The latest from Vére — product drops, stories, and everything happening in our world.', sections: [] },
};

const defaultSettings = {
  storeName: 'Vére',
  tagline: 'Just Do It.',
  supportEmail: 'support@verre.com',
  supportPhone: '1-800-VERRE',
  currency: 'USD',
  freeShipThreshold: 100,
  taxRate: 8,
  codEnabled: false,
  maintenance: false,
};

const defaultJobs = [
  {
    id: 1, title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote / New York', type: 'Full-time', level: 'Senior', open: true,
    desc: "Build and scale our e-commerce platform. You'll work with Next.js, React, and modern cloud infrastructure to deliver fast, reliable experiences to millions of users.",
  },
  {
    id: 2, title: 'Frontend Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time', level: 'Mid', open: true,
    desc: 'Craft performant, pixel-perfect interfaces across our web and mobile platforms. Strong focus on accessibility, animation, and responsive design.',
  },
  {
    id: 3, title: 'UI/UX Designer', team: 'Design', location: 'Los Angeles, CA', type: 'Full-time', level: 'Mid-Senior', open: true,
    desc: 'Design intuitive, visually striking interfaces that millions of sneakerheads interact with daily. Own the full design process from research to handoff.',
  },
  {
    id: 4, title: 'Brand Marketing Lead', team: 'Marketing', location: 'New York, NY', type: 'Full-time', level: 'Lead', open: true,
    desc: 'Shape the Vére brand voice across all channels. Lead campaigns, partnerships, and community initiatives that resonate with our audience.',
  },
  {
    id: 5, title: 'Content Strategist', team: 'Marketing', location: 'Remote', type: 'Full-time', level: 'Mid', open: true,
    desc: 'Create compelling narratives that connect our products to our community. Develop content across editorial, social, and email channels.',
  },
  {
    id: 6, title: 'Supply Chain Coordinator', team: 'Operations', location: 'Chicago, IL', type: 'Full-time', level: 'Mid', open: true,
    desc: 'Optimize our logistics network to deliver products faster and more sustainably. Work with global vendors, warehouses, and shipping partners.',
  },
];

/* ===================== PROVIDER ===================== */

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  // Edits applied on top of built-in products (keyed by product id)
  const [productOverrides, setProductOverrides] = useState({});
  // Built-in product IDs the admin has deleted — hidden from admin AND storefront
  const [hiddenProducts, setHiddenProducts] = useState([]);
  // Website visitors: timestamps of unique sessions in the last 90 days
  const [visitors, setVisitors] = useState([]);
  // IDs of notifications the admin has marked as read
  const [notifsRead, setNotifsRead] = useState([]);
  // Admin profile (name/email/role) + custom password (null = use default)
  const [adminProfile, setAdminProfile] = useState(DEFAULT_ADMIN_PROFILE);
  const [adminPassword, setAdminPassword] = useState(null);
  // Editable content for static/footer pages
  const [pageContent, setPageContent] = useState(defaultPageContent);
  const customProductsRef = useRef([]);
  useEffect(() => {
    customProductsRef.current = customProducts;
  }, [customProducts]);
  const [slides, setSlides] = useState(defaultSlides);
  const [categories, setCategories] = useState(defaultCategories);
  const [collections, setCollections] = useState(defaultCollections);
  // SNKRS launch-calendar drops (admin-managed)
  const [drops, setDrops] = useState(defaultDrops);
  const [customers, setCustomers] = useState(defaultCustomers);
  const [reviews, setReviews] = useState(defaultReviews);
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [coupons, setCoupons] = useState(defaultCoupons);
  const [settings, setSettings] = useState(defaultSettings);
  // Careers page job openings (admin-managed)
  const [jobOpenings, setJobOpenings] = useState(defaultJobs);
  // Job applications submitted from the public /careers page
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    try {
      if (localStorage.getItem(K.auth) === 'true') setIsAdmin(true);
      const savedOrders = localStorage.getItem(K.orders);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(demoOrders);
        lsSet(K.orders, demoOrders);
      }
      setCustomProducts(lsGet(K.products, []));
      setProductOverrides(lsGet(K.overrides, {}));
      setHiddenProducts(lsGet(K.hidden, []));
      // Count a visitor once per browser session, only on public pages.
      // Kept as a 30-day rolling log of session timestamps so the
      // 7/30/90-day dashboard ranges are all real.
      try {
        const isAdminArea = window.location.pathname.startsWith('/verre-admin');
        const sessKey = 'verre-visitor-session';
        const now = Date.now();
        const cutoff = now - 90 * 24 * 60 * 60 * 1000;
        const savedVisitors = lsGet(K.visitors, []);
        const log = (Array.isArray(savedVisitors) ? savedVisitors : []).filter((t) => t > cutoff);
        if (!isAdminArea && !sessionStorage.getItem(sessKey)) {
          sessionStorage.setItem(sessKey, '1');
          log.push(now);
          lsSet(K.visitors, log);
        }
        setVisitors(log);
      } catch {
        setVisitors([]);
      }
      setNotifsRead(lsGet(K.notifsRead, []));
      setAdminProfile({ ...DEFAULT_ADMIN_PROFILE, ...lsGet(K.profile, {}) });
      setAdminPassword(lsGet(K.password, null));
      setSlides(lsGet(K.slides, defaultSlides));
      setCategories(lsGet(K.categories, defaultCategories));
      setDrops(lsGet(K.drops, defaultDrops));
      setCollections(lsGet(K.collections, defaultCollections).map((col) => {
        // Normalize: old data stored plain numbers (e.g. 8) — scope them to
        // the collection's section so they match the "men-8" style keys.
        const def = defaultCollections.find((d) => d.id === col.id);
        const section = col.section || def?.section || 'men';
        const saved = (Array.isArray(col.productIds) ? col.productIds : [])
          .map((id) => (typeof id === 'number' ? `${section}-${id}` : id));
        // Admin edits win. Only fall back to the built-in list when the saved
        // collection has no products at all (legacy/thin data), so the
        // storefront never shows "No products linked".
        return { ...col, productIds: saved.length > 0 ? saved : (def?.productIds || col.productIds || []) };
      }));
      setCustomers(lsGet(K.customers, defaultCustomers));
      setReviews(lsGet(K.reviews, defaultReviews));
      setFaqs(lsGet(K.pages, defaultFaqs));
      setCoupons(lsGet(K.coupons, defaultCoupons));
      setSettings({ ...defaultSettings, ...lsGet(K.settings, {}) });
      setJobOpenings(lsGet(K.jobs, defaultJobs));
      setApplications(lsGet(K.applications, []));
      setPageContent({ ...defaultPageContent, ...lsGet(K.pageContent, {}) });
    } catch {
      setOrders(demoOrders);
    }
    setIsLoaded(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(K.auth, String(isAdmin));
    // Persist even when empty so deleted orders stay deleted after reload
    lsSet(K.orders, orders);
    lsSet(K.products, customProducts);
    lsSet(K.overrides, productOverrides);
    lsSet(K.hidden, hiddenProducts);
    lsSet(K.notifsRead, notifsRead);
    lsSet(K.profile, adminProfile);
    lsSet(K.password, adminPassword);
    lsSet(K.slides, slides);
    lsSet(K.categories, categories);
    lsSet(K.drops, drops);
    lsSet(K.collections, collections);
    lsSet(K.customers, customers);
    lsSet(K.reviews, reviews);
    lsSet(K.pages, faqs);
    lsSet(K.coupons, coupons);
    lsSet(K.settings, settings);
    lsSet(K.jobs, jobOpenings);
    lsSet(K.applications, applications);
    lsSet(K.pageContent, pageContent);
  }, [isAdmin, isLoaded, orders, customProducts, productOverrides, hiddenProducts, notifsRead, adminProfile, adminPassword, pageContent, slides, categories, drops, collections, customers, reviews, faqs, coupons, settings, jobOpenings, applications]);

  /* ---------- Auth ---------- */
  const login = useCallback((email, password) => {
    // Credentials come from the editable profile; password falls back to default until changed
    if (email === adminProfile.email && password === (adminPassword || ADMIN_CREDENTIALS.password)) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, [adminProfile.email, adminPassword]);

  /* ---------- Admin profile ---------- */
  const updateProfile = useCallback((updates) => {
    setAdminProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const changePassword = useCallback((currentPw, newPw) => {
    if (currentPw !== (adminPassword || ADMIN_CREDENTIALS.password)) {
      return { ok: false, error: 'Current password is incorrect' };
    }
    if (!newPw || newPw.length < 6) {
      return { ok: false, error: 'New password must be at least 6 characters' };
    }
    if (newPw === currentPw) {
      return { ok: false, error: 'New password must be different from current' };
    }
    setAdminPassword(newPw);
    return { ok: true };
  }, [adminPassword]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem(K.auth);
  }, []);

  /* ---------- Notifications ---------- */
  const markNotifsRead = useCallback((ids) => {
    setNotifsRead((prev) => {
      const set = new Set(prev);
      (Array.isArray(ids) ? ids : [ids]).forEach((id) => set.add(id));
      return [...set];
    });
  }, []);

  /* ---------- Generic list CRUD ---------- */
  const makeCrud = (setter, prefix) => ({
    [`add${prefix}`]: (item) => {
      const newItem = { ...item, id: Date.now() };
      setter((prev) => [...prev, newItem]);
      return newItem;
    },
    [`update${prefix}`]: (id, updates) => setter((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i))),
    [`delete${prefix}`]: (id) => setter((prev) => prev.filter((i) => (i.id !== id))),
  });

  const {
    addSlide, updateSlide, deleteSlide,
  } = makeCrud(setSlides, 'Slide');
  const {
    addCategory, updateCategory, deleteCategory,
  } = makeCrud(setCategories, 'Category');
  const {
    addCollection, updateCollection, deleteCollection,
  } = makeCrud(setCollections, 'Collection');
  const {
    addDrop, updateDrop, deleteDrop,
  } = makeCrud(setDrops, 'Drop');
  const {
    addCustomer, updateCustomer, deleteCustomer,
  } = makeCrud(setCustomers, 'Customer');
  const {
    addReview, updateReview, deleteReview,
  } = makeCrud(setReviews, 'Review');
  const {
    addFaq, updateFaq, deleteFaq,
  } = makeCrud(setFaqs, 'Faq');
  const {
    addCoupon, updateCoupon, deleteCoupon,
  } = makeCrud(setCoupons, 'Coupon');

  /* ---------- Orders ---------- */
  const addOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);
  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  /* ---------- Products ---------- */
  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      section: product.section || 'men',
      rating: product.rating || null,
      reviews: '0',
      isNew: product.isNew || false,
      isComingSoon: product.isComingSoon || false,
      prices: product.price,
      images: product.images || [product.image],
      sizes: product.sizes || [],
      colors: product.colors || [{ name: product.colorName || 'Default', hex: product.colorHex || '#000000' }],
      colorName: product.colorName || 'Default',
      colorHex: product.colorHex || '#000000',
    };
    setCustomProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, []);

  // Update a custom product in place, or store an override for a built-in product
  const updateProduct = useCallback((id, updates) => {
    if (customProductsRef.current.some((p) => p.id === id)) {
      setCustomProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    } else {
      setProductOverrides((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...updates } }));
    }
  }, []);

  // Apply saved overrides to built-in products and drop admin-deleted (hidden) ones
  const applyProductOverrides = useCallback(
    (products) =>
      products
        .filter((p) => !hiddenProducts.includes(p.id))
        .map((p) => (productOverrides[p.id] ? { ...p, ...productOverrides[p.id] } : p)),
    [productOverrides, hiddenProducts]
  );

  // Deletes custom products outright; built-ins go to the hidden list (static data can't be mutated)
  const deleteProduct = useCallback((id) => {
    if (customProductsRef.current.some((p) => p.id === id)) {
      setCustomProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      setHiddenProducts((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  }, []);

  // Bring a hidden built-in product back
  const toggleProductHidden = useCallback((id) => {
    setHiddenProducts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  /* ---------- Settings ---------- */
  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  /* ---------- Page content (static/footer pages) ---------- */
  const savePageContent = useCallback((slug, content) => {
    setPageContent((prev) => ({ ...prev, [slug]: content }));
  }, []);

  /* ---------- Careers / job openings ---------- */
  const addJob = useCallback((job) => {
    const newJob = { ...job, id: Date.now(), open: job.open !== false };
    setJobOpenings((prev) => [...prev, newJob]);
    return newJob;
  }, []);
  const updateJob = useCallback((id, updates) => {
    setJobOpenings((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
  }, []);
  const deleteJob = useCallback((id) => {
    setJobOpenings((prev) => prev.filter((j) => j.id !== id));
  }, []);

  /* ---------- Job applications (from public careers page) ---------- */
  const addApplication = useCallback((app) => {
    const newApp = { ...app, id: Date.now(), status: 'new', date: new Date().toISOString() };
    setApplications((prev) => [newApp, ...prev]);
    return newApp;
  }, []);
  const updateApplicationStatus = useCallback((id, status) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);
  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }, []);

  /* ---------- Derived stats ---------- */
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  // Unique visitor count within a trailing window (7 / 30 / 90 days)
  const visitorsByRange = useCallback(
    (days) => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return visitors.filter((t) => t >= cutoff).length;
    },
    [visitors]
  );

  // Admin-customized page data (cards/charts/articles per page), falling back to defaults
  const getPageData = useCallback(
    (slug) => ({ ...pageDataDefaults[slug], ...(pageContent[slug]?.data || {}) }),
    [pageContent]
  );

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoaded,
        login,
        logout,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        customProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        productOverrides,
        applyProductOverrides,
        hiddenProducts,
        toggleProductHidden,
        visitors,
        visitorsByRange,
        notifsRead,
        markNotifsRead,
        adminProfile,
        updateProfile,
        changePassword,
        // Dynamic site content
        slides, addSlide, updateSlide, deleteSlide,
        categories, addCategory, updateCategory, deleteCategory,
        collections, addCollection, updateCollection, deleteCollection,
        drops, addDrop, updateDrop, deleteDrop,
        customers, addCustomer, updateCustomer, deleteCustomer,
        reviews, addReview, updateReview, deleteReview,
        faqs, addFaq, updateFaq, deleteFaq,
        coupons, addCoupon, updateCoupon, deleteCoupon,
        settings,
        updateSettings,
        pageContent,
        savePageContent,
        getPageData,
        jobOpenings,
        addJob,
        updateJob,
        deleteJob,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        // Stats
        totalRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
