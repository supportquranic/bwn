import React from 'react';
import GlassSurface from './GlassSurface';
import { Compass, Store, Headphones, MessageCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home',        label: 'Explore',      Icon: Compass },
  { id: 'shops',       label: 'Shops',        Icon: Store   },
  { id: 'accessories', label: 'Accessories',  Icon: Headphones },
  { id: 'chats',       label: 'Chats',        Icon: MessageCircle },
  { id: 'account',     label: 'Account',      Icon: User    },
];

const NavbarContent = ({ navTab, favorites = [], unreadChatsCount = 0, handleNavClick }) => (
  <div className="w-full flex items-center justify-around px-2">
    {NAV_ITEMS.map(({ id, label, Icon }) => {
      const active = navTab === id;
      return (
        <button
          key={id}
          onClick={() => handleNavClick(id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all duration-200 relative ${
            active ? 'text-[#8586f2] font-bold' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <div className="relative">
            <Icon
              className={`w-5 h-5 transition-all duration-200 ${active ? 'scale-110 text-[#8586f2]' : 'text-gray-500'}`}
              strokeWidth={active ? 2.2 : 1.8}
            />
            {id === 'chats' && unreadChatsCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 bg-[#8586f2] text-white text-[8.5px] font-black rounded-full flex items-center justify-center border-2 border-white leading-none">
                {unreadChatsCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] transition-all duration-200 ${active ? 'text-[#8586f2] font-bold' : 'text-gray-500 font-medium'}`}>
            {label}
          </span>
          {active && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8586f2]" />
          )}
        </button>
      );
    })}
  </div>
);

/**
 * Navbar1: Frosted Clear Glass
 */
export const Navbar1 = (props) => (
  <GlassSurface
    width="100%"
    height={72}
    borderRadius={36}
    distortionScale={-180}
    displace={3}
    backgroundOpacity={0.18}
  >
    <NavbarContent {...props} />
  </GlassSurface>
);

/**
 * Navbar2: White Background with Inner Glass Shadows & Floating Elevation
 */
export const Navbar2 = (props) => (
  <div
    className="w-full rounded-[36px] overflow-hidden"
    style={{
      boxShadow: '0 12px 36px -6px rgba(0, 0, 0, 0.18), 0 4px 16px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.06)'
    }}
  >
    <GlassSurface
      width="100%"
      height={72}
      borderRadius={36}
      distortionScale={-180}
      displace={3}
      backgroundOpacity={0.18}
      style={{ 
        background: '#ffffff',
        boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.09), inset 0 -3px 8px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      <NavbarContent {...props} />
    </GlassSurface>
  </div>
);
