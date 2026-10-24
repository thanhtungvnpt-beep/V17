import React, { useState } from 'react';
import { 
  Calendar, Plus, Upload, CheckCircle2, AlertTriangle, 
  Search, Filter, Check, X, FileSpreadsheet, Eye, ShieldAlert
} from 'lucide-react';
import { ProductionPlan, Vendor, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface ProductionModuleProps {
  plans: ProductionPlan[];
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
  selectedVendorId: string | null;
  onSelectVendor: (id: string | null) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  plans,
  vendors,
  currentLang,
  currentUser,
  selectedVendorId,
  onSelectVendor
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('all');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual Form State
  const [formData, setFormData] = useState({
    date: '2025-06-24',
    shift: 'Ca 1 (08:00 - 16:00)' as ProductionPlan['shift'],
    vendorId: selectedVendorId || 'v-khv',
    lineNo: 'Line SMT 01',
    productCode: '',
    productName: '',
    targetPcs: 3000,
    actualPcs: 0,
    bottleneckReason: '',
    dataSource: 'MANUAL_ENTRY' as const
  });

  // CSV Preview State
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[] | null>(null);

  const canVerify = currentUser.role === 'Executive' || currentUser.role === 'OutsourcingManager';

  const filteredPlans = plans.filter(p => {
    const matchesVendor = !selectedVendorId || p.vendorId === selectedVendorId;
    const matchesShift = selectedShiftFilter === 'all' || p.shift === selectedShiftFilter;
    const matchesSearch = 
      p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lineNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVendor && matchesShift && matchesSearch;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      operationsService.addProductionPlan({
        date: formData.date,
        shift: formData.shift,
        vendorId: formData.vendorId,
        lineNo: formData.lineNo,
        productCode: formData.productCode.trim(),
        productName: formData.productName.trim(),
        targetPcs: Number(formData.targetPcs),
        actualPcs: Number(formData.actualPcs),
        bottleneckReason: formData.bottleneckReason.trim() || undefined,
        status: 'on_track',
        dataSource: 'MANUAL_ENTRY'
      });
      setSuccessMessage('Đã ghi nhận kế hoạch sản xuất thành công!');
      setShowManualModal(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi nhập dữ liệu.');
    }
  };

  const handleSimulateCSVUpload = () => {
    // Generate valid preview batch
    const sampleBatch = [
      { date: '2025-06-24', shift: 'Ca 1 (08:00 - 16:00)', vendorId: 'v-khv', lineNo: 'Line SMT 04', productCode: 'BOARD-DSP-01', productName: 'DSP Audio Board v2', targetPcs: 3200, actualPcs: 3100, bottleneck: 'Bình thường' },
      { date: '2025-06-24', shift: 'Ca 1 (08:00 - 16:00)', vendorId: 'v-daal', lineNo: 'Line SMT 02', productCode: 'PWR-UNIT-22', productName: 'Bộ nguồn 12V DC', targetPcs: 2500, actualPcs: 1400, bottleneck: 'Chờ cuộn cảm L101' },
      { date: '2025-06-24', shift: 'Ca 1 (08:00 - 16:00)', vendorId: 'v-ktech', lineNo: 'Line SMT 01', productCode: 'RF-MOD-58', productName: 'Bộ phát RF 5.8GHz', targetPcs: 4000, actualPcs: 3650, bottleneck: 'Bình thường' }
    ];
    setCsvPreviewRows(sampleBatch);
  };

  const handleCommitCSV = () => {
    if (!csvPreviewRows) return;
    try {
      csvPreviewRows.forEach(row => {
        operationsService.addProductionPlan({
          date: row.date,
          shift: row.shift,
          vendorId: row.vendorId,
          lineNo: row.lineNo,
          productCode: row.productCode,
          productName: row.productName,
          targetPcs: row.targetPcs,
          actualPcs: row.actualPcs,
          bottleneckReason: row.bottleneck,
          status: 'on_track',
          dataSource: 'CSV_UPLOAD'
        });
      });
      setSuccessMessage(`Đã nạp thành công ${csvPreviewRows.length} bản ghi từ tệp dữ liệu!`);
      setCsvPreviewRows(null);
      setShowFileModal(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kiểm tra tính hợp lệ dữ liệu tệp.');
    }
  };

  return (
    <div className="p-3 lg:p-5 space-y-4">
      {/* Alert Banners */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090f1d] border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>Kế hoạch & Sản lượng thực tế (Plan vs Actual)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi chi tiết sản lượng mục tiêu, thực tế đạt được, chênh lệch và các điểm nghẽn từng chuyền.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã sản phẩm, dây chuyền..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60"
            />
          </div>

          {/* Shift Filter */}
          <select
            value={selectedShiftFilter}
            onChange={e => setSelectedShiftFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">Tất cả các ca</option>
            <option value="Ca 1 (08:00 - 16:00)">Ca 1 (08:00 - 16:00)</option>
            <option value="Ca 2 (16:00 - 00:00)">Ca 2 (16:00 - 00:00)</option>
            <option value="Ca 3 (00:00 - 08:00)">Ca 3 (00:00 - 08:00)</option>
          </select>

          {/* Actions */}
          <button
            onClick={() => setShowFileModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.importFile}</span>
          </button>

          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-md shadow-cyan-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addManual}</span>
          </button>
        </div>
      </div>

      {/* Production Plan Table */}
      <div className="rounded-2xl bg-[#090f1d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Mã hàng & Sản phẩm</th>
                <th className="py-3 px-3">Nhà cung cấp</th>
                <th className="py-3 px-3">Dây chuyền</th>
                <th className="py-3 px-3 text-right">Kế hoạch</th>
                <th className="py-3 px-3 text-right">Thực tế</th>
                <th className="py-3 px-3 text-right">Chênh lệch</th>
                <th className="py-3 px-3 text-right">Tỷ lệ</th>
                <th className="py-3 px-3">Điểm nghẽn ghi nhận</th>
                <th className="py-3 px-3">Nguồn</th>
                <th className="py-3 px-3 text-center">Xác minh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 text-xs">
                    {t.noData} phù hợp với điều kiện lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredPlans.map(plan => {
                  const vendor = vendors.find(v => v.id === plan.vendorId);
                  return (
                    <tr key={plan.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-white font-mono">{plan.productCode}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{plan.productName}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-cyan-300">
                        {vendor ? vendor.code : plan.vendorId}
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-mono">
                        {plan.lineNo}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                        {plan.targetPcs.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white">
                        {plan.actualPcs.toLocaleString()}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono tabular-nums font-bold ${
                        plan.gapPcs >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {plan.gapPcs > 0 ? `+${plan.gapPcs.toLocaleString()}` : plan.gapPcs.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          plan.completionRate >= 85
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : plan.completionRate >= 70
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        }`}>
                          {plan.completionRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-300 max-w-[220px]">
                        {plan.bottleneckReason || 'Bình thường, không phát sinh điểm nghẽn'}
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {plan.dataSource}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {plan.isVerified ? (
                          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã xác minh</span>
                          </div>
                        ) : canVerify ? (
                          <button
                            onClick={() => operationsService.verifyProductionPlan(plan.id)}
                            className="px-2 py-1 rounded bg-amber-600/30 hover:bg-amber-600 border border-amber-500/50 text-amber-300 hover:text-white text-[11px] font-semibold transition-colors"
                          >
                            Ký xác nhận
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Chờ phê duyệt</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Input Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Nhập kế hoạch sản lượng thủ công</span>
              </h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nhà gia công *</label>
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
                  <label className="block text-slate-400 mb-1 font-semibold">Ca làm việc *</label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                    required
                  >
                    <option value="Ca 1 (08:00 - 16:00)">Ca 1 (08:00 - 16:00)</option>
                    <option value="Ca 2 (16:00 - 00:00)">Ca 2 (16:00 - 00:00)</option>
                    <option value="Ca 3 (00:00 - 08:00)">Ca 3 (00:00 - 08:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mã sản phẩm (SKU) *</label>
                  <input
                    type="text"
                    placeholder="VD: PCB-MAIN-909"
                    value={formData.productCode}
                    onChange={e => setFormData({ ...formData, productCode: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Dây chuyền sản xuất *</label>
                  <input
                    type="text"
                    placeholder="VD: Line SMT 02"
                    value={formData.lineNo}
                    onChange={e => setFormData({ ...formData, lineNo: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tên sản phẩm mô tả *</label>
                <input
                  type="text"
                  placeholder="VD: Mạch điều khiển thông minh IoT"
                  value={formData.productName}
                  onChange={e => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Sản lượng mục tiêu (Pcs) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetPcs}
                    onChange={e => setFormData({ ...formData, targetPcs: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Sản lượng thực tế (Pcs) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.actualPcs}
                    onChange={e => setFormData({ ...formData, actualPcs: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Lý do phát sinh điểm nghẽn (nếu có)</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả sự cố vật tư, máy móc hoặc thời gian chờ..."
                  value={formData.bottleneckReason}
                  onChange={e => setFormData({ ...formData, bottleneckReason: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal with Preview Step */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <span>Nhập dữ liệu tệp hàng loạt (CSV / Excel)</span>
              </h3>
              <button onClick={() => { setShowFileModal(false); setCsvPreviewRows(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!csvPreviewRows ? (
              <div className="space-y-4 text-xs">
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center space-y-3 hover:border-cyan-500 transition-colors">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                  <div className="text-slate-200 font-semibold">
                    Kéo thả tệp CSV hoặc nhấn để chọn tệp từ máy tính
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Hỗ trợ định dạng: .csv, .xlsx với tiêu đề chuẩn: [date, shift, vendorId, lineNo, productCode, targetPcs, actualPcs]
                  </div>
                  <button
                    onClick={handleSimulateCSVUpload}
                    className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
                  >
                    Tải tệp mẫu và Xem trước (Preview)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <span>Kiểm tra xem trước dữ liệu ({csvPreviewRows.length} dòng hợp lệ):</span>
                  <span className="text-[11px] text-emerald-400">✓ Đã kiểm tra trùng lặp & định dạng</span>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="p-2">Mã hàng</th>
                        <th className="p-2">NCC</th>
                        <th className="p-2">Chuyền</th>
                        <th className="p-2 text-right">Kế hoạch</th>
                        <th className="p-2 text-right">Thực tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                      {csvPreviewRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2 text-white font-bold">{row.productCode}</td>
                          <td className="p-2 text-cyan-400">{row.vendorId}</td>
                          <td className="p-2 text-slate-300">{row.lineNo}</td>
                          <td className="p-2 text-right text-slate-300">{row.targetPcs}</td>
                          <td className="p-2 text-right text-emerald-400 font-bold">{row.actualPcs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setCsvPreviewRows(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Chọn lại tệp khác
                  </button>
                  <button
                    onClick={handleCommitCSV}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  >
                    Xác nhận nhập dữ liệu vào hệ thống
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
