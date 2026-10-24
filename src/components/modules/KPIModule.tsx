import React, { useState } from 'react';
import { 
  BarChart3, Award, Sliders, CheckCircle2, 
  HelpCircle, Settings2, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { KPIConfig, Vendor, UserProfile, Language } from '../../types';
import { translations } from '../../locales/i18n';

interface KPIModuleProps {
  kpis: KPIConfig[];
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
}

export const KPIModule: React.FC<KPIModuleProps> = ({
  kpis,
  vendors,
  currentLang,
  currentUser
}) => {
  const t = translations[currentLang];
  const [selectedKpi, setSelectedKpi] = useState<KPIConfig>(kpis[0]);
  const [editingTarget, setEditingTarget] = useState<number>(kpis[0].targetValue);
  const [editingWeight, setEditingWeight] = useState<number>(kpis[0].weightPercent);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const canEditConfig = currentUser.role === 'Executive' || currentUser.role === 'Admin' || currentUser.role === 'OutsourcingManager';

  const handleSaveConfig = () => {
    selectedKpi.targetValue = editingTarget;
    selectedKpi.weightPercent = editingWeight;
    setSaveMsg(`Đã cập nhật mục tiêu KPI: ${selectedKpi.name}`);
    setTimeout(() => setSaveMsg(null), 3000);
  };

  return (
    <div className="p-3 lg:p-5 space-y-4">
      {saveMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#090f1d] border border-slate-800 p-4 rounded-2xl">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Hệ thống KPI & Đánh giá Hiệu suất Toàn diện (Performance Scorecard)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Cấu hình mục tiêu, trọng số đánh giá, công thức tính toán minh bạch và bảng xếp hạng so sánh 7 nhà cung cấp gia công.
        </p>
      </div>

      {/* 5 KPI Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {kpis.map(kpi => {
          const isSelected = selectedKpi.id === kpi.id;
          return (
            <div
              key={kpi.id}
              onClick={() => {
                setSelectedKpi(kpi);
                setEditingTarget(kpi.targetValue);
                setEditingWeight(kpi.weightPercent);
              }}
              className={`p-3 rounded-2xl bg-[#090f1d] border cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-400 ring-1 ring-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400 mb-1">
                <span>{kpi.code}</span>
                <span className="text-cyan-400 font-mono">Trọng số {kpi.weightPercent}%</span>
              </div>
              <div className="text-xs font-bold text-white line-clamp-2 h-8">
                {kpi.name}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-[10px] text-slate-400">Mục tiêu:</span>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  {kpi.targetValue} {kpi.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Detail & Formula Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Mathematical Formula & Configuration */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090f1d] border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Đặc tả công thức toán học (Calculation Formula)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              {selectedKpi.code}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 text-xs font-semibold">Công thức định nghĩa chuẩn:</div>
            <div className="text-cyan-300 font-mono text-xs font-bold bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              {selectedKpi.formulaDescription}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              <span className="font-semibold text-slate-300">Phương pháp tính: </span>
              {selectedKpi.calculationMethod}
            </div>
          </div>

          {/* Config Tuner */}
          {canEditConfig && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Hiệu chỉnh chỉ tiêu và trọng số KPI</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Mục tiêu ({selectedKpi.unit}):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingTarget}
                    onChange={e => setEditingTarget(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Trọng số đánh giá (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingWeight}
                    onChange={e => setEditingWeight(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Lưu cấu hình KPI
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Vendor Benchmark Comparison Scorecard */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090f1d] border border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Bảng so chuẩn 7 Nhà gia công (Benchmarking)</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {vendors.map(vendor => (
                <div
                  key={vendor.id}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{vendor.code}</span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{vendor.location}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[11px] text-slate-400">Sản lượng: {vendor.completionRate}%</span>
                    <span className={`text-[11px] font-bold ${vendor.defectRate > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      Lỗi: {vendor.defectRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 italic">
            * Dữ liệu benchmark cập nhật thời gian thực dựa trên sản lượng và biên bản kiểm định thực tế.
          </div>
        </div>
      </div>
    </div>
  );
};
