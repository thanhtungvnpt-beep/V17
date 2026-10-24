import React from 'react';
import { Vendor, Language } from '../types';
import { translations } from '../locales/i18n';

interface VendorRibbonProps {
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (vendorId: string | null) => void;
  currentLang: Language;
}

export const VendorRibbon: React.FC<VendorRibbonProps> = ({
  vendors,
  selectedVendorId,
  onSelectVendor,
  currentLang
}) => {
  const t = translations[currentLang];

  const getStatusColor = (rate: number) => {
    if (rate >= 80) return 'text-emerald-400';
    if (rate >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'bg-emerald-500';
    if (rate >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getBorderColor = (vendor: Vendor, isSelected: boolean) => {
    if (isSelected) return 'border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]';
    if (vendor.completionRate < 60) return 'border-rose-900/60 hover:border-rose-700/80';
    if (vendor.completionRate < 80) return 'border-amber-900/50 hover:border-amber-700/80';
    return 'border-slate-800 hover:border-slate-700';
  };

  return (
    <div className="bg-[#070d18] border-b border-slate-800/80 px-3 lg:px-6 py-2 overflow-x-auto">
      <div className="flex items-center gap-2.5 min-w-[1100px]">
        {/* Reset filter button */}
        <button
          onClick={() => onSelectVendor(null)}
          className={`shrink-0 px-2.5 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
            selectedVendorId === null
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          {t.filterAllGroup}
        </button>

        {/* 7 Vendor Cards */}
        {vendors.map(vendor => {
          const isSelected = selectedVendorId === vendor.id;
          return (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(isSelected ? null : vendor.id)}
              className={`flex-1 min-w-[145px] p-2 rounded-xl bg-slate-900/80 border cursor-pointer select-none transition-all duration-200 relative overflow-hidden group ${getBorderColor(
                vendor,
                isSelected
              )}`}
            >
              {/* Subtle top indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 ${getProgressColor(
                  vendor.completionRate
                )}`}
              />

              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white tracking-wide truncate group-hover:text-cyan-300 transition-colors">
                    {vendor.code}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold mt-0.5">
                    <span className="text-slate-400 font-normal">{t.statusAchieved}</span>
                    <span className={getStatusColor(vendor.completionRate)}>
                      {vendor.completionRate}%
                    </span>
                  </div>
                </div>

                {/* Facility Thumbnail */}
                <div className="w-10 h-7 rounded-md overflow-hidden shrink-0 border border-slate-700/60 bg-slate-800">
                  <img
                    src={vendor.image}
                    alt={vendor.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                    vendor.completionRate
                  )}`}
                  style={{ width: `${Math.min(100, vendor.completionRate)}%` }}
                />
              </div>

              {/* Output Numbers */}
              <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                <span className={`font-semibold ${getStatusColor(vendor.completionRate)}`}>
                  {vendor.actualPcs.toLocaleString()}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{vendor.planPcs.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
