'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AdminContext = createContext();

const ADMIN_CREDENTIALS = { email: 'admin@verre.com', password: 'admin123' };

// Demo orders data
const demoOrders = [
  {
    id: 'VR-A1B2C3',
    customer: { name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567' },
    items: [
      { name: 'Nike Air Max 270 G', price: 170, quantity: 1, size: '10', color: 'White' },
      { name: 'Nike Calm 2.0', price: 65, quantity: 2, size: '9', color: 'Green' },
    ],
    total: 300,
    status: 'delivered',
    date: '2026-08-28',
    address: '123 Main St, New York, NY 10001',
  },
  {
    id: 'VR-D4E5F6',
    customer: { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '(555) 987-6543' },
    items: [
      { name: 'Sabrina 4 "Light Work"', price: 130, quantity: 1, size: '8', color: 'White' },
    ],
    total: 130,
    status: 'shipped',
    date: '2026-09-01',
    address: '456 Oak Ave, Los Angeles, CA 90001',
  },
  {
    id: 'VR-G7H8I9',
    customer: { name: 'Mike Chen', email: 'mike@example.com', phone: '(555) 456-7890' },
    items: [
      { name: 'Air Jordan 8 Retro', price: 215, quantity: 1, size: '11', color: 'Black' },
      { name: 'Nike Victori One', price: 55, quantity: 1, size: '10', color: 'White' },
    ],
    total: 270,
    status: 'processing',
    date: '2026-09-04',
    address: '789 Pine Rd, Chicago, IL 60601',
  },
  {
    id: 'VR-J1K2L3',
    customer: { name: 'Emily Davis', email: 'emily@example.com', phone: '(555) 321-6549' },
    items: [
      { name: 'Nike Dunk Low Kids', price: 85, quantity: 2, size: '3yr', color: 'Blue' },
    ],
    total: 170,
    status: 'delivered',
    date: '2026-08-25',
    address: '321 Elm St, Houston, TX 77001',
  },
  {
    id: 'VR-M4N5O6',
    customer: { name: 'Alex Johnson', email: 'alex@example.com', phone: '(555) 789-0123' },
    items: [
      { name: "A'Two", price: 160, quantity: 1, size: '9', color: 'Red/Black' },
    ],
    total: 160,
    status: 'pending',
    date: '2026-09-05',
    address: '654 Maple Dr, Phoenix, AZ 85001',
  },
  {
    id: 'VR-P7Q8R9',
    customer: { name: 'Lisa Park', email: 'lisa@example.com', phone: '(555) 234-5678' },
    items: [
      { name: 'Jordan 6 Rings Kids', price: 120, quantity: 1, size: '5yr', color: 'White' },
      { name: 'Nike Star', price: 55, quantity: 1, size: '4yr', color: 'Blue' },
    ],
    total: 175,
    status: 'shipped',
    date: '2026-09-03',
    address: '987 Cedar Ln, Philadelphia, PA 19101',
  },
];

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const auth = localStorage.getItem('nike-admin-auth');
      if (auth === 'true') setIsAdmin(true);
      const savedOrders = localStorage.getItem('nike-admin-orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(demoOrders);
        localStorage.setItem('nike-admin-orders', JSON.stringify(demoOrders));
      }
      const savedProducts = localStorage.getItem('nike-admin-products');
      if (savedProducts) setCustomProducts(JSON.parse(savedProducts));
    } catch {
      setOrders(demoOrders);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nike-admin-auth', String(isAdmin));
      if (orders.length > 0) {
        localStorage.setItem('nike-admin-orders', JSON.stringify(orders));
      }
      localStorage.setItem('nike-admin-products', JSON.stringify(customProducts));
    }
  }, [isAdmin, orders, customProducts, isLoaded]);

  // Auth
  const login = useCallback((email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem('nike-admin-auth');
  }, []);

  // Orders
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  // Products
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

  const updateProduct = useCallback((id, updates) => {
    setCustomProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isLoaded,
        login,
        logout,
        orders,
        updateOrderStatus,
        deleteOrder,
        customProducts,
        addProduct,
        updateProduct,
        deleteProduct,
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
