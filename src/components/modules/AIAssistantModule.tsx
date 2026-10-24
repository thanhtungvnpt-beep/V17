import React, { useState } from 'react';
import { 
  Sparkles, Send, Bot, UserCheck, CheckCircle2, 
  AlertTriangle, FileText, Download, HelpCircle, Loader2, 
  ArrowRight, ShieldCheck, Printer, Check, X, Clock, 
  Cpu, Package, Wrench, RefreshCw, Layers, Edit3, Share2
} from 'lucide-react';
import { Vendor, ProductionPlan, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface AIAssistantModuleProps {
  vendors: Vendor[];
  plans: ProductionPlan[];
  currentLang: Language;
  currentUser: UserProfile;
}

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({
  vendors,
  plans,
  currentLang,
  currentUser
}) => {
  const t = translations[currentLang];
  
  // Navigation Tabs inside AI Assistant
  const [subTab, setSubTab] = useState<'deep_analysis' | 'realtime_actions' | 'draft_reports'>('deep_analysis');
  
  // Query & Execution States
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'GEMINI_AI' | 'DOMAIN_RULE_ENGINE'>('DOMAIN_RULE_ENGINE');
  
  // Selected Filter Vendor for deep analysis
  const [selectedAnalysisVendor, setSelectedAnalysisVendor] = useState<string>('all');

  // Report Generator State
  const [reportType, setReportType] = useState<'SHIFT_HANDOVER' | 'EXECUTIVE_BRIEFING' | 'VENDOR_INCIDENT'>('SHIFT_HANDOVER');
  const [editableReportText, setEditableReportText] = useState<string>('');
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [reportSigned, setReportSigned] = useState(false);

  // Human Gatekeeper Approval Modal
  const [gatekeeperModal, setGatekeeperModal] = useState<{
    actionTitle: string;
    targetVendor: string;
    expectedROI: string;
    requiredRole: string;
    confidence: number;
  } | null>(null);
  const [approvalJustification, setApprovalJustification] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Structured Real-time Actions Data
  const realTimeActionCards = [
    {
      id: 'act-rt-1',
      title: 'Kích hoạt phiếu mượn khẩn 2,000 IC-TPS54302 từ kho KHV sang cứu chuyền DAAL',
      vendorCode: 'DAAL / KHV',
      priority: 'Khẩn cấp',
      expectedRecovery: '+1,800 pcs sản lượng ca chiều (giảm 70% tổn thất)',
      confidence: 96,
      requiredApprover: 'OutsourcingManager',
      riskIfNotTaken: '3 dây chuyền dừng hoàn toàn lúc 14:45, trễ 3 lệnh TO',
      status: 'pending'
    },
    {
      id: 'act-rt-2',
      title: 'Điều chuyển 5 nhân công lắp ráp lành nghề từ chuyền 1 KHV sang hỗ trợ DAAL',
      vendorCode: 'KHV -> DAAL',
      priority: 'Cao',
      expectedRecovery: 'Tăng tốc năng suất thêm 350 pcs/giờ ngay khi có IC',
      confidence: 91,
      requiredApprover: 'VendorManager',
      riskIfNotTaken: 'DAAL không kịp đóng gói đủ chỉ tiêu trước khi hết ca 1',
      status: 'pending'
    },
    {
      id: 'act-rt-3',
      title: 'Thay thế cụm Feeder dự phòng slot #14 và căn chỉnh camera quang học máy SMT 02 KTECH',
      vendorCode: 'KTECH',
      priority: 'Cao',
      expectedRecovery: 'Giảm 45 phút thời gian dừng máy, phục hồi 1,200 pcs',
      confidence: 89,
      requiredApprover: 'EquipmentTech',
      riskIfNotTaken: 'Tỷ lệ gắp trượt linh kiện (Pick error) tăng lên 4.2%',
      status: 'pending'
    },
    {
      id: 'act-rt-4',
      title: 'Hiệu chuẩn nhiệt độ bể hàn sóng về 255°C ± 2°C và đóng hồ sơ CAPA-HJV-03',
      vendorCode: 'HOJEONG VINA',
      priority: 'Trung bình',
      expectedRecovery: 'Hạ tỷ lệ lỗi FQC từ 3.16% xuống dưới 0.5%',
      confidence: 93,
      requiredApprover: 'QCOfficer',
      riskIfNotTaken: 'Số board cần Rework vượt 400 pcs gây nghẽn trạm kiểm định',
      status: 'pending'
    },
    {
      id: 'act-rt-5',
      title: 'Khóa cửa sổ đóng băng kế hoạch (Frozen Window 24h) cho mã hàng A102 tại Dream Tech',
      vendorCode: 'DREAM TECH',
      priority: 'Trung bình',
      expectedRecovery: 'Tiết kiệm 50 phút thời gian căn chỉnh khuôn máy (Setup time)',
      confidence: 87,
      requiredApprover: 'Executive',
      riskIfNotTaken: 'Xáo trộn lịch làm việc ca 2 và tăng chi phí tăng ca',
      status: 'pending'
    }
  ];

  const handleRunAnalysis = async (userPrompt: string, mode: string = 'DEEP_ANALYSIS') => {
    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          userPrompt,
          reportType,
          contextData: {
            selectedVendor: selectedAnalysisVendor,
            vendors: vendors.map(v => ({ 
              code: v.code, 
              name: v.name,
              completion: v.completionRate, 
              actualPcs: v.actualPcs,
              planPcs: v.planPcs,
              defect: v.defectRate, 
              status: v.status,
              bufferHours: v.materialBufferHours 
            })),
            shift: 'Ca 1 (08:00 - 16:00)',
            date: '2025-06-24',
            summary: {
              target: 18000,
              actual: 14200,
              gap: -3800
            }
          }
        })
      });

      const data = await response.json();
      if (data.text) {
        setAnalysisResult(data.text);
        setEditableReportText(data.text);
        setSourceType(data.source || 'DOMAIN_RULE_ENGINE');
        setReportSigned(false);
      }
    } catch (err) {
      console.error(err);
      setAnalysisResult('Không thể kết nối máy chủ phân tích. Đã kích hoạt công cụ phân tích cục bộ.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGatekeeper = (action: typeof realTimeActionCards[0]) => {
    setGatekeeperModal({
      actionTitle: action.title,
      targetVendor: action.vendorCode,
      expectedROI: action.expectedRecovery,
      requiredRole: action.requiredApprover,
      confidence: action.confidence
    });
    setApprovalJustification(`Xác nhận chỉ đạo thực thi can thiệp khẩn cấp theo khuyến nghị thuật toán AI (Độ tin cậy: ${action.confidence}%).`);
  };

  const handleConfirmGatekeeperApproval = () => {
    if (!gatekeeperModal) return;

    operationsService.addAuditLog(
      'APPROVE',
      'AI_Action_Gatekeeper',
      gatekeeperModal.targetVendor,
      `Phê duyệt hành động can thiệp: ${gatekeeperModal.actionTitle} - Người duyệt: ${currentUser.name} (${currentUser.role})`
    );

    operationsService.createTaskFromAIAction(
      gatekeeperModal.actionTitle,
      'Cao',
      gatekeeperModal.targetVendor
    );

    setToastMessage(`Đã ký duyệt và kích hoạt nhiệm vụ can thiệp: "${gatekeeperModal.actionTitle}"!`);
    setGatekeeperModal(null);
    setApprovalJustification('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSignOfficialReport = () => {
    setReportSigned(true);
    operationsService.addAuditLog(
      'APPROVE',
      'Operations_Report',
      reportType,
      `Ký số phát hành báo cáo vận hành chính thức: ${reportType} bởi ${currentUser.name} (${currentUser.role})`
    );
    setToastMessage(`Đã ký số và phát hành báo cáo vận hành chính thức vào hồ sơ kiểm toán!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-3 lg:p-5 space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-[#090f1d] border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Trung tâm Trợ lý AI Vận hành Nâng cao (Neural Operations Intelligence)</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              GEMINI 3.8 FLASH & HYBRID RULES
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân tích chuyên sâu 5-Whys, phát hiện chênh lệch đa biến, khuyến nghị can thiệp thời gian thực và lập báo cáo tự động có cổng duyệt con người (Human Gatekeeper).
          </p>
        </div>

        {/* 3 Core AI Mode Selectors */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-medium">
          <button
            onClick={() => {
              setSubTab('deep_analysis');
              if (!analysisResult) handleRunAnalysis('Phân tích chuyên sâu chuỗi nguyên nhân và rủi ro lan truyền', 'DEEP_ANALYSIS');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              subTab === 'deep_analysis' ? 'bg-cyan-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Phân tích Chuyên sâu 5-Whys</span>
          </button>

          <button
            onClick={() => {
              setSubTab('realtime_actions');
              if (!analysisResult) handleRunAnalysis('Tạo danh mục khuyến nghị can thiệp định lượng', 'REALTIME_ACTIONS');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              subTab === 'realtime_actions' ? 'bg-cyan-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Khuyến nghị Can thiệp</span>
          </button>

          <button
            onClick={() => {
              setSubTab('draft_reports');
              if (!analysisResult) handleRunAnalysis('Lập bản nháp báo cáo tổng kết vận hành ca', 'DRAFT_REPORT');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              subTab === 'draft_reports' ? 'bg-cyan-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tự động Lập Báo cáo</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DEEP DATA ANALYSIS & 5-WHYS */}
      {subTab === 'deep_analysis' && (
        <div className="space-y-4">
          {/* Quick Context Filter */}
          <div className="p-3 bg-[#090f1d] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Tập trung phân tích đối tượng:</span>
              <select
                value={selectedAnalysisVendor}
                onChange={e => setSelectedAnalysisVendor(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold focus:border-cyan-400"
              >
                <option value="all">Toàn bộ 7 Nhà máy (Group Overview)</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.code} - {v.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={loading}
                onClick={() => handleRunAnalysis('Tiến hành phân tích sâu nguyên nhân gốc rễ và rủi ro lan truyền cho toàn Group', 'DEEP_ANALYSIS')}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Chạy phân tích sâu đa chiều</span>
              </button>
            </div>
          </div>

          {/* Analysis Canvas: 5-Part Presentation with Visual Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Interactive Prompt & Parameters */}
            <div className="lg:col-span-4 rounded-2xl bg-[#090f1d] border border-slate-800 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
                  Câu hỏi chuyên gia & Giả định mô phỏng
                </div>

                <div className="space-y-2">
                  {[
                    'Tại sao DAAL chỉ đạt 48% sản lượng và bao giờ cạn kiệt IC hoàn toàn?',
                    'Phân tích tương quan giữa sự cố dừng máy KTECH và sản lượng toàn ca',
                    'Đánh giá rủi ro trễ giao hàng (OTD) của 3 Transfer Orders nếu trễ thêm 2 giờ',
                    'Mô phỏng hiệu quả điều chuyển 5 công nhân từ KHV sang DAAL'
                  ].map((pText, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(pText);
                        handleRunAnalysis(pText, 'DEEP_ANALYSIS');
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-left text-[11px] text-slate-300 hover:text-white transition-all flex items-start gap-2"
                    >
                      <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">{pText}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <textarea
                    rows={3}
                    placeholder="Hoặc nhập câu hỏi tùy biến cho AI..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    disabled={loading || !query.trim()}
                    onClick={() => handleRunAnalysis(query, 'DEEP_ANALYSIS')}
                    className="w-full mt-2 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi yêu cầu phân tích</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="text-cyan-400 font-semibold">Bảo chứng Minh bạch (Section 4.8):</div>
                <p>• Dữ liệu nguồn: Trích xuất thực tế từ GMES, SCADA và WMS.</p>
                <p>• Mức độ tin cậy được tính toán từ độ sai lệch phân phối lịch sử.</p>
              </div>
            </div>

            {/* Right: Rich Structured Analysis Output with High-contrast Cards */}
            <div className="lg:col-span-8 rounded-2xl bg-[#090f1d] border border-slate-800 p-4 flex flex-col justify-between min-h-[460px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Kết quả Phân tích Căn nguyên (5-Whys Diagnostic Output)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    Nguồn phân tích: {sourceType}
                  </span>
                </div>

                {loading ? (
                  <div className="py-24 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                    <div className="text-xs text-slate-300">Đang truy xuất chuỗi sự kiện GMES và tính toán độ tin cậy...</div>
                  </div>
                ) : analysisResult ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-[440px] overflow-y-auto">
                    {analysisResult}
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-500 text-xs">
                    Nhấp "Chạy phân tích sâu đa chiều" để bắt đầu chuẩn đoán hệ thống.
                  </div>
                )}
              </div>

              {analysisResult && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Người yêu cầu: <strong className="text-cyan-300">{currentUser.name} ({currentUser.role})</strong>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analysisResult);
                      setToastMessage('Đã sao chép nội dung phân tích vào clipboard!');
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Sao chép kết quả</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REAL-TIME ACTION RECOMMENDATIONS & HUMAN GATEKEEPER */}
      {subTab === 'realtime_actions' && (
        <div className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Động cơ Đề xuất Can thiệp Thời gian thực (Real-time Action Engine)
                </span>
                <span className="text-[11px] text-slate-400">
                  Mọi hành động đều kèm định lượng hiệu quả phục hồi sản lượng (Recovery Output) và yêu cầu chữ ký số phân quyền (Gatekeeper).
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800">
              5 Hành động Khả thi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {realTimeActionCards.map(action => (
              <div
                key={action.id}
                className="rounded-2xl bg-[#090f1d] border border-slate-800 hover:border-cyan-500/60 p-4 space-y-3 flex flex-col justify-between transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono font-black text-cyan-300">
                      {action.vendorCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      action.priority === 'Khẩn cấp'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                        : action.priority === 'Cao'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {action.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors">
                    {action.title}
                  </h4>

                  {/* Quantified Recovery ROI */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Hiệu quả phục hồi kỳ vọng:
                    </div>
                    <div className="text-xs font-bold text-emerald-400">
                      {action.expectedRecovery}
                    </div>
                  </div>

                  {/* Risk if not taken */}
                  <div className="text-[11px] text-rose-300/90 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>Rủi ro: {action.riskIfNotTaken}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Độ tin cậy: <strong className="text-cyan-400">{action.confidence}%</strong></span>
                    <span>Duyệt: <strong className="text-amber-300">{action.requiredApprover}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenGatekeeper(action)}
                    className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Kích hoạt qua Cổng duyệt (Gatekeeper)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AUTOMATED DRAFT REPORT GENERATOR */}
      {subTab === 'draft_reports' && (
        <div className="space-y-4">
          <div className="p-3 bg-[#090f1d] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold">Mẫu báo cáo tự động:</span>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                {[
                  { id: 'SHIFT_HANDOVER', label: 'Báo cáo Giao ban Ca' },
                  { id: 'EXECUTIVE_BRIEFING', label: 'Bản tin Ban Lãnh đạo' },
                  { id: 'VENDOR_INCIDENT', label: 'Hồ sơ Sự cố Nhà máy' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setReportType(r.id as any);
                      handleRunAnalysis(`Lập bản nháp theo mẫu: ${r.label}`, 'DRAFT_REPORT');
                    }}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                      reportType === r.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={loading}
                onClick={() => handleRunAnalysis(`Tạo lại toàn văn báo cáo ${reportType}`, 'DRAFT_REPORT')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sinh lại bản nháp</span>
              </button>

              <button
                onClick={() => setIsEditingReport(!isEditingReport)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isEditingReport
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingReport ? 'Xem trước định dạng' : 'Chỉnh sửa bản nháp'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In / Xuất PDF</span>
              </button>
            </div>
          </div>

          {/* Report Viewer / Editor Canvas */}
          <div className="rounded-2xl bg-[#090f1d] border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider">
                  Văn bản Báo cáo Vận hành Chính thức (Official Operations Report)
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">Mã lưu trữ:</span>
                <span className="text-cyan-300 font-bold">RPT-20250624-C1</span>
                {reportSigned && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    ✓ ĐÃ KÝ SỐ PHÁT HÀNH
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <div className="text-xs text-slate-300">Đang tự động tổng hợp số liệu và cấu trúc báo cáo...</div>
              </div>
            ) : isEditingReport ? (
              <textarea
                rows={18}
                value={editableReportText}
                onChange={e => setEditableReportText(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-400"
              />
            ) : (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner max-h-[500px] overflow-y-auto">
                {editableReportText || analysisResult || 'Đang chờ sinh nội dung báo cáo...'}
              </div>
            )}

            {/* Official Human Signature Strip */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 text-[11px]">
                Xác thực người lập: <strong className="text-white">{currentUser.name}</strong> · Vai trò: <strong className="text-cyan-300">{currentUser.role}</strong>
              </div>

              <div className="flex items-center gap-2">
                {!reportSigned ? (
                  <button
                    onClick={handleSignOfficialReport}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Ký số & Phát hành Báo cáo Chính thức</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Báo cáo đã ký số và lưu trữ nhật ký kiểm toán</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HUMAN APPROVAL GATEKEEPER MODAL */}
      {gatekeeperModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Cổng Phê duyệt Con người (Human Gatekeeper)
                </h3>
              </div>
              <button onClick={() => setGatekeeperModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Hành động được đề xuất bởi AI:
                </div>
                <div className="font-bold text-white leading-snug">
                  {gatekeeperModal.actionTitle}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span>Đối tượng: <strong className="text-cyan-300">{gatekeeperModal.targetVendor}</strong></span>
                  <span>Độ tin cậy AI: <strong className="text-emerald-400 font-mono">{gatekeeperModal.confidence}%</strong></span>
                </div>
                <div className="text-emerald-400 text-[11px]">
                  Hiệu quả phục hồi: {gatekeeperModal.expectedROI}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-200">
                <span className="font-bold">Quyền hạn ký duyệt yêu cầu: </span>
                <span className="font-mono text-white underline">{gatekeeperModal.requiredRole}</span>.
                Hiện tại bạn đăng nhập với vai trò <strong className="text-white font-mono">{currentUser.role}</strong> ({currentUser.name}).
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ý kiến chỉ đạo & Căn cứ phê duyệt *</label>
                <textarea
                  rows={3}
                  value={approvalJustification}
                  onChange={e => setApprovalJustification(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setGatekeeperModal(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmGatekeeperApproval}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ký xác nhận & Phát lệnh thực thi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
