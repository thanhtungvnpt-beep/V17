import React, { useState } from 'react';
import { 
  Wrench, AlertTriangle, CheckCircle2, Cog, 
  Search, Plus, Check, X, ShieldAlert, BookOpen, UserCheck, Clock
} from 'lucide-react';
import { Equipment, Vendor, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface EquipmentModuleProps {
  equipments: Equipment[];
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
  selectedVendorId: string | null;
}

export const EquipmentModule: React.FC<EquipmentModuleProps> = ({
  equipments,
  vendors,
  currentLang,
  currentUser,
  selectedVendorId
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'breakdown' | 'maintenance'>('all');
  const [selectedSOP, setSelectedSOP] = useState<{ title: string; sop: string; code: string } | null>(null);
  const [signoffEquipment, setSignoffEquipment] = useState<Equipment | null>(null);
  const [signoffNotes, setSignoffNotes] = useState('');
  const [reportModal, setReportModal] = useState<Equipment | null>(null);
  const [reportIssue, setReportIssue] = useState('');
  const [reportSOP, setReportSOP] = useState('SOP-EQ-GEN: Kiểm tra nguồn, áp suất khí nén, và khởi động lại chu trình');
  const [notification, setNotification] = useState<string | null>(null);

  const canSignoff = currentUser.role === 'Executive' || currentUser.role === 'OutsourcingManager' || currentUser.role === 'EquipmentTech';

  const filtered = equipments.filter(eq => {
    const matchesVendor = !selectedVendorId || eq.vendorId === selectedVendorId;
    const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
    const matchesSearch = 
      eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.lineNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVendor && matchesStatus && matchesSearch;
  });

  const handleConfirmSignoff = () => {
    if (!signoffEquipment) return;
    operationsService.signoffEquipmentRepair(signoffEquipment.id, signoffNotes);
    setNotification(`Kỹ sư ${currentUser.name} đã ký xác nhận hoàn thành sửa chữa máy ${signoffEquipment.code}!`);
    setSignoffEquipment(null);
    setSignoffNotes('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConfirmReport = () => {
    if (!reportModal || !reportIssue) return;
    operationsService.reportEquipmentIncident(reportModal.id, reportIssue, reportSOP);
    setNotification(`Đã ghi nhận sự cố dừng máy cho thiết bị ${reportModal.code}!`);
    setReportModal(null);
    setReportIssue('');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="p-3 lg:p-5 space-y-4">
      {notification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090f1d] border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <span>Quản lý Thiết bị & Sự cố Dừng máy (Equipment OEE & Maintenance)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Giám sát OEE thời gian thực, sự cố dừng máy, quy trình SOP và biên bản nghiệm thu tái vận hành có chữ ký kỹ sư.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã máy, tên thiết bị..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            {(['all', 'running', 'breakdown', 'maintenance'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                {st === 'all' ? 'Tất cả' : st === 'running' ? 'Đang chạy' : st === 'breakdown' ? 'Sự cố' : 'Bảo trì'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#090f1d] border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Hiệu suất OEE trung bình</span>
          <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">74.2%</div>
          <span className="text-[10px] text-slate-500">Mục tiêu ca: &gt; 85%</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#090f1d] border border-rose-900/60">
          <span className="text-rose-400 block text-[11px]">Tổng thời gian dừng máy (Downtime)</span>
          <div className="text-lg font-bold font-mono text-rose-400 mt-0.5">142 phút</div>
          <span className="text-[10px] text-slate-500">Tại KTECH & DAAL</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#090f1d] border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Thời gian giữa 2 sự cố (MTBF)</span>
          <div className="text-lg font-bold font-mono text-white mt-0.5">144 giờ</div>
          <span className="text-[10px] text-emerald-400">Đạt ngưỡng an toàn</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#090f1d] border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Thời gian khắc phục trung bình (MTTR)</span>
          <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">1.5 giờ</div>
          <span className="text-[10px] text-slate-500">Giới hạn cam kết: &lt; 2h</span>
        </div>
      </div>

      {/* Equipment List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(eq => {
          const vendor = vendors.find(v => v.id === eq.vendorId);
          return (
            <div
              key={eq.id}
              className={`rounded-2xl bg-[#090f1d] border p-4 space-y-3 flex flex-col justify-between transition-all ${
                eq.status === 'breakdown'
                  ? 'border-rose-900/80 ring-1 ring-rose-500/30'
                  : eq.status === 'maintenance'
                  ? 'border-amber-900/80'
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{eq.code}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                        {eq.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5 truncate max-w-[220px]">
                      {eq.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {vendor?.code} · {eq.lineNo}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    eq.status === 'breakdown'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : eq.status === 'maintenance'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {eq.status === 'breakdown' ? 'Dừng máy' : eq.status === 'maintenance' ? 'Bảo trì' : 'Đang chạy'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Hiệu suất OEE</span>
                    <span className={`font-mono font-bold ${eq.oeePercent < 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {eq.oeePercent}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Bảo trì tiếp theo</span>
                    <span className="font-mono text-slate-300">
                      {eq.nextMaintenanceDate}
                    </span>
                  </div>
                </div>

                {/* Current Incident Banner */}
                {eq.currentIncident && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs space-y-1.5">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sự cố: {eq.currentIncident.downtimeMinutes} phút dừng máy</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {eq.currentIncident.issue}
                    </p>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-rose-900/60">
                      <span>Báo bởi: {eq.currentIncident.reportedBy}</span>
                      <span className="font-semibold text-amber-300">
                        {eq.currentIncident.repairStatus === 'in_repair' ? 'Đang sửa chữa' : 'Chờ nghiệm thu'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                {eq.currentIncident?.sopGuide ? (
                  <button
                    onClick={() => setSelectedSOP({
                      title: eq.name,
                      code: eq.code,
                      sop: eq.currentIncident!.sopGuide
                    })}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem SOP xử lý</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500">SOP tiêu chuẩn sẵn sàng</span>
                )}

                <div className="flex items-center gap-1.5">
                  {eq.status === 'breakdown' ? (
                    canSignoff ? (
                      <button
                        onClick={() => setSignoffEquipment(eq)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Ký nghiệm thu</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Cần kỹ sư ký</span>
                    )
                  ) : (
                    <button
                      onClick={() => setReportModal(eq)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                    >
                      Báo dừng máy
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SOP Emergency Guide Modal */}
      {selectedSOP && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Quy trình xử lý sự cố chuẩn (SOP Guide)</span>
              </h3>
              <button onClick={() => setSelectedSOP(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Thiết bị:</span>
                <span className="text-cyan-300 font-bold font-mono">{selectedSOP.code}</span> · {selectedSOP.title}
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs leading-relaxed space-y-2">
                <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
                  Các bước thao tác khôi phục:
                </div>
                <p className="text-slate-200">{selectedSOP.sop}</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300">
                ⚠️ CẢNH BÁO: AI chỉ hướng dẫn quy trình tiêu chuẩn. Tuyệt đối không tự ý bật máy khi chưa có chữ ký nghiệm thu của Kỹ sư vận hành.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSOP(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
              >
                Đóng hướng dẫn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Technician Signoff Modal */}
      {signoffEquipment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Ký xác nhận hoàn thành sửa chữa & Nghiệm thu</span>
              </h3>
              <button onClick={() => setSignoffEquipment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>Thiết bị: <span className="font-mono text-cyan-300 font-bold">{signoffEquipment.code}</span></div>
                <div>Sự cố đã xử lý: <span className="text-white">{signoffEquipment.currentIncident?.issue}</span></div>
                <div>Người ký duyệt: <span className="text-emerald-400 font-bold">{currentUser.name} ({currentUser.role})</span></div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ghi chú kiểm tra nghiệm thu *</label>
                <textarea
                  rows={3}
                  placeholder="Xác nhận đã test chạy không tải 15 phút và test 30 board không phát sinh lỗi..."
                  value={signoffNotes}
                  onChange={e => setSignoffNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSignoffEquipment(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSignoff}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Ký nghiệm thu & Bật máy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Incident Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Báo cáo sự cố dừng máy khẩn cấp</span>
              </h3>
              <button onClick={() => setReportModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div>Thiết bị: <span className="font-mono text-cyan-300 font-bold">{reportModal.code}</span> · {reportModal.name}</div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mô tả hiện tượng sự cố *</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả hiện tượng máy dừng, mã lỗi trên màn hình SCADA..."
                  value={reportIssue}
                  onChange={e => setReportIssue(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setReportModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReport}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Ghi nhận dừng máy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
