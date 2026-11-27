import { useState } from 'react';
import { X, MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Store, Check, ArrowLeft, Phone, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BAH_AREAS = [
  'Main Bazar / Rail Bazar',
  'Baldia Road Mobile Market',
  'Model Town / Minchinabad Road',
  'Circular Road',
  'City Center Shopping Mall',
  'Haroonabad Road',
  'Jail Road / Qasim Market',
  'Madina Colony',
  'Satellite Town',
  'Other Bahawalnagar Location',
];

const TAG_ICONS = {
  Home: Home,
  Work: Briefcase,
  Shop: Store,
  Other: MapPin,
};

export default function AddressesModal({ isOpen, onClose, onSelectAddress }) {
  const { addresses = [], addAddress, deleteAddress, setDefaultAddress, currentUser } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [tag, setTag] = useState('Home');
  const [recipientName, setRecipientName] = useState(() => currentUser?.name || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [area, setArea] = useState(BAH_AREAS[0]);
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(addresses.length === 0);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setErrorMsg('Please enter recipient name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMsg('Please enter house/street and colony details');
      return;
    }

    setErrorMsg('');

    addAddress({
      title: tag,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      address: streetAddress.trim(),
      area,
      city: 'Bahawalnagar',
      landmark: landmark.trim(),
      isDefault,
    });

    // Reset form
    setShowAddForm(false);
    setStreetAddress('');
    setLandmark('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[400px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[88vh] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Solid Brand Purple Header ── */}
        <div 
          className="relative px-5 pt-4 pb-4 text-white flex-shrink-0 flex items-center justify-between"
          style={{ background: '#8586f2' }}
        >
          <div className="flex items-center gap-2">
            {showAddForm ? (
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
                title="Back to list"
              >
                <ArrowLeft size={16} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
            )}
            <div>
              <h2 className="text-base font-black text-white leading-tight">
                {showAddForm ? 'Add New Address' : 'Saved Addresses'}
              </h2>
              <p className="text-white/80 text-[11px] font-medium">
                Bahawalnagar · Delivery Locations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white transition-colors"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-4 overflow-y-auto flex-1 hide-scrollbar bg-[#f8f9fc] space-y-3">
          {showAddForm ? (
            /* ── Add Address Form ── */
            <form onSubmit={handleSave} className="space-y-3">
              {/* Tag Selector */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Address Type
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Home', 'Shop', 'Work', 'Other'].map(t => {
                    const Icon = TAG_ICONS[t] || MapPin;
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTag(t)}
                        className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                          tag === t
                            ? 'border-[#8586f2] bg-[#8586f2]/10 text-[#8586f2]'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={14} />
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => { setRecipientName(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. Muhammad Tariq"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">
                  Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrorMsg(''); }}
                  placeholder="e.g. 0300 1234567"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] transition-colors"
                />
              </div>

              {/* Area Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">
                  Area / Mohalla in Bahawalnagar
                </label>
                <select
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black focus:outline-none focus:border-[#8586f2] transition-colors"
                >
                  {BAH_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Street Address */}
              <div>
                <label className="text-[11px] font-bold text-black block mb-1">
                  Street / House Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={streetAddress}
                  onChange={e => { setStreetAddress(e.target.value); setErrorMsg(''); }}
                  placeholder="House #, Street #, Mohalla / Colony details"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] transition-colors resize-none"
                />
              </div>

              {/* Nearest Landmark */}
              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                  Nearest Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="e.g. Near Shell Pump / Beside Jamia Masjid"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] transition-colors"
                />
              </div>

              {/* Default Address Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={e => setIsDefault(e.target.checked)}
                  className="rounded text-[#8586f2] focus:ring-[#8586f2]"
                />
                <span className="text-xs font-semibold text-black">
                  Set as default delivery address
                </span>
              </label>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-xl text-xs font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#8586f2] hover:bg-[#7375e8] active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-transform mt-2"
              >
                <Check size={15} />
                <span>Save Address</span>
              </button>
            </form>
          ) : (
            /* ── Addresses List ── */
            <div className="space-y-3">
              {addresses.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-black">No Saved Addresses</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Add your home or shop location for 1-tap checkout.
                  </p>
                </div>
              ) : (
                addresses.map(addr => {
                  const Icon = TAG_ICONS[addr.title] || MapPin;
                  return (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-2xl border p-3.5 shadow-xs transition-all relative ${
                        addr.isDefault ? 'border-[#8586f2] ring-1 ring-[#8586f2]/20' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#8586f2]/10 text-[#8586f2] flex items-center justify-center flex-shrink-0">
                            <Icon size={13} />
                          </span>
                          <span className="text-xs font-black text-black">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-[#8586f2]/15 text-[#8586f2] px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-500 p-1 active:scale-90 transition-transform"
                          title="Delete address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="mt-2 text-xs space-y-0.5">
                        <p className="font-bold text-black">{addr.recipientName} · {addr.phone}</p>
                        <p className="text-gray-600 leading-snug">{addr.address}</p>
                        <p className="text-gray-400 text-[11px]">{addr.area}, {addr.city}</p>
                        {addr.landmark && (
                          <p className="text-gray-500 text-[10.5px]">📍 Near: {addr.landmark}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-gray-100">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-[#8586f2] hover:underline"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            Primary Delivery Address
                          </span>
                        )}

                        {onSelectAddress && (
                          <button
                            onClick={() => {
                              onSelectAddress(addr);
                              onClose();
                            }}
                            className="bg-[#8586f2] hover:bg-[#7375e8] text-white text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                          >
                            Deliver Here
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-3 bg-white border border-dashed border-[#8586f2] text-[#8586f2] hover:bg-[#8586f2]/5 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs"
              >
                <Plus size={16} />
                <span>Add New Address</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
