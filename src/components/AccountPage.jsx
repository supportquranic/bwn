import {
  ShoppingBag, Heart as HeartIcon, MapPin, Ticket, Users, HelpCircle,
  Store, Info, ChevronRight, LogOut, User, Bell, Shield, Star
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

export default function AccountPage({ role, onLogout }) {
  const initials = role === 'shopkeeper' ? 'SK' : role === 'admin' ? 'AD' : 'U';
  const name = role === 'shopkeeper' ? 'Shopkeeper' : role === 'admin' ? 'Admin' : 'Guest User';
  const roleLabel = role === 'shopkeeper' ? 'Shopkeeper' : role === 'admin' ? 'Admin' : 'Buyer';

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-28 bg-gray-50">
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
    </div>
  );
}
