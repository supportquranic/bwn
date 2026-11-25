import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Store, 
  Smartphone, 
  AlertTriangle, 
  Search, 
  Check, 
  X, 
  UserX, 
  Trash2, 
  FileSearch, 
  Building2, 
  Calendar,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  Ban
} from 'lucide-react';

export const AdminView = () => {
  const { 
    t, 
    lang, 
    shops, 
    shopPrivate, 
    products, 
    productPrivate, 
    reports, 
    approveShop, 
    rejectShop, 
    toggleVerifiedBadge, 
    suspendShop, 
    deleteProduct, 
    resolveReport 
  } = useApp();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'imei' | 'listings' | 'reports' | 'shops'
  const [imeiSearchQuery, setImeiSearchQuery] = useState('');
  const [imeiSearchResult, setImeiSearchResult] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectShopId, setSelectedRejectShopId] = useState(null);

  // Pending shops
  const pendingShops = shops.filter(s => s.status === 'pending');

  // IMEI Lookup function
  const handleImeiSearch = (e) => {
    e.preventDefault();
    if (!imeiSearchQuery.trim()) return;

    const query = imeiSearchQuery.trim();
    // Search private IMEI records
    const matchedRecord = Object.values(productPrivate).find(
      rec => rec.imei && rec.imei.toLowerCase() === query.toLowerCase()
    );

    if (matchedRecord) {
      const product = products.find(p => p.id === matchedRecord.productId);
      const shop = shops.find(s => s.id === matchedRecord.shopId);
      const privateShopData = shopPrivate[matchedRecord.shopId];

      setImeiSearchResult({
        found: true,
        record: matchedRecord,
        product,
        shop,
        privateShopData,
      });
    } else {
      setImeiSearchResult({ found: false });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      {/* Top Banner */}
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
          Super Admin Console
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
          {t.adminDashboard}
        </h1>
        <p className="text-xs text-gray-500">
          Bahawalnagar Police & Marketplace Regulatory Oversight
        </p>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Total Shops</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{shops.length}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
            {pendingShops.length} Pending Approval
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Live Products</div>
          <div className="text-2xl font-black text-[#006A4E] mt-1">{products.length}</div>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5">
            Across Bahawalnagar
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Reported Issues</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{reports.length}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
            {reports.filter(r => r.status === 'pending').length} Open in Queue
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Private IMEI Logs</div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {Object.keys(productPrivate).length}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">
            Police Audit Ready
          </div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-[#006A4E] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals ({pendingShops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('imei')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'imei'
              ? 'bg-[#006A4E] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>IMEI Audit Search</span>
        </button>

        <button
          onClick={() => setActiveTab('shops')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'shops'
              ? 'bg-[#006A4E] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>All Shops ({shops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-[#006A4E] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>All Listings ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-[#006A4E] text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Reports Queue ({reports.filter(r => r.status === 'pending').length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVALS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingShops.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-gray-800 text-sm">All caught up!</h3>
              <p className="text-xs text-gray-400 mt-1">No shops currently pending verification.</p>
            </div>
          ) : (
            pendingShops.map(shop => {
              const privateData = shopPrivate[shop.id] || {};
              return (
                <div key={shop.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={shop.photos[0]}
                        alt={shop.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base">{shop.name}</h3>
                        <p className="text-xs text-gray-500">{shop.address}</p>
                        <p className="text-xs text-gray-400">Owner: <span className="font-bold text-gray-700">{shop.ownerName}</span> ({shop.phone})</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveShop(shop.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t.approve}</span>
                      </button>
                      <button
                        onClick={() => setSelectedRejectShopId(shop.id)}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition"
                      >
                        <X className="w-4 h-4" />
                        <span>{t.reject}</span>
                      </button>
                    </div>
                  </div>

                  {/* Private Verification Documents Box */}
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 mb-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Admin-Only Verification Documents</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                      <div>
                        CNIC Number: <span className="font-mono font-bold text-gray-900">{privateData.ownerCnic || 'Not provided'}</span>
                      </div>
                      <div>
                        Merchant Terms Accepted: <span className="font-semibold text-emerald-700">{privateData.termsAcceptedAt ? new Date(privateData.termsAcceptedAt).toLocaleString() : 'Yes'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reject Prompt Modal inline */}
                  {selectedRejectShopId === shop.id && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <label className="block text-xs font-bold text-rose-900 mb-1">Reason for rejection:</label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Incomplete CNIC photo, invalid shop address..."
                        className="w-full text-xs p-2 rounded-lg border border-rose-300 focus:outline-none mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            rejectShop(shop.id, rejectReason || 'Documents verification failed');
                            setSelectedRejectShopId(null);
                            setRejectReason('');
                          }}
                          className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => setSelectedRejectShopId(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: IMEI AUDIT LOOKUP (ANTI-THEFT LAW ENFORCEMENT) */}
      {activeTab === 'imei' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-purple-900">
            <Lock className="w-5 h-5 text-purple-700" />
            <h2 className="text-base sm:text-lg font-black">{t.imeiTracker}</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Search any phone's 15-digit IMEI to immediately identify which Bahawalnagar retailer accepted it, who listed it, and the legal declaration timestamp.
          </p>

          <form onSubmit={handleImeiSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              value={imeiSearchQuery}
              onChange={(e) => setImeiSearchQuery(e.target.value)}
              placeholder={t.searchImeiPlaceholder}
              className="flex-1 text-xs sm:text-sm font-mono p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <Search className="w-4 h-4" />
              <span>Search IMEI</span>
            </button>
          </form>

          {/* Quick Demo Prompts */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 flex-wrap">
            <span>Try demo IMEIs:</span>
            <button
              onClick={() => { setImeiSearchQuery('354892110984521'); }}
              className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 hover:underline"
            >
              354892110984521
            </button>
            <button
              onClick={() => { setImeiSearchQuery('357891223409182'); }}
              className="font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 hover:underline"
            >
              357891223409182
            </button>
          </div>

          {/* Search Result */}
          {imeiSearchResult && (
            <div className={`p-4 rounded-2xl border ${
              imeiSearchResult.found ? 'bg-emerald-50/60 border-emerald-300' : 'bg-rose-50 border-rose-300'
            }`}>
              {imeiSearchResult.found ? (
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>{t.imeiFound}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-gray-400 block mb-1">Listed Product</span>
                      <span className="font-bold text-gray-900 text-sm block">
                        {imeiSearchResult.product?.name}
                      </span>
                      <span className="text-gray-500">
                        Price: PKR {imeiSearchResult.product?.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-gray-400 block mb-1">Retailer / Shop Details</span>
                      <span className="font-bold text-gray-900 text-sm block">
                        {imeiSearchResult.shop?.name}
                      </span>
                      <span className="text-gray-600 block">
                        Owner: {imeiSearchResult.shop?.ownerName} ({imeiSearchResult.shop?.phone})
                      </span>
                      <span className="text-gray-500 block">
                        Address: {imeiSearchResult.shop?.address}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-gray-400 block mb-1">Owner CNIC (Government Record)</span>
                      <span className="font-mono font-bold text-gray-900 block">
                        {imeiSearchResult.privateShopData?.ownerCnic || '31102-1234567-1'}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-100">
                      <span className="text-gray-400 block mb-1">Legal Declaration Timestamp</span>
                      <span className="font-medium text-emerald-800 block">
                        {new Date(imeiSearchResult.record.sellerAgreementTimestamp).toUTCString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t.noImeiFound}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL SHOPS & VERIFIED BADGES */}
      {activeTab === 'shops' && (
        <div className="space-y-3">
          {shops.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img src={shop.photos[0]} alt={shop.name} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-sm">{shop.name}</h3>
                    {shop.verified && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Badge
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      shop.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {shop.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{shop.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Verified Badge Toggle */}
                <button
                  onClick={() => toggleVerifiedBadge(shop.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                    shop.verified 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{shop.verified ? 'Remove Badge' : 'Grant Verified Badge'}</span>
                </button>

                {/* Suspend / Ban */}
                <button
                  onClick={() => suspendShop(shop.id)}
                  className={`p-2 rounded-xl transition ${
                    shop.status === 'suspended' 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                  title="Suspend / Unsuspend Shop"
                >
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: LISTINGS MODERATION */}
      {activeTab === 'listings' && (
        <div className="space-y-3">
          {products.map(p => {
            const shop = shops.find(s => s.id === p.shopId);
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.photos[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900">{p.name}</h4>
                    <p className="text-[11px] text-gray-400">
                      Shop: <span className="text-gray-700 font-semibold">{shop?.name}</span> • PKR {p.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Remove listing "${p.name}"?`)) {
                      deleteProduct(p.id);
                    }
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Remove Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 5: REPORTS QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center text-xs text-gray-500">
              No citizen reports filed.
            </div>
          ) : (
            reports.map(rep => (
              <div key={rep.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                      Report on {rep.targetType}
                    </span>
                    <span className="font-bold text-xs text-gray-900">{rep.targetTitle}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-gray-700 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900">Report Reason: </span>
                  {rep.reason}
                </p>

                {rep.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolveReport(rep.id, 'resolved')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      Resolve & Freeze Target
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'dismissed')}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition"
                    >
                      Dismiss Report
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
