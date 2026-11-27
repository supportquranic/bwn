import { Store, ShieldCheck, Truck, Phone, MessageSquare, Heart, MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigateTab, onCategorySelect }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 mx-4 mb-6 bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
      {/* ── Brand Top Banner ── */}
      <div className="p-5 text-white" style={{ background: '#8586f2' }}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm shadow-xs">
            BM
          </div>
          <div>
            <h3 className="text-base font-black text-white leading-tight">
              Bahawal Market
            </h3>
            <p className="text-white/80 text-[11px] font-medium">
              بہاول مارکیٹ · Bahawalnagar, Pakistan
            </p>
          </div>
        </div>
        <p className="text-xs text-white/90 leading-relaxed mt-1">
          Bahawalnagar’s trusted marketplace connecting local buyers directly with verified mobile phone shops, repair centers, and genuine accessories retailers.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <ShieldCheck size={16} className="mx-auto mb-1 text-white" />
            <span className="text-[10px] font-bold block text-white">Verified Shops</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <Truck size={16} className="mx-auto mb-1 text-white" />
            <span className="text-[10px] font-bold block text-white">COD Delivery</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <Store size={16} className="mx-auto mb-1 text-white" />
            <span className="text-[10px] font-bold block text-white">0% Commission</span>
          </div>
        </div>
      </div>

      {/* ── Middle Sections ── */}
      <div className="p-5 bg-white space-y-4 text-xs">
        {/* Market Hubs */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Local Markets in Bahawalnagar
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Main Bazar',
              'Rail Bazar',
              'Baldia Road Mobile Market',
              'Model Town',
              'Circular Road',
              'City Center Mall',
              'Haroonabad Road',
            ].map(market => (
              <span
                key={market}
                className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-lg"
              >
                📍 {market}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Explore Marketplace
          </h4>
          <div className="grid grid-cols-2 gap-2 text-gray-700 font-semibold text-xs">
            <button
              onClick={() => onNavigateTab && onNavigateTab('shops')}
              className="text-left hover:text-[#8586f2] transition-colors py-1 flex items-center gap-1.5"
            >
              <span>🏪 All Mobile Shops</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('accessories')}
              className="text-left hover:text-[#8586f2] transition-colors py-1 flex items-center gap-1.5"
            >
              <span>🎧 Mobile Accessories</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('search')}
              className="text-left hover:text-[#8586f2] transition-colors py-1 flex items-center gap-1.5"
            >
              <span>🔍 Search Devices</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('account')}
              className="text-left hover:text-[#8586f2] transition-colors py-1 flex items-center gap-1.5"
            >
              <span>👤 Seller & Buyer Account</span>
            </button>
          </div>
        </div>

        {/* Support & Contact */}
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Helpline & Inquiries
          </h4>
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200/80">
            <div>
              <p className="text-xs font-bold text-black">Customer & Shop Support</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Bahawalnagar Desk · 10 AM - 10 PM</p>
            </div>
            <a
              href="https://wa.me/923121234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#25D366] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-[#20bd5a] active:scale-95 transition-all"
            >
              <MessageSquare size={13} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright ── */}
      <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 text-center text-[11px] text-gray-400">
        <p className="font-semibold text-gray-600">
          © {currentYear} Bahawal Market (بہاول مارکیٹ)
        </p>
        <p className="mt-0.5 text-[10px] text-gray-400">
          Designed with ❤️ for the people & shopkeepers of Bahawalnagar
        </p>
      </div>
    </footer>
  );
}
