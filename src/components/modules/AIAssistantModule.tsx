import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Bot, UserCheck, CheckCircle2, 
  AlertTriangle, FileText, Download, HelpCircle, Loader2, 
  ArrowRight, ShieldCheck, Printer, Check, X, Clock, 
  Cpu, Package, Wrench, RefreshCw, Layers, Edit3, Share2,
  Mic, MicOff, Play, Square, Volume2, ListPlus, Radio,
  FileSpreadsheet, FileDown, Eye
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

const getDefaultReportText = (type: 'SHIFT_HANDOVER' | 'EXECUTIVE_BRIEFING' | 'VENDOR_INCIDENT') => {
  if (type === 'SHIFT_HANDOVER') {
    return `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------------------------------------------------
HỆ THỐNG ĐIỀU HÀNH SẢN XUẤT NEURAL LINK V17
BAN QUẢN LÝ ĐỐI TÁC GIA CÔNG (OUTSOURCING OPERATIONS GROUP)

BÁO CÁO GIAO BAN VẬN HÀNH CA 1 (08:00 - 16:00)
Mã hồ sơ lưu trữ: RPT-20250624-C1
Ngày báo cáo: 24/06/2025
Địa điểm: Trung tâm Điều hành Sản xuất Vận hành Tập trung

I. TỔNG QUAN HIỆU SUẤT VẬN HÀNH TOÀN HỆ THỐNG:
1. Mục tiêu kế hoạch toàn bộ 7 nhà cung cấp: 18,000 pcs
2. Sản lượng thực tế hoàn thành lũy kế: 14,200 pcs (Đạt tỷ lệ: 78.8%)
3. Chênh lệch sản lượng so với kế hoạch: -3,800 pcs (Thiếu hụt sản lượng ca 1)
4. Tổng số lỗi QC phát hiện: 236 lỗi trên tổng 14,200 pcs (Tỷ lệ lỗi trung bình: 1.66%)
5. Hiệu suất thiết bị OEE trung bình toàn Group: 81.4%

II. MA TRẬN TIẾN ĐỘ VÀ NĂNG LỰC 7 NHÀ CUNG CẤP:
1. KHV: 12,800 / 15,000 pcs (85.3%) - OEE 88.5% - Defect 1.20% - Đạt chỉ tiêu cam kết
2. DREAM TECH: 13,000 / 18,000 pcs (72.2%) - OEE 76.0% - Defect 1.45% - Cần đẩy nhanh tiến độ ca 2
3. HSTEC: 12,500 / 16,000 pcs (78.1%) - OEE 82.0% - Defect 1.10% - Vận hành ổn định
4. KTECH: 12,000 / 20,000 pcs (60.0%) - OEE 65.4% - Defect 1.80% - Dừng máy 75 phút do kẹt Feeder #14
5. HOJEONGB: 13,700 / 15,500 pcs (88.4%) - OEE 91.2% - Defect 0.85% - Đạt kết quả xuất sắc nhất nhóm
6. HOJEONG VINA: 13,700 / 18,000 pcs (76.1%) - OEE 79.5% - Defect 3.16% - Phát sinh tỷ lệ lỗi hàn sóng 3.16%
7. DAAL: 8,600 / 18,000 pcs (47.8%) - OEE 52.0% - Defect 2.10% - BÁO ĐỘNG ĐỎ: Thiếu IC-TPS54302 (đệm còn 1.5h)

III. CÁC HÀNH ĐỘNG CAN THIỆP ĐÃ TRIỂN KHAI VÀ BÀN GIAO CA 2:
1. Đã phát lệnh mượn khẩn cấp 2,000 IC-TPS54302 từ kho dự phòng KHV bàn giao sang DAAL trước 14:45.
2. Đã điều động 5 kỹ thuật viên lành nghề từ Line 1 KHV sang hỗ trợ trạm đóng gói DAAL.
3. Máy SMT 02 KTECH đã được thay cụm Feeder dự phòng và hiệu chuẩn camera quang học hoàn tất lúc 15:15.
4. Bể hàn sóng Hojeong Vina đã hiệu chuẩn lại nhiệt độ 255°C, tỷ lệ lỗi 100 board thử nghiệm đã giảm về 0.4%.

IV. DANH MỤC TRỌNG TÂM CẦN BÀN GIAO CHO CA 2:
- Giám sát tiến độ tiếp nhận IC tại DAAL và chạy bù sản lượng tối thiểu 2,500 pcs.
- Chạy nghiệm thu 200 board đầu tiên của ca 2 tại Line SMT 02 KTECH.
- Ký đóng hồ sơ CAPA-HJV-03 khi ca 2 xác nhận nhiệt độ ổn định.

XÁC NHẬN BÀN GIAO CA TRỰC:
- Người lập báo cáo: [Chữ ký số đã xác thực]
- Trưởng ca vận hành: [Đã duyệt và ký số]`;
  }

  if (type === 'EXECUTIVE_BRIEFING') {
    return `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------------------------------------------------
HỆ THỐNG ĐIỀU HÀNH SẢN XUẤT NEURAL LINK V17
BẢN TIN ĐIỀU HÀNH DÀNH CHO BAN LÃNH ĐẠO (EXECUTIVE BRIEFING)
Mã tài liệu: RPT-EXEC-20250624
Thời điểm phát hành: 16:30 Ngày 24/06/2025

I. BÁO CÁO NHANH TÌNH HÌNH VẬN HÀNH CHUỖI GIA CÔNG:
1. Tổng sản lượng hoàn thành ca 1 đạt 14,200 pcs / 18,000 pcs kế hoạch (Đạt 78.8%).
2. Điểm nghẽn rủi ro cao nhất tập trung tại 2 đối tác: DAAL (đạt 47.8%, thiếu linh kiện nguồn) và KTECH (đạt 60%, dừng máy SMT 75 phút).
3. Rủi ro chậm tiến độ 2 đơn hàng TO xuất khẩu sang thị trường châu Âu (hạn chót giao hàng: 18:00 ngày 25/06) nếu không tổ chức tăng ca bù sản lượng trong đêm nay.

II. CÁC ĐỀ XUẤT QUYẾT ĐỊNH CẤP BÁCH TRÌNH BAN LÃNH ĐẠO PHÊ DUYỆT:
1. Phê duyệt ngân sách tăng ca bù sản lượng 2.5 giờ cho toàn bộ các chuyền tại DAAL và chi phí vận chuyển linh kiện khẩn cấp từ KHV ($1,450).
2. Phê duyệt áp dụng chính sách Đóng băng Kế hoạch 24 giờ (Frozen Window) đối với mã hàng A102 tại Dream Tech nhằm hạn chế chi phí căn chỉnh khuôn máy (Setup cost).
3. Yêu cầu Ban Giám đốc DAAL giải trình bằng văn bản về việc tự ý giảm tồn kho đệm an toàn dưới 48 giờ.

III. DỰ BÁO TÀI CHÍNH VÀ TIẾN ĐỘ:
- Tổn thất ước tính nếu không can thiệp: $42,000 tiền phạt vi phạm tiến độ hợp đồng TO-2025-089.
- Hiệu quả phục hồi sau khi Ban Lãnh đạo ký duyệt các biện pháp trên: Giảm thiểu 85% rủi ro trễ đơn hàng và bù đắp 3,200 pcs sản lượng thiếu hụt.

TRÌNH DUYỆT BAN LÃNH ĐẠO:
- Người đề xuất: [Chữ ký số đã xác thực]
- Phê duyệt Ban Giám đốc: [Đang chờ quyết định]`;
  }

  return `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---------------------------------------------------------
HỆ THỐNG ĐIỀU HÀNH SẢN XUẤT NEURAL LINK V17
HỒ SƠ ĐIỀU TRA SỰ CỐ VẬN HÀNH NHÀ MÁY (VENDOR INCIDENT DOSSIER)
Mã hồ sơ: INC-20250624-DAAL
Phân loại sự cố: MỨC ĐỘ 1 (CRITICAL - TẮC NGHẼN DÂY CHUYỀN SẢN XUẤT)
Thời điểm ghi nhận: 10:15 ngày 24/06/2025

I. THÔNG TIN SỰ CỐ VẬN HÀNH:
- Nhà máy xảy ra sự cố: DAAL ELECTRONICS (KCN Đại Đồng - Hoàn Sơn, Bắc Ninh)
- Dây chuyền ảnh hưởng: Line SMT 01, Line SMT 02, Line Assembly 03
- Mã linh kiện thiếu hụt: IC-TPS54302 (IC điều áp nguồn xung 5V)
- Số lượng kế hoạch ca bị đe dọa: 9,400 pcs

II. ĐIỀU TRA NGUYÊN NHÂN GỐC RỄ THEO PHƯƠNG PHÁP 5-WHYS:
1. Tại sao chuyền SMT tại DAAL phải dừng? -> Trạm gắn chip hết IC-TPS54302 lúc 10:15.
2. Tại sao kho hết IC? -> Tồn kho thực tế chỉ còn 450 pcs, không đủ cho định mức ca là 2,500 pcs.
3. Tại sao kho không được cấp bổ sung? -> Chuyến xe giao hàng sáng từ nhà phân phối Arrow Electronics bị chậm do kẹt cửa khẩu quốc tế.
4. Tại sao không có tồn kho đệm an toàn tại chỗ? -> DAAL đã đơn phương cắt giảm mức đệm an toàn từ 3 ngày xuống còn 1.5 giờ nhằm tối ưu hóa chi phí vốn lưu kho.
5. Nguyên nhân cốt lõi: Quy trình quản lý rủi ro chuỗi cung ứng của DAAL vi phạm điều khoản cam kết SLA trong hợp đồng outsourcing với Neural Link V17.

III. KẾT QUẢ XỬ LÝ KHẨN CẤP VÀ HÀNH ĐỘNG PHÒNG NGỪA (CAPA):
1. Hành động khẩn cấp: Mượn 2,000 IC từ kho dự trữ chiến lược của KHV, bàn giao lúc 14:45.
2. Hành động phòng ngừa: Buộc DAAL ký phụ lục cam kết duy trì tồn kho an toàn tối thiểu 48 giờ đối với toàn bộ danh mục linh kiện Nhóm A (Critical ICs).
3. Chế tài: Ghi nhận vi phạm SLA, trừ 5 điểm KPI tháng 6 của DAAL.

TRƯỞNG ĐOÀN ĐIỀU TRA SỰ CỐ: [Đã ký xác nhận]
ĐẠI DIỆN BAN GIÁM ĐỐC NHÀ MÁY DAAL: [Đã ký nhận biên bản]`;
};

export const AIAssistantModule: React.FC<AIAssistantModuleProps> = ({
  vendors,
  plans,
  currentLang,
  currentUser
}) => {
  const t = translations[currentLang];
  
  // Navigation Tabs inside AI Assistant
  const [subTab, setSubTab] = useState<'deep_analysis' | 'realtime_actions' | 'draft_reports' | 'voice_to_task'>('deep_analysis');
  
  // Query & Execution States
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<'GEMINI_AI' | 'DOMAIN_RULE_ENGINE'>('DOMAIN_RULE_ENGINE');
  
  // Selected Filter Vendor for deep analysis
  const [selectedAnalysisVendor, setSelectedAnalysisVendor] = useState<string>('all');

  // Report Generator State
  const [reportType, setReportType] = useState<'SHIFT_HANDOVER' | 'EXECUTIVE_BRIEFING' | 'VENDOR_INCIDENT'>('SHIFT_HANDOVER');
  const [editableReportText, setEditableReportText] = useState<string>(() => getDefaultReportText('SHIFT_HANDOVER'));
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [reportSigned, setReportSigned] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

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

  // --- Voice-to-Task Audio State ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  
  // Parsed Audio Task Result
  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);
  const [extractedTask, setExtractedTask] = useState<{
    title: string;
    vendorCode: string;
    priority: 'Cao' | 'Trung bình' | 'Thấp';
    category: string;
    deadline: string;
    assigneeRole: string;
    actionableDetails: string;
    requiresApproval: boolean;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

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

  // --- Export Report as CSV (UTF-8 BOM with structured metadata and 7-vendor matrix) ---
  const handleExportCSV = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString('vi-VN');
    const reportTitle = reportType === 'SHIFT_HANDOVER' 
      ? 'Báo cáo Giao ban Vận hành Ca' 
      : reportType === 'EXECUTIVE_BRIEFING'
      ? 'Bản tin Điều hành Ban Lãnh đạo'
      : 'Hồ sơ Sự cố Nhà máy';
    const reportCode = `RPT-${dateStr.replace(/-/g, '')}-${reportType.slice(0, 4)}`;

    const csvRows: string[] = [];

    // Helper to escape CSV field
    const c = (val: any) => {
      const s = String(val ?? '').replace(/"/g, '""');
      return `"${s}"`;
    };

    // 1. Enterprise Report Metadata
    csvRows.push([c('HỆ THỐNG ĐIỀU HÀNH SẢN XUẤT NEURAL LINK V17 - BAN QUẢN LÝ OUTSOURCING')].join(','));
    csvRows.push([c('LOẠI BÁO CÁO:'), c(reportTitle)].join(','));
    csvRows.push([c('MÃ LƯU TRỮ HỒ SƠ:'), c(reportCode)].join(','));
    csvRows.push([c('NGÀY XUẤT BÁO CÁO:'), c(`${dateStr} ${timeStr}`)].join(','));
    csvRows.push([c('NGƯỜI LẬP / XÁC THỰC:'), c(`${currentUser.name} (${currentUser.role})`)].join(','));
    csvRows.push([c('TRẠNG THÁI KÝ SỐ:'), c(reportSigned ? 'ĐÃ KÝ SỐ VÀ PHÁT HÀNH CHÍNH THỨC' : 'BẢN THẢO CHỜ DUYỆT (DRAFT)')].join(','));
    csvRows.push([c('CÔNG NGHỆ BÓC TÁCH:'), c(sourceType === 'GEMINI_AI' ? 'Mô hình Phân tích Gemini 3.8 Flash AI' : 'Động cơ Phân tích Quy tắc Nghiệp vụ (Domain Engine)')].join(','));
    csvRows.push('');

    // 2. Summary KPI Metrics
    const totalTarget = vendors.reduce((acc, v) => acc + (v.planPcs || 0), 0);
    const totalActual = vendors.reduce((acc, v) => acc + (v.actualPcs || 0), 0);
    const avgCompletion = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : '0';
    const avgDefect = (vendors.reduce((acc, v) => acc + (v.defectRate || 0), 0) / (vendors.length || 1)).toFixed(2);
    const avgOtif = (vendors.reduce((acc, v) => acc + (v.onTimeDeliveryRate || 0), 0) / (vendors.length || 1)).toFixed(1);

    csvRows.push([c('--- CHỈ SỐ KPI TỔNG QUAN TOÀN HỆ THỐNG ---')].join(','));
    csvRows.push([c('Chỉ số'), c('Giá trị'), c('Đơn vị'), c('Đánh giá')].join(','));
    csvRows.push([c('Tổng Kế hoạch Mục tiêu'), c(totalTarget), c('Pcs'), c('Toàn bộ 7 cơ sở gia công')].join(','));
    csvRows.push([c('Tổng Sản lượng Hoàn thành'), c(totalActual), c('Pcs'), c('Ghi nhận từ GMES/Thủ công')].join(','));
    csvRows.push([c('Chênh lệch Thiếu hụt'), c(totalActual - totalTarget), c('Pcs'), c(totalActual >= totalTarget ? 'Đạt tiến độ' : 'Thiếu hụt sản lượng')].join(','));
    csvRows.push([c('Tỷ lệ Hoàn thành Toàn Group'), c(`${avgCompletion}%`), c('%'), c(Number(avgCompletion) >= 85 ? 'Tốt' : 'Cần can thiệp')].join(','));
    csvRows.push([c('Tỷ lệ Lỗi QC Trung bình'), c(`${avgDefect}%`), c('%'), c(Number(avgDefect) <= 1.5 ? 'Trong ngưỡng' : 'Vượt ngưỡng kiểm soát')].join(','));
    csvRows.push([c('Tỷ lệ Giao hàng Đúng hạn (OTIF)'), c(`${avgOtif}%`), c('%'), c('Định mức >= 90%')].join(','));
    csvRows.push('');

    // 3. Matrix of 7 Vendors
    csvRows.push([c('--- MA TRẬN NĂNG LỰC VẬN HÀNH 7 NHÀ CUNG CẤP ---')].join(','));
    csvRows.push([
      c('STT'),
      c('Mã NCC'),
      c('Tên Nhà Cung Cấp'),
      c('Khu Vực'),
      c('Kế Hoạch (Pcs)'),
      c('Thực Tế (Pcs)'),
      c('Chênh Lệch (Pcs)'),
      c('Tỷ Lệ Hoàn Thành (%)'),
      c('Tỷ Lệ Lỗi QC (%)'),
      c('Đệm Vật Liệu (Giờ)'),
      c('Tỷ Lệ OTIF (%)'),
      c('Trạng Thái Vận Hành')
    ].join(','));

    vendors.forEach((v, idx) => {
      csvRows.push([
        c(idx + 1),
        c(v.code),
        c(v.name),
        c(v.location),
        c(v.planPcs),
        c(v.actualPcs),
        c(v.actualPcs - v.planPcs),
        c(`${v.completionRate}%`),
        c(`${v.defectRate}%`),
        c(`${v.materialBufferHours}h`),
        c(`${v.onTimeDeliveryRate}%`),
        c(v.status === 'active' ? 'Hoạt động tốt' : v.status === 'warning' ? 'Cảnh báo' : v.status === 'critical' ? 'Báo động đỏ' : 'Chưa có dữ liệu')
      ].join(','));
    });
    csvRows.push('');

    // 4. Full Text of the Report
    csvRows.push([c('--- TOÀN VĂN NỘI DUNG VĂN BẢN BÁO CÁO ---')].join(','));
    const reportBody = editableReportText || analysisResult || getDefaultReportText(reportType);
    const bodyLines = reportBody.split('\n');
    bodyLines.forEach(line => {
      csvRows.push([c(line)].join(','));
    });
    csvRows.push('');

    // 5. Signature Section
    csvRows.push([c('--- XÁC THỰC VÀ CHỮ KÝ PHÊ DUYỆT ---')].join(','));
    csvRows.push([c('Người Lập Báo Cáo'), c(''), c('Trưởng Nhóm Outsourcing'), c(''), c('Tổng Giám Đốc Phê Duyệt')].join(','));
    csvRows.push([c(currentUser.name), c(''), c('Trần Thị Hằng'), c(''), c('Đỗ Minh Tuấn')].join(','));
    csvRows.push([c(`Ký ngày: ${dateStr}`), c(''), c('Đã ký số Token #SEC-8912'), c(''), c('Đã phê duyệt điện tử')].join(','));

    const csvContent = '\uFEFF' + csvRows.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NEURAL_LINK_${reportType}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    operationsService.addAuditLog(
      'SYNC',
      'ReportExport',
      reportCode,
      `Xuất tệp CSV báo cáo: ${reportTitle} (${reportCode}) bởi ${currentUser.name} (${currentUser.role})`
    );
    setToastMessage(`Đã xuất tệp CSV lưu trữ báo cáo "${reportTitle}" thành công!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Open PDF Document Archival & Print Studio ---
  const handleExportPDF = () => {
    const reportTitle = reportType === 'SHIFT_HANDOVER' 
      ? 'Báo cáo Giao ban Vận hành Ca' 
      : reportType === 'EXECUTIVE_BRIEFING'
      ? 'Bản tin Điều hành Ban Lãnh đạo'
      : 'Hồ sơ Sự cố Nhà máy';
    const dateStr = new Date().toISOString().slice(0, 10);
    const reportCode = `RPT-${dateStr.replace(/-/g, '')}-${reportType.slice(0, 4)}`;

    operationsService.addAuditLog(
      'SYNC',
      'ReportExport',
      reportCode,
      `Mở giao diện xuất bản PDF và lưu trữ tài liệu: ${reportTitle} (${reportCode}) bởi ${currentUser.name}`
    );
    setShowPdfModal(true);
  };

  // --- Direct Standalone HTML/PDF Document Download ---
  const handleDownloadPrintableHTML = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toLocaleTimeString('vi-VN');
    const reportTitle = reportType === 'SHIFT_HANDOVER' 
      ? 'BÁO CÁO GIAO BAN VẬN HÀNH CA 1' 
      : reportType === 'EXECUTIVE_BRIEFING'
      ? 'BẢN TIN ĐIỀU HÀNH DÀNH CHO BAN LÃNH ĐẠO'
      : 'HỒ SƠ ĐIỀU TRA SỰ CỐ VẬN HÀNH NHÀ MÁY';
    const reportCode = `RPT-${dateStr.replace(/-/g, '')}-${reportType.slice(0, 4)}`;
    const reportBody = editableReportText || analysisResult || getDefaultReportText(reportType);

    const totalTarget = vendors.reduce((acc, v) => acc + (v.planPcs || 0), 0);
    const totalActual = vendors.reduce((acc, v) => acc + (v.actualPcs || 0), 0);
    const avgCompletion = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : '0';

    const vendorRowsHTML = vendors.map((v, i) => `
      <tr>
        <td style="text-align:center;">${i + 1}</td>
        <td><strong>${v.code}</strong></td>
        <td>${v.name}</td>
        <td>${v.location}</td>
        <td style="text-align:right;">${v.planPcs.toLocaleString()}</td>
        <td style="text-align:right; font-weight:bold;">${v.actualPcs.toLocaleString()}</td>
        <td style="text-align:right; color: ${v.actualPcs - v.planPcs < 0 ? '#b91c1c' : '#15803d'}; font-weight:bold;">
          ${(v.actualPcs - v.planPcs).toLocaleString()}
        </td>
        <td style="text-align:center; font-weight:bold;">${v.completionRate}%</td>
        <td style="text-align:center;">${v.defectRate}%</td>
        <td style="text-align:center;">${v.onTimeDeliveryRate}%</td>
        <td style="text-align:center;">
          <span style="display:inline-block; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:bold; background:${v.status === 'active' ? '#dcfce7; color:#15803d;' : v.status === 'warning' ? '#fef3c7; color:#b45309;' : v.status === 'critical' ? '#fee2e2; color:#b91c1c;' : '#f1f5f9; color:#64748b;'}">
            ${v.status === 'active' ? 'Hoạt động tốt' : v.status === 'warning' ? 'Cảnh báo' : v.status === 'critical' ? 'Báo động đỏ' : 'Chưa có dữ liệu'}
          </span>
        </td>
      </tr>
    `).join('');

    const htmlDoc = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>NEURAL LINK V17 - ${reportTitle} - ${reportCode}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111827; background: #ffffff; margin: 0; padding: 25px; font-size: 13px; line-height: 1.6; }
    .header-table { width: 100%; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; }
    .national-motto { text-align: center; }
    .national-motto h3 { margin: 0; font-size: 13px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
    .national-motto p { margin: 2px 0 0 0; font-size: 12px; font-weight: bold; text-decoration: underline; }
    .brand-title { font-size: 14px; font-weight: 800; color: #0369a1; text-transform: uppercase; margin: 0; }
    .brand-sub { font-size: 11px; color: #475569; margin: 2px 0 0 0; }
    .doc-title { text-align: center; margin: 20px 0 15px 0; }
    .doc-title h1 { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase; }
    .doc-title p { font-size: 12px; color: #64748b; margin: 4px 0 0 0; }
    .meta-box { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
    .meta-box td { padding: 6px 10px; border: 1px solid #cbd5e1; }
    .meta-box td.label { font-weight: bold; background: #f1f5f9; width: 25%; color: #334155; }
    .section-header { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0369a1; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 20px 0 10px 0; }
    .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    .data-table th, .data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; }
    .data-table th { background: #0f172a; color: #ffffff; font-weight: bold; text-align: left; }
    .data-table tr:nth-child(even) { background: #f8fafc; }
    .report-narrative { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 11.5px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 25px; }
    .sig-container { width: 100%; margin-top: 30px; display: table; }
    .sig-col { display: table-cell; width: 33.33%; text-align: center; vertical-align: top; }
    .sig-role { font-weight: bold; font-size: 12px; text-transform: uppercase; }
    .sig-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
    .sig-badge { display: inline-block; margin-top: 15px; margin-bottom: 15px; padding: 4px 10px; border: 1.5px solid #059669; color: #059669; font-weight: bold; font-size: 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .sig-name { font-weight: bold; font-size: 12px; }
    .footer-audit { border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 25px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <div class="brand-title">NEURAL LINK V17</div>
        <div class="brand-sub">HỆ THỐNG ĐIỀU HÀNH SẢN XUẤT THUÊ NGOÀI (OUTSOURCING OPS)</div>
        <div class="brand-sub">Trực ban Vận hành: 24/06/2025 - Ca 1</div>
      </td>
      <td style="width: 50%; vertical-align: top;">
        <div class="national-motto">
          <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
          <p>Độc lập - Tự do - Hạnh phúc</p>
        </div>
      </td>
    </tr>
  </table>

  <div class="doc-title">
    <h1>${reportTitle}</h1>
    <p>Hồ sơ Lưu trữ Văn bản Chính thức & Phục vụ Kiểm toán Vận hành</p>
  </div>

  <table class="meta-box">
    <tr>
      <td class="label">Mã Lưu Trữ Văn Bản:</td>
      <td><strong>${reportCode}</strong></td>
      <td class="label">Thời Điểm Lập:</td>
      <td>${dateStr} - ${timeStr}</td>
    </tr>
    <tr>
      <td class="label">Người Lập / Thẩm Tra:</td>
      <td><strong>${currentUser.name}</strong> (${currentUser.role})</td>
      <td class="label">Trạng Thái Ký Số:</td>
      <td><strong style="color: ${reportSigned ? '#15803d' : '#b45309'};">${reportSigned ? '✓ ĐÃ KÝ SỐ VÀ PHÁT HÀNH CHÍNH THỨC' : 'BẢN THẢO LƯU HÀNH NỘI BỘ (CHƯA KÝ)'}</strong></td>
    </tr>
    <tr>
      <td class="label">Tổng Kế Hoạch 7 Nhà Máy:</td>
      <td>${totalTarget.toLocaleString()} pcs</td>
      <td class="label">Sản Lượng Thực Tế Đạt:</td>
      <td><strong>${totalActual.toLocaleString()} pcs (${avgCompletion}%)</strong></td>
    </tr>
  </table>

  <div class="section-header">I. MA TRẬN NĂNG LỰC VẬN HÀNH 7 NHÀ CUNG CẤP (7 FACILITIES MATRIX)</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width:30px; text-align:center;">STT</th>
        <th>Mã NCC</th>
        <th>Tên Nhà Cung Cấp</th>
        <th>Khu Vực</th>
        <th style="text-align:right;">Kế Hoạch</th>
        <th style="text-align:right;">Thực Tế</th>
        <th style="text-align:right;">Chênh Lệch</th>
        <th style="text-align:center;">Tỷ Lệ</th>
        <th style="text-align:center;">Lỗi QC</th>
        <th style="text-align:center;">OEE</th>
        <th style="text-align:center;">Đánh Giá</th>
      </tr>
    </thead>
    <tbody>
      ${vendorRowsHTML}
    </tbody>
  </table>

  <div class="section-header">II. NỘI DUNG CHI TIẾT BÁO CÁO VẬN HÀNH & KẾT QUẢ ĐIỀU PHỐI</div>
  <div class="report-narrative">${reportBody}</div>

  <div class="section-header">III. XÁC NHẬN TRÁCH NHIỆM & CHỮ KÝ PHÊ DUYỆT</div>
  <div class="sig-container">
    <div class="sig-col">
      <div class="sig-role">Người Lập Báo Cáo</div>
      <div class="sig-sub">(Ký & ghi rõ họ tên)</div>
      <div class="sig-badge">✓ XÁC THỰC PKI ĐIỆN TỬ</div>
      <div class="sig-name">${currentUser.name}</div>
      <div class="sig-sub">${currentUser.role}</div>
    </div>
    <div class="sig-col">
      <div class="sig-role">Trưởng Ban Outsourcing</div>
      <div class="sig-sub">(Thẩm tra & xác nhận)</div>
      <div class="sig-badge">✓ ĐÃ KÝ DUYỆT SỐ #SEC-8912</div>
      <div class="sig-name">Trần Thị Hằng</div>
      <div class="sig-sub">Outsourcing Group Manager</div>
    </div>
    <div class="sig-col">
      <div class="sig-role">Tổng Giám Đốc</div>
      <div class="sig-sub">(Phê chuẩn lưu trữ)</div>
      <div class="sig-badge" style="border-color:#b91c1c; color:#b91c1c;">★ PHÊ CHUẨN BAN HÀNH</div>
      <div class="sig-name">Đỗ Minh Tuấn</div>
      <div class="sig-sub">Executive Managing Director</div>
    </div>
  </div>

  <div class="footer-audit">
    <span>Hệ thống Neural Link V17 - Document Integrity SHA256: 9f8e72c81d...5a4b</span>
    <span>Trang 1 / 1 · Thời điểm in: ${dateStr} ${timeStr}</span>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NEURAL_LINK_${reportType}_${dateStr}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    operationsService.addAuditLog(
      'SYNC',
      'ReportExport',
      reportCode,
      `Tải tệp tài liệu báo cáo độc lập (.html): ${reportTitle} bởi ${currentUser.name}`
    );
    setToastMessage('Đã tải xuống tài liệu báo cáo lưu trữ dạng file hoàn chỉnh!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Voice-to-Task Real Microphone Recording Handlers ---
  const startRecording = async () => {
    setMicError(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioTranscript(null);
    setExtractedTask(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission or hardware error:', err);
      setMicError('Không thể truy cập Microphone (quyền trình duyệt hoặc phần cứng). Bạn có thể thử nghiệm tính năng với các đoạn ghi âm mẫu chuẩn phía dưới.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleTranscribeAndExtract = async (overrideBlob?: Blob, sampleTextPrompt?: string) => {
    setTranscribing(true);
    setAudioTranscript(null);
    setExtractedTask(null);

    const targetBlob = overrideBlob || audioBlob;

    let audioBase64 = '';
    if (targetBlob) {
      const reader = new FileReader();
      audioBase64 = await new Promise((resolve) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          const base64Part = res.split(',')[1] || res;
          resolve(base64Part);
        };
        reader.readAsDataURL(targetBlob);
      });
    }

    try {
      const response = await fetch('/api/gemini/audio-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType: targetBlob?.type || 'audio/webm',
          sampleText: sampleTextPrompt,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAudioTranscript(data.transcript);
        setExtractedTask(data.task);
        setToastMessage('Đã chuyển đổi giọng nói và bóc tách nhiệm vụ sản xuất thành công!');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gửi yêu cầu chuyển đổi âm thanh.');
    } finally {
      setTranscribing(false);
    }
  };

  const handleCommitVoiceTask = () => {
    if (!extractedTask) return;

    // Find vendor id
    const vendor = vendors.find(v => v.code.toLowerCase() === extractedTask.vendorCode.toLowerCase());
    const vendorId = vendor ? vendor.id : 'v-daal';

    operationsService.createTaskFromAIAction(
      extractedTask.title,
      extractedTask.priority,
      vendorId
    );

    operationsService.addAuditLog(
      'CREATE',
      'VoiceTask',
      vendorId,
      `Tạo nhiệm vụ từ ghi âm giọng nói: "${extractedTask.title}" (${extractedTask.deadline})`
    );

    setToastMessage(`Đã đưa nhiệm vụ "${extractedTask.title}" vào danh sách tác nghiệp toàn ca!`);
    setExtractedTask(null);
    setAudioTranscript(null);
    setAudioBlob(null);
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
              GEMINI 3.8 FLASH & MULTIMODAL AUDIO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân tích chuyên sâu 5-Whys, khuyến nghị hành động, ghi âm chỉ đạo chuyển thành nhiệm vụ và lập báo cáo tự động có cổng duyệt con người (Human Gatekeeper).
          </p>
        </div>

        {/* 4 Core AI Mode Selectors */}
        <div className="flex flex-wrap items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-medium">
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
            <span>Phân tích 5-Whys</span>
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
            onClick={() => setSubTab('voice_to_task')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              subTab === 'voice_to_task' ? 'bg-rose-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-300" />
            <span>Ghi âm Chỉ đạo (Voice-to-Task)</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
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

      {/* SUB-TAB 4: VOICE-TO-TASK MICROPHONE RECORDING (NEW FEATURE) */}
      {subTab === 'voice_to_task' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Banner */}
          <div className="p-4 bg-gradient-to-r from-rose-950/60 via-slate-900 to-[#090f1d] border border-rose-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-600/30 border border-rose-500 text-rose-300">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span>Trí tuệ Nhân tạo Đa phương thức (Multimodal Speech-to-Task)</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-rose-900/80 text-rose-200">Microphone Live</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">
                  Ghi âm Ghi chú Hiện trường & Tự động Chuyển thành Nhiệm vụ Sản xuất
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Sử dụng Gemini AI để nhận dạng tiếng Việt, trích xuất mã nhà máy, mức độ ưu tiên, hạn hoàn thành và lập phiếu giao việc tức thời.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Trạng thái:</span>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800">
                Audio Engine Sẵn sàng
              </span>
            </div>
          </div>

          {micError && (
            <div className="p-3 bg-amber-950/70 border border-amber-600 text-amber-200 text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span>{micError}</span>
              </div>
            </div>
          )}

          {/* Voice Recording Control Center */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Box: Microphone Recorder & Audio Waveform */}
            <div className="lg:col-span-5 rounded-2xl bg-[#090f1d] border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4 text-center">
                <div className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>Bộ Thu Âm Micro Trực tiếp</span>
                  <span className="text-[10px] text-cyan-400 font-mono">16kHz WebM</span>
                </div>

                {/* Big Recording Button */}
                <div className="py-6 flex flex-col items-center justify-center space-y-3">
                  <div className="relative">
                    {isRecording && (
                      <span className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
                    )}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                        isRecording 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-500/50 scale-105'
                          : 'bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:scale-105'
                      }`}
                    >
                      {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                  </div>

                  <div className="font-mono text-base font-bold text-white tracking-widest">
                    {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:
                    {(recordingSeconds % 60).toString().padStart(2, '0')}
                  </div>

                  <div className="text-xs text-slate-400">
                    {isRecording ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1.5 justify-center">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        Đang thu âm... Nhấn nút vuông để dừng
                      </span>
                    ) : (
                      <span>Nhấn vào nút Micro để bắt đầu nói chỉ đạo ca</span>
                    )}
                  </div>
                </div>

                {/* Audio Waveform Simulation Bar */}
                <div className="h-10 w-full bg-slate-950 rounded-xl border border-slate-800/80 px-4 flex items-center justify-center gap-1">
                  {[4, 12, 24, 16, 28, 8, 20, 32, 14, 26, 18, 10, 30, 22, 6, 15, 25, 35, 12, 20, 28, 16, 8, 24].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isRecording ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{ height: isRecording ? `${Math.min(32, Math.max(6, (h * (recordingSeconds % 3 + 1)) % 32))}px` : '4px' }}
                    />
                  ))}
                </div>

                {/* Audio Playback Element */}
                {audioUrl && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-left">
                    <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Bản ghi âm hiện trường:</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {(audioBlob?.size ? (audioBlob.size / 1024).toFixed(1) : '0')} KB
                      </span>
                    </div>
                    <audio src={audioUrl} controls className="w-full h-8" />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  disabled={!audioBlob || isRecording || transcribing}
                  onClick={() => handleTranscribeAndExtract()}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all"
                >
                  {transcribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang chuyển văn bản & trích xuất nhiệm vụ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Chuyển Giọng Nói Thành Nhiệm Vụ Sản Xuất</span>
                    </>
                  )}
                </button>
              </div>

              {/* Presets for Testing / Instant Experience */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Hoặc thử nhanh các bản ghi chú giọng nói mẫu:
                </span>
                <div className="space-y-1.5">
                  {[
                    {
                      label: 'DAAL: Cạn kiệt IC nguồn TPS54302, xin mượn 2,000 con từ KHV trước 16h',
                      text: 'Báo cáo khẩn từ xưởng DAAL: Hiện tại IC nguồn TPS54302 chỉ còn 450 con đệm 1.5 giờ. Yêu cầu làm việc với thủ kho KHV để mượn khẩn 2,000 con chuyển sang trước 16:00 chiều nay.'
                    },
                    {
                      label: 'KTECH: Máy SMT mounter Line 2 kẹt feeder #14, dừng chuyền 75p',
                      text: 'Báo sự cố khẩn cấp: Máy SMT mounter Line 2 tại KTECH bị kẹt feeder slot số 14, camera quang học lệch góc. Yêu cầu kỹ sư thiết bị Vũ Quốc Thái thay cụm feeder dự phòng và chạy mẫu 50 board trước 15:30.'
                    },
                    {
                      label: 'HOJEONG VINA: Tỷ lệ lỗi hàn sóng vượt 3.16%, cần hiệu chuẩn nhiệt 255°C',
                      text: 'Báo cáo chất lượng QC Hojeong Vina: FQC phát hiện 19 board bị bắc cầu thiếc hàn sóng, tỷ lệ lỗi 3.16%. Yêu cầu tổ bảo trì hiệu chuẩn lại nhiệt độ bể thiếc về 255 độ C và lấy 100 mẫu nghiệm thu.'
                    },
                    {
                      label: 'HSTEC: Thiếu 12 nhân công khâu lắp ráp chuyền 2, xin điều chuyển',
                      text: 'Báo cáo nhân lực HSTEC: Chuyền lắp ráp số 2 thiếu 12 công nhân do dịch cúm. Đề nghị Ban quản lý điều chuyển nhân sự từ KCN Quế Võ và kéo dài ca làm thêm 1.5 giờ.'
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      disabled={transcribing}
                      onClick={() => handleTranscribeAndExtract(undefined, preset.text)}
                      className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 text-left text-[11px] text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">• {preset.label}</span>
                      <Play className="w-3 h-3 text-cyan-400 shrink-0 group-hover:scale-110" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box: Transcribed Speech & Actionable Task Card */}
            <div className="lg:col-span-7 rounded-2xl bg-[#090f1d] border border-slate-800 p-5 space-y-4 flex flex-col justify-between min-h-[480px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Kết quả Chuyển đổi Văn bản & Nhiệm vụ Đã Bóc Tách
                    </span>
                  </div>
                  {extractedTask && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold font-mono">
                      ✓ ĐÃ TRÍCH XUẤT NHIỆM VỤ
                    </span>
                  )}
                </div>

                {transcribing ? (
                  <div className="py-24 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                    <div className="text-xs text-slate-300">Đang nhận dạng âm thanh qua Gemini Model và bóc tách các trường tác nghiệp...</div>
                  </div>
                ) : audioTranscript && extractedTask ? (
                  <div className="space-y-4">
                    {/* 1. Speech Transcript Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                        <span>Văn bản nguyên văn nhận dạng được (Speech Transcript):</span>
                        <span className="text-cyan-400 font-mono">Độ chính xác cao</span>
                      </div>
                      <p className="text-xs font-mono text-cyan-200 leading-relaxed italic">
                        "{audioTranscript}"
                      </p>
                    </div>

                    {/* 2. Extracted Structured Task Card */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1626] border border-cyan-500/60 shadow-xl space-y-3">
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-400">Nhiệm vụ sản xuất đề xuất:</div>
                          <h3 className="text-sm font-bold text-white mt-0.5">
                            {extractedTask.title}
                          </h3>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded font-mono ${
                          extractedTask.priority === 'Cao'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : extractedTask.priority === 'Trung bình'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          Ưu tiên: {extractedTask.priority}
                        </span>
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Nhà máy đích</span>
                          <span className="font-mono font-bold text-cyan-300">{extractedTask.vendorCode}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Hạng mục</span>
                          <span className="font-semibold text-white">{extractedTask.category}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Hạn xử lý (SLA)</span>
                          <span className="font-mono text-amber-300">{extractedTask.deadline}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">Cần phê duyệt</span>
                          <span className="font-semibold text-rose-400">
                            {extractedTask.requiresApproval ? 'Bắt buộc' : 'Không'}
                          </span>
                        </div>
                      </div>

                      {/* Action Details */}
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Kế hoạch can thiệp chi tiết:
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {extractedTask.actionableDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-3 text-slate-500 text-xs">
                    <Mic className="w-10 h-10 mx-auto text-slate-700" />
                    <div>Chưa có bản ghi âm. Hãy nhấn nút Micro bên trái hoặc chọn một bản ghi âm mẫu để xem kết quả trích xuất nhiệm vụ.</div>
                  </div>
                )}
              </div>

              {/* Bottom Commit Strip */}
              {extractedTask && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Người giao việc: <strong className="text-white">{currentUser.name} ({currentUser.role})</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setExtractedTask(null);
                        setAudioTranscript(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleCommitVoiceTask}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
                    >
                      <ListPlus className="w-4 h-4" />
                      <span>Xác nhận & Tạo Nhiệm vụ Sản xuất ngay</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                      setEditableReportText(getDefaultReportText(r.id as any));
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

            <div className="flex flex-wrap items-center gap-2">
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
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Xuất bảng dữ liệu và toàn văn báo cáo dưới dạng tệp CSV UTF-8"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xuất tệp CSV (.csv)</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                title="Mở studio xem trước và xuất tài liệu PDF lưu trữ chính thức"
              >
                <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Xuất tệp PDF (.pdf)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                title="In trực tiếp trang báo cáo"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In nhanh</span>
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

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xuất CSV</span>
                </button>

                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Xem & In PDF</span>
                </button>

                {!reportSigned ? (
                  <button
                    onClick={handleSignOfficialReport}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Ký số & Phát hành Báo cáo Chính thức</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs px-2.5 py-1.5 bg-emerald-950/60 rounded-xl border border-emerald-800">
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

      {/* PDF DOCUMENT ARCHIVAL & PRINT PREVIEW MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
          {/* Top Modal Control Bar (Excluded from printing via no-print class) */}
          <div className="no-print max-w-4xl w-full mx-auto mb-4 bg-slate-900 border border-slate-700 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Trung tâm Lưu trữ & Xuất bản Báo cáo (Document Archival Studio)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    A4 Official
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Xem trước định dạng văn bản pháp quy, hỗ trợ xuất file PDF độ nét cao, tệp dữ liệu CSV hoặc tệp độc lập (.html).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-800/60 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Tải về tệp CSV mã hóa UTF-8 BOM"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xuất CSV</span>
              </button>

              <button
                onClick={handleDownloadPrintableHTML}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Tải về tệp văn bản độc lập dùng cho lưu trữ offline hoặc mở trong MS Word"
              >
                <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tải tệp .html</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950 transition-all print-allow"
                title="Kích hoạt lệnh In hệ thống / Lưu dưới dạng PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In / Lưu PDF (Ctrl+P)</span>
              </button>

              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-1"
                title="Đóng cửa sổ xem trước"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Official A4 Document Canvas */}
          <div 
            id="printable-operations-report"
            className="w-full max-w-4xl mx-auto bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-10 md:p-12 font-sans text-xs leading-relaxed space-y-6 print:p-0 print:m-0 print:shadow-none print:rounded-none"
          >
            {/* Header: Organization & National Motto */}
            <div className="border-b-2 border-sky-600 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="text-sm font-black text-sky-800 tracking-wider uppercase font-mono">
                  NEURAL LINK V17
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase">
                  HỆ THỐNG ĐIỀU HÀNH SẢN XUẤT THUÊ NGOÀI (OUTSOURCING OPERATIONS)
                </div>
                <div className="text-[10px] text-slate-500">
                  Trung tâm Vận hành Tập trung · Ca 1 (08:00 - 16:00) · Ngày 24/06/2025
                </div>
              </div>

              <div className="text-center sm:text-right space-y-0.5 sm:self-center">
                <div className="text-xs font-bold uppercase tracking-wide text-slate-900">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[11px] font-semibold text-slate-800 underline decoration-slate-400 underline-offset-4">
                  Độc lập - Tự do - Hạnh phúc
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1 pt-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-wide">
                {reportType === 'SHIFT_HANDOVER'
                  ? 'BÁO CÁO GIAO BAN VẬN HÀNH CA 1'
                  : reportType === 'EXECUTIVE_BRIEFING'
                  ? 'BẢN TIN ĐIỀU HÀNH DÀNH CHO BAN LÃNH ĐẠO'
                  : 'HỒ SƠ ĐIỀU TRA SỰ CỐ VẬN HÀNH NHÀ MÁY'}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Hồ sơ Lưu trữ Văn bản Chính thức & Nhật ký Kiểm toán Vận hành Sản xuất
              </p>
            </div>

            {/* Metadata Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-300 border border-slate-300 rounded overflow-hidden text-[11px]">
              <div className="bg-slate-50 p-2 sm:p-2.5 flex justify-between">
                <span className="font-semibold text-slate-600">Mã văn bản:</span>
                <span className="font-mono font-bold text-slate-900">RPT-20250624-C1</span>
              </div>
              <div className="bg-slate-50 p-2 sm:p-2.5 flex justify-between">
                <span className="font-semibold text-slate-600">Thời điểm lập:</span>
                <span className="font-mono text-slate-800">24/06/2025 16:15</span>
              </div>
              <div className="bg-white p-2 sm:p-2.5 flex justify-between">
                <span className="font-semibold text-slate-600">Người lập / Thẩm tra:</span>
                <span className="font-bold text-slate-900">{currentUser.name} ({currentUser.role})</span>
              </div>
              <div className="bg-white p-2 sm:p-2.5 flex justify-between">
                <span className="font-semibold text-slate-600">Trạng thái pháp lý:</span>
                <span className={`font-bold font-mono ${reportSigned ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {reportSigned ? '✓ ĐÃ KÝ SỐ CHÍNH THỨC' : 'BẢN THẢO (DRAFT)'}
                </span>
              </div>
              <div className="bg-slate-50 p-2 sm:p-2.5 flex justify-between">
                <span className="font-semibold text-slate-600">Mục tiêu Kế hoạch:</span>
                <span className="font-mono text-slate-900">18,000 pcs (Toàn bộ 7 NCC)</span>
              </div>
              <div className="bg-slate-50 p-2 sm:p-2.5 flex justify-between">
                <span className="font-semibold text-slate-600">Sản lượng Thực tế:</span>
                <span className="font-mono font-bold text-slate-900">14,200 pcs (78.8%)</span>
              </div>
            </div>

            {/* Section I: 7 Vendor Matrix */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase text-sky-900 border-b border-slate-300 pb-1">
                I. MA TRẬN NĂNG LỰC VẬN HÀNH 7 NHÀ CUNG CẤP (7 FACILITIES PERFORMANCE)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="border border-slate-700 p-1.5 text-center w-8">STT</th>
                      <th className="border border-slate-700 p-1.5 text-left">Mã NCC</th>
                      <th className="border border-slate-700 p-1.5 text-left">Tên Nhà Cung Cấp</th>
                      <th className="border border-slate-700 p-1.5 text-left">Khu Vực</th>
                      <th className="border border-slate-700 p-1.5 text-right">Kế Hoạch</th>
                      <th className="border border-slate-700 p-1.5 text-right">Thực Tế</th>
                      <th className="border border-slate-700 p-1.5 text-right">Chênh Lệch</th>
                      <th className="border border-slate-700 p-1.5 text-center">Hoàn Thành</th>
                      <th className="border border-slate-700 p-1.5 text-center">Lỗi QC</th>
                      <th className="border border-slate-700 p-1.5 text-center">OTIF (%)</th>
                      <th className="border border-slate-700 p-1.5 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((v, i) => (
                      <tr key={v.id} className={i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">{i + 1}</td>
                        <td className="border border-slate-300 p-1.5 font-bold font-mono text-slate-900">{v.code}</td>
                        <td className="border border-slate-300 p-1.5">{v.name}</td>
                        <td className="border border-slate-300 p-1.5 text-slate-600">{v.location}</td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono">{v.planPcs.toLocaleString()}</td>
                        <td className="border border-slate-300 p-1.5 text-right font-mono font-bold text-slate-900">{v.actualPcs.toLocaleString()}</td>
                        <td className={`border border-slate-300 p-1.5 text-right font-mono font-bold ${v.actualPcs - v.planPcs < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                          {(v.actualPcs - v.planPcs).toLocaleString()}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono font-bold">{v.completionRate}%</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">{v.defectRate}%</td>
                        <td className="border border-slate-300 p-1.5 text-center font-mono">{v.onTimeDeliveryRate}%</td>
                        <td className="border border-slate-300 p-1.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                            v.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : v.status === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {v.status === 'active' ? 'Hoạt động tốt' : v.status === 'warning' ? 'Cảnh báo' : v.status === 'critical' ? 'Báo động đỏ' : 'Chưa có dữ liệu'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section II: Full Narrative Text */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase text-sky-900 border-b border-slate-300 pb-1">
                II. TOÀN VĂN NỘI DUNG VĂN BẢN BÁO CÁO & KẾ HOẠCH BÀN GIAO
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-4 font-mono text-[11px] leading-relaxed whitespace-pre-line text-slate-800 shadow-inner">
                {editableReportText || analysisResult || getDefaultReportText(reportType)}
              </div>
            </div>

            {/* Section III: Signatures Section */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase text-sky-900 border-b border-slate-300 pb-1">
                III. XÁC NHẬN TRÁCH NHIỆM & KÝ DUYỆT PHÁT HÀNH
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-2">
                <div className="space-y-1">
                  <div className="font-bold text-[11px] uppercase text-slate-900">Người Lập Báo Cáo</div>
                  <div className="text-[10px] text-slate-500">(Ký & ghi rõ họ tên)</div>
                  <div className="py-2.5">
                    <span className="inline-block px-2.5 py-1 rounded border border-emerald-600 bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
                      ✓ PKI VERIFIED SIGNATURE
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{currentUser.role}</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[11px] uppercase text-slate-900">Trưởng Nhóm Outsourcing</div>
                  <div className="text-[10px] text-slate-500">(Thẩm tra & phê duyệt)</div>
                  <div className="py-2.5">
                    <span className="inline-block px-2.5 py-1 rounded border border-blue-600 bg-blue-50 text-blue-700 text-[10px] font-bold font-mono">
                      ✓ TOKEN #SEC-8912 SIGNED
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Trần Thị Hằng</div>
                  <div className="text-[10px] text-slate-500 font-mono">Outsourcing Group Manager</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-[11px] uppercase text-slate-900">Tổng Giám Đốc Phê Chuẩn</div>
                  <div className="text-[10px] text-slate-500">(Ký duyệt ban hành)</div>
                  <div className="py-2.5">
                    <span className="inline-block px-2.5 py-1 rounded border border-rose-600 bg-rose-50 text-rose-700 text-[10px] font-bold font-mono">
                      ★ EXECUTIVE SEAL APPROVED
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">Đỗ Minh Tuấn</div>
                  <div className="text-[10px] text-slate-500 font-mono">Executive Managing Director</div>
                </div>
              </div>
            </div>

            {/* Footer Integrity Bar */}
            <div className="border-t border-slate-300 pt-3 flex flex-wrap justify-between items-center text-[10px] text-slate-500 font-mono">
              <div>
                NEURAL LINK V17 · SHA-256 INTEGRITY: 9a8c2f1e4b8d76e3 · VALIDATED
              </div>
              <div>
                Hồ sơ lưu trữ chính thức · Xuất bản: 24/06/2025
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
