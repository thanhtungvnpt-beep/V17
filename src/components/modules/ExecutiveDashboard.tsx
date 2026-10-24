import React, { useState } from 'react';
import { 
  Sparkles, Info, ArrowRight, CheckCircle2, 
  Calendar, Layers, Package, Users, Cog, ShieldCheck, 
  RotateCcw, BarChart3, Truck, AlertTriangle, X, Lightbulb
} from 'lucide-react';
import { Vendor, Language } from '../../types';
import { operationsService } from '../../services/operationsService';

interface ExecutiveDashboardProps {
  currentLang: Language;
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
  vendors: Vendor[];
  onNavigateToTab: (tabId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  selectedVendorId,
  onSelectVendor,
  vendors,
  onNavigateToTab
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'vendor' | 'sku'>('all');
  const [activeInsightTab, setActiveInsightTab] = useState<'main' | 'chains'>('main');
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // 1. Causal Nodes Definition matching Screenshot 100%
  const causalNodes = [
    {
      id: 'node-plan',
      title: 'KẾ HOẠCH SẢN XUẤT',
      icon: Calendar,
      themeColor: 'border-[#1e3a8a] bg-[#081730]',
      iconBg: 'bg-[#1d4ed8]',
      iconColor: 'text-white',
      bullets: [
        'Kế hoạch hôm nay',
        'Kế hoạch tiếp theo',
        'Độ ổn định kế hoạch',
        'Thay đổi khẩn cấp'
      ],
      bulletDot: 'bg-[#00e5ff]',
      col: 1
    },
    {
      id: 'node-prebuild',
      title: 'PREBUILD',
      icon: Layers,
      themeColor: 'border-[#065f46] bg-[#07241f]',
      iconBg: 'bg-[#059669]',
      iconColor: 'text-white',
      bullets: [
        'Sản xuất trước để gối',
        'Số lượng Prebuild',
        'Độ bao phủ kế hoạch',
        'Giải tỏa áp lực đơn hàng'
      ],
      bulletDot: 'bg-[#10b981]',
      col: 1
    },
    {
      id: 'node-material',
      title: 'KHO VẬT LIỆU',
      icon: Package,
      themeColor: 'border-[#0e7490] bg-[#072233]',
      iconBg: 'bg-[#0891b2]',
      iconColor: 'text-white',
      bullets: [
        'Tồn kho',
        'Thiếu vật liệu',
        'Thời gian cung ứng',
        'Chất lượng vật liệu'
      ],
      bulletDot: 'bg-[#00e5ff]',
      col: 1
    },
    {
      id: 'node-qc',
      title: 'CHẤT LƯỢNG (QC)',
      icon: ShieldCheck,
      themeColor: 'border-[#9f1239] bg-[#290d16]',
      iconBg: 'bg-[#e11d48]',
      iconColor: 'text-white',
      bullets: [
        'Tỷ lệ lỗi',
        'Hàng chờ QC',
        'Tiêu chuẩn chất lượng',
        'Kiểm tra đầu vào'
      ],
      bulletDot: 'bg-[#f43f5e]',
      col: 2
    },
    {
      id: 'node-hr',
      title: 'NHÂN LỰC',
      icon: Users,
      themeColor: 'border-[#6b21a8] bg-[#1d0f30]',
      iconBg: 'bg-[#9333ea]',
      iconColor: 'text-white',
      bullets: [
        'Số lượng nhân công',
        'Tay nghề',
        'Tỷ lệ nghỉ việc',
        'Tăng ca'
      ],
      bulletDot: 'bg-[#c084fc]',
      col: 2
    },
    {
      id: 'node-equipment',
      title: 'THIẾT BỊ',
      icon: Cog,
      themeColor: 'border-[#92400e] bg-[#2a1a0c]',
      iconBg: 'bg-[#d97706]',
      iconColor: 'text-white',
      bullets: [
        'Hiệu suất (OEE)',
        'Thời gian dừng máy',
        'Bảo trì',
        'Sự cố bất thường'
      ],
      bulletDot: 'bg-[#f59e0b]',
      col: 2
    },
    {
      id: 'node-rework',
      title: 'REWORK',
      icon: RotateCcw,
      themeColor: 'border-[#9a3412] bg-[#2a160b]',
      iconBg: 'bg-[#ea580c]',
      iconColor: 'text-white',
      bullets: [
        'Số lượng hàng hỏng',
        'Số lượng làm lại',
        'Thời gian rework',
        'Tỷ lệ tái lỗi'
      ],
      bulletDot: 'bg-[#fb923c]',
      col: 3
    },
    {
      id: 'node-output',
      title: 'SẢN LƯỢNG THỰC TẾ',
      icon: BarChart3,
      themeColor: 'border-cyan-400 bg-gradient-to-br from-[#0c2e56] to-[#061833] ring-4 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.5)]',
      iconBg: 'bg-[#0070d8]',
      iconColor: 'text-white',
      bullets: [
        'Sản lượng đạt được',
        'Tỷ lệ hoàn thành',
        'Năng suất theo giờ',
        'Sản lượng còn thiếu'
      ],
      bulletDot: 'bg-[#00e5ff]',
      col: 3,
      isCenterHub: true
    },
    {
      id: 'node-external',
      title: 'YẾU TỐ BÊN NGOÀI',
      icon: AlertTriangle,
      themeColor: 'border-[#991b1b] bg-[#2b0c12]',
      iconBg: 'bg-[#dc2626]',
      iconColor: 'text-white',
      bullets: [
        'Thay đổi đơn hàng',
        'Vấn đề logistics',
        'Thời tiết / thiên tai',
        'Quy định pháp lý'
      ],
      bulletDot: 'bg-[#f87171]',
      col: 3
    },
    {
      id: 'node-delivery',
      title: 'GIAO HÀNG (TO / OTD)',
      icon: Truck,
      themeColor: 'border-[#065f46] bg-[#07251f]',
      iconBg: 'bg-[#059669]',
      iconColor: 'text-white',
      bullets: [
        'Số lượng phải giao',
        'Số lượng đã giao',
        'Tỷ lệ đúng hạn (OTD)',
        'Nguy cơ trễ hạn'
      ],
      bulletDot: 'bg-[#10b981]',
      col: 4
    }
  ];

  // 2. AI Insight Items matching Screenshot 100%
  const aiInsights = [
    {
      rank: 1,
      circleBg: 'bg-[#f43f5e]',
      title: 'Thiếu vật liệu tại DAAL',
      badge: '0.82',
      badgeColor: 'bg-[#450a0a] text-[#f87171] border border-[#dc2626]/60',
      description: 'Làm giảm 32% sản lượng, ảnh hưởng trực tiếp đến nguy cơ trễ giao hàng.',
      vendorId: 'v-daal'
    },
    {
      rank: 2,
      circleBg: 'bg-[#f59e0b]',
      title: 'Thời gian dừng máy tại KTECH',
      badge: '0.67',
      badgeColor: 'bg-[#431407] text-[#fb923c] border border-[#ea580c]/60',
      description: 'Làm giảm 18% sản lượng do sự cố thiết bị.',
      vendorId: 'v-ktech'
    },
    {
      rank: 3,
      circleBg: 'bg-[#a855f7]',
      title: 'Tỷ lệ rework cao tại HOJEONG VINA',
      badge: '0.59',
      badgeColor: 'bg-[#431407] text-[#fb923c] border border-[#ea580c]/60',
      description: 'Làm tăng 12% thời gian sản xuất, ảnh hưởng tiến độ giao hàng.',
      vendorId: 'v-hojeongvina'
    },
    {
      rank: 4,
      circleBg: 'bg-[#10b981]',
      title: 'Thiếu nhân lực tại HSTEC',
      badge: '0.48',
      badgeColor: 'bg-[#042f2e] text-[#2dd4bf] border border-[#0d9488]/60',
      description: 'Giảm năng suất 15%, cần bổ sung 12 nhân công.',
      vendorId: 'v-hstec'
    },
    {
      rank: 5,
      circleBg: 'bg-[#f59e0b]',
      title: 'Kế hoạch thay đổi đột xuất',
      badge: '0.71',
      badgeColor: 'bg-[#431407] text-[#fb923c] border border-[#ea580c]/60',
      description: 'Gây xáo trộn kế hoạch, tăng thời gian chờ.'
    },
    {
      rank: 6,
      circleBg: 'bg-[#f59e0b]',
      title: 'Prebuild chưa đủ tại DAAL',
      badge: '0.63',
      badgeColor: 'bg-[#431407] text-[#fb923c] border border-[#ea580c]/60',
      description: 'Độ bao phủ kế hoạch thấp, tăng áp lực sản xuất hiện tại.',
      vendorId: 'v-daal'
    }
  ];

  // 2b. AI Cause Chains Definition (Chuỗi nguyên nhân)
  const aiChains = [
    {
      id: 1,
      source: 'DAAL: Thiếu vật liệu IC TPS54302',
      impact: 'Dừng Line SMT #02 & #04 (2.5h)',
      result: 'Hụt 3,800 pcs sản lượng cuối ngày',
      weight: '0.82',
      vendorId: 'v-daal'
    },
    {
      id: 2,
      source: 'KTECH: Kẹt feeder tự động slot #14',
      impact: 'Dừng đột xuất 75 phút tại Line 3',
      result: 'OEE giảm từ 82% xuống 60%',
      weight: '0.67',
      vendorId: 'v-ktech'
    },
    {
      id: 3,
      source: 'HOJEONG VINA: Lệch nhiệt độ bể hàn sóng',
      impact: 'Tỷ lệ lỗi hàn chập tăng vọt 2.85%',
      result: 'Tăng 12% hàng chờ Rework & chậm OTD',
      weight: '0.59',
      vendorId: 'v-hojeongvina'
    },
    {
      id: 4,
      source: 'HSTEC: 12 công nhân nghỉ do dịch cúm',
      impact: 'Thiếu nhân lực khâu đóng gói & test',
      result: 'Năng suất giảm 15% so với target',
      weight: '0.48',
      vendorId: 'v-hstec'
    }
  ];

  // 3. Driver Analysis Bars matching Screenshot 100%
  const driverBars = [
    { label: 'Kế hoạch sản xuất', percent: 28, color: 'bg-[#f43f5e]', icon: Calendar },
    { label: 'Prebuild', percent: 12, color: 'bg-[#10b981]', icon: Layers },
    { label: 'Kho vật liệu', percent: 18, color: 'bg-[#38bdf8]', icon: Package },
    { label: 'Nhân lực', percent: 15, color: 'bg-[#a855f7]', icon: Users },
    { label: 'Thiết bị', percent: 13, color: 'bg-[#f59e0b]', icon: Cog },
    { label: 'Chất lượng', percent: 10, color: 'bg-[#818cf8]', icon: ShieldCheck },
    { label: 'Rework', percent: 8, color: 'bg-[#fb7185]', icon: RotateCcw },
    { label: 'Yếu tố bên ngoài', percent: 4, color: 'bg-[#dc2626]', icon: AlertTriangle }
  ];

  // 4. Action Recommendations matching Screenshot 100%
  const actionList = [
    {
      order: 1,
      text: 'Bổ sung vật liệu cho DAAL trong 2 giờ tới.',
      priority: 'Cao',
      badgeClass: 'bg-[#450a0a] text-[#f87171] border border-[#b91c1c]'
    },
    {
      order: 2,
      text: 'Điều chuyển 5 nhân công từ KHV sang DAAL.',
      priority: 'Cao',
      badgeClass: 'bg-[#450a0a] text-[#f87171] border border-[#b91c1c]'
    },
    {
      order: 3,
      text: 'Rút ngắn thời gian QC, tăng 1 line kiểm tra.',
      priority: 'Trung bình',
      badgeClass: 'bg-[#431407] text-[#fb923c] border border-[#c2410c]'
    },
    {
      order: 4,
      text: 'Lên kế hoạch bảo trì thiết bị KTECH ngoài giờ.',
      priority: 'Trung bình',
      badgeClass: 'bg-[#431407] text-[#fb923c] border border-[#c2410c]'
    },
    {
      order: 5,
      text: 'Tăng Prebuild cho mã hàng A để giảm áp lực.',
      priority: 'Trung bình',
      badgeClass: 'bg-[#431407] text-[#fb923c] border border-[#c2410c]'
    },
    {
      order: 6,
      text: 'Theo dõi sát 3 TO có nguy cơ trễ trong 3 ngày tới.',
      priority: 'Thấp',
      badgeClass: 'bg-[#042f2e] text-[#2dd4bf] border border-[#0f766e]'
    }
  ];

  const handleTriggerAction = (act: typeof actionList[0]) => {
    operationsService.createTaskFromAIAction(
      act.text,
      act.priority as any,
      'v-daal'
    );
    setActionSuccessMsg(`Đã phát lệnh điều hành: "${act.text}"`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  return (
    <div className="p-3 lg:p-4 space-y-3.5 bg-[#040b17] min-h-screen text-slate-100 font-sans">
      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP SECTION: Causal Network Diagram (Left ~68%) + AI Insight (Right ~32%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
        {/* Causal Network Diagram Canvas (xl:col-span-8) */}
        <div className="xl:col-span-8 rounded-2xl bg-[#061224] border border-[#142c4c] p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Header of Causal Network */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#142c4c]/80">
            <div>
              <h2 className="text-sm lg:text-base font-black text-white tracking-wide uppercase font-sans">
                SƠ ĐỒ NHÂN QUẢ ẢNH HƯỞNG ĐẾN SẢN LƯỢNG
              </h2>
              <div className="text-xs text-[#00e5ff] font-medium mt-0.5">
                Mối quan hệ giữa các yếu tố từ kế hoạch → sản xuất → giao hàng (Causal Network)
              </div>
            </div>

            {/* Filter Buttons & Explain Model */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center bg-[#07172e] border border-[#163359] rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    onSelectVendor(null);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-[#0070d8] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Toàn Group
                </button>
                <button
                  onClick={() => setActiveFilter('vendor')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    activeFilter === 'vendor'
                      ? 'bg-[#0070d8] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Từng nhà gia công
                </button>
                <button
                  onClick={() => setActiveFilter('sku')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    activeFilter === 'sku'
                      ? 'bg-[#0070d8] text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Từng mã hàng
                </button>
              </div>

              <button
                onClick={() => setShowExplainModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071d33] border border-cyan-400/70 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Giải thích</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Selection Bar (Active when vendor or sku tab is selected) */}
          {activeFilter === 'vendor' && (
            <div className="flex items-center gap-2 py-2 px-3 bg-[#081730] border-b border-[#142c4c] text-xs overflow-x-auto">
              <span className="text-slate-400 text-[11px] font-semibold shrink-0">Chọn lọc Nhà gia công:</span>
              <button
                onClick={() => onSelectVendor(null)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${!selectedVendorId ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-[#0c1f38] text-slate-300'}`}
              >
                Tất cả (7 nhà)
              </button>
              {vendors.map(v => (
                <button
                  key={v.id}
                  onClick={() => onSelectVendor(v.id === selectedVendorId ? null : v.id)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                    selectedVendorId === v.id
                      ? 'bg-[#0070d8] text-white shadow-md'
                      : 'bg-[#0c1f38] text-slate-300 hover:text-white'
                  }`}
                >
                  {v.code}
                </button>
              ))}
            </div>
          )}

          {activeFilter === 'sku' && (
            <div className="flex items-center gap-2 py-2 px-3 bg-[#081730] border-b border-[#142c4c] text-xs overflow-x-auto">
              <span className="text-slate-400 text-[11px] font-semibold shrink-0">Chọn mã linh kiện / SKU:</span>
              {['PCB-MAIN-V17 (Ưu tiên)', 'MOD-SENSOR-8B', 'POWER-CTRL-X1', 'SUB-DISPLAY-A2'].map((sku, idx) => (
                <span
                  key={sku}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                    idx === 0 ? 'bg-[#0070d8] text-white shadow-sm' : 'bg-[#0c1f38] text-slate-400 hover:text-white'
                  }`}
                >
                  {sku}
                </span>
              ))}
            </div>
          )}

          {/* Legend Strip */}
          <div className="flex items-center gap-6 py-2 text-[11px] text-slate-300 border-b border-[#142c4c]/40 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#10b981] inline-block" />
              <ArrowRight className="w-3 h-3 text-[#10b981] -ml-1.5" />
              <span>Ảnh hưởng tích cực</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#f43f5e] inline-block" />
              <ArrowRight className="w-3 h-3 text-[#f43f5e] -ml-1.5" />
              <span>Ảnh hưởng tiêu cực</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-slate-400 inline-block border-t border-dashed" />
              <span>Mối liên hệ</span>
            </div>
          </div>

          {/* Causal Network Interactive 2D Layout Canvas */}
          <div className="relative min-h-[460px] w-full mt-2 rounded-xl bg-[#040e1c] p-3 border border-[#112642] overflow-x-auto select-none">
            <div className="relative w-[860px] min-w-[860px] min-h-[440px]">
              {/* SVG Connecting Paths with Impact Weights matching Reference Coordinates */}
              <svg className="absolute inset-0 w-[860px] h-[440px] pointer-events-none z-0">
                {/* Path 1: Plan -> QC (0.6, Green) */}
                <path d="M 203 52 C 211 52, 211 52, 219 52" stroke="#10b981" strokeWidth="2.5" fill="none" />
                {/* Path 2: Plan -> Prebuild (0.4, Cyan) */}
                <path d="M 101 125 L 101 142" stroke="#00e5ff" strokeWidth="2.5" fill="none" />
                {/* Path 3: Prebuild -> HR (0.7, Cyan) */}
                <path d="M 203 194 C 211 194, 211 194, 219 194" stroke="#00e5ff" strokeWidth="2.5" fill="none" />
                {/* Path 4: QC -> Rework (0.8, Red) */}
                <path d="M 422 52 C 430 52, 430 52, 438 52" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                {/* Path 5: QC -> HR (0.9, Red) */}
                <path d="M 315 125 L 315 142" stroke="#f43f5e" strokeWidth="3" fill="none" />
                {/* Path 6: QC -> Output (0.5, Red) */}
                <path d="M 422 95 C 430 115, 430 150, 438 175" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                {/* Path 7: Rework -> Output (0.6, Orange) */}
                <path d="M 540 125 L 540 142" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                {/* Path 8: Rework -> Delivery (0.8, Green) */}
                <path d="M 641 60 C 650 90, 650 150, 657 175" stroke="#10b981" strokeWidth="2.5" fill="none" />
                {/* Path 9: HR -> Output (0.9, Red) */}
                <path d="M 422 194 C 430 194, 430 194, 438 194" stroke="#f43f5e" strokeWidth="3.5" fill="none" />
                {/* Path 10: HR -> QC (0.6, Green) */}
                <path d="M 335 142 L 335 125" stroke="#10b981" strokeWidth="2" fill="none" />
                {/* Path 11: Material -> Prebuild (0.4, Cyan) */}
                <path d="M 101 284 L 101 268" stroke="#00e5ff" strokeWidth="2.5" fill="none" />
                {/* Path 12: Material -> HR (0.4, Orange) */}
                <path d="M 203 330 C 212 300, 212 250, 219 220" stroke="#f59e0b" strokeWidth="2" fill="none" />
                {/* Path 13: Material -> Equipment (0.5, Cyan) */}
                <path d="M 203 355 C 211 355, 211 355, 219 355" stroke="#00e5ff" strokeWidth="2" fill="none" />
                {/* Path 14: Equipment -> Output (0.8, Orange) */}
                <path d="M 422 330 C 430 300, 430 260, 438 235" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                {/* Path 15: Equipment -> External (0.5, Gray dashed) */}
                <path d="M 422 360 C 430 360, 430 360, 438 360" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
                {/* Path 16: External -> Output (0.5, Green) */}
                <path d="M 540 297 L 540 280" stroke="#10b981" strokeWidth="2" fill="none" />
                {/* Path 17: Output -> Delivery (0.5, Green) */}
                <path d="M 641 194 C 649 194, 649 194, 657 194" stroke="#10b981" strokeWidth="3" fill="none" />
              </svg>

              {/* Connecting Weight Value Badges matching Screenshot */}
              <div className="absolute top-[41px] left-[201px] z-20 w-5 h-5 rounded-full bg-[#071f1a] border border-[#10b981] text-[#10b981] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.6</div>
              <div className="absolute top-[125px] left-[91px] z-20 w-5 h-5 rounded-full bg-[#0c2a4d] border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.4</div>
              <div className="absolute top-[183px] left-[201px] z-20 w-5 h-5 rounded-full bg-[#0c2a4d] border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.7</div>
              <div className="absolute top-[41px] left-[420px] z-20 w-5 h-5 rounded-full bg-[#3d0d16] border border-[#f43f5e] text-[#f43f5e] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.8</div>
              <div className="absolute top-[125px] left-[305px] z-20 w-5 h-5 rounded-full bg-[#3d0d16] border border-[#f43f5e] text-[#f43f5e] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.9</div>
              <div className="absolute top-[125px] left-[420px] z-20 w-5 h-5 rounded-full bg-[#3d0d16] border border-[#f43f5e] text-[#f43f5e] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.5</div>
              <div className="absolute top-[125px] left-[530px] z-20 w-5 h-5 rounded-full bg-[#381e09] border border-[#f59e0b] text-[#f59e0b] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.6</div>
              <div className="absolute top-[105px] left-[641px] z-20 w-5 h-5 rounded-full bg-[#071f1a] border border-[#10b981] text-[#10b981] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.8</div>
              <div className="absolute top-[183px] left-[420px] z-20 w-5 h-5 rounded-full bg-[#3d0d16] border border-[#f43f5e] text-[#f43f5e] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.9</div>
              <div className="absolute top-[125px] left-[330px] z-20 w-5 h-5 rounded-full bg-[#071f1a] border border-[#10b981] text-[#10b981] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.6</div>
              <div className="absolute top-[267px] left-[91px] z-20 w-5 h-5 rounded-full bg-[#0c2a4d] border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.4</div>
              <div className="absolute top-[267px] left-[201px] z-20 w-5 h-5 rounded-full bg-[#381e09] border border-[#f59e0b] text-[#f59e0b] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.4</div>
              <div className="absolute top-[344px] left-[201px] z-20 w-5 h-5 rounded-full bg-[#0c2a4d] border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.5</div>
              <div className="absolute top-[270px] left-[420px] z-20 w-5 h-5 rounded-full bg-[#381e09] border border-[#f59e0b] text-[#f59e0b] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.8</div>
              <div className="absolute top-[349px] left-[420px] z-20 w-5 h-5 rounded-full bg-[#1b2533] border border-[#94a3b8] text-slate-300 text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.5</div>
              <div className="absolute top-[278px] left-[530px] z-20 w-5 h-5 rounded-full bg-[#071f1a] border border-[#10b981] text-[#10b981] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.5</div>
              <div className="absolute top-[183px] left-[641px] z-20 w-5 h-5 rounded-full bg-[#071f1a] border border-[#10b981] text-[#10b981] text-[10px] font-bold font-mono flex items-center justify-center shadow-sm">0.5</div>

              {/* 4 Columns of Nodes in 2D Space */}
              <div className="grid grid-cols-4 gap-4 w-full z-10 relative">
                {/* Column 1: Plan, Prebuild, Material */}
                <div className="space-y-3">
                {causalNodes.filter(n => n.col === 1).map(node => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.id}
                      className={`p-2.5 rounded-xl border ${node.themeColor} shadow-md transition-all hover:scale-[1.02] cursor-pointer`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                        </div>
                        <span className="text-[11px] font-black text-white tracking-wide">
                          {node.title}
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-300 pl-1 font-medium">
                        {node.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.bulletDot}`} />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: QC, HR, Equipment */}
              <div className="space-y-3">
                {causalNodes.filter(n => n.col === 2).map(node => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.id}
                      className={`p-2.5 rounded-xl border ${node.themeColor} shadow-md transition-all hover:scale-[1.02] cursor-pointer`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                        </div>
                        <span className="text-[11px] font-black text-white tracking-wide">
                          {node.title}
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-300 pl-1 font-medium">
                        {node.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.bulletDot}`} />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Column 3: Rework, Center Hub (Actual Output), External Factors */}
              <div className="space-y-3">
                {/* Node: Rework */}
                {(() => {
                  const node = causalNodes.find(n => n.id === 'node-rework')!;
                  const Icon = node.icon;
                  return (
                    <div className={`p-2.5 rounded-xl border ${node.themeColor} shadow-md transition-all hover:scale-[1.02] cursor-pointer`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                        </div>
                        <span className="text-[11px] font-black text-white tracking-wide">
                          {node.title}
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-300 pl-1 font-medium">
                        {node.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.bulletDot}`} />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Node: Center Hub (Sản lượng thực tế) */}
                {(() => {
                  const node = causalNodes.find(n => n.id === 'node-output')!;
                  const Icon = node.icon;
                  return (
                    <div className={`p-3 rounded-2xl border-2 ${node.themeColor} transition-all hover:scale-[1.03] cursor-pointer`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-xl ${node.iconBg} flex items-center justify-center shrink-0 shadow-[0_0_15px_#0070d8]`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-black text-white tracking-wider">
                          {node.title}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[10.5px] text-slate-200 pl-1 font-semibold">
                        {node.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.bulletDot} shadow-[0_0_6px_#00e5ff]`} />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Node: Yếu tố bên ngoài */}
                {(() => {
                  const node = causalNodes.find(n => n.id === 'node-external')!;
                  const Icon = node.icon;
                  return (
                    <div className={`p-2.5 rounded-xl border ${node.themeColor} shadow-md transition-all hover:scale-[1.02] cursor-pointer`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                        </div>
                        <span className="text-[11px] font-black text-white tracking-wide">
                          {node.title}
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-300 pl-1 font-medium">
                        {node.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.bulletDot}`} />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Column 4: Giao hàng (TO / OTD) */}
              <div className="space-y-3 pt-28">
                {(() => {
                  const node = causalNodes.find(n => n.id === 'node-delivery')!;
                  const Icon = node.icon;
                  return (
                    <div className={`p-3 rounded-xl border ${node.themeColor} shadow-md transition-all hover:scale-[1.02] cursor-pointer`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                        </div>
                        <span className="text-[11px] font-black text-white tracking-wide">
                          {node.title}
                        </span>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-300 pl-1 font-medium">
                        {node.bullets.map((b, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.bulletDot}`} />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI INSIGHT - Ranked Bottlenecks Panel (xl:col-span-4) */}
      <div className="xl:col-span-4 rounded-2xl bg-[#061224] border border-[#142c4c] p-4 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#142c4c]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0c2a4d] to-[#06162d] border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <svg className="w-4 h-4 stroke-cyan-400 fill-none" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.08A3.5 3.5 0 0 0 4.5 8c0 .35.05.69.15 1A3.5 3.5 0 0 0 3 12c0 1.25.66 2.35 1.65 2.95A3.5 3.5 0 0 0 7 19.5v.08A2.5 2.5 0 0 0 9.5 22h.5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-.5zM14.5 2a2.5 2.5 0 0 1 2.5 2.5v.08A3.5 3.5 0 0 1 19.5 8c0 .35-.05.69-.15 1A3.5 3.5 0 0 1 21 12c0 1.25-.66 2.35-1.65 2.95A3.5 3.5 0 0 1 17 19.5v.08A2.5 2.5 0 0 1 14.5 22h-.5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
              AI INSIGHT - PHÂN TÍCH NHÂN QUẢ
            </h3>
          </div>

          {/* Sub Tabs: Ảnh hưởng chính | Chuỗi nguyên nhân */}
          <div className="grid grid-cols-2 gap-1.5 my-3 bg-[#081730] p-1 rounded-xl border border-[#163359]">
            <button
              onClick={() => setActiveInsightTab('main')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeInsightTab === 'main'
                  ? 'bg-[#0070d8] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ảnh hưởng chính
            </button>
            <button
              onClick={() => setActiveInsightTab('chains')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeInsightTab === 'chains'
                  ? 'bg-[#0070d8] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chuỗi nguyên nhân
            </button>
          </div>

          {/* List of 6 Ranked AI Insights OR Cause Chains */}
          <div className="space-y-2.5">
            {activeInsightTab === 'main' ? (
              aiInsights.map(item => (
                <div
                  key={item.rank}
                  onClick={() => {
                    if (item.vendorId) onSelectVendor(item.vendorId);
                  }}
                  className="p-2.5 rounded-xl bg-[#081528] border border-[#142c4c] hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full ${item.circleBg} text-white flex items-center justify-center text-xs font-black font-mono shadow-sm`}>
                        {item.rank}
                      </span>
                      <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug pl-7">
                    {item.description}
                  </p>
                </div>
              ))
            ) : (
              aiChains.map(chain => (
                <div
                  key={chain.id}
                  onClick={() => {
                    if (chain.vendorId) onSelectVendor(chain.vendorId);
                  }}
                  className="p-2.5 rounded-xl bg-[#081528] border border-[#142c4c] hover:border-cyan-500/50 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-black font-mono shadow-sm">
                        {chain.id}
                      </span>
                      <span className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                        {chain.source}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-[#450a0a] text-[#f87171] border border-[#dc2626]/60">
                      {chain.weight}
                    </span>
                  </div>
                  <div className="pl-7 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                      <ArrowRight className="w-3 h-3 shrink-0 text-amber-400" />
                      <span>{chain.impact}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                      <ArrowRight className="w-3 h-3 shrink-0 text-rose-400" />
                      <span>{chain.result}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>

      {/* BOTTOM SECTION: 3 Columns matching Screenshot 100% */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Panel 1: Phân tích đóng góp (Driver Analysis) */}
        <div className="rounded-2xl bg-[#061224] border border-[#142c4c] p-4 shadow-xl">
          <div className="pb-2.5 border-b border-[#142c4c] mb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              PHÂN TÍCH ĐÓNG GÓP (DRIVER ANALYSIS)
            </h3>
          </div>

          <div className="space-y-2.5">
            {driverBars.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 w-36 shrink-0 text-slate-300 text-[11px] font-semibold">
                    <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{d.label}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-3.5 bg-[#081730] rounded-full overflow-hidden border border-[#142c4c]">
                      <div
                        className={`h-full rounded-full ${d.color} shadow-sm`}
                        style={{ width: `${d.percent * 3.4}%` }}
                      />
                    </div>
                    <span className="font-mono font-black text-white text-xs w-9 text-right shrink-0">
                      {d.percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Kịch bản dự báo sản lượng cuối ngày */}
        <div className="rounded-2xl bg-[#061224] border border-[#142c4c] p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#142c4c] mb-3">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  KỊCH BẢN DỰ BÁO SẢN LƯỢNG CUỐI NGÀY
                </h3>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Legend at Top of Chart */}
            <div className="flex items-center gap-4 text-[11px] text-slate-300 mb-2 font-medium">
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-0.5 bg-white inline-block" />
                <ArrowRight className="w-2.5 h-2.5 text-white -ml-1" />
                <span>Kế hoạch</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0070d8] inline-block" />
                <span>Thực tế</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block" />
                <span>Dự báo</span>
              </div>
            </div>

            {/* Graph + KPI Grid layout matching Screenshot 100% */}
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Left: Accurate Area Chart with Axes (col-span-8) */}
              <div className="col-span-8 relative h-36">
                <svg className="w-full h-full" viewBox="0 0 240 120">
                  {/* Grid lines */}
                  <line x1="30" y1="20" x2="230" y2="20" stroke="#132742" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="30" y1="45" x2="230" y2="45" stroke="#132742" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="30" y1="70" x2="230" y2="70" stroke="#132742" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="30" y1="95" x2="230" y2="95" stroke="#132742" strokeWidth="1" />

                  {/* Y-axis Labels */}
                  <text x="25" y="23" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">20,000</text>
                  <text x="25" y="48" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">15,000</text>
                  <text x="25" y="73" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">10,000</text>
                  <text x="25" y="98" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">5,000</text>
                  <text x="25" y="112" textAnchor="end" fill="#64748b" fontSize="7" fontFamily="monospace">0</text>

                  {/* Shaded Area for Actual */}
                  <defs>
                    <linearGradient id="actualAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="30,110 30,105 75,95 125,75 175,55 175,110"
                    fill="url(#actualAreaGrad)"
                  />

                  {/* White Trajectory Line: Kế hoạch */}
                  <line x1="30" y1="40" x2="230" y2="25" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Blue Curve: Thực tế */}
                  <path d="M 30 105 Q 100 85 175 55" fill="none" stroke="#0070d8" strokeWidth="2.5" />

                  {/* Orange Dashed Projection: Dự báo */}
                  <path d="M 175 55 Q 200 50 230 45" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />

                  {/* Data Points */}
                  <circle cx="30" cy="105" r="2.5" fill="#0070d8" />
                  <circle cx="75" cy="95" r="2.5" fill="#0070d8" />
                  <circle cx="125" cy="75" r="2.5" fill="#0070d8" />
                  <circle cx="175" cy="55" r="3.5" fill="#00e5ff" stroke="#fff" strokeWidth="1" />
                  <circle cx="230" cy="45" r="3" fill="#f59e0b" stroke="#fff" strokeWidth="1" />

                  {/* X-axis Labels */}
                  <text x="30" y="118" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">08:00</text>
                  <text x="75" y="118" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">10:00</text>
                  <text x="125" y="118" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">12:00</text>
                  <text x="175" y="118" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">14:00</text>
                  <text x="230" y="118" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">16:00</text>
                </svg>
              </div>

              {/* Right: 3 KPI Metrics matching Screenshot (col-span-4) */}
              <div className="col-span-4 space-y-2 text-right">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Kế hoạch hôm nay</div>
                  <div className="text-sm font-black text-white font-mono leading-tight">
                    18,000 <span className="text-[10px] text-slate-400 font-sans font-normal">pcs</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Dự báo cuối ngày</div>
                  <div className="text-sm font-black text-[#facc15] font-mono leading-tight">
                    14,200 <span className="text-[10px] text-[#facc15] font-sans font-normal">pcs (79%)</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Nguy cơ thiếu</div>
                  <div className="text-sm font-black text-[#f43f5e] font-mono leading-tight">
                    -3,800 <span className="text-[10px] text-[#f43f5e] font-sans font-normal">pcs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Đề xuất hành động (AI) */}
        <div className="rounded-2xl bg-[#061224] border border-[#142c4c] p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#142c4c] mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#00e5ff]" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  ĐỀ XUẤT HÀNH ĐỘNG (AI)
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('tasks')}
                className="text-xs text-[#00e5ff] hover:underline font-bold"
              >
                Xem tất cả &gt;
              </button>
            </div>

            <div className="space-y-2">
              {actionList.map(act => (
                <div
                  key={act.order}
                  onClick={() => handleTriggerAction(act)}
                  className="p-2 rounded-xl bg-[#081528] border border-[#142c4c] hover:border-cyan-500/50 flex items-center justify-between gap-2 cursor-pointer transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-xs font-black shrink-0 font-mono shadow-sm">
                      {act.order}
                    </span>
                    <span className="text-xs text-slate-200 truncate group-hover:text-cyan-300 transition-colors font-medium">
                      {act.text}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono shrink-0 ${act.badgeClass}`}>
                    {act.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model Explanation Modal */}
      {showExplainModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#091526] border border-cyan-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Giải Thích Thuật Toán Mạng Nhân Quả (Causal AI Network)
                </h3>
              </div>
              <button onClick={() => setShowExplainModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                Mô hình sử dụng mạng Bayes động học (Dynamic Bayesian Network) tích hợp thuật toán phân tích nguyên nhân gốc rễ (Root Cause Driver Analysis) để mô phỏng tác động lan truyền giữa 10 nhân tố sản xuất.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-cyan-400 font-bold">• Trọng số liên kết (0.0 → 1.0):</div>
                <div className="text-slate-300">Biểu thị xác suất điều kiện và mức độ nhạy cảm của sản lượng khi xảy ra biến động tại mắt xích nguồn.</div>
                <div className="text-emerald-400 font-bold">• Mũi tên xanh lá:</div>
                <div className="text-slate-300">Tác động tỷ lệ thuận (Tăng cường năng lực đầu ra).</div>
                <div className="text-rose-400 font-bold">• Mũi tên đỏ:</div>
                <div className="text-slate-300">Tác động tiêu cực gây tắc nghẽn hoặc sụt giảm sản lượng (Bottleneck).</div>
              </div>
              <p className="text-slate-400 text-[11px]">
                Dữ liệu được cập nhật tự động từ kết nối GMES API và hệ thống SCADA theo chu kỳ 15 phút.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
