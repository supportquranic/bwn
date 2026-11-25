import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  PlusCircle, 
  Eye, 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Trash2, 
  ShieldAlert, 
  Upload, 
  FileText,
  BadgeCheck,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  X
} from 'lucide-react';

export const ShopkeeperView = () => {
  const { 
    t, 
    lang, 
    currentUser, 
    shops, 
    products, 
    shopPrivate, 
    productPrivate, 
    addProduct, 
    updateProductStock, 
    deleteProduct, 
    registerShop 
  } = useApp();

  // Find this shopkeeper's shop
  const myShop = shops.find(s => s.ownerId === currentUser.id || s.id === currentUser.shopId);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showRegisterShopModal, setShowRegisterShopModal] = useState(!myShop);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    brand: 'Apple',
    model: '',
    category: 'Mobiles',
    price: '',
    condition: 'Used', // 'New' or 'Used'
    ptaStatus: 'PTA Approved',
    storage: '128GB',
    ram: '8GB',
    color: 'Black',
    photos: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80'],
    description: '',
    warranty: '1 Month Shop Checking Warranty',
    stockStatus: 'Available',
  });

  const [imeiNumber, setImeiNumber] = useState('');
  const [acceptedSellerTerms, setAcceptedSellerTerms] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Shop Registration Form State
  const [shopForm, setShopForm] = useState({
    name: 'New Bahawalnagar Mobile Corner',
    nameUrdu: 'نیو بہاولنگر موبائل کارنر',
    ownerName: currentUser.name || 'Muhammad Tariq',
    phone: currentUser.phone || '+92 300 1234567',
    whatsapp: '923001234567',
    address: 'Near Baldia Chowk, Bahawalnagar',
    addressUrdu: 'نزد بلدیہ چوک، بہاولنگر',
    hours: '10:00 AM - 10:00 PM',
    photos: ['https://images.unsplash.com/photo-1596558450268-9c27524ba856?auto=format&fit=crop&w=600&q=80'],
    cnic: '31102-1234567-1',
  });
  const [shopAcceptedTerms, setShopAcceptedTerms] = useState(false);

  // Products belonging to this shop
  const myProducts = products.filter(p => p.shopId === myShop?.id);

  const handleCreateProduct = (e) => {
    e.preventDefault();
    setFormError('');

    // Safety & Legal Check: Mandatory IMEI for used phones
    if (productForm.condition === 'Used') {
      if (!imeiNumber.trim() || imeiNumber.trim().length < 14) {
        setFormError('Mandatory IMEI error: Used phone listings require a valid 14-15 digit IMEI number for legal registration.');
        return;
      }
    }

    if (!acceptedSellerTerms) {
      setFormError('You must accept the Anti-Theft Seller Agreement and legal declaration.');
      return;
    }

    addProduct(
      {
        ...productForm,
        price: Number(productForm.price),
      },
      productForm.condition === 'Used' ? imeiNumber : null
    );

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddProductModal(false);
      // Reset form
      setProductForm({
        name: '',
        brand: 'Apple',
        model: '',
        category: 'Mobiles',
        price: '',
        condition: 'Used',
        ptaStatus: 'PTA Approved',
        storage: '128GB',
        ram: '8GB',
        color: 'Black',
        photos: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80'],
        description: '',
        warranty: '1 Month Shop Checking Warranty',
        stockStatus: 'Available',
      });
      setImeiNumber('');
      setAcceptedSellerTerms(false);
    }, 1500);
  };

  const handleRegisterShopSubmit = (e) => {
    e.preventDefault();
    if (!shopAcceptedTerms) {
      alert('You must accept the Bahawal Market Seller Agreement.');
      return;
    }
    registerShop(shopForm, shopForm.cnic);
    setShowRegisterShopModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Top Banner */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#006A4E] bg-emerald-100 px-2.5 py-0.5 rounded-full">
            {t.roleShopkeeper}
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            {t.shopDashboard}
          </h1>
          <p className="text-xs text-gray-500">
            {myShop ? (lang === 'ur' && myShop.nameUrdu ? myShop.nameUrdu : myShop.name) : 'No Shop Registered'}
          </p>
        </div>

        {myShop && (
          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-2 bg-[#006A4E] hover:bg-emerald-800 text-white px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.addProduct}</span>
          </button>
        )}
      </div>

      {/* SHOP STATUS NOTICE */}
      {myShop && (
        <div className={`p-4 rounded-2xl border mb-6 flex items-start gap-3.5 ${
          myShop.status === 'approved' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : myShop.status === 'pending'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {myShop.status === 'approved' ? (
            <BadgeCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : myShop.status === 'pending' ? (
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-extrabold">
                {myShop.status === 'approved' 
                  ? t.approvedShop 
                  : myShop.status === 'pending' 
                  ? t.pendingApproval 
                  : t.suspendedShop}
              </span>
              {myShop.verified && (
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Badge Active
                </span>
              )}
            </div>
            <p className="mt-1 text-xs opacity-90">
              {myShop.status === 'approved'
                ? 'Your shop is fully verified and your items are actively appearing in Bahawalnagar search results.'
                : myShop.status === 'pending'
                ? 'Your shop details and CNIC documents have been submitted to the Bahawal Market Admin team for verification.'
                : 'Your shop has been frozen by the market administrator.'}
            </p>
          </div>
        </div>
      )}

      {/* PERFORMANCE METRICS */}
      {myShop && (
        <div className="grid grid-cols-3 gap-3.5 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
              <Eye className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{myShop.viewsCount || 0}</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">{t.totalViews}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{myShop.callClicks || 0}</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">{t.totalCalls}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-gray-900">{myShop.whatsappClicks || 0}</div>
            <div className="text-[11px] text-gray-400 font-medium mt-0.5">{t.totalWhatsApp}</div>
          </div>
        </div>
      )}

      {/* INVENTORY / PRODUCTS TABLE */}
      {myShop ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>{t.manageProducts}</span>
              <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                {myProducts.length}
              </span>
            </h2>
          </div>

          {myProducts.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <h3 className="font-bold text-gray-700 text-sm">No products listed yet</h3>
              <p className="text-xs text-gray-400 mt-1 mb-4">Add your mobile inventory to start getting customer calls.</p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="inline-flex items-center gap-1.5 bg-[#006A4E] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.addProduct}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myProducts.map(product => {
                const isUsed = product.condition === 'Used';
                const privateRecord = productPrivate[product.id];

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={product.photos[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-50 border border-gray-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            product.condition === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {product.condition}
                          </span>
                          <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-medium">
                            {product.ptaStatus}
                          </span>
                          {isUsed && (
                            <span className="text-[10px] font-mono bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                              IMEI Logged (Private)
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm mt-1">{product.name}</h3>
                        <div className="text-xs font-extrabold text-[#006A4E] mt-0.5">
                          PKR {product.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                      {/* Stock Toggle */}
                      <button
                        onClick={() => updateProductStock(
                          product.id,
                          product.stockStatus === 'Available' ? 'Out of Stock' : 'Available'
                        )}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          product.stockStatus === 'Available'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {product.stockStatus === 'Available' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t.inStock}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            <span>{t.outOfStock}</span>
                          </>
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete listing ${product.name}?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* REGISTER SHOP CALL TO ACTION */
        <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center shadow-sm">
          <Store className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-gray-900">Open Your Digital Shop in Bahawalnagar</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2 mb-6">
            Join all mobile retailers in Bahawalnagar. Upload your shop details and start receiving local buyer inquiries directly via WhatsApp and phone calls.
          </p>
          <button
            onClick={() => setShowRegisterShopModal(true)}
            className="bg-[#006A4E] text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-emerald-800 shadow-md transition"
          >
            {t.registerShop}
          </button>
        </div>
      )}

      {/* ADD PRODUCT MODAL (WITH MANDATORY USED IMEI RULE) */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h3 className="font-extrabold text-gray-900 text-base">{t.addProduct}</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Listing published successfully!</span>
                </div>
              )}

              {/* Title & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Apple iPhone 15 Pro 128GB"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi / Redmi</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Vivo">Vivo</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Realme">Realme</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none"
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Chargers">Chargers</option>
                    <option value="Covers">Covers</option>
                    <option value="Earphones">Earphones</option>
                    <option value="Repair">Repair Service</option>
                  </select>
                </div>
              </div>

              {/* Price & Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (in PKR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 185000"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Condition *</label>
                  <select
                    value={productForm.condition}
                    onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none font-bold text-[#006A4E]"
                  >
                    <option value="Used">Used (سیکنڈ ہینڈ)</option>
                    <option value="New">New (نیا ڈبہ پیک)</option>
                  </select>
                </div>
              </div>

              {/* MANDATORY IMEI SECTION (SPEC REQUIREMENT FOR USED PHONES) */}
              {productForm.condition === 'Used' && (
                <div className="p-4 bg-amber-50/80 rounded-2xl border-2 border-amber-300 space-y-2">
                  <div className="flex items-start gap-2 text-amber-900">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-rose-700 uppercase tracking-wide">
                        Safety & Police Audit Requirement
                      </h4>
                      <p className="text-[11px] text-gray-700 mt-0.5 leading-snug">
                        {t.legalWarningImei}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-xs font-bold text-gray-900 mb-1">
                      {t.imeiRequiredUsed} *
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      required
                      value={imeiNumber}
                      onChange={(e) => setImeiNumber(e.target.value)}
                      placeholder="e.g. 354892110984521"
                      className="w-full text-xs font-mono font-bold p-3 rounded-xl border border-amber-400 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 italic">
                      {t.imeiPrivateNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Specs (Storage, RAM, PTA, Warranty) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Storage</label>
                  <input
                    type="text"
                    value={productForm.storage}
                    onChange={(e) => setProductForm({ ...productForm, storage: e.target.value })}
                    placeholder="e.g. 128GB"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PTA Status</label>
                  <select
                    value={productForm.ptaStatus}
                    onChange={(e) => setProductForm({ ...productForm, ptaStatus: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                  >
                    <option value="PTA Approved">PTA Approved</option>
                    <option value="Non-PTA">Non-PTA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    placeholder="e.g. Black, Titanium"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Warranty</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    placeholder="e.g. 7 Days Checking"
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description & Details</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Battery health, condition, accessories included..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              {/* SELLER AGREEMENT CHECKBOX */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    checked={acceptedSellerTerms}
                    onChange={(e) => setAcceptedSellerTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-gray-700 leading-snug">
                    {t.acceptSellerAgreement}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#006A4E] text-white font-extrabold text-sm rounded-2xl hover:bg-emerald-800 shadow-lg shadow-emerald-800/20 transition"
              >
                {t.saveProduct}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHOP REGISTRATION MODAL */}
      {showRegisterShopModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h3 className="font-extrabold text-gray-900 text-base">{t.registerShop}</h3>
              {myShop && (
                <button onClick={() => setShowRegisterShopModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <form onSubmit={handleRegisterShopSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Shop Name (English) *</label>
                <input
                  type="text"
                  required
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Shop Name (Urdu) *</label>
                <input
                  type="text"
                  required
                  value={shopForm.nameUrdu}
                  onChange={(e) => setShopForm({ ...shopForm, nameUrdu: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={shopForm.phone}
                    onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={shopForm.whatsapp}
                    onChange={(e) => setShopForm({ ...shopForm, whatsapp: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bahawalnagar Address *</label>
                <input
                  type="text"
                  required
                  value={shopForm.address}
                  onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  placeholder="e.g. Shop # 12, Minchinabad Road, Bahawalnagar"
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none"
                />
              </div>

              {/* CNIC (Private for Admin) */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  Owner CNIC Number (Admin Verification Only) *
                </label>
                <input
                  type="text"
                  required
                  value={shopForm.cnic}
                  onChange={(e) => setShopForm({ ...shopForm, cnic: e.target.value })}
                  placeholder="31102-XXXXXXX-X"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-300 font-mono focus:outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  This CNIC is strictly encrypted and used by admin solely to approve your shop.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <input
                    type="checkbox"
                    checked={shopAcceptedTerms}
                    onChange={(e) => setShopAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-xs text-emerald-900 font-medium">
                    I accept the Bahawal Market Merchant Agreement and agree to stay in Pending state until admin verifies all details.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#006A4E] text-white font-extrabold text-sm rounded-2xl hover:bg-emerald-800 shadow-md transition"
              >
                Submit Shop for Admin Verification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
