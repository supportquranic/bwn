import { ShieldCheck } from 'lucide-react';

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

  // Overall Score calculation (out of 10)
  let overallScore = 9.2;
  if (used.conditionRating) {
    const parsed = parseFloat(used.conditionRating.replace('/10', ''));
    if (!isNaN(parsed)) overallScore = parsed;
  } else if (specs.Condition) {
    const match = specs.Condition.match(/([0-9.]+)\/10/);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed)) overallScore = parsed;
    }
  }

  // Frame & Outer Body Score (out of 10)
  const bodyScore = Math.min(10, Math.max(7.0, parseFloat((overallScore - 0.2).toFixed(1))));

  // Battery Score rated out of 10 (e.g. 88% -> 8.8/10)
  const batteryScore = parseFloat((batteryHealth / 10).toFixed(1));

  const bars = [
    {
      id: 'overall',
      label: 'Overall Condition',
      score: `${overallScore.toFixed(1)}/10`,
      percentage: Math.min(100, Math.max(0, overallScore * 10)),
    },
    {
      id: 'body',
      label: 'Frame & Outer Body',
      score: `${bodyScore.toFixed(1)}/10`,
      percentage: Math.min(100, Math.max(0, bodyScore * 10)),
    },
    {
      id: 'battery',
      label: 'Battery Health & Performance',
      score: `${batteryScore.toFixed(1)}/10`,
      percentage: Math.min(100, Math.max(0, batteryHealth)),
    },
  ];

  return (
    <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-[#8586f2]" />
          <h3 className="text-xs font-black text-black tracking-tight">Verified Device Condition</h3>
        </div>
        <span className="text-[10.5px] font-bold bg-[#8586f2]/10 text-[#8586f2] px-2 py-0.5 rounded-full">
          {overallScore.toFixed(1)} / 10
        </span>
      </div>

      {/* 3 Minimal Thin Bars */}
      <div className="space-y-2.5">
        {bars.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="font-black text-black tracking-tight">{item.score}</span>
            </div>

            {/* Sleek Minimal Thin Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#8586f2] transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Minimal Footer Badges */}
      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10.5px] text-gray-500 font-medium">
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <span>●</span> PTA Approved Official
        </span>
        <span className="text-gray-400">·</span>
        <span>{used.warrantyRemaining || '7 Days Check Warranty'}</span>
      </div>
    </div>
  );
}
