import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Send, 
  Phone, 
  CheckCheck, 
  Megaphone, 
  ShieldCheck, 
  Bell, 
  Tag, 
  Sparkles, 
  X,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_SHOPS } from '../data/mockData';

const fmt = n => 'Rs. ' + (Number(n) || 0).toLocaleString('en-PK');

/* ── Authentic Official WhatsApp Brand Logo Component ── */
function WhatsAppIcon({ size = 18, className = "" }) {
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

const QUICK_PROMPTS = [
  'Is this available in stock?',
  'What is the final cash price in BWN?',
  'Can I inspect before payment?',
  'What are your shop timings today?',
];

const SHOP_STORIES = [
  { id: 'shop-1', name: 'Al-Madina', avatar: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=150&q=80', active: true, tag: 'New Stock' },
  { id: 'shop-2', name: 'Suleman Hub', avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80', active: true, tag: 'S25 Arrival' },
  { id: 'shop-4', name: 'Pak World', avatar: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=150&q=80', active: true, tag: 'Discounts' },
  { id: 'shop-3', name: 'Al-Rehman', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80', active: false, tag: 'Cases' },
  { id: 'admin', name: 'BWN Official', avatar: '/brands logos/apple.png', active: true, isChannel: true, tag: 'Broadcast' },
];

const SPECIAL_OFFERS = [
  {
    id: 'off-1',
    shopId: 'shop-1',
    shopName: 'Al-Madina Mobile Zone',
    title: 'iPhone 15 Pro Max Special Cash Discount',
    description: 'Get flat Rs. 5,000 cash discount on counter pickup with free 9D glass protector installed.',
    discount: 'Rs. 5,000 OFF',
    validTill: 'Valid this week in BWN',
    badge: 'Hot Deal',
    image: '/product images/iphone 15 pro.png',
  },
  {
    id: 'off-2',
    shopId: 'shop-2',
    shopName: 'Suleman Mobile Hub',
    title: 'Samsung Galaxy S25 Ultra Bundle',
    description: 'Pre-order or counter pickup bundle: Free fast charger and transparent shockproof case.',
    discount: 'Free Accessories',
    validTill: 'Limited stock',
    badge: 'Bundle Offer',
    image: '/product images/s25 ultra.png',
  },
  {
    id: 'off-3',
    shopId: 'shop-4',
    shopName: 'Pak Mobile World',
    title: 'Flash Sale: All Original Silicone Cases',
    description: 'Buy any 2 phone cases or glass protectors and get 25% off instantly.',
    discount: '25% OFF',
    validTill: 'Today Only',
    badge: 'Accessories Sale',
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=400&q=80',
  },
];

export default function ChatsPage({ onProduct, onShop }) {
  const { 
    chats = [], 
    activeChatId, 
    setActiveChatId, 
    sendMessage, 
    broadcastAdminMessage, 
    startChatWithShop,
    markChatAsRead,
    currentUser,
    role
  } = useApp();

  const [segmentTab, setSegmentTab] = useState('chats'); // 'chats' | 'offers' | 'broadcast'
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [adminBroadcastText, setAdminBroadcastText] = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      markChatAsRead(activeChat.id);
    }
  }, [activeChat?.messages?.length, activeChatId]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeChatId) return;
    sendMessage(activeChatId, inputText.trim());
    setInputText('');
  };

  const handleBroadcast = (e) => {
    e?.preventDefault();
    if (!adminBroadcastText.trim()) return;
    broadcastAdminMessage(adminBroadcastText.trim());
    setAdminBroadcastText('');
  };

  const filteredChats = chats.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || 
      c.messages?.some(m => m.text?.toLowerCase().includes(q));
  });

  const broadcastChannel = chats.find(c => c.isChannel);
  const directChats = filteredChats.filter(c => !c.isChannel);

  /* ─────────────────────────────────────────────────────────────
     VIEW 1: INSIDE A CONVERSATION THREAD
  ───────────────────────────────────────────────────────────── */
  if (activeChat) {
    const isChannel = activeChat.isChannel;

    return (
      <div className="h-full flex flex-col overflow-hidden bg-[#f8f9fc] relative">
        {/* Chat Header */}
        <div className="px-4 pt-4 pb-3.5 bg-white border-b border-gray-100 flex-shrink-0 z-30 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setActiveChatId(null)}
              className="w-8.5 h-8.5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
              aria-label="Back to chat list"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-50 flex items-center justify-center">
              {isChannel ? (
                <div className="w-full h-full bg-[#8586f2] flex items-center justify-center text-white font-black text-sm">
                  📢
                </div>
              ) : (
                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-cover" />
              )}
              {!isChannel && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-gray-900 truncate max-w-[190px]">
                  {activeChat.name}
                </h3>
                {activeChat.verified && (
                  <ShieldCheck size={14} className="text-[#8586f2] flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                {isChannel ? 'Official Market Broadcast Channel' : 'Online · Bahawalnagar'}
              </p>
            </div>
          </div>

          {/* Quick External Actions (WhatsApp & Call) */}
          {!isChannel && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeChat.whatsapp && (
                <a
                  href={`https://wa.me/${activeChat.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8.5 h-8.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center active:scale-95 transition-transform"
                  title="Open in WhatsApp"
                >
                  <WhatsAppIcon size={17} />
                </a>
              )}
              {activeChat.phone && (
                <a
                  href={`tel:${activeChat.phone}`}
                  className="w-8.5 h-8.5 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center active:scale-95 transition-transform"
                  title="Call Shop"
                >
                  <Phone size={15} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3 pb-28 smooth-scroll">
          {/* Channel Banner notice */}
          {isChannel && (
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border border-[#8586f2]/20 rounded-2xl p-3.5 text-center shadow-2xs">
              <span className="text-xs font-black text-[#8586f2] flex items-center justify-center gap-1.5">
                <Megaphone size={14} />
                <span>Bahawal Market Official Channel</span>
              </span>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Direct broadcast from market administration to all shops and customers in Bahawalnagar.
              </p>
            </div>
          )}

          {/* Message Bubbles */}
          {activeChat.messages?.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isAdmin = msg.sender === 'admin';

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble Card */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs relative ${
                    isUser
                      ? 'bg-[#8586f2] text-white rounded-br-xs'
                      : isAdmin
                      ? 'bg-white border border-[#8586f2]/30 text-gray-900 rounded-bl-xs'
                      : 'bg-white text-gray-900 rounded-bl-xs border border-gray-200'
                  }`}
                >
                  {/* Sender Name if not user */}
                  {!isUser && (
                    <span className={`text-[10px] font-bold block mb-1 ${isAdmin ? 'text-[#8586f2]' : 'text-gray-500'}`}>
                      {msg.senderName || (isAdmin ? 'Market Admin' : activeChat.name)}
                    </span>
                  )}

                  {/* Attached Product Card (if inquiry started from a device) */}
                  {msg.attachedProduct && (
                    <div 
                      onClick={() => onProduct && onProduct(msg.attachedProduct.id)}
                      className={`mb-2.5 p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-transform active:scale-98 ${
                        isUser 
                          ? 'bg-white/15 border-white/25 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center p-1 flex-shrink-0">
                        <img 
                          src={msg.attachedProduct.image} 
                          alt={msg.attachedProduct.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate">{msg.attachedProduct.name}</p>
                        <p className="text-[10.5px] font-semibold opacity-85 mt-0.5">{fmt(msg.attachedProduct.price)}</p>
                      </div>
                    </div>
                  )}

                  {/* Message Body */}
                  <p className="text-xs leading-relaxed font-normal whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>

                  {/* Timestamp & Status */}
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[9.5px] ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
                    <span>
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isUser && <CheckCheck size={13} className="text-white" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar (Only for 1-on-1 Shop chats) */}
        {!isChannel && (
          <div className="absolute bottom-[68px] inset-x-0 px-3 flex gap-1.5 overflow-x-auto hide-scrollbar z-20 pointer-events-auto">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(activeChat.id, prompt)}
                className="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-2xs text-[11px] font-semibold text-gray-700 hover:text-[#8586f2] hover:border-[#8586f2]/40 transition-colors whitespace-nowrap active:scale-95 flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-200 p-2.5 z-30 pb-safe">
          {isChannel ? (
            /* Admin Broadcast Console (Broadcast to all shops) */
            <form onSubmit={handleBroadcast} className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold px-1">
                <span className="flex items-center gap-1 text-[#8586f2]">
                  <Megaphone size={12} />
                  <span>Admin Broadcast Console</span>
                </span>
                <span className="text-gray-400">Broadcasts to all shops & buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={adminBroadcastText}
                  onChange={e => setAdminBroadcastText(e.target.value)}
                  placeholder="Type an announcement to broadcast to all shops in BWN..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!adminBroadcastText.trim()}
                  className="px-4 py-2.5 rounded-full bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold disabled:opacity-40 active:scale-95 transition-transform flex items-center gap-1.5 shadow-xs"
                >
                  <span>Broadcast</span>
                  <Send size={12} />
                </button>
              </div>
            </form>
          ) : (
            /* Standard User / Shop Input */
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message to shopkeeper..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-[#8586f2] hover:bg-[#7375e8] text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform shadow-xs flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     VIEW 2: CHATS MAIN LIST (Matches Exact Reference Image)
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* ── Top Header matching Reference Image ── */}
      <div className="px-5 pt-6 pb-2 bg-white flex-shrink-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User Avatar with Welcome back */}
          <div className="w-11 h-11 rounded-full bg-[#8586f2]/15 border-2 border-[#8586f2]/30 flex items-center justify-center text-[#8586f2] font-black text-sm flex-shrink-0 overflow-hidden">
            <span className="text-base">👤</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block tracking-tight leading-none mb-0.5">
              Welcome back
            </span>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-snug">
              Your Chats
            </h1>
          </div>
        </div>

        {/* Minimal Bell Notification Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 active:scale-95 transition-transform relative"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={2} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#8586f2]" />
        </button>
      </div>

      {/* ── Modern Pill Search Inset Bar matching Image ── */}
      <div className="px-5 pt-2 pb-3 bg-white flex-shrink-0">
        <div className="w-full bg-gray-50/90 border border-gray-200/90 rounded-full px-4 py-2.5 flex items-center gap-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-transparent text-xs font-medium text-black placeholder:text-gray-400 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-0.5 text-gray-400 hover:text-black">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── 3 Options Segmented Switch: 1. Chats | 2. Offers | 3. Broadcast ── */}
      <div className="px-5 pb-3 bg-white flex-shrink-0">
        <div className="w-full bg-gray-100 p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setSegmentTab('chats')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              segmentTab === 'chats'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <span>Chats</span>
            <span
              className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                segmentTab === 'chats' ? 'bg-[#8586f2] text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {directChats.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSegmentTab('offers')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              segmentTab === 'offers'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Flame size={12} className={segmentTab === 'offers' ? 'text-amber-500 fill-amber-500' : 'text-gray-400'} />
            <span>Offers</span>
            <span
              className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                segmentTab === 'offers' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {SPECIAL_OFFERS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSegmentTab('broadcast')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              segmentTab === 'broadcast'
                ? 'bg-white text-black shadow-xs font-black'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <Megaphone size={12} className={segmentTab === 'broadcast' ? 'text-[#8586f2]' : 'text-gray-400'} />
            <span>Broadcast</span>
            {broadcastChannel?.unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#8586f2]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Scrollable Body with Stories and Content ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32 smooth-scroll">
        {/* Stories / Active Shops Row (Matching Reference Image) */}
        {segmentTab === 'chats' && (
          <div className="px-5 pt-1 pb-4">
            <h3 className="text-xs font-black text-gray-900 mb-2.5">Stories</h3>
            <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1">
              {SHOP_STORIES.map(story => (
                <div
                  key={story.id}
                  onClick={() => {
                    if (story.isChannel) {
                      setActiveChatId('broadcast-admin');
                    } else {
                      startChatWithShop(story.id);
                    }
                  }}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  {/* Avatar with Gradient Purple Ring */}
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#8586f2] via-purple-400 to-indigo-500 shadow-2xs">
                    <div className="w-13 h-13 rounded-full bg-white p-0.5 overflow-hidden">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    {story.active && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 mt-1 truncate max-w-[62px] text-center">
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 1: CHATS LIST (Matching exact reference image layout) ── */}
        {segmentTab === 'chats' && (
          <div className="px-5 divide-y divide-gray-100">
            {directChats.length > 0 ? (
              directChats.map(chat => {
                const lastMsg = chat.messages[chat.messages.length - 1];
                const hasUnread = (chat.unreadCount || 0) > 0;

                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setActiveChatId(chat.id);
                      markChatAsRead(chat.id);
                    }}
                    className="py-3.5 flex items-center gap-3.5 cursor-pointer active:bg-gray-50 transition-colors"
                  >
                    {/* Circular Avatar with Online Dot */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    {/* Chat Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-gray-900 truncate">{chat.name}</h4>
                        {lastMsg && (
                          <span className="text-[10.5px] text-gray-400 font-medium flex-shrink-0 ml-1">
                            {new Date(lastMsg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-[11px] truncate leading-snug pr-2 ${hasUnread ? 'text-black font-bold' : 'text-gray-500'}`}>
                          {lastMsg ? lastMsg.text : 'Tap to start conversation'}
                        </p>
                        {hasUnread && (
                          <span className="w-4.5 h-4.5 rounded-full bg-[#8586f2] text-white text-[9.5px] font-black flex items-center justify-center flex-shrink-0">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
                  <MessageCircle size={22} />
                </div>
                <p className="text-xs font-bold text-gray-700">No chats started yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Tap any shop from Stories above or browse products to chat with retailers.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: OFFERS (Shopkeeper Deals & Special Discounts) ── */}
        {segmentTab === 'offers' && (
          <div className="px-5 space-y-3 pt-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-black text-gray-900">Current Market Offers</h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Bahawalnagar Only</span>
            </div>

            {SPECIAL_OFFERS.map(offer => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-full inline-block mb-1.5">
                      🔥 {offer.badge}
                    </span>
                    <h4 className="text-xs font-black text-gray-900 leading-snug">{offer.title}</h4>
                    <p className="text-[10.5px] text-gray-500 font-medium mt-0.5">{offer.shopName}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex items-center justify-center flex-shrink-0">
                    <img src={offer.image} alt={offer.title} className="max-h-full max-w-full object-contain" />
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {offer.description}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-[#8586f2] block">{offer.discount}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{offer.validTill}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      startChatWithShop(offer.shopId);
                    }}
                    className="py-1.5 px-3.5 rounded-full bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold active:scale-95 transition-transform flex items-center gap-1 shadow-xs"
                  >
                    <span>Claim via Chat</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: BROADCAST (Admin to All Shopkeepers Channel) ── */}
        {segmentTab === 'broadcast' && (
          <div className="px-5 space-y-3 pt-1">
            {/* Channel Card Header */}
            <div 
              onClick={() => {
                setActiveChatId('broadcast-admin');
                markChatAsRead('broadcast-admin');
              }}
              className="bg-gradient-to-r from-purple-50 via-[#8586f2]/10 to-white rounded-2xl border border-[#8586f2]/20 p-4 shadow-xs cursor-pointer active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#8586f2] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Megaphone size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-gray-900 truncate">Official Admin Channel</h4>
                    <span className="text-[9.5px] font-bold bg-[#8586f2] text-white px-1.5 py-0.2 rounded-full">PINNED</span>
                  </div>
                  <p className="text-[10.5px] text-gray-600 mt-0.5 leading-snug">
                    Broadcast messages from Admin to all shopkeepers and buyers.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#8586f2]/15 flex items-center justify-between text-[11px] font-bold text-[#8586f2]">
                <span>Open Channel Conversation</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Recent Broadcast Announcements List */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-gray-900">Recent Market Announcements</h4>
              {broadcastChannel?.messages?.map(msg => (
                <div key={msg.id} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#8586f2] flex items-center gap-1">
                      <Megaphone size={12} />
                      <span>{msg.senderName || 'Muzammil (Market Admin)'}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.timestamp || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed font-normal">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
