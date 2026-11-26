import { useState } from 'react';
import {
  ShoppingBag, Heart as HeartIcon, MapPin, Ticket, Users, HelpCircle,
  Info, ChevronRight, LogOut, Bell, Shield, Star
} from 'lucide-react';

const PERKS = [
  { icon: Ticket, label: 'Vouchers', sub: 'Your discount coupons' },
  { icon: Users, label: 'Invite Friends', sub: 'Earn when they join' },
  { icon: HelpCircle, label: 'Help Center', sub: '24/7 support' },
  { icon: Bell, label: 'Notifications', sub: 'Manage alerts' },
  { icon: Shield, label: 'Privacy & Security', sub: 'Account safety settings' },
  { icon: Info, label: 'About & Terms', sub: 'Policies & app info' },
];

export default function AccountPage({ role, onLogout, onOpenAdmin }) {
  const initials = role === 'shopkeeper' ? 'SK' : role === 'admin' ? 'AD' : 'U';
  const name = role === 'shopkeeper' ? 'Shopkeeper' : role === 'admin' ? 'Admin' : 'Guest User';
  const roleLabel = role === 'shopkeeper' ? 'Shopkeeper' : role === 'admin' ? 'Admin' : 'Buyer';

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-28 bg-[#f8f9fc] smooth-scroll">
      {/* ── Solid Brand Header (No gradients) ── */}
      <div className="px-4 pt-6 pb-10 text-white" style={{ background: '#8586f2' }}>
        <h2 className="text-white text-xl font-black">My Account</h2>
        <p className="text-white/80 text-xs mt-0.5">Bahawalnagar, Pakistan</p>
      </div>

      {/* ── Profile Card (overlapping header) ── */}
      <div className="mx-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#4b47d9] flex items-center justify-center shadow-xs flex-shrink-0">
              <span className="text-white text-xl font-black">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-black">{name}</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 bg-gray-100 text-[#4b47d9]">
                {roleLabel}
              </span>
            </div>
            <button className="text-[#4b47d9] text-xs font-bold border border-gray-200 px-3 py-1.5 rounded-full">
              View Profile
            </button>
          </div>
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-black">4.9</span>
            <span className="text-xs text-black/40 ml-0.5">Member rating</span>
          </div>
        </div>
      </div>

      {/* ── Action Buttons Grid (Clean flat neutral styling, zero colorful icons) ── */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
        {[
          { icon: ShoppingBag, label: 'Orders' },
          { icon: HeartIcon, label: 'Favourites' },
          { icon: MapPin, label: 'Addresses' },
        ].map(({ icon: Icon, label }) => (
          <button key={label} className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-black/80">
              <Icon size={18} />
            </div>
            <span className="text-xs font-bold text-black/80">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Perks & Settings (Flat single-color icons, neutral tones) ── */}
      <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {PERKS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors text-left ${i < PERKS.length - 1 ? 'border-b border-gray-100' : ''}`}
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

      {/* ── Logout Button ── */}
      <div className="mx-4 mt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gray-100 text-black/70 font-bold text-sm active:scale-[0.98] transition-all"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      <div className="h-4" />
    </div>
  );
}
