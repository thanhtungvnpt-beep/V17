import React, { useState } from 'react';
import { 
  Smartphone, Camera, CheckCircle2, AlertTriangle, 
  Send, Wrench, Package, ShieldCheck, BarChart3, X, Image as ImageIcon
} from 'lucide-react';
import { Vendor, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface MobileOpsModuleProps {
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
}

export const MobileOpsModule: React.FC<MobileOpsModuleProps> = ({
  vendors,
  currentLang,
  currentUser
}) => {
  const t = translations[currentLang];
  const [activeForm, setActiveForm] = useState<'output' | 'defect' | 'machine' | 'material'>('output');
  const [selectedVendorId, setSelectedVendorId] = useState('v-daal');
  const [photoAttached, setPhotoAttached] = useState<string | null>(null);
  const [outputPcs, setOutputPcs] = useState(350);
  const [defectDesc, setDefectDesc] = useState('');
  const [machineDesc, setMachineDesc] = useState('');
  const [materialQty, setMaterialQty] = useState(500);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeForm === 'output') {
      operationsService.addAuditLog('UPDATE', 'FieldOutput', selectedVendorId, `Hiện trường báo sản lượng giờ: ${outputPcs} pcs`);
      setSuccessToast(`Đã ghi nhận ${outputPcs} pcs vào hệ thống thành công!`);
    } else if (activeForm === 'defect') {
      operationsService.addAuditLog('CREATE', 'FieldDefect', selectedVendorId, `Báo lỗi hiện trường: ${defectDesc}`);
      setSuccessToast(`Đã gửi cảnh báo lỗi QC tới trưởng ca!`);
    } else if (activeForm === 'machine') {
      operationsService.addAuditLog('CREATE', 'FieldMachineStop', selectedVendorId, `Báo dừng máy: ${machineDesc}`);
      setSuccessToast(`Đã phát lệnh dừng máy tới đội bảo trì!`);
    } else {
      operationsService.addAuditLog('CREATE', 'FieldMaterialAlert', selectedVendorId, `Báo thiếu vật liệu: ${materialQty} pcs`);
      setSuccessToast(`Đã gửi phiếu yêu cầu vật tư khẩn cấp!`);
    }

    setPhotoAttached(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSimulatePhoto = () => {
    setPhotoAttached('/src/assets/images/factory_electronics_plant_1792815473989.jpg');
  };

  return (
    <div className="p-3 lg:p-5 flex justify-center">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-md bg-[#080e1a] border-2 border-slate-700 rounded-3xl p-4 shadow-2xl space-y-4">
        {/* Device Top Speaker & Status */}
        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
          <span className="font-mono font-bold text-cyan-400">08:42</span>
          <div className="w-16 h-1 bg-slate-700 rounded-full" />
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span>4G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-800/40">
          <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
            Chế độ Hiện trường (Field Operations Mode)
          </div>
          <div className="text-sm font-black text-white mt-0.5">
            {currentUser.name}
          </div>
          <div className="text-[11px] text-slate-300">
            Vai trò: <span className="text-cyan-300 font-semibold">{currentUser.role}</span>
          </div>
        </div>

        {successToast && (
          <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* 4 Quick Action Tabs */}
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          <button
            onClick={() => setActiveForm('output')}
            className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
              activeForm === 'output' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px]">Sản lượng</span>
          </button>

          <button
            onClick={() => setActiveForm('defect')}
            className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
              activeForm === 'defect' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px]">Báo lỗi QC</span>
          </button>

          <button
            onClick={() => setActiveForm('machine')}
            className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
              activeForm === 'machine' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span className="text-[10px]">Dừng máy</span>
          </button>

          <button
            onClick={() => setActiveForm('material')}
            className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
              activeForm === 'material' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-[10px]">Thiếu vật tư</span>
          </button>
        </div>

        {/* Interactive Fast Form */}
        <form onSubmit={handleSubmit} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Nhà máy hiện trường *</label>
            <select
              value={selectedVendorId}
              onChange={e => setSelectedVendorId(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.code} - {v.name}</option>
              ))}
            </select>
          </div>

          {activeForm === 'output' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Sản lượng kiểm đếm theo giờ (pcs) *</label>
              <input
                type="number"
                min="1"
                value={outputPcs}
                onChange={e => setOutputPcs(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-base font-bold text-center focus:border-cyan-400"
                required
              />
            </div>
          )}

          {activeForm === 'defect' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mô tả hiện tượng lỗi bất thường *</label>
              <textarea
                rows={3}
                placeholder="VD: Phát hiện 5 board bị bắc cầu thiếc hàn sóng..."
                value={defectDesc}
                onChange={e => setDefectDesc(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                required
              />
            </div>
          )}

          {activeForm === 'machine' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mã máy & Tình trạng dừng *</label>
              <textarea
                rows={3}
                placeholder="VD: Máy mounter SMT line 2 kẹt tape feeder #14..."
                value={machineDesc}
                onChange={e => setMachineDesc(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                required
              />
            </div>
          )}

          {activeForm === 'material' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Số lượng vật tư cần gấp (pcs) *</label>
              <input
                type="number"
                min="1"
                value={materialQty}
                onChange={e => setMaterialQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-base font-bold text-center focus:border-cyan-400"
                required
              />
            </div>
          )}

          {/* Camera / Photo Attachment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 font-semibold text-[11px]">Đính kèm ảnh hiện trường:</span>
              {photoAttached && (
                <button
                  type="button"
                  onClick={() => setPhotoAttached(null)}
                  className="text-rose-400 text-[10px] hover:underline"
                >
                  Xóa ảnh
                </button>
              )}
            </div>

            {photoAttached ? (
              <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-700 relative">
                <img src={photoAttached} alt="Evidence" className="w-full h-full object-cover" />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-emerald-300">
                  ✓ Đã đính kèm ảnh
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulatePhoto}
                className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500 bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Chụp ảnh / Tải ảnh minh chứng</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Gửi báo cáo hiện trường ngay</span>
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 pt-1">
          * Dữ liệu ghi nhận sẽ lập tức đồng bộ về Bảng điều khiển Trung tâm.
        </div>
      </div>
    </div>
  );
};
