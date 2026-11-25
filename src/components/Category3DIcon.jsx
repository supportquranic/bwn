import React from 'react';

/**
 * Minimalist 2-Color Soft 3D Category Icon Component
 * Designed with soft ambient light, rounded claymorphic geometry and dual-tone gradients.
 */
export const Category3DIcon = ({ type = 'phone', isSelected = false, className = 'w-12 h-12' }) => {
  // Dual-tone color palettes: primary gradient + shadow tones
  const configs = {
    sparkles: {
      from: '#10B981',
      to: '#059669',
      accent: '#6EE7B7',
      shadow: 'rgba(16, 185, 129, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" fill="#FFFFFF" />
          <path d="M24 22L25.2 25.8L29 27L25.2 28.2L24 32L22.8 28.2L19 27L22.8 25.8L24 22Z" fill="#D1FAE5" opacity="0.9" />
        </svg>
      )
    },
    phone: {
      from: '#3B82F6',
      to: '#1D4ED8',
      accent: '#93C5FD',
      shadow: 'rgba(59, 130, 246, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          {/* 3D phone body with bevel */}
          <rect x="9" y="4" width="14" height="24" rx="4" fill="#FFFFFF" />
          <rect x="11" y="7" width="10" height="15" rx="1.5" fill="#DBEAFE" />
          <circle cx="16" cy="25" r="1.2" fill="#93C5FD" />
          <rect x="14" y="5.5" width="4" height="1" rx="0.5" fill="#BFDBFE" />
        </svg>
      )
    },
    accessories: {
      from: '#8B5CF6',
      to: '#6D28D9',
      accent: '#C4B5FD',
      shadow: 'rgba(139, 92, 246, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          {/* Smartwatch / gadget 3D icon */}
          <rect x="11" y="2" width="10" height="6" rx="2" fill="#DDD6FE" />
          <rect x="11" y="24" width="10" height="6" rx="2" fill="#DDD6FE" />
          <rect x="8" y="7" width="16" height="18" rx="5" fill="#FFFFFF" />
          <rect x="10.5" y="9.5" width="11" height="13" rx="3" fill="#EDE9FE" />
          <circle cx="16" cy="16" r="3" fill="#8B5CF6" />
        </svg>
      )
    },
    charger: {
      from: '#F59E0B',
      to: '#D97706',
      accent: '#FDE68A',
      shadow: 'rgba(245, 158, 11, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          {/* 3D power adapter & lightning */}
          <rect x="8" y="10" width="16" height="16" rx="4" fill="#FFFFFF" />
          <rect x="11" y="4" width="3" height="7" rx="1.5" fill="#FEF3C7" />
          <rect x="18" y="4" width="3" height="7" rx="1.5" fill="#FEF3C7" />
          <path d="M17 14L13 19H17L15 24L20 18H16L17 14Z" fill="#F59E0B" />
        </svg>
      )
    },
    cover: {
      from: '#F43F5E',
      to: '#BE123C',
      accent: '#FECDD3',
      shadow: 'rgba(244, 63, 94, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          {/* 3D protective shield / case */}
          <path d="M16 4L7 8V16C7 22.5 11 26.5 16 28C21 26.5 25 22.5 25 16V8L16 4Z" fill="#FFFFFF" />
          <path d="M16 7L9 10V15.5C9 20.5 12 23.8 16 25C20 23.8 23 20.5 23 15.5V10L16 7Z" fill="#FFE4E6" />
          <circle cx="16" cy="16" r="3" fill="#F43F5E" />
        </svg>
      )
    },
    audio: {
      from: '#059669',
      to: '#047857',
      accent: '#A7F3D0',
      shadow: 'rgba(5, 150, 105, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          {/* 3D modern wireless earbud/headphone */}
          <path d="M7 16C7 11.03 11.03 7 16 7C20.97 7 25 11.03 25 16V22C25 23.66 23.66 25 22 25H21V18H24V16C24 11.58 20.42 8 16 8C11.58 8 8 11.58 8 16V18H11V25H10C8.34 25 7 23.66 7 22V16Z" fill="#FFFFFF" />
          <rect x="8" y="17" width="4" height="7" rx="2" fill="#D1FAE5" />
          <rect x="20" y="17" width="4" height="7" rx="2" fill="#D1FAE5" />
        </svg>
      )
    },
    repair: {
      from: '#475569',
      to: '#1E293B',
      accent: '#94A3B8',
      shadow: 'rgba(71, 85, 105, 0.35)',
      svg: (
        <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6 drop-shadow-sm">
          {/* 3D repair wrench & screwdrivers */}
          <path d="M24.7 10.3C25.5 8.9 25.1 7.1 23.7 6.3C22.3 5.5 20.5 5.9 19.7 7.3L16 13L19 16L24.7 10.3Z" fill="#F1F5F9" />
          <rect x="7" y="19" width="13" height="4" rx="2" transform="rotate(-45 7 19)" fill="#FFFFFF" />
          <circle cx="8" cy="24" r="2.5" fill="#CBD5E1" />
        </svg>
      )
    }
  };

  const item = configs[type] || configs.phone;

  return (
    <div
      className={`relative rounded-2xl flex items-center justify-center transition-all duration-300 icon-3d ${className} ${
        isSelected ? 'scale-105 ring-2 ring-emerald-500 ring-offset-2' : ''
      }`}
      style={{
        background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)`,
        boxShadow: `0 8px 16px -4px ${item.shadow}, inset 0 1px 2px rgba(255, 255, 255, 0.45)`,
      }}
    >
      {/* Top subtle highlight reflection */}
      <div className="absolute top-1 inset-x-2 h-2 rounded-full bg-white/20 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-center">
        {item.svg}
      </div>
    </div>
  );
};
