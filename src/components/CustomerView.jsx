import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_3D } from '../data/mockData';
import { Category3DIcon } from './Category3DIcon';
import { 
  Search, 
  Phone, 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  X, 
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Sparkles,
  Store,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const CustomerView = () => {
  const { 
    t, 
    lang, 
    shops, 
    products, 
    reviews, 
    favorites, 
    activeShopId, 
    setActiveShopId,
    toggleFavorite, 
    recordInteraction, 
    recordProductView,
    addReview, 
    addReport 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All'); // 'All' | 'New' | 'Used'
  const [selectedPta, setSelectedPta] = useState('All'); // 'All' | 'PTA Approved' | 'Non-PTA'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Shop internal category filter (when viewing a specific shop)
  const [shopCategoryFilter, setShopCategoryFilter] = useState('All');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReportModal, setShowReportModal] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Review state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Approved shops lookup
  const approvedShopsMap = useMemo(() => {
    const map = {};
    shops.filter(s => s.status === 'approved').forEach(s => {
      map[s.id] = s;
    });
    return map;
  }, [shops]);

  // Featured and Unique Items for Home Screen
  const featuredAndUniqueProducts = useMemo(() => {
    return products.filter(p => {
      const shop = approvedShopsMap[p.shopId];
      return shop && (p.isFeatured || p.isUnique);
    });
  }, [products, approvedShopsMap]);

  // General Filtered Products for Market Home
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const shop = approvedShopsMap[p.shopId];
      if (!shop) return false;
      if (verifiedOnly && !shop.verified) return false;

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Condition
      if (selectedCondition !== 'All' && p.condition !== selectedCondition) return false;

      // PTA
      if (selectedPta !== 'All' && p.ptaStatus !== selectedPta) return false;

      // Search Query
      if (searchQuery.trim()) {
        const queryTerms = searchQuery.toLowerCase().replace(/[-_]/g, ' ').split(' ').filter(Boolean);
        const searchableText = `${p.name} ${p.brand} ${p.model} ${p.storage} ${p.color} ${shop.name} ${shop.address}`.toLowerCase();
        return queryTerms.every(term => searchableText.includes(term));
      }

      return true;
    });

    // Default sorting: lowest price first
    result.sort((a, b) => a.price - b.price);
    return result;
  }, [products, approvedShopsMap, verifiedOnly, selectedCategory, selectedCondition, selectedPta, searchQuery]);

  // Current active shop if one is clicked
  const activeShop = useMemo(() => {
    return shops.find(s => s.id === activeShopId);
  }, [shops, activeShopId]);

  // Products belonging to the active shop
  const activeShopProducts = useMemo(() => {
    if (!activeShop) return [];
    return products.filter(p => {
      if (p.shopId !== activeShop.id) return false;
      if (shopCategoryFilter !== 'All' && p.category !== shopCategoryFilter) return false;
      return true;
    });
  }, [products, activeShop, shopCategoryFilter]);

  const handleOpenProduct = (product) => {
    recordProductView(product.id);
    setSelectedProduct(product);
  };

  const handleOpenShop = (shopId) => {
    recordInteraction(shopId, 'view');
    setActiveShopId(shopId);
    setShopCategoryFilter('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCallShop = (shop, product = null) => {
    recordInteraction(shop.id, 'call');
    window.open(`tel:${shop.phone}`, '_self');
  };

  const handleWhatsAppShop = (shop, product = null) => {
    recordInteraction(shop.id, 'whatsapp');
    let message = '';
    if (lang === 'ur') {
      message = product 
        ? `السلام علیکم! میں نے بہاول مارکیٹ پر آپ کا اشتہار دیکھا ہے: ${product.name} (قیمت: ${product.price.toLocaleString()} روپے)۔ کیا یہ دستیاب ہے؟`
        : `السلام علیکم! میں بہاول مارکیٹ ایپ کے ذریعے آپ کی دکان ${shop.nameUrdu || shop.name} سے رابطہ کر رہا ہوں۔`;
    } else {
      message = product 
        ? `Assalam-o-Alaikum, I saw your listing on Bahawal Market: ${product.name} (PKR ${product.price.toLocaleString()}). Is it available?`
        : `Assalam-o-Alaikum, I am inquiring from Bahawal Market app regarding ${shop.name}.`;
    }
    const cleanNumber = shop.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!activeShop || !newComment.trim()) return;
    addReview(activeShop.id, newRating, newComment.trim());
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!showReportModal || !reportReason.trim()) return;
    addReport(showReportModal.type, showReportModal.id, showReportModal.title, reportReason.trim());
    setReportReason('');
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(null);
    }, 1800);
  };

  // ==========================================
  // RENDER: SHOP DETAIL & STOREFRONT VIEW
  // ==========================================
  if (activeShop) {
    const shopReviews = reviews.filter(r => r.shopId === activeShop.id);
    const shopCategories = activeShop.categories || ['Mobiles', 'Accessories', 'Chargers'];

    return (
      <div className="pb-32 animate-in fade-in duration-200">
        {/* Top Back Navigation Bar */}
        <div className="sticky top-14 z-30 bg-[#F8FAFC]/90 backdrop-blur-md px-4 py-3 border-b border-gray-200/60 flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => setActiveShopId(null)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white px-3 py-1.5 rounded-full border border-gray-200/80 shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{lang === 'ur' ? 'مارکیٹ پر واپس جائیں' : 'Back to Market'}</span>
          </button>

          <span className="text-[11px] font-mono text-gray-400">
            {activeShop.viewsCount || 0} visits
          </span>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-4">
          {/* Shop Hero Card */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={activeShop.photos[0]}
                alt={activeShop.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                    {lang === 'ur' && activeShop.nameUrdu ? activeShop.nameUrdu : activeShop.name}
                  </h1>
                  {activeShop.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Store
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{lang === 'ur' && activeShop.addressUrdu ? activeShop.addressUrdu : activeShop.address}</span>
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {activeShop.hours}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {activeShop.rating} ({activeShop.ratingCount} reviews)
                  </span>
                </div>
              </div>

              {/* Direct Call & WhatsApp Contact */}
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => handleCallShop(activeShop)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Call Store</span>
                </button>
                <button
                  onClick={() => handleWhatsAppShop(activeShop)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {activeShop.featuredQuote && (
              <div className="mt-4 pt-3.5 border-t border-gray-100 text-xs text-gray-500 italic">
                "{activeShop.featuredQuote}"
              </div>
            )}
          </div>

          {/* Shop's Categories Pills */}
          <div className="mt-6 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Available Categories in this Store
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setShopCategoryFilter('All')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  shopCategoryFilter === 'All'
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
                }`}
              >
                All Items ({products.filter(p => p.shopId === activeShop.id).length})
              </button>
              {shopCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setShopCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    shopCategoryFilter === cat
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Shop's Available Inventory */}
          <div className="space-y-3">
            {activeShopProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-xs text-gray-400 border border-gray-200/80">
                No items currently listed in this category.
              </div>
            ) : (
              activeShopProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/80 hover:border-emerald-300 shadow-xs hover:shadow-sm transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.photos[0]}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          product.condition === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {product.condition}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                          {product.ptaStatus}
                        </span>
                        {product.stockStatus === 'Available' ? (
                          <span className="text-[10px] text-emerald-700 font-medium">In Stock</span>
                        ) : (
                          <span className="text-[10px] text-rose-600 font-medium">Out of Stock</span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-gray-900 truncate mt-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {product.storage !== 'N/A' && `${product.storage} • `}{product.color}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-400 font-medium">PKR</div>
                    <div className="text-base font-black text-[#064E3B]">
                      {product.price.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-0.5 mt-0.5">
                      View <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Shop Reviews & Feedback */}
          <div className="mt-8 bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">
                Customer Ratings ({shopReviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{activeShop.rating} / 5.0</span>
              </div>
            </div>

            {/* Submit Review */}
            <form onSubmit={handleSubmitReview} className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200/70 mb-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setNewRating(s)}
                    className="p-0.5"
                  >
                    <Star className={`w-4 h-4 ${s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this shop..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-2"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#064E3B] text-white text-xs font-semibold rounded-xl hover:bg-emerald-900 transition"
              >
                Post Review
              </button>
              {reviewSubmitted && (
                <p className="text-[11px] text-emerald-700 font-medium text-center mt-1.5">
                  Thank you! Your feedback has been recorded.
                </p>
              )}
            </form>

            <div className="space-y-2.5">
              {shopReviews.map(rev => (
                <div key={rev.id} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{rev.userName}</span>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN MARKETPLACE HOME VIEW
  // ==========================================
  return (
    <div className="pb-32">
      {/* SOPHISTICATED TOP BANNER */}
      <div className="relative bg-[#082218] text-white pt-6 pb-7 px-4 rounded-b-[32px] shadow-sm overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Bahawalnagar Live Market</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                {t.appName}
              </h1>
            </div>

            <div className="text-right text-xs text-emerald-200/80">
              <span className="block font-semibold text-white">{shops.filter(s => s.status === 'approved').length} Shops</span>
              <span className="text-[11px]">{products.length} Phones Listed</span>
            </div>
          </div>

          {/* Minimalist Floating Search Pill */}
          <div className="relative mt-3">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-emerald-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full py-3.5 ps-11 pe-24 rounded-2xl bg-white/95 text-gray-900 placeholder-gray-400 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-xs transition"
            />
            <div className="absolute inset-y-0 end-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  showFilters || verifiedOnly || selectedCondition !== 'All' || selectedPta !== 'All'
                    ? 'bg-[#064E3B] text-white shadow-xs' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.filters}</span>
              </button>
            </div>
          </div>

          {/* Expandable Filter Drawer */}
          {showFilters && (
            <div className="mt-3.5 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs animate-in fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-emerald-200 text-[11px] font-medium mb-1">{t.condition}</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full bg-white text-gray-900 rounded-xl px-2.5 py-1.5 font-medium text-xs focus:outline-none"
                  >
                    <option value="All">{t.all}</option>
                    <option value="New">{t.new}</option>
                    <option value="Used">{t.used}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-200 text-[11px] font-medium mb-1">PTA Status</label>
                  <select
                    value={selectedPta}
                    onChange={(e) => setSelectedPta(e.target.value)}
                    className="w-full bg-white text-gray-900 rounded-xl px-2.5 py-1.5 font-medium text-xs focus:outline-none"
                  >
                    <option value="All">{t.all}</option>
                    <option value="PTA Approved">{t.ptaApproved}</option>
                    <option value="Non-PTA">{t.nonPta}</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl w-full border border-white/20 transition">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="text-white font-medium text-xs">{t.verifiedOnly}</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {/* SOFT MINIMAL 2-COLOR 3D CATEGORIES */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Browse Categories
            </h2>
            {selectedCategory !== 'All' && (
              <button 
                onClick={() => setSelectedCategory('All')} 
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none pt-1">
            {CATEGORIES_3D.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 p-2.5 rounded-2xl transition shrink-0 group ${
                    isSelected 
                      ? 'bg-emerald-50/80 border border-emerald-300/80' 
                      : 'hover:bg-white/80'
                  }`}
                >
                  <Category3DIcon
                    type={cat.iconType}
                    isSelected={isSelected}
                    className="w-13 h-13 sm:w-14 sm:h-14"
                  />
                  <span className={`text-[11px] font-semibold tracking-tight ${
                    isSelected ? 'text-[#064E3B] font-bold' : 'text-gray-700'
                  }`}>
                    {lang === 'ur' ? cat.nameUr : cat.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEATURED & UNIQUE ITEMS ON HOME SCREEN */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                  Featured & Unique in Bahawalnagar
                </h2>
              </div>
              <span className="text-[11px] font-medium text-gray-400">Hand-checked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {featuredAndUniqueProducts.slice(0, 4).map(product => {
                const shop = approvedShopsMap[product.shopId] || {};
                const isFav = favorites.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => handleOpenProduct(product)}
                    className="bg-white rounded-3xl p-4 border border-gray-200/80 hover:border-emerald-300 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                          <Flame className="w-3 h-3 text-amber-600" />
                          {product.badgeText || 'Featured'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className="p-1 text-gray-400 hover:text-rose-500 transition"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Photo & Specs */}
                      <div className="flex gap-3.5 mb-2.5">
                        <img
                          src={product.photos[0]}
                          alt={product.name}
                          className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-105 transition"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {product.condition} • {product.storage}
                          </p>
                          <div className="mt-1.5 text-base font-extrabold text-[#064E3B]">
                            PKR {product.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shop details */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 truncate flex items-center gap-1">
                        <Store className="w-3 h-3 text-gray-400 shrink-0" />
                        {shop.name}
                      </span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-0.5 shrink-0">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MINIMAL MODERN SHOP CARDS */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                Verified Local Shops ({shops.filter(s => s.status === 'approved').length})
              </h2>
              <span className="text-[11px] text-emerald-700 font-medium">Tap to view shop products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shops.filter(s => s.status === 'approved').map(shop => (
                <div
                  key={shop.id}
                  onClick={() => handleOpenShop(shop.id)}
                  className="bg-white rounded-2xl p-3.5 border border-gray-200/80 hover:border-emerald-300 shadow-xs hover:shadow-sm transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={shop.photos[0]}
                      alt={shop.name}
                      className="w-13 h-13 rounded-xl object-cover border border-gray-100 shrink-0 group-hover:scale-105 transition"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-gray-900 truncate">
                          {lang === 'ur' && shop.nameUrdu ? shop.nameUrdu : shop.name}
                        </h3>
                        {shop.verified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {shop.address}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                        <span className="text-amber-600 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {shop.rating}
                        </span>
                        <span>•</span>
                        <span>{products.filter(p => p.shopId === shop.id).length} items</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL MARKET LISTINGS (SORTED BY LOWEST PRICE DEFAULT) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
              <span>{t.allProducts}</span>
              <span className="text-xs text-gray-400 font-normal">({filteredProducts.length})</span>
            </h2>
            <span className="text-[11px] text-gray-400">
              {t.sortByPrice}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredProducts.map(product => {
              const shop = approvedShopsMap[product.shopId] || {};
              const isFav = favorites.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="bg-white rounded-3xl p-3.5 border border-gray-200/80 hover:border-emerald-300 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top Condition Badges */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          product.condition === 'New' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {product.condition}
                        </span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                          {product.ptaStatus}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className="p-1 text-gray-400 hover:text-rose-500 transition"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Image & Title */}
                    <div className="flex gap-3 mb-3">
                      <img
                        src={product.photos[0]}
                        alt={product.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-105 transition"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {product.storage !== 'N/A' && `${product.storage} • `}{product.color}
                        </p>
                        <div className="mt-1.5 text-base font-extrabold text-[#064E3B]">
                          PKR {product.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shop Footer with One-Click Call / WhatsApp */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenShop(shop.id);
                      }}
                      className="min-w-0 pr-2 hover:opacity-80 transition"
                    >
                      <div className="text-xs font-bold text-gray-800 truncate flex items-center gap-1">
                        {shop.name}
                        {shop.verified && <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-400 truncate">{shop.address}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleCallShop(shop, product)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                        title="Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleWhatsAppShop(shop, product)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-gray-100 flex items-center justify-between z-10">
              <span className="text-xs font-bold text-[#064E3B] bg-emerald-50 px-2 py-0.5 rounded-md">
                {selectedProduct.brand}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReportModal({
                    type: 'product',
                    id: selectedProduct.id,
                    title: selectedProduct.name
                  })}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-full hover:bg-gray-100 transition"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 aspect-video relative">
                <img
                  src={selectedProduct.photos[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                    {selectedProduct.condition}
                  </span>
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                    {selectedProduct.ptaStatus}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <div className="mt-2 text-2xl font-black text-[#064E3B]">
                  PKR {selectedProduct.price.toLocaleString()}
                </div>
              </div>

              {/* Specs */}
              <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 block">Storage</span>
                  <span className="font-semibold text-gray-800">{selectedProduct.storage}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Warranty</span>
                  <span className="font-semibold text-gray-800">{selectedProduct.warranty}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Color</span>
                  <span className="font-semibold text-gray-800">{selectedProduct.color}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Stock</span>
                  <span className="font-semibold text-emerald-700">{selectedProduct.stockStatus}</span>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                  {selectedProduct.description}
                </div>
              )}

              {/* Shop card inside detail */}
              {approvedShopsMap[selectedProduct.shopId] && (
                <div 
                  onClick={() => {
                    handleOpenShop(selectedProduct.shopId);
                    setSelectedProduct(null);
                  }}
                  className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/60 transition"
                >
                  <div>
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                      {approvedShopsMap[selectedProduct.shopId].name}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {approvedShopsMap[selectedProduct.shopId].address}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-800" />
                </div>
              )}
            </div>

            {/* Bottom Contact */}
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex items-center gap-2.5">
              {approvedShopsMap[selectedProduct.shopId] && (
                <>
                  <button
                    onClick={() => handleCallShop(approvedShopsMap[selectedProduct.shopId], selectedProduct)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Store</span>
                  </button>
                  <button
                    onClick={() => handleWhatsAppShop(approvedShopsMap[selectedProduct.shopId], selectedProduct)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900">Report Listing / Store</h3>
              <button onClick={() => setShowReportModal(null)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <textarea
                rows={3}
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe reason (e.g. price fraud, incorrect status, suspect)..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
              >
                Submit Report
              </button>
              {reportSuccess && (
                <p className="text-xs text-emerald-600 text-center font-semibold">Report logged!</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
