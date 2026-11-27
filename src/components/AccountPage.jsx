import { useState } from 'react';
import {
  ShoppingBag, Heart as HeartIcon, MapPin, Ticket, Users, HelpCircle,
  Info, ChevronRight, LogOut, Bell, Shield, Star, Store, User,
  ArrowRight, ShieldCheck, Phone, CheckCircle, ExternalLink, Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PERKS = [
  { icon: Ticket, label: 'Vouchers', sub: 'Your discount coupons' },
  { icon: Users, label: 'Invite Friends', sub: 'Earn when they join' },
  { icon: HelpCircle, label: 'Help Center', sub: '24/7 Bahawalnagar support' },
  { icon: Bell, label: 'Notifications', sub: 'Manage alerts & inquiries' },
  { icon: Shield, label: 'Privacy & Security', sub: 'Account & verification safety' },
  { icon: Info, label: 'About & Terms', sub: 'Marketplace policies & guidelines' },
];

export default function AccountPage({ 
  role: propRole, 
  onLogout, 
  onOpenAdmin,
  onOpenAuth,
  onOpenShopRegistration,
  onOpenShop,
  onOpenOrders,
  onOpenAddresses,
  onOpenShopDashboard,
  onNavigateTab
}) {
  const { currentUser, role, logoutUser, shops, orders = [], addresses = [] } = useApp();
  const effectiveRole = role || propRole || 'customer';
  const isLoggedIn = Boolean(currentUser && currentUser.name);

  // If user has a shop, find shop data
  const userShop = currentUser?.shopId 
    ? shops.find(s => s.id === currentUser.shopId)
    : null;

  const initials = isLoggedIn 
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'G';

  const displayName = isLoggedIn ? currentUser.name : 'Guest Shopper';
  const displayPhone = isLoggedIn ? currentUser.phone : 'Not signed in';

  const roleLabel = effectiveRole === 'shopkeeper' 
    ? 'Verified Shopkeeper' 
    : effectiveRole === 'admin' 
    ? 'Administrator' 
    : 'Local Customer';

  const handleLogoutClick = () => {
    if (logoutUser) logoutUser();
    if (onLogout) onLogout();
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
      {/* ── Solid Brand Header (No gradients) ── */}
      <div className="px-4 pt-6 pb-10 text-white" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-xl font-black">My Account</h2>
        <p className="text-white/80 text-xs mt-0.5">Bahawal Market · Bahawalnagar</p>
      </div>

      {/* ── Profile Card (overlapping header) ── */}
      <div className="mx-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#8586f2] flex items-center justify-center shadow-xs flex-shrink-0 text-white">
              {isLoggedIn ? (
                <span className="text-lg font-black">{initials}</span>
              ) : (
                <User size={26} strokeWidth={2.2} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-black truncate">{displayName}</h3>
              <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                {displayPhone}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full inline-block bg-gray-100 text-[#8586f2]">
                  {roleLabel}
                </span>
                {effectiveRole === 'shopkeeper' && (
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={11} />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Profile CTA */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogoutClick}
                className="text-xs font-bold text-gray-500 hover:text-black border border-gray-200 px-3 py-1.5 rounded-full flex-shrink-0 transition-colors"
              >
                Log Out
              </button>
            ) : (
              <button 
                onClick={() => onOpenAuth && onOpenAuth('signin')}
                className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex-shrink-0 shadow-xs transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {!isLoggedIn && (
            <div className="mt-3.5 pt-3 border-t border-gray-100">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signin')}
                className="w-full py-2.5 bg-[#8586f2] hover:bg-[#7375e8] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-xs"
              >
                <span>Sign In with Phone & OTP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center justify-between gap-1 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-black">5.0</span>
                <span className="text-[11px] text-black/40 ml-0.5">Marketplace Rating</span>
              </div>
              <span className="text-[11px] text-gray-400">Bahawalnagar Member</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Shopkeeper Dashboard Banner (If role === 'shopkeeper') ── */}
      {effectiveRole === 'shopkeeper' && (
        <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8586f2] bg-[#8586f2]/10 px-2 py-0.5 rounded-md inline-block mb-1">
                My Storefront
              </span>
              <h4 className="text-sm font-black text-black">
                {userShop?.name || currentUser?.shopName || 'Registered Mobile Shop'}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {userShop?.address || 'Bahawalnagar Market'}
              </p>
            </div>

            <button
              onClick={() => onOpenShop && onOpenShop(currentUser?.shopId || 'shop-1')}
              className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xs active:scale-95 transition-transform flex-shrink-0"
            >
              <span>Visit Shop</span>
              <ExternalLink size={12} />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 text-center">
            <div className="bg-gray-50/70 p-2 rounded-xl">
              <p className="text-xs font-black text-black">{userShop?.viewsCount || 142}</p>
              <p className="text-[10px] text-gray-400">Shop Views</p>
            </div>
            <div className="bg-gray-50/70 p-2 rounded-xl">
              <p className="text-xs font-black text-emerald-600">{userShop?.whatsappClicks || 28}</p>
              <p className="text-[10px] text-gray-400">WhatsApp Inquiries</p>
            </div>
            <div className="bg-gray-50/70 p-2 rounded-xl">
              <p className="text-xs font-black text-[#8586f2]">Active</p>
              <p className="text-[10px] text-gray-400">Live Status</p>
            </div>
          </div>

          <button
            onClick={() => onOpenShopDashboard && onOpenShopDashboard()}
            className="mt-3 w-full py-2.5 bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform shadow-xs"
          >
            <Store size={14} />
            <span>Open Merchant Dashboard (Products & Orders)</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ── "Become a Seller / Register Your Shop" Banner (When not a shopkeeper) ── */}
      {effectiveRole !== 'shopkeeper' && (
        <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8586f2]/15 text-[#8586f2] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Store size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8586f2] bg-[#8586f2]/10 px-2 py-0.5 rounded-md inline-block mb-1">
                Sell on Bahawal Market
              </span>
              <h4 className="text-sm font-black text-black">
                Own a mobile shop in Bahawalnagar?
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Register your shop in 2 minutes. Receive direct customer orders on WhatsApp with 0% sales commission.
              </p>

              <button
                onClick={() => {
                  if (onOpenShopRegistration) onOpenShopRegistration();
                }}
                className="mt-3 w-full py-2.5 bg-[#8586f2] hover:bg-[#7375e8] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform shadow-xs"
              >
                <Store size={14} />
                <span>Register Your Shop Now</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Action Buttons Grid (Clean flat neutral styling) ── */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
        <button 
          onClick={() => onOpenOrders && onOpenOrders()}
          className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform relative shadow-xs group"
        >
          {orders && orders.length > 0 && (
            <span className="absolute top-2 right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-[#8586f2] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {orders.length}
            </span>
          )}
          <div className="w-10 h-10 bg-[#8586f2]/10 group-hover:bg-[#8586f2]/20 rounded-xl flex items-center justify-center text-[#8586f2] transition-colors">
            <ShoppingBag size={18} />
          </div>
          <span className="text-xs font-bold text-black/80">Orders</span>
        </button>

        <button 
          onClick={() => onNavigateTab && onNavigateTab('favorites')}
          className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform relative shadow-xs"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black/80">
            <HeartIcon size={18} />
          </div>
          <span className="text-xs font-bold text-black/80">Favourites</span>
        </button>

        <button 
          onClick={() => onOpenAddresses && onOpenAddresses()}
          className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform relative shadow-xs group"
        >
          {addresses && addresses.length > 0 && (
            <span className="absolute top-2 right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {addresses.length}
            </span>
          )}
          <div className="w-10 h-10 bg-[#8586f2]/10 group-hover:bg-[#8586f2]/20 rounded-xl flex items-center justify-center text-[#8586f2] transition-colors">
            <MapPin size={18} />
          </div>
          <span className="text-xs font-bold text-black/80">Addresses</span>
        </button>
      </div>

      {/* ── Perks & Settings ── */}
      <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        {PERKS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors text-left ${
                i < PERKS.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-black/70">
                <Icon size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black">{item.label}</p>
                <p className="text-xs text-black/40">{item.sub}</p>
              </div>
              <ChevronRight size={15} className="text-black/30 flex-shrink-0" />
            </button>
          );
        })}
      </div>

      {/* ── Admin / Store Management Visual Editor Link ── */}
      <div className="mx-4 mt-3">
        <button
          onClick={onOpenAdmin}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:text-black active:scale-[0.99] transition-all shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Settings size={16} className="text-[#8586f2]" />
            <span>Admin & Visual Content Editor</span>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
      </div>

      {/* ── Logout Button (when logged in) ── */}
      {isLoggedIn && (
        <div className="mx-4 mt-3">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gray-100 text-black/70 font-bold text-sm active:scale-[0.98] transition-all"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
}
