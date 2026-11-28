import { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, ShoppingBag, ChevronRight, CheckCircle, CheckCircle2, Tag, Ticket, X, Sparkles } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_SHOPS } from '../data/mockData';
import { useApp } from '../context/AppContext';

const fmt = n => 'Rs. ' + (Number(n) || 0).toLocaleString('en-PK');

/* ── Authentic Official WhatsApp Brand Logo Component ── */
function WhatsAppIcon({ size = 20, className = "" }) {
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

export default function CartPage({
  cart = [],
  onBack,
  onProduct,
  onUpdateQty,
  onRemove,
  onClear,
  onOpenOrders
}) {
  const { addOrder, currentUser } = useApp();
  const [deliveryMethod, setDeliveryMethod] = useState('pickup'); // 'pickup' | 'delivery'
  const [placedOrder, setPlacedOrder] = useState(null);
  const [promoInput, setPromoInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' });

  // Hydrate cart with full product details
  const cartItems = cart.map(item => {
    const p = INITIAL_PRODUCTS.find(x => x.id === item.productId) || {};
    const shop = INITIAL_SHOPS.find(s => s.id === p.shopId) || {};
    return {
      ...item,
      product: p,
      shop,
      price: p.price || 0,
      totalPrice: (p.price || 0) * (item.quantity || 1),
    };
  }).filter(item => Boolean(item.product.id));

  const totalItemsCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const subtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? 150 : 0;

  // Voucher calculation
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'delivery') {
      discountAmount = deliveryMethod === 'delivery' ? 150 : 150; // Waives delivery fee or gives flat 150
    } else {
      discountAmount = Math.min(subtotal, appliedVoucher.amount);
    }
  }
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = (codeToApply) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'BWN150') {
      setAppliedVoucher({
        code: 'BWN150',
        title: 'Free Delivery Voucher (BWN)',
        type: 'delivery',
        amount: 150,
      });
      setPromoMsg({ text: 'Voucher applied! Rs. 150 delivery discount activated.', type: 'success' });
      setPromoInput('');
    } else if (code === 'BWN500') {
      if (subtotal < 10000) {
        setPromoMsg({ text: 'Code BWN500 is only valid on orders above Rs. 10,000', type: 'error' });
        return;
      }
      setAppliedVoucher({
        code: 'BWN500',
        title: 'Bahawal Mega Saver (Rs. 500 OFF)',
        type: 'fixed',
        amount: 500,
      });
      setPromoMsg({ text: 'Voucher applied! Rs. 500 discount added.', type: 'success' });
      setPromoInput('');
    } else if (code === 'WELCOME') {
      setAppliedVoucher({
        code: 'WELCOME',
        title: 'Welcome to BWN Market (Rs. 200 OFF)',
        type: 'fixed',
        amount: 200,
      });
      setPromoMsg({ text: 'Welcome voucher applied! Rs. 200 discount added.', type: 'success' });
      setPromoInput('');
    } else {
      setPromoMsg({ text: 'Invalid voucher code. Try "BWN150" or "WELCOME".', type: 'error' });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setPromoMsg({ text: '', type: '' });
  };

  // Primary shop WhatsApp (first shop in cart or default market contact)
  const primaryShop = cartItems[0]?.shop || INITIAL_SHOPS[0];
  const whatsappNumber = primaryShop.whatsapp || '923121234567';

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    const orderId = 'BWN-' + Math.floor(1000 + Math.random() * 9000);

    let text = `🛍️ *BAHAWAL MARKET ORDER #${orderId}*\n`;
    text += `-----------------------------------\n`;
    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}*\n`;
      text += `   Qty: ${item.quantity} × ${fmt(item.price)} = ${fmt(item.totalPrice)}\n`;
      if (item.shop?.name) {
        text += `   Shop: ${item.shop.name}\n`;
      }
    });
    text += `-----------------------------------\n`;
    text += `*Fulfillment:* ${deliveryMethod === 'delivery' ? 'Home Delivery (Bahawalnagar - Rs. 150)' : 'Free Market Counter Pickup'}\n`;
    if (appliedVoucher && discountAmount > 0) {
      text += `*Promo Voucher:* ${appliedVoucher.code} (-${fmt(discountAmount)})\n`;
    }
    text += `*Payment Method:* Cash on Delivery (COD)\n`;
    text += `*Grand Total Payable:* *${fmt(grandTotal)}*\n`;
    text += `-----------------------------------\n`;
    text += `Salam! Please confirm order #${orderId} and availability. Thank you!`;

    const orderData = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.image,
        shopName: item.shop?.name || 'Bahawal Mobile Market',
      })),
      totalAmount: grandTotal,
      voucherApplied: appliedVoucher?.code || null,
      discountAmount,
      fulfillmentMethod: deliveryMethod,
      customerName: currentUser?.name || 'Bahawal Shopper',
      customerPhone: currentUser?.phone || '',
      deliveryAddress: deliveryMethod === 'delivery' ? 'Bahawalnagar City' : 'Market Counter Pickup',
      shopWhatsApp: whatsappNumber,
    };

    if (addOrder) {
      addOrder(orderData);
    }
    setPlacedOrder(orderData);
    if (onClear) {
      onClear();
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
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
              Saved to your local device. The retailer will confirm stock & delivery on WhatsApp.
            </p>
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
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#f8f9fc]">
      {/* ── Fixed Top Purple Header ── */}
      <div className="px-4 pt-4 pb-3.5 text-white flex-shrink-0 z-30 flex items-center justify-between" style={{ background: '#8586f2' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-[#8586f2] active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-black text-base tracking-tight leading-snug">My Cart</h1>
            <p className="text-white/80 text-[11px] font-medium">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} · Bahawalnagar
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={onClear}
            className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-red-500 active:scale-95 transition-transform"
            title="Clear Cart"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32 smooth-scroll">
        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="py-24 flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#8586f2] mb-4">
              <ShoppingCart size={30} strokeWidth={1.75} />
            </div>
            <h2 className="text-base font-bold text-black">Your Cart is Empty</h2>
            <p className="text-xs text-black/45 mt-1 max-w-xs leading-relaxed">
              Explore the latest phones, cases, glass protectors, and audio accessories in Bahawal Mobile Market.
            </p>
            <button
              onClick={onBack}
              className="mt-6 bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-6 py-3 rounded-full active:scale-95 transition-transform shadow-md shadow-[#8586f2]/25 flex items-center gap-1.5"
            >
              <span>Start Shopping</span>
              <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <div className="px-4 pt-3 flex flex-col gap-3">
            {/* Cart Items List */}
            <div className="flex flex-col gap-2.5">
              {cartItems.map(item => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl border border-gray-200 p-3 flex gap-3 shadow-xs items-center"
                >
                  {/* Product Image */}
                  <div
                    className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center p-1 flex-shrink-0 cursor-pointer"
                    onClick={() => onProduct && onProduct(item.productId)}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold text-black leading-snug line-clamp-2 cursor-pointer hover:text-[#8586f2] transition-colors"
                      onClick={() => onProduct && onProduct(item.productId)}
                    >
                      {item.product.name}
                    </p>
                    <p className="text-[10.5px] font-medium text-black/45 truncate mt-0.5">
                      {item.shop?.name || 'Bahawal Mobile Market'}
                    </p>
                    <p className="text-xs font-black text-[#8586f2] mt-1.5">
                      {fmt(item.price)}
                    </p>
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex flex-col items-end justify-between h-20 py-0.5 flex-shrink-0">
                    <button
                      onClick={() => onRemove(item.productId)}
                      className="text-gray-400 hover:text-red-500 p-1 active:scale-90 transition-transform"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="flex items-center gap-1.5 bg-gray-100/80 rounded-full px-2 py-0.5 border border-gray-200/60">
                      <button
                        onClick={() => onUpdateQty(item.productId, -1)}
                        className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center active:scale-90 shadow-xs"
                        aria-label="Decrease"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold text-black min-w-3 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.productId, 1)}
                        className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center active:scale-90 shadow-xs"
                        aria-label="Increase"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery / Pickup Option */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
              <h3 className="text-xs font-bold text-black mb-2.5">Fulfillment Method</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#8586f2] bg-[#8586f2]/5 text-[#8586f2] font-bold'
                      : 'border-gray-200 text-black/70 font-medium'
                  }`}
                >
                  <p className="text-xs font-bold">🏪 Shop Pickup</p>
                  <p className="text-[10px] text-black/45 mt-0.5">Free at Market Counter</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-[#8586f2] bg-[#8586f2]/5 text-[#8586f2] font-bold'
                      : 'border-gray-200 text-black/70 font-medium'
                  }`}
                >
                  <p className="text-xs font-bold">🛵 Home Delivery</p>
                  <p className="text-[10px] text-black/45 mt-0.5">Rs. 150 (Bahawalnagar)</p>
                </button>
              </div>
            </div>

            {/* Promo Code / Voucher Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Ticket size={14} className="text-[#8586f2]" />
                  <h3 className="text-xs font-bold text-black">Promo Code / Voucher</h3>
                </div>
                {!appliedVoucher && (
                  <button
                    type="button"
                    onClick={() => handleApplyPromo('BWN150')}
                    className="text-[10px] font-bold text-[#8586f2] bg-[#8586f2]/10 hover:bg-[#8586f2]/20 px-2 py-0.5 rounded-full transition-colors active:scale-95"
                  >
                    Tap to use BWN150
                  </button>
                )}
              </div>

              {appliedVoucher ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                      <Tag size={13} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-800 tracking-wide">{appliedVoucher.code}</span>
                        <span className="text-[10px] font-bold bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded-md">
                          APPLIED
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-700 font-medium">
                        {appliedVoucher.title} · Saved {fmt(discountAmount)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="p-1 rounded-full text-emerald-700 hover:bg-emerald-200/50 active:scale-90 transition-transform"
                    title="Remove Voucher"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => {
                        setPromoInput(e.target.value.toUpperCase());
                        setPromoMsg({ text: '', type: '' });
                      }}
                      placeholder="Enter promo code (e.g. BWN150)"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-black placeholder:text-gray-400 uppercase tracking-wider focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="px-4 py-2 bg-[#8586f2] hover:bg-[#7375e8] text-white rounded-xl text-xs font-bold active:scale-95 transition-transform shadow-xs"
                    >
                      Apply
                    </button>
                  </div>

                  {promoMsg.text && (
                    <p className={`text-[10.5px] font-medium pl-1 ${promoMsg.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {promoMsg.text}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs flex flex-col gap-2">
              <h3 className="text-xs font-bold text-black mb-1">Price Summary</h3>
              <div className="flex justify-between text-xs text-black/60">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span className="font-bold text-black">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-black/60">
                <span>Delivery Charges</span>
                <span className="font-semibold text-black">
                  {deliveryFee === 0 ? 'FREE' : fmt(deliveryFee)}
                </span>
              </div>

              {appliedVoucher && discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold bg-emerald-50/50 px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Tag size={11} />
                    <span>Voucher Discount ({appliedVoucher.code})</span>
                  </span>
                  <span>- {fmt(discountAmount)}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-2.5 mt-1 flex justify-between items-center">
                <span className="text-sm font-black text-black">Total Amount</span>
                <span className="text-base font-black text-[#8586f2]">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Checkout Bar ── */}
      {cartItems.length > 0 && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3 pb-safe flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
          <div>
            <p className="text-[10.5px] font-semibold text-black/45">Total Payable</p>
            <p className="text-base font-black text-[#8586f2] leading-tight">{fmt(grandTotal)}</p>
          </div>
          <button
            onClick={handleWhatsAppCheckout}
            className="flex-1 py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold active:scale-95 transition-transform shadow-md flex items-center justify-center gap-2"
          >
            <WhatsAppIcon size={20} />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      )}
    </div>
  );
}
