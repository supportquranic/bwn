import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SHOPS,
  INITIAL_SHOP_PRIVATE,
  INITIAL_PRODUCTS,
  INITIAL_PRODUCT_PRIVATE,
  INITIAL_REVIEWS,
  INITIAL_REPORTS
} from '../data/mockData';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Language & Role
  const [lang, setLang] = useState(() => localStorage.getItem('bm_lang') || 'en');
  const [role, setRole] = useState(() => localStorage.getItem('bm_role') || 'customer'); // 'customer' | 'shopkeeper' | 'admin'
  const [navTab, setNavTab] = useState('explore'); // 'explore' | 'shops' | 'sell' | 'favorites' | 'role'
  const [activeShopId, setActiveShopId] = useState(null); // When opened into full shop view
  const [deviceFrame, setDeviceFrame] = useState(false); // Mobile frame simulation toggle

  // Core Data — always seeded with canonical data
  const [shops, setShops] = useState(INITIAL_SHOPS);
  const [shopPrivate, setShopPrivate] = useState(INITIAL_SHOP_PRIVATE);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [productPrivate, setProductPrivate] = useState(INITIAL_PRODUCT_PRIVATE);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current Logged in User simulation
  const [currentUser, setCurrentUser] = useState({
    id: 'user-tariq-1',
    name: 'Muhammad Tariq',
    phone: '+92 300 1234567',
    role: 'shopkeeper',
    shopId: 'shop-1',
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('bm_lang', lang);
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('bm_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('bm_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('bm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bm_product_private', JSON.stringify(productPrivate));
  }, [productPrivate]);

  useEffect(() => {
    localStorage.setItem('bm_shop_private', JSON.stringify(shopPrivate));
  }, [shopPrivate]);

  useEffect(() => {
    localStorage.setItem('bm_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('bm_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('bm_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const t = translations[lang] || translations.en;

  // Actions
  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Live Tracking System
  const recordInteraction = (shopId, type) => {
    // type: 'call' | 'whatsapp' | 'view'
    setShops(prev => prev.map(s => {
      if (s.id !== shopId) return s;
      if (type === 'call') return { ...s, callClicks: (s.callClicks || 0) + 1 };
      if (type === 'whatsapp') return { ...s, whatsappClicks: (s.whatsappClicks || 0) + 1 };
      if (type === 'view') return { ...s, viewsCount: (s.viewsCount || 0) + 1 };
      return s;
    }));
  };

  const recordProductView = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return { ...p, viewsCount: (p.viewsCount || 0) + 1 };
    }));
  };

  const addProduct = (productData, imei) => {
    const newId = `prod-${Date.now()}`;
    const newProduct = {
      ...productData,
      id: newId,
      shopId: currentUser.shopId || 'shop-1',
      isFeatured: false,
      isUnique: false,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      searchKeywords: [
        productData.name.toLowerCase(),
        productData.brand.toLowerCase(),
        productData.model.toLowerCase(),
        productData.storage?.toLowerCase(),
        productData.condition?.toLowerCase()
      ]
    };

    setProducts(prev => [newProduct, ...prev]);

    // Mandatory IMEI stored securely in private table
    if (imei) {
      setProductPrivate(prev => ({
        ...prev,
        [newId]: {
          productId: newId,
          imei: imei.trim(),
          shopId: newProduct.shopId,
          sellerAgreementTimestamp: new Date().toISOString(),
          listedByOwner: currentUser.name,
        }
      }));
    }
  };

  const updateProductStock = (productId, newStatus) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockStatus: newStatus } : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const registerShop = (shopData, cnic) => {
    const newShopId = `shop-${Date.now()}`;
    const newShop = {
      ...shopData,
      id: newShopId,
      ownerId: currentUser.id,
      status: 'pending',
      verified: false,
      rating: 5.0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      callClicks: 0,
      whatsappClicks: 0,
      categories: ['Mobiles', 'Accessories'],
      featuredQuote: 'New retailer in Bahawalnagar',
    };

    setShops(prev => [newShop, ...prev]);
    setShopPrivate(prev => ({
      ...prev,
      [newShopId]: {
        shopId: newShopId,
        ownerCnic: cnic,
        cnicImageUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=500&q=80',
        termsAcceptedAt: new Date().toISOString(),
      }
    }));
    setCurrentUser(prev => ({ ...prev, shopId: newShopId }));
  };

  const approveShop = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status: 'approved' } : s));
  };

  const rejectShop = (shopId, reason) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status: 'rejected', rejectReason: reason } : s));
  };

  const toggleVerifiedBadge = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, verified: !s.verified } : s));
  };

  const suspendShop = (shopId) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, status: s.status === 'suspended' ? 'approved' : 'suspended' } : s));
  };

  const addReview = (shopId, rating, comment) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      shopId,
      userId: currentUser.id,
      userName: currentUser.name || 'Local Customer',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);

    const shopReviews = [newRev, ...reviews.filter(r => r.shopId === shopId)];
    const avg = shopReviews.reduce((acc, curr) => acc + curr.rating, 0) / shopReviews.length;
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, rating: Number(avg.toFixed(1)), ratingCount: shopReviews.length } : s));
  };

  const addReport = (targetType, targetId, targetTitle, reason) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
  };

  const resolveReport = (reportId, action) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        role,
        setRole,
        navTab,
        setNavTab,
        activeShopId,
        setActiveShopId,
        deviceFrame,
        setDeviceFrame,
        t,
        shops,
        shopPrivate,
        products,
        productPrivate,
        reviews,
        reports,
        favorites,
        currentUser,
        setCurrentUser,
        toggleFavorite,
        recordInteraction,
        recordProductView,
        addProduct,
        updateProductStock,
        deleteProduct,
        registerShop,
        approveShop,
        rejectShop,
        toggleVerifiedBadge,
        suspendShop,
        addReview,
        addReport,
        resolveReport
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
