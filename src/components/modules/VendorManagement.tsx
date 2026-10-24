import React, { useState } from 'react';
import { 
  Building2, Search, Filter, Phone, MapPin, CheckCircle2, 
  AlertTriangle, ShieldAlert, Cpu, Package, ArrowUpRight, 
  ChevronRight, X, Clock, FileText
} from 'lucide-react';
import { Vendor, Language, UserProfile } from '../../types';
import { translations } from '../../locales/i18n';

interface VendorManagementProps {
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const VendorManagement: React.FC<VendorManagementProps> = ({
  vendors,
  currentLang,
  currentUser,
  selectedVendorId,
  onSelectVendor,
  onNavigateToTab
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'warning' | 'critical'>('all');
  const [inspectVendor, setInspectVendor] = useState<Vendor | null>(
    vendors.find(v => v.id === selectedVendorId) || null
  );

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3 lg:p-5 space-y-4">
      {/* Top Header & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090f1d] border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Quản lý 7 Nhà gia công (Vendor Operations)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hồ sơ năng lực, tiến độ ca, chỉ số chất lượng và thiết bị theo từng đối tác gia công.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã, tên NCC hoặc KCN..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52 sm:w-64"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Ổn định
            </button>
            <button
              onClick={() => setFilterStatus('warning')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-400'
              }`}
            >
              Cảnh báo
            </button>
            <button
              onClick={() => setFilterStatus('critical')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterStatus === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400'
              }`}
            >
              Nguy cơ cao
            </button>
          </div>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVendors.map(vendor => {
          const isSelected = selectedVendorId === vendor.id;
          return (
            <div
              key={vendor.id}
              className={`rounded-2xl bg-[#090f1d] border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : vendor.status === 'critical'
                  ? 'border-rose-900/80 hover:border-rose-600'
                  : vendor.status === 'warning'
                  ? 'border-amber-900/80 hover:border-amber-600'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Photo & Status Banner */}
              <div className="relative h-28 w-full bg-slate-800 overflow-hidden">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-black/40 to-transparent" />
                
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-slate-700 text-xs font-black font-mono text-cyan-300">
                  {vendor.code}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    vendor.status === 'critical'
                      ? 'bg-rose-600 text-white shadow-lg'
                      : vendor.status === 'warning'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {vendor.status === 'critical' ? 'Khẩn cấp' : vendor.status === 'warning' ? 'Cảnh báo' : 'Ổn định'}
                  </span>
                </div>

                <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-bold truncate">
                  {vendor.name}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="p-3.5 space-y-3 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{vendor.location}</span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Tiến độ sản lượng:</span>
                    <span className={`font-mono font-bold ${
                      vendor.completionRate >= 80 ? 'text-emerald-400' : vendor.completionRate >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {vendor.completionRate}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        vendor.completionRate >= 80 ? 'bg-emerald-500' : vendor.completionRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${vendor.completionRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>Thực tế: {vendor.actualPcs.toLocaleString()}</span>
                    <span>Mục tiêu: {vendor.planPcs.toLocaleString()}</span>
                  </div>
                </div>

                {/* Secondary KPIs */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Tỷ lệ lỗi (QC)</span>
                    <span className={`font-mono font-bold ${vendor.defectRate > 2.0 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {vendor.defectRate}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Đệm vật liệu</span>
                    <span className={`font-mono font-bold ${vendor.materialBufferHours < 4 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {vendor.materialBufferHours} giờ
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Dây chuyền</span>
                    <span className="font-mono font-bold text-slate-200">
                      {vendor.activeLines}/{vendor.totalLines} lines
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Giao đúng hạn</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {vendor.onTimeDeliveryRate}%
                    </span>
                  </div>
                </div>

                {vendor.notes && (
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-300">
                    <span className="text-cyan-400 font-semibold">Ghi chú ca: </span>
                    {vendor.notes}
                  </div>
                )}
              </div>

              {/* Bottom Card Action */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    onSelectVendor(vendor.id);
                    onNavigateToTab('overview');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Lọc Tổng quan</span>
                </button>

                <button
                  onClick={() => setInspectVendor(vendor)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Hồ sơ chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Inspection Drawer / Modal */}
      {inspectVendor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 lg:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                  <img src={inspectVendor.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{inspectVendor.code}</span>
                    <span className="text-xs text-slate-400">· {inspectVendor.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {inspectVendor.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {inspectVendor.manager} ({inspectVendor.phone})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectVendor(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operational Deep Dive */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">Tiến độ ca 1 hôm nay</div>
                <div className="text-lg font-bold font-mono text-white">
                  {inspectVendor.actualPcs.toLocaleString()} / {inspectVendor.planPcs.toLocaleString()}
                </div>
                <div className="text-cyan-400 font-mono mt-1">Đạt {inspectVendor.completionRate}% mục tiêu</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">Chất lượng & Hồ sơ CAPA</div>
                <div className="text-lg font-bold font-mono text-rose-400">
                  {inspectVendor.defectRate}% Defect Rate
                </div>
                <div className="text-amber-400 mt-1">{inspectVendor.pendingCAPA} hồ sơ CAPA đang mở</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 font-semibold mb-1">Tình trạng vật tư & OTD</div>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {inspectVendor.onTimeDeliveryRate}% OTD
                </div>
                <div className="text-slate-400 mt-1">Đệm kho: {inspectVendor.materialBufferHours} giờ</div>
              </div>
            </div>

            {/* Equipment & Lines Breakdown */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>Trạng thái thiết bị & Dây chuyền sản xuất</span>
                <span className="text-slate-400 font-normal">
                  Đang chạy: {inspectVendor.activeLines}/{inspectVendor.totalLines} Lines
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {inspectVendor.notes || 'Không có cảnh báo dừng chuyền đột xuất.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectVendor(inspectVendor.id);
                  onNavigateToTab('production');
                  setInspectVendor(null);
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Xem Kế hoạch sản xuất
              </button>
              <button
                onClick={() => {
                  onSelectVendor(inspectVendor.id);
                  onNavigateToTab('quality');
                  setInspectVendor(null);
                }}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Kiểm tra chất lượng QC
              </button>
              <button
                onClick={() => {
                  onSelectVendor(inspectVendor.id);
                  onNavigateToTab('materials');
                  setInspectVendor(null);
                }}
                className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                Cấp phát vật liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
