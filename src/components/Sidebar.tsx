import React from 'react';
import { 
  LayoutDashboard, Calendar, BarChart3, Truck, ShieldCheck, 
  Users, Wrench, Package, Layers, Sparkles, 
  FileText, Settings, Terminal, Building2, CheckSquare, Smartphone
} from 'lucide-react';
import { Language, Vendor } from '../types';
import { translations } from '../locales/i18n';

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
  currentLang,
  vendors,
  selectedVendorId,
  onSelectVendor
}) => {
  const t = translations[currentLang];

  const mainNavItems = [
    { id: 'overview', label: t.navOverview, icon: LayoutDashboard },
    { id: 'production', label: t.navPlan, icon: Calendar },
    { id: 'vendors', label: t.navVendors, icon: Building2 },
    { id: 'quality', label: t.navQuality, icon: ShieldCheck },
    { id: 'equipment', label: t.navEquipment, icon: Wrench },
    { id: 'materials', label: t.navMaterials, icon: Package },
    { id: 'kpi', label: t.navKPI, icon: BarChart3 },
    { id: 'ai-assistant', label: t.navAIAssistant, icon: Sparkles },
    { id: 'tasks', label: t.navTasksApprovals, icon: CheckSquare },
    { id: 'mobile', label: t.navMobile, icon: Smartphone },
    { id: 'developer', label: t.navDeveloperConsole, icon: Terminal, isDev: true },
  ];

  const vendorDotColors: Record<string, string> = {
    'v-khv': 'bg-emerald-400',
    'v-dreamtech': 'bg-amber-400',
    'v-hstec': 'bg-cyan-400',
    'v-ktech': 'bg-purple-400',
    'v-hojeongb': 'bg-blue-400',
    'v-hojeongvina': 'bg-indigo-400',
    'v-daal': 'bg-rose-500',
  };

  return (
    <aside className="w-56 lg:w-64 bg-[#070d18] border-r border-slate-800/80 flex flex-col shrink-0 select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          User Operations
        </div>

        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? item.isDev
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : item.isDev
                  ? 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? (item.isDev ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span className="truncate">{item.label}</span>
              {item.isDev && (
                <span className="ml-auto text-[9px] px-1 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-600/40">
                  ADM
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pinned 7 Outsourcing Vendors */}
      <div className="p-3 border-t border-slate-800/80 bg-[#060a12]">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            7 Nhà gia công
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">Real-time</span>
        </div>
        <div className="space-y-1">
          {vendors.map(v => {
            const isSelected = selectedVendorId === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  onSelectVendor(isSelected ? null : v.id);
                  if (activeTab !== 'overview' && activeTab !== 'vendors') {
                    onSelectTab('vendors');
                  }
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  isSelected 
                    ? 'bg-slate-800 text-white font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${vendorDotColors[v.id] || 'bg-slate-400'}`} />
                  <span className="truncate">{v.code}</span>
                </div>
                <span className={`font-mono tabular-nums text-[10px] ${
                  v.completionRate >= 80 ? 'text-emerald-400' : v.completionRate >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {v.completionRate}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
