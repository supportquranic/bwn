import { useState } from 'react';
import { ArrowLeft, Heart, Star, Phone, ChevronRight, Battery, Shield, AlertTriangle, ShoppingCart, CheckCircle, CheckCircle2, User, MapPin, Sparkles, MessageSquare } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ConditionVerificationPanel from './ConditionVerificationPanel';
import ReviewModal from './ReviewModal';

const fmt = n => 'Rs. ' + n.toLocaleString('en-PK');

/* ── Authentic Official WhatsApp Brand Logo Component ── */
function WhatsAppIcon({ size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2Z"
        fill="#25D366"
      />
      <path
        d="M17.36 14.39C17.07 14.24 15.65 13.54 15.38 13.44C15.11 13.34 14.92 13.29 14.73 13.59C14.53 13.88 13.97 14.54 13.8 14.74C13.63 14.94 13.46 14.96 13.17 14.81C12.88 14.66 11.93 14.35 10.81 13.35C9.93 12.57 9.34 11.61 9.17 11.32C9 11.03 9.15 10.87 9.3 10.73C9.43 10.59 9.59 10.38 9.74 10.21C9.88 10.03 9.93 9.91 10.03 9.71C10.13 9.52 10.08 9.35 10.01 9.2C9.93 9.05 9.35 7.63 9.1 7.05C8.87 6.47 8.62 6.55 8.44 6.54H7.87C7.68 6.54 7.35 6.62 7.08 6.91C6.81 7.21 6.03 7.94 6.03 9.42C6.03 10.9 7.11 12.33 7.26 12.53C7.41 12.72 9.38 15.76 12.4 17.06C13.12 17.37 13.68 17.56 14.12 17.7C14.84 17.93 15.5 17.89 16.02 17.82C16.6 17.73 17.8 17.09 18.05 16.38C18.3 15.67 18.3 15.07 18.23 14.94C18.15 14.81 17.65 14.54 17.36 14.39Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

const batteryColor = (h) => {
  return 'text-gray-700 bg-gray-100';
};

/* ── Fallback generator to guarantee exactly 3 images ── */
function getThreeImages(product) {
  if (!product) return [];
  const list = product.images && Array.isArray(product.images) && product.images.length > 0
    ? [...product.images]
    : [product.image];

  const pName = (product.name || '').toLowerCase();
  const fallbacks = [];
  if (pName.includes('iphone') || product.category === 'iphone') {
    fallbacks.push('/product images/ip18pblk.png', '/product images/ip 17p.png', '/product images/ip 17pm.png', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80');
  } else if (pName.includes('samsung') || pName.includes('galaxy') || pName.includes('s25')) {
    fallbacks.push('/product images/s25 ultra.png', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80');
  } else if (pName.includes('pixel')) {
    fallbacks.push('/product images/pixel 9.png', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80');
  } else if (pName.includes('glass') || pName.includes('protector')) {
    fallbacks.push('https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80', 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&q=80', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80');
  } else if (pName.includes('case') || pName.includes('cover')) {
    fallbacks.push('https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&q=80', 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&q=80', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80');
  } else {
    fallbacks.push('https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', 'https://images.unsplash.com/photo-1598327105854-7d2e3c822e51?w=800&q=80', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80');
  }

  while (list.length < 3) {
    const next = fallbacks.find(f => !list.includes(f)) || product.image;
    list.push(next);
  }

  return list.slice(0, 3);
}

/* ── Helper: Related Covers & Glass Protectors (Checks current shop first, then others) ── */
function getRelatedAccessories(currentProduct, allProducts) {
  if (!currentProduct) return [];
  const productNameLower = (currentProduct.name || '').toLowerCase();
  
  const terms = [];
  if (productNameLower.includes('iphone') || currentProduct.category === 'iphone') terms.push('iphone', 'apple');
  if (productNameLower.includes('s25') || productNameLower.includes('s21') || productNameLower.includes('samsung') || productNameLower.includes('galaxy')) terms.push('samsung', 'galaxy', 's25', 's21');
  if (productNameLower.includes('pixel')) terms.push('pixel', 'google');
  if (productNameLower.includes('redmi') || productNameLower.includes('xiaomi')) terms.push('redmi', 'xiaomi');
  if (productNameLower.includes('tecno') || productNameLower.includes('camon') || productNameLower.includes('spark')) terms.push('tecno', 'camon', 'spark');
  if (productNameLower.includes('infinix') || productNameLower.includes('hot') || productNameLower.includes('gt')) terms.push('infinix', 'gt', 'hot');
  if (productNameLower.includes('realme')) terms.push('realme');
  if (productNameLower.includes('vivo')) terms.push('vivo');
  if (productNameLower.includes('itel')) terms.push('itel');
  if (productNameLower.includes('oneplus')) terms.push('oneplus');

  const isCoverOrGlass = (p) => {
    const name = (p.name || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    return cat === 'cases' || name.includes('case') || name.includes('cover') || name.includes('glass') || name.includes('protector');
  };

  const matchesPhone = (p) => {
    if (p.compatibleModels && Array.isArray(p.compatibleModels)) {
      return p.compatibleModels.some(model => {
        const m = model.toLowerCase();
        return terms.some(t => m.includes(t) || t.includes(m)) || productNameLower.includes(m);
      });
    }
    const name = (p.name || '').toLowerCase();
    return terms.some(t => name.includes(t));
  };

  // 1. From current shop first
  const fromThisShop = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    p.shopId === currentProduct.shopId &&
    isCoverOrGlass(p) &&
    matchesPhone(p)
  );

  // 2. From other shops for the same phone
  const fromOtherShops = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    p.shopId !== currentProduct.shopId &&
    isCoverOrGlass(p) &&
    matchesPhone(p)
  );

  // 3. Fallback covers & protectors if specific device match is low
  const fallbackCovers = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    isCoverOrGlass(p) &&
    !fromThisShop.includes(p) &&
    !fromOtherShops.includes(p)
  );

  const combined = [...fromThisShop, ...fromOtherShops, ...fallbackCovers];

  const glassProtectors = combined.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('glass') || n.includes('protector');
  });
  const covers = combined.filter(p => {
    const n = (p.name || '').toLowerCase();
    return n.includes('case') || n.includes('cover') || (!n.includes('glass') && !n.includes('protector'));
  });

  const selected = [];
  let g = 0, c = 0;
  // Ensure a diverse mix of 3-4 options (both covers and protectors)
  while (selected.length < 4 && (g < glassProtectors.length || c < covers.length)) {
    if (c < covers.length && !selected.includes(covers[c])) {
      selected.push(covers[c++]);
    }
    if (selected.length < 4 && g < glassProtectors.length && !selected.includes(glassProtectors[g])) {
      selected.push(glassProtectors[g++]);
    }
  }

  for (const item of combined) {
    if (selected.length >= 4) break;
    if (!selected.includes(item)) selected.push(item);
  }

  return selected.slice(0, 4);
}

/* ── Delivery Details Checkout Page (Name, Phone, Address, Cash on Delivery) ── */
function DeliveryCheckoutPage({ product, shop, onBack, onOpenOrders }) {
  const { addOrder, currentUser, addresses = [] } = useApp();
  const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];

  const [customerName, setCustomerName] = useState(() => currentUser?.name || defaultAddr?.recipientName || '');
  const [customerPhone, setCustomerPhone] = useState(() => currentUser?.phone || defaultAddr?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(() => defaultAddr ? `${defaultAddr.address}, ${defaultAddr.area}` : '');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' | 'pickup'
  const [customerNotes, setCustomerNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const deliveryFee = deliveryMethod === 'delivery' ? 150 : 0;
  const totalPrice = (product.price || 0) + deliveryFee;

  const handleConfirmOrder = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    if (deliveryMethod === 'delivery' && !customerAddress.trim()) {
      setErrorMsg('Please enter your delivery address in Bahawalnagar');
      return;
    }

    setErrorMsg('');

    const orderId = 'BWN-' + Math.floor(1000 + Math.random() * 9000);

    let text = `🛍️ *BAHAWAL MARKET ORDER #${orderId}*\n`;
    text += `-----------------------------------\n`;
    text += `*Product:* ${product.name}\n`;
    text += `*Price:* ${fmt(product.price)}\n`;
    if (shop?.name) {
      text += `*Shop:* ${shop.name}\n`;
    }
    text += `-----------------------------------\n`;
    text += `*Customer Name:* ${customerName.trim()}\n`;
    text += `*Phone Number:* ${customerPhone.trim()}\n`;
    if (deliveryMethod === 'delivery') {
      text += `*Delivery Address:* ${customerAddress.trim()}\n`;
      text += `*Fulfillment:* Home Delivery (Bahawalnagar - Rs. 150)\n`;
    } else {
      text += `*Fulfillment:* Free Market Counter Pickup\n`;
    }
    if (customerNotes.trim()) {
      text += `*Special Instructions:* ${customerNotes.trim()}\n`;
    }
    text += `*Payment Method:* Cash on Delivery (COD)\n`;
    text += `*Grand Total Payable:* *${fmt(totalPrice)}*\n`;
    text += `-----------------------------------\n`;
    text += `Salam! Please confirm my order #${orderId} and availability. Thank you!`;

    const targetWhatsApp = shop?.whatsapp || '923121234567';

    const orderData = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      items: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          shopName: shop?.name || 'Bahawal Mobile Market',
        }
      ],
      totalAmount: totalPrice,
      fulfillmentMethod: deliveryMethod,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryMethod === 'delivery' ? customerAddress.trim() : 'Market Counter Pickup',
      customerNotes: customerNotes.trim(),
      shopWhatsApp: targetWhatsApp,
    };

    if (addOrder) {
      addOrder(orderData);
    }
    setPlacedOrder(orderData);

    window.open(`https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (placedOrder) {
    return (
      <div className="h-full flex flex-col overflow-hidden bg-[#f8f9fc]">
        {/* Header */}
        <div className="px-4 pt-5 pb-4 text-white flex-shrink-0 text-center" style={{ background: '#8586f2' }}>
          <div className="w-12 h-12 rounded-full bg-white text-[#8586f2] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="text-xl font-black text-white">Order Confirmed!</h2>
          <p className="text-white/80 text-xs mt-0.5">Order request dispatched via WhatsApp</p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3.5 pb-24 smooth-scroll">
          {/* Order ID Badge Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs text-center">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">Order Tracking ID</span>
            <div className="text-2xl font-black text-black tracking-wider mt-1">
              #{placedOrder.id}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1">
              <span>●</span> Status: Pending Shop Confirmation
            </p>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Saved to your local device. The retailer at {shop?.name || 'Bahawal Market'} will confirm stock & delivery on WhatsApp.
            </p>
          </div>

          {/* Order Summary Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order Summary</h3>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1 flex-shrink-0">
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black truncate">{product.name}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{shop?.name || 'Bahawal Mobile Market'}</p>
                <p className="text-xs font-black text-[#8586f2] mt-1">{fmt(product.price)}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Fulfillment</span>
                <span className="font-semibold text-black">
                  {deliveryMethod === 'delivery' ? 'Home Delivery (Rs. 150)' : 'Market Pickup (Free)'}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Customer</span>
                <span className="font-semibold text-black">{customerName}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment</span>
                <span className="font-semibold text-black">Cash on Delivery</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-black text-black">
                <span>Total Amount</span>
                <span className="text-[#8586f2]">{fmt(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (onOpenOrders) onOpenOrders();
              }}
              className="w-full py-3 bg-[#8586f2] hover:bg-[#7375e8] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-xs"
            >
              <ShoppingBag size={15} />
              <span>Track in My Orders</span>
            </button>
            <button
              onClick={onBack}
              className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:text-black rounded-full text-xs font-bold flex items-center justify-center gap-1 active:scale-98 transition-transform"
            >
              <span>Back to Product</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#f8f9fc]">
      {/* ── Fixed Top Purple Header ── */}
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30 flex items-center gap-3" style={{ background: '#8586f2' }}>
        <button
          onClick={onBack}
          className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-white font-black text-base tracking-tight leading-snug">Delivery Details</h1>
          <p className="text-white/80 text-[11px] font-medium">Complete your order · Bahawal Market</p>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pb-28 space-y-3.5 smooth-scroll">
        {/* Item Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1 flex-shrink-0">
            <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-black truncate">{product.name}</h4>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{shop?.name || 'Bahawal Mobile Market'}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs font-black text-[#8586f2]">{fmt(product.price)}</span>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">1 unit</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 tracking-wide uppercase">Contact & Delivery Address</h3>
            {addresses.length > 0 && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                ✓ Saved Address Loaded
              </span>
            )}
          </div>

          {/* Quick Saved Address Autofill Chips */}
          {addresses.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex-shrink-0">
                Saved:
              </span>
              {addresses.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    setCustomerName(a.recipientName);
                    setCustomerPhone(a.phone);
                    setCustomerAddress(`${a.address}, ${a.area}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#8586f2]/10 hover:bg-[#8586f2]/20 text-[#8586f2] text-[11px] font-bold flex items-center gap-1 transition-colors flex-shrink-0 active:scale-95"
                >
                  <span>📍 {a.title} ({a.recipientName.split(' ')[0]})</span>
                </button>
              ))}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={e => { setCustomerName(e.target.value); setErrorMsg(''); }}
              placeholder="Enter your name (e.g. Muhammad Ahmed)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1">
              Phone / WhatsApp Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={e => { setCustomerPhone(e.target.value); setErrorMsg(''); }}
              placeholder="e.g. 0300 1234567"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
            />
          </div>

          {/* Fulfillment Method */}
          <div>
            <label className="block text-[11px] font-bold text-black mb-1.5">Fulfillment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-[#8586f2] bg-[#8586f2]/5 text-black'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${deliveryMethod === 'delivery' ? 'border-[#8586f2] bg-[#8586f2]' : 'border-gray-300'}`}>
                    {deliveryMethod === 'delivery' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>Home Delivery</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 pl-5">Rs. 150 · Bahawalnagar</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-[#8586f2] bg-[#8586f2]/5 text-black'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${deliveryMethod === 'pickup' ? 'border-[#8586f2] bg-[#8586f2]' : 'border-gray-300'}`}>
                    {deliveryMethod === 'pickup' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>Shop Pickup</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 pl-5">Free · Collect at shop</p>
              </button>
            </div>
          </div>

          {/* Delivery Address (only if delivery) */}
          {deliveryMethod === 'delivery' && (
            <div>
              <label className="block text-[11px] font-bold text-black mb-1">
                Delivery Address in Bahawalnagar <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={customerAddress}
                onChange={e => { setCustomerAddress(e.target.value); setErrorMsg(''); }}
                placeholder="House / Street #, Mohalla / Area in Bahawalnagar"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors resize-none"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={customerNotes}
              onChange={e => setCustomerNotes(e.target.value)}
              placeholder="e.g. Call before arrival / timing preferences"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Pricing Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Item Price</span>
            <span className="font-semibold text-black">{fmt(product.price)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Delivery Fee</span>
            <span className="font-semibold text-black">{deliveryFee === 0 ? 'Free' : fmt(deliveryFee)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm">
            <span className="font-black text-black">Total Payable</span>
            <span className="font-black text-[#8586f2]">{fmt(totalPrice)}</span>
          </div>
          <div className="pt-1 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              💵 Payment: Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom WhatsApp Button ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        <button
          onClick={handleConfirmOrder}
          className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold active:scale-98 transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2"
        >
          <WhatsAppIcon size={20} />
          <span>Confirm Order via WhatsApp ({fmt(totalPrice)})</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ productId, onBack, onShop, onProduct, favorites, onToggleFav, onAddToCart, onOpenCart, onOpenOrders }) {
  const { reviews = [] } = useApp();
  const product = INITIAL_PRODUCTS.find(p => p.id === productId);
  const shop = product ? INITIAL_SHOPS.find(s => s.id === product.shopId) : null;
  const [imgIdx, setImgIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [addedToast, setAddedToast] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const isFav = favorites.includes(productId);

  // Filter reviews relevant to this product or shop
  const productReviews = reviews.filter(r => r.productId === productId || (r.shopId === product?.shopId && !r.productId));

  if (!product) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-gray-400">Product not found.</p>
    </div>
  );

  // Guarantee exactly 3 images for the hero section carousel
  const images = (product.images && product.images.length >= 3)
    ? product.images.slice(0, 3)
    : getThreeImages(product);

  const specs = product.specs || {};
  const used = product.usedDetails;
  const relatedItems = getRelatedAccessories(product, INITIAL_PRODUCTS);

  // Comprehensive Standard Specifications requested:
  // Processor / Chipset, RAM, Storage, Display, Battery, Camera, Software, Network Support 4g, 5g, Charger included, yes no
  const isPhone = product.category === 'iphone' || product.category === 'android' ||
    (!['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree', 'cables'].includes(product.category) &&
     !['case', 'cover', 'glass', 'protector', 'charger', 'buds', 'watch', 'handsfree', 'cable'].some(kw => (product.name || '').toLowerCase().includes(kw)));

  const standardSpecs = [];
  if (isPhone) {
    const rawSpecs = product.specs || {};
    const nameLower = (product.name || '').toLowerCase();

    // 1. Processor / Chipset
    const processor = rawSpecs.Processor || rawSpecs['Processor / Chipset'] || (
      nameLower.includes('iphone') ? 'Apple A-Series Bionic / Pro' :
      nameLower.includes('s25') || nameLower.includes('s24') || nameLower.includes('ultra') ? 'Qualcomm Snapdragon 8 Gen 3 / Gen 4' :
      nameLower.includes('pixel') ? 'Google Tensor G4' :
      nameLower.includes('redmi') || nameLower.includes('note 13') ? 'Snapdragon 7s Gen 2 (4nm)' :
      nameLower.includes('camon') || nameLower.includes('spark') ? 'MediaTek Dimensity / Helio' :
      nameLower.includes('note 40') || nameLower.includes('infinix') ? 'MediaTek Helio G99 Ultimate' :
      nameLower.includes('realme') ? 'Snapdragon 7+ Gen 3' :
      nameLower.includes('oneplus') ? 'Qualcomm Snapdragon 8 Gen 3' : 'Octa-Core High Performance Processor'
    );

    // 2. RAM
    const ram = rawSpecs.RAM || (
      nameLower.includes('pro max') || nameLower.includes('ultra') ? '12GB LPDDR5X' :
      nameLower.includes('pro') ? '8GB / 12GB' : '8GB'
    );

    // 3. Storage
    const storage = rawSpecs.Storage || '256GB UFS 3.1';

    // 4. Display
    const display = rawSpecs.Display || '6.67" AMOLED 120Hz';

    // 5. Battery
    const battery = rawSpecs.Battery || '5000 mAh';

    // 6. Camera
    const camera = rawSpecs.Camera || '50MP OIS High-Res Triple Camera';

    // 7. Software
    const software = rawSpecs.Software || rawSpecs.OS || (
      nameLower.includes('iphone') ? 'iOS 18 / 19' :
      nameLower.includes('samsung') ? 'One UI 6.1 (Android 14 / 15)' :
      nameLower.includes('pixel') ? 'Android 15 (Stock Google Experience)' :
      nameLower.includes('redmi') || nameLower.includes('xiaomi') ? 'Xiaomi HyperOS (Android 14)' :
      nameLower.includes('tecno') ? 'HiOS 14 (Android 14)' :
      nameLower.includes('infinix') ? 'XOS 14 (Android 14)' :
      nameLower.includes('realme') ? 'realme UI 5.0 (Android 14)' :
      nameLower.includes('oneplus') ? 'OxygenOS 14 (Android 14)' : 'Android 14'
    );

    // 8. Network Support 4g, 5g
    const network = rawSpecs['Network Support'] || rawSpecs.Network || (
      (nameLower.includes('4g') && !nameLower.includes('5g')) ? '4G LTE, 3G, 2G' : '5G (SA/NSA), 4G LTE'
    );

    // 9. Charger included , yes no
    const charger = rawSpecs['Charger included'] !== undefined ? rawSpecs['Charger included'] : (
      (nameLower.includes('iphone') || nameLower.includes('samsung') || nameLower.includes('pixel'))
        ? 'No (Type-C Cable included in box)'
        : 'Yes (Fast Charger included in box)'
    );

    standardSpecs.push(
      { label: 'Processor / Chipset', value: processor },
      { label: 'RAM', value: ram },
      { label: 'Storage', value: storage },
      { label: 'Display', value: display },
      { label: 'Battery', value: battery },
      { label: 'Camera', value: camera },
      { label: 'Software', value: software },
      { label: 'Network Support', value: network },
      { label: 'Charger included', value: charger }
    );
  } else {
    // For non-phone items (cases, chargers, etc.), display their actual specs
    Object.entries(specs).forEach(([key, val]) => {
      standardSpecs.push({ label: key, value: String(val) });
    });
  }

  // Swipe support without needing left/right chevron icons
  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setImgIdx((prev) => (prev + 1) % images.length);
    } else if (distance < -minSwipeDistance) {
      setImgIdx((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product.id);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleBuyNow = () => {
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <DeliveryCheckoutPage
        product={product}
        shop={shop}
        onBack={() => setShowCheckout(false)}
        onOpenOrders={onOpenOrders}
      />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 relative">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#8586f2] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={15} className="text-white" />
          <span>Added to cart!</span>
        </div>
      )}

      {/* ── Scrollable Content (Carousel + Details) ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-6 smooth-scroll">
        {/* ── Image Carousel (3 Images, Left/Right Icons Removed) ── */}
        <div className="relative bg-white border-b border-gray-100">
          {/* Back button only (Favorite moved under image) */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          {/* Image Display with Touch Swipe */}
          <div
            className="h-72 overflow-hidden flex items-center justify-center bg-gray-50/40 relative cursor-pointer select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => setImgIdx((prev) => (prev + 1) % images.length)}
          >
            <img
              src={images[imgIdx]}
              alt={`${product.name} view ${imgIdx + 1}`}
              className="max-h-72 max-w-full object-contain transition-all duration-300"
            />
            {/* Image counter indicator (1/3, 2/3, 3/3) */}
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10.5px] font-bold px-2.5 py-0.5 rounded-full pointer-events-none">
              {imgIdx + 1} / {images.length}
            </div>
          </div>

          {/* 3 Dots Indicator (Interactive) */}
          <div className="flex justify-center items-center gap-2 py-3 bg-white">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImgIdx(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === imgIdx ? 'w-6 bg-[#8586f2]' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info Card (With Favorite Icon Moved Under Image) */}
        <div className="bg-white px-4 py-4 mt-2 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {product.badge && (
                <span className="text-[11px] bg-gray-100 text-gray-500 font-medium px-2.5 py-0.5 rounded-full">{product.badge}</span>
              )}
              <h1 className="text-lg font-black text-gray-900 mt-2 leading-snug">{product.name}</h1>
            </div>

            {/* ── Moved Add to Favorite Icon Directly Under Image ── */}
            <button
              onClick={() => onToggleFav(productId)}
              className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0 mt-1 shadow-xs"
              aria-label={isFav ? 'Remove from Saved' : 'Add to Favorite'}
            >
              <Heart size={20} className={isFav ? 'fill-[#8586f2] text-[#8586f2]' : 'text-gray-700'} strokeWidth={1.8} />
            </button>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-2xl font-black text-[#8586f2]">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-black/40 line-through">{fmt(product.originalPrice)}</span>
            )}
          </div>

          {/* Condition pills */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {product.condition === 'new' ? 'New' : 'Used'}
            </span>
            {product.condition === 'new' && (
              <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield size={11} /> Genuine
              </span>
            )}
          </div>

          {/* Shop link */}
          {shop && (
            <button
              onClick={() => onShop(shop.id)}
              className="mt-3 w-full flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 active:scale-[0.98] transition-transform"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-gray-800">{shop.name}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] text-gray-500">{shop.rating} · {shop.distance}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* 10-Point Certified Condition Verification Panel */}
        <ConditionVerificationPanel product={product} />

        {/* Specs Table */}
        {standardSpecs.length > 0 && (
          <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-black">Specifications</h3>
              <span className="text-[11px] font-semibold text-black/40">Technical Details</span>
            </div>
            {standardSpecs.map((item, i) => (
              <div key={item.label} className={`flex items-start px-4 py-2.5 ${i % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'}`}>
                <span className="text-xs font-semibold text-gray-500 w-36 flex-shrink-0">{item.label}</span>
                <span className="text-xs text-gray-800 font-medium flex-1">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Related Covers & Glass Protectors Section (Current Shop First, then Others) ── */}
        {relatedItems.length > 0 && (
          <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-3.5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-black">Available Covers & Protectors</h3>
                <p className="text-[10.5px] font-semibold text-black/45 mt-0.5">Compatible with {product.name}</p>
              </div>
              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {relatedItems.length} Options
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {relatedItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => onProduct && onProduct(item.id)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                >
                  {/* Image */}
                  <div className="px-3 pt-3 pb-2 flex items-center justify-center min-h-[120px] bg-gray-50/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-28 max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="px-3 pb-3 pt-1 flex flex-col justify-between flex-1">
                    <p className="text-xs font-bold text-black leading-snug line-clamp-2 mb-2">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between gap-1 mt-auto">
                      <span className="text-xs font-black text-[#8586f2]">{fmt(item.price)}</span>
                      <button
                        type="button"
                        className="flex-shrink-0 bg-[#8586f2] hover:bg-[#7375e8] text-white text-[10px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform shadow-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onProduct) onProduct(item.id);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Customer Reviews & Ratings Section ── */}
        <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-black">Customer Reviews</h3>
                <span className="text-[10px] font-bold bg-[#8586f2]/10 text-[#8586f2] px-2 py-0.5 rounded-full">
                  Verified Local
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-black text-gray-800">4.9</span>
                <span className="text-[11px] text-gray-400 font-medium">
                  ({productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="py-1.5 px-3 rounded-full bg-[#8586f2]/10 hover:bg-[#8586f2]/20 text-[#8586f2] text-xs font-bold active:scale-95 transition-transform flex items-center gap-1"
            >
              <MessageSquare size={13} />
              <span>Write Review</span>
            </button>
          </div>

          {/* List of Customer Reviews */}
          {productReviews.length > 0 ? (
            <div className="space-y-2.5">
              {productReviews.map(rev => (
                <div key={rev.id} className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block leading-tight">{rev.userName}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{rev.city || 'Bahawalnagar'}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={11}
                          className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-gray-700 leading-relaxed font-normal">
                      "{rev.comment}"
                    </p>
                  )}

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {rev.tags.map(tag => (
                        <span key={tag} className="text-[9.5px] font-semibold bg-white border border-gray-200/80 text-gray-600 px-2 py-0.5 rounded-full">
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-700">No reviews yet for this product</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Be the first customer in Bahawalnagar to leave a review!</p>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="mt-2 text-xs font-bold text-[#8586f2] hover:underline"
              >
                + Write First Review
              </button>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="h-6" />
      </div>

      {/* Review Modal Popup */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        targetType="product"
        targetTitle={product.name}
        productId={product.id}
        shopId={product.shopId}
      />

      {/* ── Fixed Bottom Action Bar with Add to Cart & Buy Now ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 pb-safe flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        {/* Contact Icons (WhatsApp & Call) */}
        {shop && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(`Hi, I am interested in buying ${product.name} (${fmt(product.price)}) from ${shop.name}. Is it available?`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full border border-emerald-100 bg-emerald-50/70 flex items-center justify-center active:scale-95 transition-transform shadow-xs"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon size={24} />
            </a>
            <a
              href={`tel:${shop.phone}`}
              className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 text-gray-700 flex items-center justify-center active:scale-95 transition-transform"
              title="Call Shop"
            >
              <Phone size={17} />
            </a>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 rounded-full border-2 border-[#8586f2] text-[#8586f2] hover:bg-[#8586f2]/5 text-xs font-bold active:scale-95 transition-transform flex items-center justify-center gap-1.5"
        >
          <ShoppingCart size={15} />
          <span>Add to Cart</span>
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 rounded-full bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold active:scale-95 transition-transform shadow-md shadow-[#8586f2]/25 flex items-center justify-center gap-1.5"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
