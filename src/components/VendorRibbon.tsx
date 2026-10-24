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

  const getStatusColor = (vendorCode: string, rate: number) => {
    if (vendorCode === 'DAAL') return 'text-[#f43f5e]';
    if (vendorCode === 'KTECH') return 'text-[#f59e0b]';
    if (vendorCode === 'KHV' || vendorCode === 'HOJEONGB') return 'text-[#10b981]';
    return 'text-[#00e5ff]';
  };

  const getProgressColor = (vendorCode: string, rate: number) => {
    if (vendorCode === 'DAAL') return 'bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]';
    if (vendorCode === 'KTECH') return 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]';
    if (vendorCode === 'KHV' || vendorCode === 'HOJEONGB') return 'bg-[#10b981] shadow-[0_0_8px_#10b981]';
    return 'bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]';
  };

  return (
    <div className="no-print bg-[#050e1c] border-b border-[#142c4c] px-3 lg:px-6 py-2.5">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {vendors.map(vendor => {
          const isSelected = selectedVendorId === vendor.id;
          const statusCol = getStatusColor(vendor.code, vendor.completionRate);
          const progCol = getProgressColor(vendor.code, vendor.completionRate);

          return (
            <div
              key={vendor.id}
              onClick={() => onSelectVendor(isSelected ? null : vendor.id)}
              className={`p-2.5 rounded-xl bg-[#081528] border cursor-pointer select-none transition-all duration-200 relative overflow-hidden group shadow-md ${
                isSelected
                  ? 'border-cyan-400 ring-1 ring-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'border-[#173559] hover:border-cyan-500/50 hover:bg-[#0c1e36]'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 mb-2">
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm font-black text-white tracking-wide truncate group-hover:text-cyan-300 transition-colors">
                    {vendor.code}
                  </div>
                  <div className="text-[11px] font-bold mt-0.5">
                    <span className="text-slate-300 font-medium">Đạt </span>
                    <span className={`${statusCol} font-extrabold`}>
                      {vendor.completionRate}%
                    </span>
                  </div>
                </div>

                {/* Facility Thumbnail */}
                <div className="w-12 h-8 rounded-md overflow-hidden shrink-0 border border-[#1b3d68] bg-[#0c223f] shadow-inner">
                  <img
                    src={vendor.image}
                    alt={vendor.code}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-95 contrast-105"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                      // Fallback SVG manufacturing graphic if local image has load issue
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#071324] rounded-full overflow-hidden mb-1.5 border border-[#132845]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progCol}`}
                  style={{ width: `${Math.min(100, vendor.completionRate)}%` }}
                />
              </div>

              {/* Output Numbers */}
              <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums">
                <span className={`font-bold ${statusCol}`}>
                  {vendor.actualPcs.toLocaleString()}
                </span>
                <span className="text-slate-500 font-sans">/</span>
                <span className="text-slate-400 font-medium">{vendor.planPcs.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
