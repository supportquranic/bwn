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

  // Customer Orders with persistent storage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_orders');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'BWN-4821',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'Confirmed',
          items: [
            {
              id: 'p-1',
              name: 'iPhone 15 Pro Max (256GB)',
              price: 335000,
              quantity: 1,
              image: '/product images/iphone 15 pro.png',
              shopName: 'Al-Madina Mobile Zone',
            }
          ],
          totalAmount: 335150,
          fulfillmentMethod: 'delivery',
          customerName: 'Muhammad Tariq',
          customerPhone: '0300 1234567',
          deliveryAddress: 'Model Town, Street #4, Bahawalnagar',
          shopName: 'Al-Madina Mobile Zone',
          shopWhatsApp: '923001234567',
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bm_orders', JSON.stringify(orders));
  }, [orders]);

  // Saved Customer Delivery Addresses with persistent storage
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_addresses');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'addr-1',
          title: 'Home',
          recipientName: 'Muhammad Tariq',
          phone: '0300 1234567',
          address: 'House # 12, Street 4, Model Town',
          area: 'Model Town / Minchinabad Road',
          city: 'Bahawalnagar',
          landmark: 'Near Shell Pump',
          isDefault: true,
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('bm_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (addr) => {
    const newAddr = {
      ...addr,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0 || addr.isDefault,
    };
    if (newAddr.isDefault) {
      setAddresses(prev => [newAddr, ...prev.map(a => ({ ...a, isDefault: false }))]);
    } else {
      setAddresses(prev => [newAddr, ...prev]);
    }
  };

  const updateAddress = (id, updated) => {
    setAddresses(prev => prev.map(a => {
      if (a.id !== id) {
        return updated.isDefault ? { ...a, isDefault: false } : a;
      }
      return { ...a, ...updated };
    }));
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const setDefaultAddress = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Current Logged in User simulation
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bm_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bm_current_user');
    }
  }, [currentUser]);

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
    const newShopId = shopData.id || `shop-${Date.now()}`;
    const newShop = {
      status: 'approved',
      verified: true,
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      callClicks: 0,
      whatsappClicks: 0,
      categories: ['Mobiles', 'Accessories'],
      featuredQuote: 'Verified retailer in Bahawalnagar',
      ...shopData,
      id: newShopId,
      ownerId: currentUser?.id || `user-${Date.now()}`,
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

    const updatedUser = {
      ...(currentUser || {
        id: `user-${Date.now()}`,
        name: shopData.ownerName || 'Shop Owner',
        phone: shopData.whatsapp || shopData.phone || '+92 300 1234567',
      }),
      role: 'shopkeeper',
      shopId: newShopId,
      shopName: newShop.name,
    };
    setCurrentUser(updatedUser);
    setRole('shopkeeper');
    localStorage.setItem('bm_current_user', JSON.stringify(updatedUser));
    localStorage.setItem('bm_role', 'shopkeeper');
    return newShopId;
  };

  const loginUser = (userData) => {
    setCurrentUser(userData);
    setRole(userData.role || 'customer');
    localStorage.setItem('bm_current_user', JSON.stringify(userData));
    localStorage.setItem('bm_role', userData.role || 'customer');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setRole('customer');
    localStorage.removeItem('bm_current_user');
    localStorage.setItem('bm_role', 'customer');
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

  const addOrder = (orderData) => {
    const orderId = orderData.id || `BWN-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: orderData.status || 'Pending Confirmation',
    };
    setOrders(prev => [fullOrder, ...prev]);
    return fullOrder;
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
        orders,
        setOrders,
        addOrder,
        updateOrderStatus,
        addresses,
        setAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        currentUser,
        setCurrentUser,
        toggleFavorite,
        recordInteraction,
        recordProductView,
        addProduct,
        updateProductStock,
        deleteProduct,
        loginUser,
        logoutUser,
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
