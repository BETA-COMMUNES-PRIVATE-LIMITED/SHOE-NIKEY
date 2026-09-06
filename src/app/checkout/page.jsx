'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { useCart } from '@/context/CartContext';

const steps = ['Shipping', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Shipping form state
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apt: '', city: '', state: '', zip: '',
  });

  // Payment form state
  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const [shippingErrors, setShippingErrors] = useState({});
  const [paymentErrors, setPaymentErrors] = useState({});

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = cartTotal + shippingCost + tax;

  // Redirect if cart empty
  if (cartCount === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <svg className="w-20 h-20 mx-auto mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your Cart is Empty</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Add some items before checking out.</p>
            <Link href="/men" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Order Success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
              <svg className="w-10 h-10" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Order Confirmed!</h1>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Thank you for your purchase.</p>
            <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
              Order Number: <span className="font-bold" style={{ color: 'var(--accent-lime)' }}>{orderNumber}</span>
            </p>
            <div className="p-4 rounded-2xl mb-6 text-left" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>A confirmation email has been sent to:</p>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{shipping.email}</p>
              <div className="h-px my-3" style={{ backgroundColor: 'var(--border-color)' }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Estimated delivery: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>5–7 business days</span></p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/men" className="flex-1 h-12 rounded-full text-sm font-bold flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}>
                Continue Shopping
              </Link>
              <Link href="/" className="flex-1 h-12 rounded-full text-sm font-semibold flex items-center justify-center" style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const validateShipping = () => {
    const errs = {};
    if (!shipping.firstName.trim()) errs.firstName = 'Required';
    if (!shipping.lastName.trim()) errs.lastName = 'Required';
    if (!shipping.email.trim() || !shipping.email.includes('@')) errs.email = 'Valid email required';
    if (!shipping.address.trim()) errs.address = 'Required';
    if (!shipping.city.trim()) errs.city = 'Required';
    if (!shipping.state.trim()) errs.state = 'Required';
    if (!shipping.zip.trim()) errs.zip = 'Required';
    setShippingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs = {};
    if (!payment.cardNumber.trim() || payment.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Valid card number required';
    if (!payment.cardName.trim()) errs.cardName = 'Required';
    if (!payment.expiry.trim() || payment.expiry.length < 5) errs.expiry = 'MM/YY required';
    if (!payment.cvv.trim() || payment.cvv.length < 3) errs.cvv = 'Required';
    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateShipping()) return;
    if (currentStep === 1 && !validatePayment()) return;
    if (currentStep === 2) {
      // Place order
      const num = 'VR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setOrderNumber(num);
      setOrderPlaced(true);
      clearCart();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const InputField = ({ label, name, value, onChange, errors, type = 'text', placeholder = '', half = false }) => (
    <div className={half ? 'flex-1' : ''}>
      <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: errors?.[name] ? '1px solid var(--accent-red)' : '1px solid var(--border-color)',
          color: 'var(--text-primary)',
        }}
      />
      {errors?.[name] && <p className="text-[10px] mt-1" style={{ color: 'var(--accent-red)' }}>{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-semibold transition-all hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>Checkout</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{
                    backgroundColor: idx <= currentStep ? 'var(--accent-lime)' : 'var(--bg-surface)',
                    color: idx <= currentStep ? '#000' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {idx < currentStep ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : idx + 1}
                </div>
                <span className="text-xs font-semibold hidden sm:inline" style={{ color: idx <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-8 sm:w-12 h-px" style={{ backgroundColor: idx < currentStep ? 'var(--accent-lime)' : 'var(--border-color)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 0: Shipping */}
            {currentStep === 0 && (
              <div className="rounded-2xl p-5 md:p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h2 className="text-sm font-bold tracking-wider uppercase mb-5" style={{ color: 'var(--text-primary)' }}>Shipping Information</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <InputField label="First Name" name="firstName" value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} errors={shippingErrors} half placeholder="John" />
                    <InputField label="Last Name" name="lastName" value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} errors={shippingErrors} half placeholder="Doe" />
                  </div>
                  <div className="flex gap-3">
                    <InputField label="Email" name="email" type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} errors={shippingErrors} half placeholder="john@example.com" />
                    <InputField label="Phone" name="phone" type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} errors={shippingErrors} half placeholder="(555) 123-4567" />
                  </div>
                  <InputField label="Street Address" name="address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} errors={shippingErrors} placeholder="123 Main Street" />
                  <InputField label="Apt / Suite / Floor (Optional)" name="apt" value={shipping.apt} onChange={(e) => setShipping({ ...shipping, apt: e.target.value })} errors={shippingErrors} placeholder="Apt 4B" />
                  <div className="flex gap-3">
                    <InputField label="City" name="city" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} errors={shippingErrors} half placeholder="New York" />
                    <InputField label="State" name="state" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} errors={shippingErrors} half placeholder="NY" />
                    <InputField label="ZIP Code" name="zip" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} errors={shippingErrors} half placeholder="10001" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {currentStep === 1 && (
              <div className="rounded-2xl p-5 md:p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>Payment Details</h2>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>Secure Payment</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <InputField label="Card Number" name="cardNumber" value={payment.cardNumber} onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
                    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
                    setPayment({ ...payment, cardNumber: v });
                  }} errors={paymentErrors} placeholder="1234 5678 9012 3456" />
                  <InputField label="Cardholder Name" name="cardName" value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} errors={paymentErrors} placeholder="John Doe" />
                  <div className="flex gap-3">
                    <InputField label="Expiry Date" name="expiry" value={payment.expiry} onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
                      setPayment({ ...payment, expiry: v });
                    }} errors={paymentErrors} half placeholder="MM/YY" />
                    <InputField label="CVV" name="cvv" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })} errors={paymentErrors} half placeholder="123" />
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Your payment info is encrypted and secure. We never store your full card details.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4">
                {/* Shipping Summary */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>Shipping To</h2>
                    <button onClick={() => setCurrentStep(0)} className="text-[11px] font-semibold underline" style={{ color: 'var(--accent-lime)' }}>Edit</button>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}{shipping.apt ? `, ${shipping.apt}` : ''}<br />
                    {shipping.city}, {shipping.state} {shipping.zip}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{shipping.email}</p>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>Payment</h2>
                    <button onClick={() => setCurrentStep(1)} className="text-[11px] font-semibold underline" style={{ color: 'var(--accent-lime)' }}>Edit</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      •••• •••• •••• {payment.cardNumber.replace(/\s/g, '').slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Order Items</h2>
                  <div className="flex flex-col gap-3">
                    {cartItems.map((item) => (
                      <div key={item.key} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Size: {item.size} · {item.colorName} · Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="h-12 px-6 rounded-full text-sm font-semibold flex items-center gap-2 transition-all active:scale-[0.98]"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 h-12 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ backgroundColor: 'var(--accent-lime)', color: '#000' }}
              >
                {currentStep === 2 ? (
                  <>
                    Place Order — ${total.toFixed(2)}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <h2 className="text-sm font-bold tracking-wider uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Order Summary</h2>

              {/* Items Preview */}
              <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <Image src={item.image} alt={item.name} fill className="object-contain p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="h-px mb-4" style={{ backgroundColor: 'var(--border-color)' }} />

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Shipping</span>
                  <span className="text-xs font-semibold" style={{ color: shippingCost === 0 ? '#22c55e' : 'var(--text-primary)' }}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tax</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
                </div>

                <div className="h-px my-1" style={{ backgroundColor: 'var(--border-color)' }} />

                <div className="flex justify-between">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 flex flex-col gap-2.5" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: '#22c55e' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Free shipping on orders over $100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
