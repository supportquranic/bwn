import { useState } from 'react';
import { 
  X, ShoppingBag, Clock, CheckCircle2, Truck, Store, MapPin, 
  MessageSquare, ChevronRight, ExternalLink, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = n => 'Rs. ' + Number(n || 0).toLocaleString('en-PK');

export default function MyOrdersModal({ isOpen, onClose, onExplore }) {
  const { orders = [] } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!isOpen) return null;

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') {
      return order.status?.toLowerCase().includes('pending') || 
             order.status?.toLowerCase().includes('confirmed') ||
             order.status?.toLowerCase().includes('delivery');
    }
    if (filter === 'completed') {
      return order.status?.toLowerCase().includes('completed') || 
             order.status?.toLowerCase().includes('delivered');
    }
    return true;
  });

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    if (s.includes('completed') || s.includes('delivered')) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Delivered',
      };
    }
    if (s.includes('delivery')) {
      return {
        bg: 'bg-[#8586f2]/10 text-[#8586f2] border-[#8586f2]/30',
        dot: 'bg-[#8586f2]',
        label: 'Out for Delivery',
      };
    }
    if (s.includes('confirmed')) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Confirmed',
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending Confirmation',
    };
  };

  const openWhatsAppTrack = (order) => {
    const targetPhone = order.shopWhatsApp || '923121234567';
    const text = `Salam! I am checking the status of my Bahawal Market Order *#${order.id}*.\nName: ${order.customerName}\nTotal: ${fmt(order.totalAmount)}\nPlease provide an update on delivery. Thank you!`;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[390px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Solid Brand Purple Header ── */}
        <div 
          className="relative px-6 pt-6 pb-6 text-white text-center flex-shrink-0"
          style={{ background: '#8586f2' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
            title="Close"
          >
            <X size={17} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-2">
            <Sparkles size={12} />
            Track Purchases
          </div>

          <h2 className="text-2xl font-black text-white leading-tight">
            My Orders
          </h2>
          <p className="text-white/80 text-xs mt-1">
            Bahawal Market · {orders.length} Total Orders Placed
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 mt-3.5 bg-black/10 p-1 rounded-2xl">
            {[
              { id: 'all', label: `All (${orders.length})` },
              { id: 'pending', label: 'Active' },
              { id: 'completed', label: 'Delivered' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id 
                    ? 'bg-white text-black shadow-xs font-black' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Orders List Body ── */}
        <div className="p-4 overflow-y-auto flex-1 hide-scrollbar space-y-3 bg-[#f8f9fc]">
          {filteredOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-base font-black text-black">No Orders Found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[220px] mx-auto">
                  You haven't placed any orders in this category yet.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onExplore) onExplore();
                }}
                className="mt-2 px-5 py-2.5 bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
              >
                Explore Phones & Accessories
              </button>
            </div>
          ) : (
            filteredOrders.map(order => {
              const badge = getStatusBadge(order.status);
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-PK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:border-gray-300 transition-all p-3.5"
                >
                  {/* Top Bar: Order ID & Status */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#8586f2] tracking-wide">
                        #{order.id}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formattedDate}
                      </span>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${badge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="py-2.5 space-y-2">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image || '/icons/categories/iphone.png'}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-black truncate leading-snug">
                            {item.name}
                          </p>
                          <p className="text-[10.5px] text-gray-500">
                            Qty: <strong className="text-black">{item.quantity || 1}</strong> × {fmt(item.price)}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-black">
                          {fmt((item.price || 0) * (item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment info */}
                  <div className="bg-gray-50/80 rounded-xl p-2.5 text-[11px] text-gray-600 space-y-1 mb-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center gap-1">
                        {order.fulfillmentMethod === 'delivery' ? <Truck size={12} /> : <Store size={12} />}
                        Fulfillment:
                      </span>
                      <span className="font-semibold text-black">
                        {order.fulfillmentMethod === 'delivery' 
                          ? 'Cash on Delivery (Bahawalnagar)' 
                          : 'Market Shop Counter Pickup'}
                      </span>
                    </div>

                    {order.deliveryAddress && (
                      <div className="flex items-start justify-between gap-2 pt-0.5 border-t border-gray-100">
                        <span className="text-gray-400 flex-shrink-0 flex items-center gap-1">
                          <MapPin size={11} />
                          Address:
                        </span>
                        <span className="font-medium text-black truncate text-right">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row: Total & WhatsApp Tracking Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block leading-tight">Total Payable (COD)</span>
                      <span className="text-sm font-black text-[#8586f2]">
                        {fmt(order.totalAmount)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openWhatsAppTrack(order)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11.5px] font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-transform"
                    >
                      <MessageSquare size={13} />
                      <span>Track on WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
