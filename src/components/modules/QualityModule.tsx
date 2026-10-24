import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, 
  Search, Plus, Check, X, FileText, UserCheck, ArrowRight
} from 'lucide-react';
import { QualityInspection, Vendor, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface QualityModuleProps {
  inspections: QualityInspection[];
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
  selectedVendorId: string | null;
}

export const QualityModule: React.FC<QualityModuleProps> = ({
  inspections,
  vendors,
  currentLang,
  currentUser,
  selectedVendorId
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'IQC' | 'IPQC' | 'FQC' | 'OQA'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [closeCAPAModal, setCloseCAPAModal] = useState<QualityInspection | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    batchNo: `LOT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-01`,
    vendorId: selectedVendorId || 'v-khv',
    productCode: 'PCB-MAIN-901',
    stage: 'IPQC' as QualityInspection['stage'],
    sampleSize: 500,
    defectCount: 4,
    majorDefectType: 'Lệch chân linh kiện',
    status: 'passed' as QualityInspection['status'],
    inspectionTime: '14:30',
    inspectorName: currentUser.name,
    dataSource: 'MANUAL_ENTRY' as const
  });

  const canApprove = currentUser.role === 'Executive' || currentUser.role === 'OutsourcingManager' || currentUser.role === 'QCOfficer';

  const filtered = inspections.filter(item => {
    const matchesVendor = !selectedVendorId || item.vendorId === selectedVendorId;
    const matchesStage = stageFilter === 'all' || item.stage === stageFilter;
    const matchesSearch = 
      item.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.majorDefectType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVendor && matchesStage && matchesSearch;
  });

  // Defect Pareto Breakdown
  const defectBreakdown = [
    { type: 'Bắc cầu thiếc hàn sóng (Solder Bridge)', count: 42, pct: 38 },
    { type: 'Lệch chân linh kiện SMD 0402', count: 28, pct: 25 },
    { type: 'Oxy hóa chân tiếp xúc Connector', count: 20, pct: 18 },
    { type: 'Hư hỏng cơ học / xước bề mặt', count: 12, pct: 11 },
    { type: 'Lỗi phần mềm nạp Flash bootloader', count: 9, pct: 8 }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      operationsService.addQualityInspection({
        batchNo: formData.batchNo.trim(),
        vendorId: formData.vendorId,
        productCode: formData.productCode.trim(),
        stage: formData.stage,
        sampleSize: Number(formData.sampleSize),
        defectCount: Number(formData.defectCount),
        majorDefectType: formData.majorDefectType.trim(),
        status: Number(formData.defectCount) > 10 ? 'capa_open' : 'passed',
        inspectionTime: formData.inspectionTime,
        inspectorName: formData.inspectorName,
        dataSource: 'MANUAL_ENTRY'
      });
      setNotification('Ghi nhận kết quả kiểm định QC thành công!');
      setShowAddModal(false);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nhập dữ liệu QC.');
    }
  };

  const handleConfirmCloseCAPA = () => {
    if (!closeCAPAModal) return;
    operationsService.closeCAPA(closeCAPAModal.id, approvalNotes);
    setNotification(`Đã nghiệm thu và phê duyệt đóng hồ sơ CAPA cho lô ${closeCAPAModal.batchNo}!`);
    setCloseCAPAModal(null);
    setApprovalNotes('');
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
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Quản lý Chất lượng & Hồ sơ Khắc phục (Quality & CAPA)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dữ liệu kiểm tra IQC, IPQC, FQC, OQA và quy trình phê duyệt đóng hành động khắc phục lỗi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo lô, mã hàng, loại lỗi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52 sm:w-60"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            {(['all', 'IQC', 'IPQC', 'FQC', 'OQA'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  stageFilter === st ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                {st === 'all' ? 'Tất cả' : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ghi nhận kiểm tra QC</span>
          </button>
        </div>
      </div>

      {/* Defect Pareto Breakdown Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-[#090f1d] border border-slate-800 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Phân loại lỗi Pareto (Top Defect Distribution)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Tổng 111 lỗi phát hiện</span>
          </div>

          <div className="space-y-2.5">
            {defectBreakdown.map((item, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="text-slate-300">{item.type}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{item.count} lỗi</span>
                    <span className="font-bold text-rose-400">{item.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${item.pct * 2.2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Standards Summary */}
        <div className="rounded-2xl bg-[#090f1d] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold text-white uppercase tracking-wider pb-2 border-b border-slate-800 mb-3">
              Chỉ số chất lượng toàn hệ thống
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Tỷ lệ lỗi bình quân:</span>
                <span className="font-mono font-bold text-amber-400">2.15% (Mục tiêu &lt; 1.2%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Số hồ sơ CAPA đang xử lý:</span>
                <span className="font-mono font-bold text-rose-400">3 hồ sơ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Tỷ lệ đạt chuẩn IQC vật tư:</span>
                <span className="font-mono font-bold text-emerald-400">99.1%</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic mt-3 pt-2 border-t border-slate-800">
            * Dữ liệu QC được thu thập trực tiếp từ cổng kiểm tra tự động AOI và trạm kiểm định FQC của các nhà máy.
          </p>
        </div>
      </div>

      {/* QC Inspections Table */}
      <div className="rounded-2xl bg-[#090f1d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Mã lô kiểm tra</th>
                <th className="py-3 px-3">Nhà cung cấp</th>
                <th className="py-3 px-3">Mã hàng</th>
                <th className="py-3 px-3">Công đoạn</th>
                <th className="py-3 px-3 text-right">Cỡ mẫu</th>
                <th className="py-3 px-3 text-right">Số lỗi</th>
                <th className="py-3 px-3 text-right">Tỷ lệ lỗi</th>
                <th className="py-3 px-3">Loại lỗi chính</th>
                <th className="py-3 px-3">Trạng thái & CAPA</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(item => {
                const vendor = vendors.find(v => v.id === item.vendorId);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-white">
                      {item.batchNo}
                      <div className="text-[10px] text-slate-400 font-normal">Lúc {item.inspectionTime} · {item.inspectorName}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-cyan-300">
                      {vendor ? vendor.code : item.vendorId}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {item.productCode}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                        {item.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {item.sampleSize}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">
                      {item.defectCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={item.defectRate > 2.0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.defectRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] max-w-[200px]">
                      {item.majorDefectType}
                    </td>
                    <td className="py-3 px-3">
                      {item.correctiveAction ? (
                        <div className="text-[11px]">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            item.correctiveAction.status === 'verified_closed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {item.correctiveAction.status === 'verified_closed' ? 'Đã đóng CAPA' : 'CAPA đang mở'}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[180px]">
                            {item.correctiveAction.action}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                          Đạt chuẩn
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.correctiveAction && item.correctiveAction.status !== 'verified_closed' ? (
                        canApprove ? (
                          <button
                            onClick={() => setCloseCAPAModal(item)}
                            className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-300 hover:text-white text-[11px] font-semibold transition-colors"
                          >
                            Duyệt đóng
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Cần QC duyệt</span>
                        )
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-mono">✓ Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inspection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Ghi nhận biên bản kiểm định QC</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nhà cung cấp *</label>
                  <select
                    value={formData.vendorId}
                    onChange={e => setFormData({ ...formData, vendorId: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                    required
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.code} - {v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Công đoạn QC *</label>
                  <select
                    value={formData.stage}
                    onChange={e => setFormData({ ...formData, stage: e.target.value as any })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                    required
                  >
                    <option value="IQC">IQC (Đầu vào linh kiện)</option>
                    <option value="IPQC">IPQC (Trong quá trình sản xuất)</option>
                    <option value="FQC">FQC (Kiểm tra thành phẩm cuối)</option>
                    <option value="OQA">OQA (Đảm bảo chất lượng xuất xưởng)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mã số lô hàng *</label>
                  <input
                    type="text"
                    value={formData.batchNo}
                    onChange={e => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mã sản phẩm *</label>
                  <input
                    type="text"
                    value={formData.productCode}
                    onChange={e => setFormData({ ...formData, productCode: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Cỡ mẫu kiểm tra *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sampleSize}
                    onChange={e => setFormData({ ...formData, sampleSize: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Số sản phẩm lỗi phát hiện *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.defectCount}
                    onChange={e => setFormData({ ...formData, defectCount: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Loại lỗi chính ghi nhận *</label>
                <input
                  type="text"
                  placeholder="VD: Bắc cầu thiếc hàn sóng, lệch chân chip..."
                  value={formData.majorDefectType}
                  onChange={e => setFormData({ ...formData, majorDefectType: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Ghi nhận biên bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close CAPA Approval Modal */}
      {closeCAPAModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Nghiệm thu & Phê duyệt đóng CAPA</span>
              </h3>
              <button onClick={() => setCloseCAPAModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-semibold mb-1">Thông tin hồ sơ:</div>
                <div>Lô: <span className="font-mono text-white font-bold">{closeCAPAModal.batchNo}</span></div>
                <div>Lỗi: <span className="text-rose-400">{closeCAPAModal.majorDefectType}</span></div>
                <div className="mt-1">Biện pháp khắc phục: <span className="text-amber-300">{closeCAPAModal.correctiveAction?.action}</span></div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ý kiến nghiệm thu của người phê duyệt *</label>
                <textarea
                  rows={3}
                  placeholder="Xác nhận đã kiểm tra lại mẫu, tỷ lệ lỗi đạt chuẩn cho phép..."
                  value={approvalNotes}
                  onChange={e => setApprovalNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setCloseCAPAModal(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmCloseCAPA}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Ký duyệt đóng hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
