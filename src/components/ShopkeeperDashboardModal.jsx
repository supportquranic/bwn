import { useState } from 'react';
import { 
  X, Store, Package, Plus, ShoppingBag, Settings, CheckCircle2, 
  Trash2, Edit3, ArrowRight, Check, AlertCircle, Phone, MapPin, 
  Clock, ExternalLink, RefreshCw, Smartphone, Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = n => 'Rs. ' + (Number(n) || 0).toLocaleString('en-PK');

const SAMPLE_IMAGES = [
  { label: 'iPhone 15 Pro', url: '/product images/iphone 15 pro.png' },
  { label: 'iPhone 13', url: '/product images/iphone 13.png' },
  { label: 'Samsung S24', url: '/product images/samsung s24 ultra.png' },
  { label: 'Redmi Note 13', url: '/product images/xiaomi redmi note 13.png' },
  { label: 'AirPods Pro', url: '/product images/airpods pro 2.png' },
  { label: 'Apple Watch', url: '/product images/apple watch ultra.png' },
  { label: '65W Charger', url: '/product images/65w fast charger.png' },
  { label: 'Silicone Case', url: '/product images/iphone 15 leather case.png' },
];

export default function ShopkeeperDashboardModal({ isOpen, onClose, onOpenShop }) {
  const { 
    currentUser, 
    shops = [], 
    products = [], 
    orders = [], 
    addProduct, 
    updateProductStock, 
    deleteProduct, 
    updateOrderStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add' | 'orders' | 'settings'
  const [successToast, setSuccessToast] = useState('');

  // Find this shopkeeper's shop
  const myShop = shops.find(s => s.id === currentUser?.shopId) || shops[0] || {
    id: 'shop-1',
    name: 'Al-Madina Mobile Zone',
    address: 'Shop # 5, Main Bazar, Bahawalnagar',
    whatsapp: '923121234567',
  };

  // Filter products for this shop
  const shopProducts = products.filter(p => p.shopId === myShop.id || !p.shopId);

  // Filter orders for this shop
  const shopOrders = orders.filter(o => 
    o.shopWhatsApp === myShop.whatsapp || 
    o.shopName === myShop.name || 
    !o.shopWhatsApp
  );

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('android');
  const [newBrand, setNewBrand] = useState('Samsung');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState('new'); // 'new' | 'used'
  const [newPta, setNewPta] = useState(true);
  const [newStorage, setNewStorage] = useState('256GB');
  const [newRam, setNewRam] = useState('8GB');
  const [newBattery, setNewBattery] = useState('100');
  const [newImage, setNewImage] = useState(SAMPLE_IMAGES[0].url);
  const [newImei, setNewImei] = useState('');
  const [formError, setFormError] = useState('');

  // Shop Settings State
  const [shopWhatsapp, setShopWhatsapp] = useState(myShop.whatsapp || '923121234567');
  const [shopAddress, setShopAddress] = useState(myShop.address || 'Main Bazar, Bahawalnagar');
  const [shopHours, setShopHours] = useState('10:00 AM - 10:00 PM');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter a product name');
      return;
    }
    if (!newPrice || Number(newPrice) <= 0) {
      setFormError('Please enter a valid price in PKR');
      return;
    }

    setFormError('');

    const productPayload = {
      name: newTitle.trim(),
      category: newCategory,
      brand: newBrand,
      price: Number(newPrice),
      image: newImage,
      condition: newCondition,
      shopId: myShop.id,
      shopName: myShop.name,
      stockStatus: 'in_stock',
      specs: {
        Brand: newBrand,
        Storage: newStorage,
        RAM: newRam,
        ...(newCategory === 'iphone' || newCategory === 'android' ? {
          'PTA Status': newPta ? 'Official PTA Approved' : 'Non-PTA / JV',
          'Network Support': '5G, 4G LTE',
        } : {})
      },
      ...(newCondition === 'used' ? {
        usedDetails: {
          ptaApproved: newPta,
          batteryHealth: Number(newBattery) || 95,
          cosmeticScore: '9.5/10 Flawless',
          warranty: '7 Days Check Warranty',
        }
      } : {})
    };

    if (addProduct) {
      addProduct(productPayload, newImei);
    }

    showToast(`Added "${newTitle}" to your catalog!`);
    setActiveTab('inventory');

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewImei('');
  };

  const handleUpdateStatus = (orderId, status) => {
    if (updateOrderStatus) {
      updateOrderStatus(orderId, status);
      showToast(`Order #${orderId} marked as ${status}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Toast Notification ── */}
        {successToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* ── Solid Brand Purple Header ── */}
        <div 
          className="relative px-5 pt-4 pb-4 text-white flex-shrink-0"
          style={{ background: '#8586f2' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Store size={19} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-white leading-tight truncate">
                  {myShop.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <p className="text-white/80 text-[11px] font-medium truncate">
                    Seller Portal · Bahawalnagar
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors flex-shrink-0"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center justify-between bg-black/15 p-1 rounded-2xl gap-1">
            {[
              { id: 'inventory', label: 'Inventory', count: shopProducts.length, icon: Package },
              { id: 'add', label: 'Add Item', icon: Plus },
              { id: 'orders', label: 'Orders', count: shopOrders.length, icon: ShoppingBag },
              { id: 'settings', label: 'Shop', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-1.5 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-xs font-black'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[9.5px] px-1 py-0.2 rounded-full ${isActive ? 'bg-[#8586f2]/15 text-[#8586f2]' : 'bg-white/20 text-white'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Content (Scrollable) ── */}
        <div className="p-4 overflow-y-auto flex-1 hide-scrollbar bg-[#f8f9fc] space-y-3">
          {/* ════ TAB 1: INVENTORY ════ */}
          {activeTab === 'inventory' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  My Listed Items ({shopProducts.length})
                </span>
                <button
                  onClick={() => setActiveTab('add')}
                  className="text-xs font-bold text-[#8586f2] hover:underline flex items-center gap-0.5"
                >
                  <Plus size={13} />
                  <span>New Product</span>
                </button>
              </div>

              {shopProducts.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center p-4">
                  <Package size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-black">No products in inventory</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Click "+ Add Item" to list your first mobile phone.</p>
                </div>
              ) : (
                shopProducts.map(product => {
                  const isOutOfStock = product.stockStatus === 'out_of_stock';
                  return (
                    <div 
                      key={product.id}
                      className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs flex items-center gap-3 transition-all"
                    >
                      <div className="w-13 h-13 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-black truncate leading-snug">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-[#8586f2]">
                            {fmt(product.price)}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {product.specs?.Storage || (product.condition === 'new' ? 'Brand New' : 'Used')}
                          </span>
                        </div>

                        {/* Quick Stock Toggle */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => {
                              if (updateProductStock) {
                                updateProductStock(product.id, isOutOfStock ? 'in_stock' : 'out_of_stock');
                                showToast(isOutOfStock ? 'Marked In Stock' : 'Marked Out of Stock');
                              }
                            }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                              isOutOfStock
                                ? 'bg-rose-50 text-rose-600 border-rose-200'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            }`}
                          >
                            ● {isOutOfStock ? 'Out of Stock' : 'In Stock (Live)'}
                          </button>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button
                        onClick={() => {
                          if (deleteProduct && window.confirm(`Remove ${product.name} from store?`)) {
                            deleteProduct(product.id);
                            showToast('Product removed');
                          }
                        }}
                        className="text-gray-300 hover:text-red-500 p-1.5 active:scale-90 transition-transform flex-shrink-0"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ════ TAB 2: ADD PRODUCT ════ */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreateProduct} className="space-y-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  List New Mobile / Accessory
                </h3>
                <p className="text-[11px] text-gray-400">Instantly visible to customers across Bahawalnagar</p>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => { setNewTitle(e.target.value); setFormError(''); }}
                  placeholder="e.g. Samsung Galaxy A55 (256GB)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                />
              </div>

              {/* Category & Brand Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-black block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs text-black focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                  >
                    <option value="android">Android Phone</option>
                    <option value="iphone">Apple iPhone</option>
                    <option value="airpods">AirPods / Earbuds</option>
                    <option value="smartwatch">Smartwatch</option>
                    <option value="chargers">Fast Charger</option>
                    <option value="cases">Protective Case</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-black block mb-1">Brand</label>
                  <select
                    value={newBrand}
                    onChange={e => setNewBrand(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-xs text-black focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                  >
                    <option value="Samsung">Samsung</option>
                    <option value="Apple">Apple</option>
                    <option value="Xiaomi">Xiaomi / Redmi</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Realme">Realme</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Google">Google Pixel</option>
                  </select>
                </div>
              </div>

              {/* Price (PKR) */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">
                  Selling Price (PKR) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#8586f2] focus-within:bg-white transition-colors">
                  <span className="text-xs font-bold text-gray-400 mr-1.5">Rs.</span>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => { setNewPrice(e.target.value); setFormError(''); }}
                    placeholder="e.g. 75000"
                    className="w-full bg-transparent text-xs font-bold text-black outline-none"
                  />
                </div>
              </div>

              {/* Condition (New vs Used) */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCondition('new')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newCondition === 'new'
                        ? 'border-[#8586f2] bg-[#8586f2]/10 text-[#8586f2]'
                        : 'border-gray-200 text-gray-600 bg-gray-50'
                    }`}
                  >
                    ✨ Brand New / Box Pack
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCondition('used')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newCondition === 'used'
                        ? 'border-[#8586f2] bg-[#8586f2]/10 text-[#8586f2]'
                        : 'border-gray-200 text-gray-600 bg-gray-50'
                    }`}
                  >
                    📱 Used / Pre-Owned
                  </button>
                </div>
              </div>

              {/* PTA Approval Toggle */}
              {(newCategory === 'iphone' || newCategory === 'android') && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <div>
                    <p className="text-xs font-bold text-black">PTA Status</p>
                    <p className="text-[10px] text-gray-400">{newPta ? 'Official PTA Approved' : 'Non-PTA / JV'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewPta(p => !p)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                      newPta ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                    }`}
                  >
                    {newPta ? 'PTA Approved' : 'Non-PTA'}
                  </button>
                </div>
              )}

              {/* Storage & RAM */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-black block mb-1">Storage</label>
                  <input
                    type="text"
                    value={newStorage}
                    onChange={e => setNewStorage(e.target.value)}
                    placeholder="e.g. 256GB"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-black outline-none focus:border-[#8586f2] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-black block mb-1">RAM</label>
                  <input
                    type="text"
                    value={newRam}
                    onChange={e => setNewRam(e.target.value)}
                    placeholder="e.g. 8GB"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-black outline-none focus:border-[#8586f2] focus:bg-white"
                  />
                </div>
              </div>

              {/* Sample Image Selector */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1.5">
                  Select Product Image
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewImage(img.url)}
                      className={`p-1 rounded-xl border bg-gray-50 flex flex-col items-center gap-1 transition-all ${
                        newImage === img.url ? 'border-[#8586f2] ring-2 ring-[#8586f2]/20 bg-white' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-8 h-8 object-contain" />
                      <span className="text-[9px] font-medium text-gray-500 truncate w-full text-center">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#8586f2] hover:bg-[#7375e8] active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-transform"
              >
                <Check size={15} />
                <span>Publish to Bahawal Market</span>
              </button>
            </form>
          )}

          {/* ════ TAB 3: ORDERS ════ */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Store Orders ({shopOrders.length})
                </span>
                <span className="text-[11px] text-gray-400">Cash on Delivery</span>
              </div>

              {shopOrders.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-gray-200 text-center p-4">
                  <ShoppingBag size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-black">No incoming orders yet</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">When customers order via WhatsApp/portal, orders appear here.</p>
                </div>
              ) : (
                shopOrders.map(order => {
                  const isDelivered = order.status === 'Delivered';
                  return (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-[#8586f2]">#{order.id}</span>
                          <span className="text-[10.5px] text-gray-400 ml-1.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDelivered ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="border-t border-gray-100 pt-2 space-y-1">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="font-medium text-black truncate max-w-[200px]">{item.name}</span>
                            <span className="font-bold text-black">{fmt(item.price)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-xl p-2 text-[11px] space-y-0.5 text-gray-600">
                        <p className="font-bold text-black">👤 {order.customerName} · {order.customerPhone}</p>
                        <p className="truncate">📍 {order.deliveryAddress || 'Market Pickup'}</p>
                      </div>

                      {/* Total and Status Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Total COD</span>
                          <span className="text-xs font-black text-black">{fmt(order.totalAmount)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {order.status !== 'Confirmed' && order.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Confirmed')}
                              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10.5px] font-bold rounded-lg transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {order.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold rounded-lg transition-colors"
                            >
                              Delivered ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ════ TAB 4: SHOP SETTINGS ════ */}
          {activeTab === 'settings' && (
            <div className="space-y-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Storefront Information
              </h3>

              <div>
                <label className="text-[11px] font-bold text-black block mb-1">Shop Name</label>
                <input
                  type="text"
                  disabled
                  value={myShop.name}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-black block mb-1">WhatsApp for Orders</label>
                <input
                  type="text"
                  value={shopWhatsapp}
                  onChange={e => setShopWhatsapp(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-[#8586f2] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-black block mb-1">Market Address</label>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={e => setShopAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-[#8586f2] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-black block mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={shopHours}
                  onChange={e => setShopHours(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black font-semibold focus:outline-none focus:border-[#8586f2] focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Shop details saved!');
                }}
                className="w-full py-2.5 bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold rounded-xl active:scale-98 transition-transform shadow-xs"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
