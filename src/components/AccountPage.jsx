import { useState } from 'react';
import {
  ShoppingBag, Heart as HeartIcon, MapPin, Ticket, Users, HelpCircle,
  Store, Info, ChevronRight, LogOut, User, Bell, Shield, Star, Lock
} from 'lucide-react';

const PERKS = [
  { icon: Ticket, label: 'Vouchers', sub: 'Your discount coupons', color: 'text-purple-500', bg: 'bg-purple-50' },
  { icon: Users, label: 'Invite Friends', sub: 'Earn when they join', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: HelpCircle, label: 'Help Center', sub: '24/7 support', color: 'text-sky-500', bg: 'bg-sky-50' },
  { icon: Store, label: 'Become a Shopkeeper', sub: 'List your shop for free', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Bell, label: 'Notifications', sub: 'Manage alerts', color: 'text-amber-500', bg: 'bg-amber-50' },
  { icon: Shield, label: 'Privacy & Security', sub: 'Account safety settings', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { icon: Info, label: 'About & Terms', sub: 'Policies & app info', color: 'text-gray-500', bg: 'bg-gray-100' },
];

export default function AccountPage({ role, onLogout, onOpenAdmin }) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const initials = role === 'shopkeeper' ? 'SK' : role === 'admin' ? 'AD' : 'U';
  const name = role === 'shopkeeper' ? 'Shopkeeper' : role === 'admin' ? 'Admin' : 'Guest User';
  const roleLabel = role === 'shopkeeper' ? 'Shopkeeper' : role === 'admin' ? 'Admin' : 'Buyer';

  const handleAdminClick = () => {
    const isAuthed = sessionStorage.getItem('bm_admin_authed') === 'true';
    if (isAuthed) {
      onOpenAdmin();
    } else {
      setPinInput('');
      setPinError('');
      setShowPinModal(true);
    }
  };

  const handleVerifyPin = (e) => {
    e?.preventDefault();
    const cleanPin = pinInput.trim();
    if (cleanPin === '3344') {
      sessionStorage.setItem('bm_admin_authed', 'true');
      setShowPinModal(false);
      onOpenAdmin();
    } else {
      setPinError('Incorrect password. Please enter 3344.');
    }
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-28 bg-gray-50 smooth-scroll">
      {/* ── Header gradient ── */}
      <div className="gradient-hero px-4 pt-6 pb-10">
        <h2 className="text-white text-xl font-black">My Account</h2>
        <p className="text-blue-200 text-xs mt-0.5">Bahawalnagar, Pakistan</p>
      </div>

      {/* ── Profile Card (overlapping header) ── */}
      <div className="mx-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl card-shadow p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-card flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white text-xl font-black">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-gray-900">{name}</h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                roleLabel === 'Shopkeeper' ? 'bg-green-100 text-green-700'
                : roleLabel === 'Admin' ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
              }`}>
                {roleLabel}
              </span>
            </div>
            <button className="text-blue-600 text-xs font-bold border border-blue-200 px-3 py-1.5 rounded-full">
              View Profile
            </button>
          </div>
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-800">4.9</span>
            <span className="text-xs text-gray-400 ml-0.5">Member rating</span>
          </div>
        </div>
      </div>

      {/* ── Admin Visual Studio (Protected Access) ── */}
      <div className="mx-4 mt-3">
        <div 
          onClick={handleAdminClick}
          className="bg-gradient-to-r from-[#1e1b4b] to-[#312e81] rounded-2xl p-4 text-white cursor-pointer active:scale-[0.98] transition-transform shadow-md border border-indigo-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Lock size={18} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Admin Visual Studio</h3>
                <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-full">PRIVATE</span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">Live UI clone & pixel-accurate image editor</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-indigo-300" />
        </div>
      </div>

      {/* ── Partner Banner ── */}
      <div className="mx-4 mt-3">
        <div className="rounded-2xl gradient-card p-4 flex items-center gap-3 overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-white font-black text-sm leading-snug">Become a Partner<br />& Sell Your Devices!</p>
            <button className="mt-2 bg-white text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">Join Now →</button>
          </div>
          <div className="ml-auto text-5xl opacity-30 select-none">🏪</div>
        </div>
      </div>

      {/* ── Action Buttons Grid ── */}
      <div className="mx-4 mt-3 grid grid-cols-3 gap-2.5">
        {[
          { icon: ShoppingBag, label: 'Orders', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: HeartIcon, label: 'Favourites', color: 'text-red-500', bg: 'bg-red-50' },
          { icon: MapPin, label: 'Addresses', color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ icon: Icon, label, color, bg }) => (
          <button key={label} className="bg-white rounded-2xl card-shadow p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <span className="text-xs font-bold text-gray-700">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Perks & Settings ── */}
      <div className="mx-4 mt-3 bg-white rounded-2xl card-shadow overflow-hidden">
        {PERKS.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50 transition-colors text-left ${i < PERKS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={17} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <ChevronRight size={15} className="text-gray-300 flex-shrink-0" />
            </button>
          );
        })}
      </div>

      {/* ── Logout Button ── */}
      <div className="mx-4 mt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gray-100 text-gray-600 font-bold text-sm active:scale-[0.98] transition-all"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      <div className="h-4" />

      {/* ── Admin Passcode Modal ── */}
      {showPinModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPinModal(false)}
        >
          <div 
            className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-[#4b47d9]">
              <Lock size={22} />
            </div>
            <div>
              <h3 className="text-base font-black text-black">Admin Access</h3>
              <p className="text-xs text-black/50 mt-1">Enter your admin passcode to open the visual image studio</p>
            </div>

            <form onSubmit={handleVerifyPin} className="flex flex-col gap-3">
              <input
                type="password"
                autoFocus
                placeholder="Enter Passcode (e.g. 7860)"
                value={pinInput}
                onChange={e => { setPinInput(e.target.value); setPinError(''); }}
                className="w-full text-center text-sm font-bold tracking-widest bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4b47d9]"
              />
              {pinError && <p className="text-[11px] text-red-500 font-bold">{pinError}</p>}
              
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-black text-xs font-bold active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#4b47d9] text-white text-xs font-bold active:scale-95 shadow"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
