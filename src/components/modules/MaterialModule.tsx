import React, { useState } from 'react';
import { 
  Package, AlertTriangle, CheckCircle2, Clock, 
  Search, Plus, Send, X, ArrowRight, ShieldAlert, Truck
} from 'lucide-react';
import { Material, Vendor, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface MaterialModuleProps {
  materials: Material[];
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
  selectedVendorId: string | null;
}

export const MaterialModule: React.FC<MaterialModuleProps> = ({
  materials,
  vendors,
  currentLang,
  currentUser,
  selectedVendorId
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical_shortage' | 'low_risk' | 'sufficient'>('all');
  const [replenishModal, setReplenishModal] = useState<Material | null>(null);
  const [urgentQty, setUrgentQty] = useState(2000);
  const [urgentNotes, setUrgentNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = materials.filter(m => {
    const matchesVendor = !selectedVendorId || m.vendorId === selectedVendorId;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesSearch = 
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVendor && matchesStatus && matchesSearch;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replenishModal) return;
    operationsService.requestMaterialReplenish(replenishModal.id, urgentQty, urgentNotes);
    setNotification(`Đã gửi yêu cầu cấp phát khẩn cấp ${urgentQty} ${replenishModal.unit} ${replenishModal.code} tới Ban điều hành!`);
    setReplenishModal(null);
    setUrgentNotes('');
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
            <Package className="w-5 h-5 text-cyan-400" />
            <span>Quản lý Kho vật liệu & Cảnh báo thiếu hụt (Material Buffer)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi tồn kho an toàn, thời gian đáp ứng ETA và luồng cấp phát vật tư khẩn cấp giữa các nhà máy gia công.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã linh kiện, nhà cung cấp..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            {(['all', 'critical_shortage', 'low_risk', 'sufficient'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  statusFilter === st ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                {st === 'all' ? 'Tất cả' : st === 'critical_shortage' ? 'Khẩn cấp' : st === 'low_risk' ? 'Nguy cơ' : 'Đủ tồn'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Shortage Highlight Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-[#090f1d] border border-rose-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-300">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Cảnh báo thiếu vật tư cấp độ 1 (Critical Shortage)
            </div>
            <div className="text-sm font-black text-white mt-0.5">
              DAAL: IC-TPS54302 (IC Nguồn Buck Converter 28V 3A)
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Tồn kho hiện tại chỉ còn <span className="text-rose-400 font-bold font-mono">450 pcs</span> (đệm an toàn: 1.5 giờ sản xuất). 3 dây chuyền đối diện nguy cơ dừng máy.
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const daalMat = materials.find(m => m.code === 'IC-TPS54302');
            if (daalMat) setReplenishModal(daalMat);
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Kích hoạt yêu cầu cấp khẩn cấp</span>
        </button>
      </div>

      {/* Material Table */}
      <div className="rounded-2xl bg-[#090f1d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Mã linh kiện & Tên vật tư</th>
                <th className="py-3 px-3">Loại</th>
                <th className="py-3 px-3">Nhà máy sử dụng</th>
                <th className="py-3 px-3 text-right">Tồn hiện tại</th>
                <th className="py-3 px-3 text-right">Tồn an toàn</th>
                <th className="py-3 px-3 text-right">Nhu cầu ngày</th>
                <th className="py-3 px-3">Nhà cung ứng</th>
                <th className="py-3 px-3">Trạng thái tồn</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(mat => {
                const vendor = vendors.find(v => v.id === mat.vendorId);
                return (
                  <tr key={mat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-white font-mono">{mat.code}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[220px]">{mat.name}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                        {mat.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-cyan-300">
                      {vendor ? vendor.code : mat.vendorId}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={mat.status === 'critical_shortage' ? 'text-rose-400' : 'text-white'}>
                        {mat.currentStock.toLocaleString()} {mat.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                      {mat.minSafetyStock.toLocaleString()} {mat.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                      {mat.requiredDailyQty.toLocaleString()} {mat.unit}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-300 truncate max-w-[180px]">
                      {mat.supplier}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mat.status === 'critical_shortage'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                          : mat.status === 'low_risk'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {mat.status === 'critical_shortage'
                          ? 'Thiếu khẩn cấp'
                          : mat.status === 'low_risk'
                          ? 'Dưới mức an toàn'
                          : 'Tồn kho đầy đủ'}
                      </span>
                      {mat.urgentRequestStatus === 'pending_po' && (
                        <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Đang chờ duyệt PO (ETA ~{mat.etaHours}h)</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setReplenishModal(mat)}
                        className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-300 hover:text-white text-[11px] font-semibold transition-colors"
                      >
                        Yêu cầu cấp
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Replenish Request Modal */}
      {replenishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <span>Phiếu yêu cầu cấp phát vật tư khẩn cấp</span>
              </h3>
              <button onClick={() => setReplenishModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>Mã vật tư: <span className="font-mono text-cyan-300 font-bold">{replenishModal.code}</span></div>
                <div className="text-slate-300">{replenishModal.name}</div>
                <div className="text-slate-400 mt-1">
                  Tồn kho hiện tại: <span className="font-mono text-rose-400 font-bold">{replenishModal.currentStock} {replenishModal.unit}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Số lượng cần cấp khẩn ({replenishModal.unit}) *</label>
                <input
                  type="number"
                  min="1"
                  value={urgentQty}
                  onChange={e => setUrgentQty(Number(e.target.value))}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Lý do & Địa điểm nhận hàng *</label>
                <textarea
                  rows={2}
                  placeholder="Ghi rõ chuyển từ kho nào sang chuyền nào để cứu tiến độ ca..."
                  value={urgentNotes}
                  onChange={e => setUrgentNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReplenishModal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Gửi duyệt Ban điều hành
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
