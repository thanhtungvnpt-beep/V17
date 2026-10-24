import React, { useState } from 'react';
import { 
  Sparkles, Info, ArrowRight, AlertTriangle, CheckCircle2, 
  Calendar, Layers, Package, Users, Cog, ShieldCheck, 
  RotateCcw, BarChart3, Truck, AlertOctagon, HelpCircle, X, ExternalLink
} from 'lucide-react';
import { 
  Vendor, CausalNode, AIInsightItem, AIActionRecommendation, Language 
} from '../../types';
import { 
  INITIAL_CAUSAL_NODES, INITIAL_AI_INSIGHTS, 
  INITIAL_AI_ACTIONS 
} from '../../services/mockData';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface ExecutiveDashboardProps {
  currentLang: Language;
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
  vendors: Vendor[];
  onNavigateToTab: (tabId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  currentLang,
  selectedVendorId,
  onSelectVendor,
  vendors,
  onNavigateToTab
}) => {
  const t = translations[currentLang];
  const [activeFilter, setActiveFilter] = useState<'all' | 'vendor' | 'sku'>('all');
  const [activeInsightTab, setActiveInsightTab] = useState<'main' | 'chains'>('main');
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [aiActions, setAiActions] = useState<AIActionRecommendation[]>(INITIAL_AI_ACTIONS);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  // Driver Analysis percentages
  const driverData = [
    { label: 'Kế hoạch sản xuất', percent: 28, color: 'bg-rose-500', icon: Calendar },
    { label: 'Prebuild', percent: 12, color: 'bg-emerald-500', icon: Layers },
    { label: 'Kho vật liệu', percent: 18, color: 'bg-cyan-500', icon: Package },
    { label: 'Nhân lực', percent: 15, color: 'bg-purple-500', icon: Users },
    { label: 'Thiết bị', percent: 13, color: 'bg-amber-500', icon: Cog },
    { label: 'Chất lượng', percent: 10, color: 'bg-blue-500', icon: ShieldCheck },
    { label: 'Rework', percent: 8, color: 'bg-red-400', icon: RotateCcw },
    { label: 'Yếu tố bên ngoài', percent: 4, color: 'bg-orange-500', icon: AlertTriangle },
  ];

  const handleExecuteAction = (action: AIActionRecommendation) => {
    operationsService.createTaskFromAIAction(
      action.text,
      action.priority,
      action.relatedVendorId
    );
    setAiActions(prev =>
      prev.map(a => (a.id === action.id ? { ...a, status: 'in_progress' } : a))
    );
    setActionSuccessMsg(`Đã tạo nhiệm vụ điều hành: "${action.text}"`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  // Node Icon Mapping
  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'node-plan': return Calendar;
      case 'node-prebuild': return Layers;
      case 'node-material': return Package;
      case 'node-hr': return Users;
      case 'node-equipment': return Cog;
      case 'node-qc': return ShieldCheck;
      case 'node-rework': return RotateCcw;
      case 'node-output': return BarChart3;
      case 'node-external': return AlertOctagon;
      case 'node-delivery': return Truck;
      default: return Info;
    }
  };

  // Node Color Theme
  const getNodeBorder = (node: CausalNode) => {
    if (selectedNode?.id === node.id) {
      return 'border-cyan-300 ring-2 ring-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]';
    }
    if (node.status === 'danger') return 'border-rose-600/80 hover:border-rose-400';
    if (node.status === 'warning') return 'border-amber-500/80 hover:border-amber-400';
    return 'border-emerald-500/80 hover:border-emerald-400';
  };

  return (
    <div className="p-3 lg:p-5 space-y-4">
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP SECTION: Causal Network Diagram (Left) + AI Insight (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Causal Network Diagram Canvas (7 cols on 2xl, 8 cols on xl) */}
        <div className="xl:col-span-8 rounded-2xl bg-[#090f1d] border border-slate-800 p-4 relative overflow-hidden flex flex-col">
          {/* Header of Causal Network */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="text-sm lg:text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>{t.causalTitle}</span>
                {selectedVendor && (
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                    {selectedVendor.code}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {t.causalSubtitle}
              </div>
            </div>

            {/* Filter buttons & Explain modal button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    onSelectVendor(null);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.filterAllGroup}
                </button>
                <button
                  onClick={() => setActiveFilter('vendor')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeFilter === 'vendor'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.filterByVendor}
                </button>
                <button
                  onClick={() => setActiveFilter('sku')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    activeFilter === 'sku'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.filterBySKU}
                </button>
              </div>

              <button
                onClick={() => setShowExplainModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/80 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.explainModel}</span>
              </button>
            </div>
          </div>

          {/* Legend Strip */}
          <div className="flex items-center gap-5 py-2 text-[11px] text-slate-400 border-b border-slate-800/40">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
              <ArrowRight className="w-3 h-3 text-emerald-400 -ml-1" />
              <span>{t.positiveImpact}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500 inline-block" />
              <ArrowRight className="w-3 h-3 text-rose-500 -ml-1" />
              <span>{t.negativeImpact}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 inline-block border-t border-dashed" />
              <span>{t.relationship}</span>
            </div>
            <span className="text-slate-500 ml-auto text-[10px] hidden sm:inline">
              * Nhấp vào nút để xem phân tích chi tiết & hành động
            </span>
          </div>

          {/* Causal Network Interactive Visual Layout */}
          <div className="relative min-h-[500px] w-full mt-2 rounded-xl bg-[#060b14]/90 p-4 border border-slate-900 overflow-x-auto flex items-center justify-center">
            {/* SVG Connecting Paths with Impact Weights */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="gradPositive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradNegative" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="gradNeutral" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Connecting curved lines between functional nodes */}
              <path d="M 220 70 C 270 70, 320 70, 380 70" stroke="#f43f5e" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              <path d="M 120 120 C 120 150, 120 170, 120 200" stroke="#10b981" strokeWidth="2" fill="none" />
              <path d="M 220 230 C 280 230, 300 230, 360 230" stroke="#10b981" strokeWidth="2.5" fill="none" />
              <path d="M 460 230 C 500 230, 520 230, 560 230" stroke="#06b6d4" strokeWidth="3" fill="none" />
              <path d="M 680 230 C 720 230, 750 230, 790 230" stroke="#10b981" strokeWidth="2.5" fill="none" />
              
              <path d="M 420 115 C 420 150, 420 180, 420 200" stroke="#ef4444" strokeWidth="2.5" fill="none" />
              <path d="M 480 70 C 530 70, 560 70, 600 70" stroke="#f97316" strokeWidth="2" fill="none" />
              <path d="M 640 115 C 640 150, 640 180, 640 200" stroke="#f97316" strokeWidth="2.5" fill="none" />

              <path d="M 220 370 C 280 370, 300 370, 360 370" stroke="#10b981" strokeWidth="2" fill="none" />
              <path d="M 460 370 C 500 370, 520 300, 570 260" stroke="#10b981" strokeWidth="3" fill="none" />
              <path d="M 620 350 C 620 310, 620 280, 620 260" stroke="#ef4444" strokeWidth="2" fill="none" />
            </svg>

            {/* Grid of Causal Network Nodes matching reference layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full z-10 relative">
              {/* Column 1: Kế hoạch, Prebuild, Kho vật liệu */}
              <div className="space-y-4">
                {/* Node: Kế hoạch sản xuất */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[0],
                  'border-cyan-500/60 bg-[#0d1627]',
                  'text-cyan-400',
                  '0.6 →'
                )}

                {/* Node: Prebuild */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[1],
                  'border-emerald-500/60 bg-[#091f1a]',
                  'text-emerald-400',
                  '0.4 →'
                )}

                {/* Node: Kho vật liệu */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[2],
                  'border-rose-500/80 bg-[#241117]',
                  'text-rose-400',
                  '0.9 !!'
                )}
              </div>

              {/* Column 2: Chất lượng, Nhân lực, Thiết bị */}
              <div className="space-y-4">
                {/* Node: Chất lượng QC */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[5],
                  'border-rose-500/80 bg-[#251016]',
                  'text-rose-400',
                  '0.8'
                )}

                {/* Node: Nhân lực */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[3],
                  'border-purple-500/60 bg-[#1b1227]',
                  'text-purple-400',
                  '0.9 →'
                )}

                {/* Node: Thiết bị */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[4],
                  'border-amber-500/70 bg-[#241a10]',
                  'text-amber-400',
                  '0.8'
                )}
              </div>

              {/* Column 3: Rework, Sản lượng thực tế, Yếu tố bên ngoài */}
              <div className="space-y-4">
                {/* Node: Rework */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[6],
                  'border-orange-500/70 bg-[#27150c]',
                  'text-orange-400',
                  '0.6'
                )}

                {/* Node: Sản lượng thực tế (The Central Core Node) */}
                <div
                  onClick={() => setSelectedNode(INITIAL_CAUSAL_NODES[7])}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group shadow-xl ${
                    selectedNode?.id === 'node-output'
                      ? 'border-cyan-300 bg-gradient-to-br from-cyan-950/90 via-blue-950 to-slate-900 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                      : 'border-cyan-500/80 bg-gradient-to-br from-blue-950/80 to-slate-950 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-cyan-200 tracking-wider">
                        SẢN LƯỢNG THỰC TẾ
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700">
                      Thiếu -3,800 pcs
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Đạt được:</span>
                      <span className="font-mono font-bold text-white">14,200 pcs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tỷ lệ hoàn thành:</span>
                      <span className="font-mono font-bold text-amber-400">78.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Năng suất:</span>
                      <span className="font-mono text-cyan-300">1,775 pcs/giờ</span>
                    </div>
                  </div>
                </div>

                {/* Node: Yếu tố bên ngoài */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[8],
                  'border-red-900/60 bg-[#1e0d11]',
                  'text-red-400',
                  '0.5'
                )}
              </div>

              {/* Column 4: Giao hàng (TO / OTD) */}
              <div className="space-y-4">
                {/* Node: Giao hàng TO / OTD */}
                {renderNodeCard(
                  INITIAL_CAUSAL_NODES[9],
                  'border-emerald-500/80 bg-[#0c231c]',
                  'text-emerald-400',
                  '0.8'
                )}

                {/* Quick Info Box on Selected Node */}
                {selectedNode ? (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between font-bold text-cyan-300">
                      <span>Chi tiết: {selectedNode.label}</span>
                      <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1">
                      {selectedNode.bulletPoints.map((bp, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400">▪</span>
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => onNavigateToTab(mapNodeToModule(selectedNode.id))}
                      className="w-full mt-2 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Mở mô-đun chuyên trách</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-500 text-center">
                    Nhấp vào bất kỳ khối nào trên sơ đồ để xem phân tích tác động và mở quy trình xử lý.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI INSIGHT - Ranked Bottlenecks Panel (Right side: 4 cols on xl/2xl) */}
        <div className="xl:col-span-4 rounded-2xl bg-[#090f1d] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white tracking-wide">
                    {t.aiInsightTitle}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Xếp hạng tác động theo thời gian thực
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Tabs: Ảnh hưởng chính | Chuỗi nguyên nhân */}
            <div className="flex items-center gap-1 my-3 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveInsightTab('main')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeInsightTab === 'main'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.mainImpactTab}
              </button>
              <button
                onClick={() => setActiveInsightTab('chains')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeInsightTab === 'chains'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.causalChainTab}
              </button>
            </div>

            {/* List of 6 Ranked AI Insights */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {INITIAL_AI_INSIGHTS.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.vendorId) onSelectVendor(item.vendorId);
                  }}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center text-xs font-bold font-mono">
                        {item.rank}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
                      {item.impactScore.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {activeInsightTab === 'chains' && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 text-[10px] space-y-1">
                      <div className="text-amber-300">
                        <span className="font-semibold text-slate-400">Nguyên nhân gốc: </span>
                        {item.rootCause}
                      </div>
                      <div className="text-cyan-300">
                        <span className="font-semibold text-slate-400">Đề xuất: </span>
                        {item.proposedAction}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Nguồn: {item.dataSource}</span>
                    <span className="text-cyan-400 font-mono">Tin cậy: {item.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="italic">{t.humanApprovalNotice}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 3 Columns matching reference UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bottom Left: Phân tích đóng góp (Driver Analysis) */}
        <div className="rounded-2xl bg-[#090f1d] border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{t.driverAnalysisTitle}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">100% Total</span>
          </div>

          <div className="space-y-2.5">
            {driverData.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="text-xs">
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{d.label}</span>
                    </div>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {d.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${d.color}`}
                      style={{ width: `${d.percent * 2.8}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Center: Kịch bản dự báo sản lượng cuối ngày */}
        <div className="rounded-2xl bg-[#090f1d] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>{t.forecastTitle}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Timeline Graphic & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  {t.planToday}
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  18,000 <span className="text-xs font-normal text-slate-400">pcs</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-900/60">
                <div className="text-[10px] text-amber-400 uppercase font-semibold">
                  {t.forecastEndDay}
                </div>
                <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                  14,200 <span className="text-xs font-normal text-amber-400">(79%)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-rose-900/60">
                <div className="text-[10px] text-rose-400 uppercase font-semibold">
                  {t.riskShortage}
                </div>
                <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                  -3,800 <span className="text-xs font-normal text-rose-400">pcs</span>
                </div>
              </div>
            </div>

            {/* Hourly Run-chart simulation */}
            <div className="relative h-32 w-full bg-slate-950 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between">
              {/* SVG Curve */}
              <svg className="w-full h-20" viewBox="0 0 300 80">
                {/* Target straight trajectory */}
                <line x1="10" y1="70" x2="290" y2="10" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                {/* Actual curve up to current hour (14:00) */}
                <path d="M 10 70 Q 100 62 170 38" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                {/* Forecast projection from 14:00 to 16:00 */}
                <path d="M 170 38 Q 230 30 290 28" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
                
                {/* Data points */}
                <circle cx="170" cy="38" r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1.5" />
                <circle cx="290" cy="28" r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
              </svg>

              {/* Time tick labels */}
              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800">
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span className="text-cyan-400 font-bold">14:00 (Hiện tại)</span>
                <span>16:00 (Hết ca)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-slate-500" /> Kế hoạch</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-cyan-400" /> Thực tế</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-400" /> Dự báo</span>
            </div>
            <button
              onClick={() => onNavigateToTab('production')}
              className="text-cyan-400 hover:underline"
            >
              Xem chi tiết ca →
            </button>
          </div>
        </div>

        {/* Bottom Right: Đề xuất hành động (AI) */}
        <div className="rounded-2xl bg-[#090f1d] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{t.actionsTitle}</span>
              </div>
              <button
                onClick={() => onNavigateToTab('tasks')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll}</span>
                <span>&gt;</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {aiActions.map(action => (
                <div
                  key={action.id}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                      {action.order}
                    </span>
                    <span className="text-xs text-slate-200 truncate">
                      {action.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      action.priority === 'Cao'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : action.priority === 'Trung bình'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    }`}>
                      {action.priority}
                    </span>

                    {action.status === 'in_progress' ? (
                      <span className="text-[10px] text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                        Đang xử lý
                      </span>
                    ) : (
                      <button
                        onClick={() => handleExecuteAction(action)}
                        className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-semibold transition-colors"
                      >
                        Giao việc
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            * Nhấp "Giao việc" để chuyển đề xuất thành nhiệm vụ được giao cho kỹ sư phụ trách.
          </div>
        </div>
      </div>

      {/* Model Explanation Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Nguyên lý Mô hình Nhân quả (Causal Network Model)
                </h3>
              </div>
              <button onClick={() => setShowExplainModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                Hệ thống NEURAL LINK V17 sử dụng mạng lưới đồ thị nhân quả trọng số (Weighted Causal Graph) nhằm mô hình hóa luồng biến thiên xuyên suốt chuỗi cung ứng gia công:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-cyan-300 font-semibold">1. Chuỗi tác động trực tiếp:</div>
                <p>Kho vật liệu (0.9) & Thiết bị (0.8) & Nhân lực (0.9) tác động trực tiếp đến Sản lượng thực tế.</p>
                <div className="text-rose-300 font-semibold">2. Tác động lan truyền ngược:</div>
                <p>Lỗi chất lượng tại QC (0.8) làm tăng khối lượng Rework, hút nhân lực lành nghề và gây nghẽn băng chuyền đóng gói giao hàng (OTD).</p>
                <div className="text-emerald-300 font-semibold">3. Cơ chế giải tỏa áp lực:</div>
                <p>Sản lượng Prebuild được tính toán trước nhằm tạo vùng đệm khi có biến động về thay đổi đơn hàng đột xuất.</p>
              </div>
              <p className="text-slate-400 text-[11px]">
                Toàn bộ trọng số được hiệu chỉnh tự động từ lịch sử dữ liệu GMES và báo cáo kiểm toán QC thực tế, không dùng số liệu giả định.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderNodeCard(
    node: CausalNode,
    colorClasses: string,
    accentColor: string,
    arrowText?: string
  ) {
    const Icon = getNodeIcon(node.id);
    const isSelected = selectedNode?.id === node.id;

    return (
      <div
        key={node.id}
        onClick={() => setSelectedNode(node)}
        className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group select-none ${colorClasses} ${
          isSelected ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'hover:scale-[1.01]'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`p-1.5 rounded-lg bg-black/40 ${accentColor}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide truncate">
              {node.label}
            </span>
          </div>
          {arrowText && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
              {arrowText}
            </span>
          )}
        </div>

        <ul className="space-y-0.5 text-[10px] text-slate-300">
          {node.bulletPoints.map((bp, i) => (
            <li key={i} className="truncate flex items-center gap-1">
              <span className={`w-1 h-1 rounded-full ${accentColor} inline-block`} />
              <span>{bp}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function mapNodeToModule(nodeId: string): string {
    switch (nodeId) {
      case 'node-plan': return 'production';
      case 'node-prebuild': return 'production';
      case 'node-material': return 'materials';
      case 'node-hr': return 'vendors';
      case 'node-equipment': return 'equipment';
      case 'node-qc': return 'quality';
      case 'node-rework': return 'quality';
      case 'node-output': return 'production';
      case 'node-delivery': return 'production';
      default: return 'overview';
    }
  }
};
