import React from 'react';
import { 
  Home, Calendar, BarChart3, Truck, ShieldCheck, 
  Users, Cog, Building, Layers, Compass, 
  FileText, Settings
} from 'lucide-react';
import { Language, Vendor } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentLang: Language;
  vendors: Vendor[];
  selectedVendorId: string | null;
  onSelectVendor: (vendorId: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  vendors,
  selectedVendorId,
  onSelectVendor
}) => {
  const mainNavItems = [
    { id: 'overview', label: 'Tổng quan', icon: Home, targetTab: 'overview' },
    { id: 'production', label: 'Kế hoạch sản xuất', icon: Calendar, targetTab: 'production' },
    { id: 'actual-output', label: 'Sản lượng thực tế', icon: BarChart3, targetTab: 'production' },
    { id: 'delivery', label: 'Giao hàng (TO/OTD)', icon: Truck, targetTab: 'kpi' },
    { id: 'quality', label: 'Chất lượng', icon: ShieldCheck, targetTab: 'quality' },
    { id: 'hr', label: 'Nhân lực', icon: Users, targetTab: 'tasks' },
    { id: 'equipment', label: 'Thiết bị', icon: Cog, targetTab: 'equipment' },
    { id: 'materials', label: 'Kho vật liệu', icon: Building, targetTab: 'materials' },
    { id: 'prebuild', label: 'Prebuild & Rework', icon: Layers, targetTab: 'production' },
    { id: 'ai-assistant', label: 'Phân tích AI', icon: Compass, targetTab: 'ai-assistant' },
    { id: 'reports', label: 'Báo cáo', icon: FileText, targetTab: 'ai-assistant' },
    { id: 'developer', label: 'Cài đặt', icon: Settings, targetTab: 'developer' },
  ];

  const vendorColorMap: Record<string, string> = {
    'KHV': 'bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]',
    'DREAM TECH': 'bg-[#f97316] shadow-[0_0_8px_#f97316]',
    'HSTEC': 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]',
    'KTECH': 'bg-[#a855f7] shadow-[0_0_8px_#a855f7]',
    'HOJEONGB': 'bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]',
    'HOJEONG VINA': 'bg-[#818cf8] shadow-[0_0_8px_#818cf8]',
    'DAAL': 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]',
  };

  return (
    <aside className="no-print w-56 lg:w-60 bg-[#061122] border-r border-[#152e50] flex flex-col shrink-0 select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto">
        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.targetTab && (item.id === 'overview' || activeTab === item.id);
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.targetTab)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-[#0070d8] text-white shadow-[0_0_15px_rgba(0,112,216,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c1f38]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-300'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Pinned 7 Outsourcing Vendors matching Screenshot */}
      <div className="p-3 border-t border-[#152e50] bg-[#050e1c]">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-sm font-black text-white">7</span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-white">
            NHÀ GIA CÔNG
          </span>
        </div>
        <div className="space-y-1">
          {vendors.map(v => {
            const isSelected = selectedVendorId === v.id;
            const dotClass = vendorColorMap[v.code] || 'bg-cyan-400';
            return (
              <button
                key={v.id}
                onClick={() => {
                  onSelectVendor(isSelected ? null : v.id);
                  if (activeTab !== 'overview' && activeTab !== 'vendors') {
                    onSelectTab('vendors');
                  }
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected 
                    ? 'bg-[#0c223f] text-cyan-300 font-bold border border-cyan-700/60' 
                    : 'text-slate-300 hover:text-white hover:bg-[#0c1f38]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotClass}`} />
                  <span className="truncate font-semibold tracking-wide text-xs">{v.code}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
