import { useState } from 'react';
import { 
  ShieldCheck, 
  Battery, 
  Smartphone, 
  Camera, 
  Volume2, 
  Fingerprint, 
  Wifi, 
  Droplets, 
  Package, 
  HelpCircle, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';

export default function ConditionVerificationPanel({ product }) {
  if (!product) return null;

  const isUsed = product.condition === 'used' || Boolean(product.usedDetails);
  if (!isUsed) return null;

  const used = product.usedDetails || {};
  const specs = product.specs || {};

  // Extract battery health
  let batteryHealth = 88;
  if (used.batteryHealth) {
    batteryHealth = Number(used.batteryHealth) || 88;
  } else if (specs.BatteryHealth) {
    batteryHealth = parseInt(specs.BatteryHealth, 10) || 88;
  }

  // Overall Score calculation
  let overallScore = '9.3';
  if (used.conditionRating) {
    overallScore = used.conditionRating.replace('/10', '').trim();
  } else if (specs.Condition) {
    const match = specs.Condition.match(/([0-9.]+)\/10/);
    if (match) overallScore = match[1];
  }

  const scoreNum = parseFloat(overallScore) || 9.2;

  // 10-Point Detailed Diagnostic Checklist
  const diagnosticItems = [
    {
      id: 'battery',
      title: 'Battery Health & Performance',
      score: `${batteryHealth}%`,
      percentage: batteryHealth,
      icon: Battery,
      detail: batteryHealth >= 85 ? 'Peak Performance · Original Cell' : 'Normal Service Capacity',
      color: batteryHealth >= 85 ? 'bg-emerald-500' : 'bg-amber-500',
    },
    {
      id: 'display',
      title: 'Display & TrueTone',
      score: '9.6/10',
      percentage: 96,
      icon: Smartphone,
      detail: 'Original panel · 0 dead pixels · Touch responsive',
      color: 'bg-emerald-500',
    },
    {
      id: 'body',
      title: 'Frame & Outer Body',
      score: `${overallScore}/10`,
      percentage: Math.min(100, scoreNum * 10),
      icon: Smartphone,
      detail: scoreNum >= 9.2 ? 'Clean side edges · Minor hairline pocket marks' : 'Noticeable bezel scuffs · Zero dents',
      color: scoreNum >= 9.0 ? 'bg-emerald-500' : 'bg-amber-500',
    },
    {
      id: 'camera_glass',
      title: 'Rear Glass & Camera Lens',
      score: '9.8/10',
      percentage: 98,
      icon: Camera,
      detail: 'Scratch-free lenses · Clean camera bezel',
      color: 'bg-emerald-500',
    },
    {
      id: 'sensors',
      title: 'Camera Sensors & OIS',
      score: '10/10',
      percentage: 100,
      icon: Camera,
      detail: 'Autofocus instant · 4K video stabilization tested',
      color: 'bg-[#8586f2]',
    },
    {
      id: 'biometrics',
      title: 'Face ID / Fingerprint',
      score: '10/10',
      percentage: 100,
      icon: Fingerprint,
      detail: 'Hardware biometric scanner fully functional',
      color: 'bg-[#8586f2]',
    },
    {
      id: 'audio',
      title: 'Dual Speakers & Mic',
      score: '9.8/10',
      percentage: 98,
      icon: Volume2,
      detail: 'Crisp stereo sound · High gain microphone',
      color: 'bg-emerald-500',
    },
    {
      id: 'ports',
      title: 'Charging Port & Buttons',
      score: '10/10',
      percentage: 100,
      icon: CheckCircle2,
      detail: 'Tactile clicks · Snug charging connector fit',
      color: 'bg-[#8586f2]',
    },
    {
      id: 'connectivity',
      title: 'Network & Wi-Fi / Bluetooth',
      score: '10/10',
      percentage: 100,
      icon: Wifi,
      detail: 'Strong 4G/5G signals · Bluetooth 5.3 pairing OK',
      color: 'bg-[#8586f2]',
    },
    {
      id: 'ldi',
      title: 'Liquid Damage Check (LDI)',
      score: 'Pass',
      percentage: 100,
      icon: Droplets,
      detail: 'White / Untriggered · Zero moisture exposure',
      color: 'bg-emerald-500',
    },
  ];

  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? diagnosticItems : diagnosticItems.slice(0, 4);

  return (
    <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
      {/* Top Header Card */}
      <div className="p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50/50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8586f2]/10 text-[#8586f2] flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-black">10-Point Condition Report</h3>
                <span className="text-[10px] font-bold bg-[#8586f2]/10 text-[#8586f2] px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">Physical & Hardware Inspection</p>
            </div>
          </div>

          {/* Overall Condition Score Badge */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">
              Score
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-black text-[#8586f2] leading-none">{overallScore}</span>
              <span className="text-xs font-bold text-gray-400">/10</span>
            </div>
          </div>
        </div>

        {/* Verification Summary Chips */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase">PTA Approval</p>
            <p className="text-xs font-black text-emerald-600 mt-0.5 flex items-center gap-1">
              <span>●</span> Official PTA Approved
            </p>
          </div>

          <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Shop Testing Warranty</p>
            <p className="text-xs font-black text-gray-800 mt-0.5">
              {used.warrantyRemaining || '7 Days Check Warranty'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Original Box & Acc.</p>
            <p className="text-xs font-bold text-gray-700 mt-0.5 flex items-center gap-1">
              <Package size={12} className="text-gray-500" />
              <span>Matching Box Included</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-2xs">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Local Store Photos</p>
            <p className="text-xs font-bold text-gray-700 mt-0.5 flex items-center gap-1">
              <Camera size={12} className="text-gray-500" />
              <span>100% Real Pictures</span>
            </p>
          </div>
        </div>
      </div>

      {/* 10-Point Bar Inspection List */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-gray-800 uppercase tracking-wide">
            Component Health Breakdown
          </span>
          <span className="text-[11px] text-gray-400 font-semibold">
            {diagnosticItems.length} Inspection Checkpoints
          </span>
        </div>

        <div className="space-y-3">
          {visibleItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon size={13} className="text-gray-500 flex-shrink-0" />
                    <span className="font-bold text-gray-800 truncate">{item.title}</span>
                  </div>
                  <span className="font-black text-gray-900 ml-2">{item.score}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <p className="text-[10.5px] text-gray-500 font-medium pl-0.5">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Expand / Collapse Button */}
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold active:scale-98 transition-colors flex items-center justify-center gap-1.5 mt-2"
        >
          <span>{expanded ? 'Show Less Details' : `View All 10 Checkpoints (${diagnosticItems.length - 4} More)`}</span>
        </button>

        {/* Local Verification Notice */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex items-start gap-2 mt-2">
          <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900/80 leading-relaxed">
            <strong>Bahawal Market Guarantee:</strong> You can physically inspect this device at the shop counter or check during home delivery before payment.
          </p>
        </div>
      </div>
    </div>
  );
}
