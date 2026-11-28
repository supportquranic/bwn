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

  // WhatsApp-style In-App Chat & Admin Broadcast Channel
  const [chats, setChats] = useState(() => {
    try {
      const saved = localStorage.getItem('bm_chats');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'broadcast-admin',
          type: 'broadcast',
          isChannel: true,
          name: '📢 Bahawal Market Official Broadcast',
          shopName: 'Official Admin Broadcast',
          avatar: '/brands logos/apple.png',
          verified: true,
          pinned: true,
          unreadCount: 1,
          messages: [
            {
              id: 'bmsg-1',
              sender: 'admin',
              senderName: 'Muzammil (Market Admin)',
              text: 'Assalam-o-Alaikum shopkeepers and buyers! Welcome to Bahawal Market. Please verify PTA status and authentic condition scores for all listed phones.',
              timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
            },
            {
              id: 'bmsg-2',
              sender: 'admin',
              senderName: 'Muzammil (Market Admin)',
              text: '📢 Live Update: Free home delivery promo code "BWN150" is active across all shops in Bahawalnagar city.',
              timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            }
          ],
        },
        {
          id: 'chat-shop-1',
          type: 'direct',
          shopId: 'shop-1',
          name: 'Al-Madina Mobile Zone',
          avatar: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=150&q=80',
          phone: '0300 1234567',
          whatsapp: '923001234567',
          verified: true,
          unreadCount: 1,
          messages: [
            {
              id: 'm-1',
              sender: 'user',
              senderName: 'You',
              text: 'Salam bhai, iPhone 15 Pro Max available hai?',
              timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
            },
            {
              id: 'm-2',
              sender: 'shop',
              senderName: 'Al-Madina Mobile Zone',
              text: 'Walaikum Assalam! Ji bhai 100% genuine box pack sealed available hai. Counter pickup par special market discount bhi milega.',
              timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
            }
          ],
        },
        {
          id: 'chat-shop-2',
          type: 'direct',
          shopId: 'shop-2',
          name: 'Suleman Mobile Hub',
          avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80',
          phone: '0301 2345678',
          whatsapp: '923012345678',
          verified: true,
          unreadCount: 0,
          messages: [
            {
              id: 'm-3',
              sender: 'shop',
              senderName: 'Suleman Mobile Hub',
              text: 'Salam! S25 Ultra stock available ho gaya hai. Whenever you are free visit us at Minchinabad Road.',
              timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            }
          ],
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    localStorage.setItem('bm_chats', JSON.stringify(chats));
  }, [chats]);

  const markChatAsRead = (chatId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  };

  const sendMessage = (chatId, text, attachedProduct = null) => {
    if (!text.trim() && !attachedProduct) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: currentUser?.name || 'You',
      text: text.trim(),
      attachedProduct,
      timestamp: new Date().toISOString(),
    };

    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      return {
        ...c,
        messages: [...c.messages, userMsg],
        lastActivity: new Date().toISOString(),
      };
    }));

    // If direct chat with shopkeeper, simulate realistic shopkeeper instant reply
    const targetChat = chats.find(c => c.id === chatId);
    if (targetChat && targetChat.type === 'direct') {
      setTimeout(() => {
        const shopReply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'shop',
          senderName: targetChat.name,
          text: attachedProduct
            ? `Walaikum Assalam! Ji bhai, *${attachedProduct.name}* stock mein available hai. Aap cash on delivery mangwana chahte hain ya counter pickup?`
            : 'Salam brother! Message received. Yes, we are open right now in Bahawalnagar. How can I assist you further?',
          timestamp: new Date().toISOString(),
        };

        setChats(currentChats => currentChats.map(c => {
          if (c.id !== chatId) return c;
          return {
            ...c,
            unreadCount: activeChatId === chatId ? 0 : (c.unreadCount || 0) + 1,
            messages: [...c.messages, shopReply],
            lastActivity: new Date().toISOString(),
          };
        }));
      }, 1400);
    }
  };

  const broadcastAdminMessage = (text) => {
    if (!text.trim()) return;

    const adminMsg = {
      id: `bcast-${Date.now()}`,
      sender: 'admin',
      senderName: currentUser?.name || 'Muzammil (Market Admin)',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setChats(prev => prev.map(c => {
      if (c.id !== 'broadcast-admin') return c;
      return {
        ...c,
        unreadCount: (c.unreadCount || 0) + 1,
        messages: [...c.messages, adminMsg],
        lastActivity: new Date().toISOString(),
      };
    }));
  };

  const startChatWithShop = (shopId, product = null) => {
    const existing = chats.find(c => c.shopId === shopId);
    if (existing) {
      if (product) {
        sendMessage(existing.id, `Salam! I am inquiring about *${product.name}* (Rs. ${product.price?.toLocaleString('en-PK')}). Is it currently available?`, product);
      }
      markChatAsRead(existing.id);
      setActiveChatId(existing.id);
      return existing.id;
    }

    const shopInfo = INITIAL_SHOPS.find(s => s.id === shopId) || {
      id: shopId,
      name: 'Bahawal Retailer',
      logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=150&q=80',
      whatsapp: '923001234567',
      phone: '0300 1234567',
    };

    const newChatId = `chat-${shopId}-${Date.now()}`;
    const initialMessages = [];
    if (product) {
      initialMessages.push({
        id: `msg-${Date.now()}`,
        sender: 'user',
        senderName: currentUser?.name || 'You',
        text: `Salam! I am inquiring about *${product.name}* (Rs. ${product.price?.toLocaleString('en-PK')}). Is it currently in stock?`,
        attachedProduct: product,
        timestamp: new Date().toISOString(),
      });
    }

    const newChat = {
      id: newChatId,
      type: 'direct',
      shopId,
      name: shopInfo.name,
      avatar: shopInfo.logo,
      phone: shopInfo.phone,
      whatsapp: shopInfo.whatsapp,
      verified: true,
      unreadCount: 0,
      messages: initialMessages,
      lastActivity: new Date().toISOString(),
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChatId);

    // Auto shop reply
    if (product) {
      setTimeout(() => {
        const reply = {
          id: `msg-${Date.now() + 2}`,
          sender: 'shop',
          senderName: shopInfo.name,
          text: `Walaikum Assalam! Yes brother, *${product.name}* is available in our shop. You can order here or visit our counter.`,
          timestamp: new Date().toISOString(),
        };
        setChats(cList => cList.map(c => c.id === newChatId ? { ...c, messages: [...c.messages, reply] } : c));
      }, 1500);
    }

    return newChatId;
  };

  const unreadChatsCount = chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

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

  const addReview = (param1, param2, param3) => {
    let reviewObj = {};
    if (typeof param1 === 'object' && param1 !== null) {
      reviewObj = { ...param1 };
    } else {
      reviewObj = {
        shopId: param1,
        rating: param2,
        comment: param3,
      };
    }

    const targetShopId = reviewObj.shopId;
    const targetProductId = reviewObj.productId;

    const newRev = {
      id: `rev-${Date.now()}`,
      shopId: targetShopId || null,
      productId: targetProductId || null,
      userId: currentUser?.id || `guest-${Date.now()}`,
      userName: reviewObj.userName || currentUser?.name || 'Local Customer',
      city: reviewObj.city || 'Bahawalnagar',
      rating: Number(reviewObj.rating) || 5,
      comment: reviewObj.comment || '',
      tags: reviewObj.tags || [],
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate shop rating if review was for a shop
    if (targetShopId) {
      const shopReviews = [newRev, ...reviews.filter(r => r.shopId === targetShopId)];
      const avg = shopReviews.reduce((acc, curr) => acc + curr.rating, 0) / shopReviews.length;
      setShops(prev => prev.map(s => s.id === targetShopId ? { ...s, rating: Number(avg.toFixed(1)), ratingCount: shopReviews.length } : s));
    }
    return newRev;
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
        resolveReport,
        chats,
        setChats,
        activeChatId,
        setActiveChatId,
        sendMessage,
        broadcastAdminMessage,
        startChatWithShop,
        markChatAsRead,
        unreadChatsCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
