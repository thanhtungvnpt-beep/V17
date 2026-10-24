import { 
  Vendor, ProductionPlan, QualityInspection, Equipment, 
  Material, KPIConfig, Task, Alert, Approval, IntegrationJob, 
  AuditEvent, CausalNode, CausalEdge, AIInsightItem, AIActionRecommendation, UserProfile 
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  { id: 'usr-1', name: 'Nguyễn Văn Minh', role: 'Executive', email: 'minh.nv@outsourcing.vn' },
  { id: 'usr-2', name: 'Trần Thị Hằng', role: 'OutsourcingManager', email: 'hang.tt@outsourcing.vn' },
  { id: 'usr-3', name: 'Lê Hoàng Anh', role: 'VendorManager', email: 'anh.lh@daal-factory.vn', vendorId: 'v-daal' },
  { id: 'usr-4', name: 'Phạm Đức Dũng', role: 'QCOfficer', email: 'dung.pd@qc-quality.vn' },
  { id: 'usr-5', name: 'Vũ Quốc Thái', role: 'EquipmentTech', email: 'thai.vq@maintenance.vn' },
  { id: 'usr-6', name: 'Đỗ Thùy Trang', role: 'MaterialPlanner', email: 'trang.dt@supplychain.vn' },
  { id: 'usr-7', name: 'System Admin', role: 'Admin', email: 'admin@neurallink.internal' },
  { id: 'usr-8', name: 'Dev Integration Lead', role: 'ITDeveloper', email: 'it-dev@neurallink.internal' }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'v-khv',
    code: 'KHV',
    name: 'KHV High-Tech Component Co.',
    location: 'KCN Quế Võ, Bắc Ninh',
    manager: 'Trần Đình Trọng',
    phone: '0222-384-9102',
    status: 'active',
    planPcs: 15000,
    actualPcs: 12800,
    completionRate: 85,
    defectRate: 0.85,
    activeLines: 6,
    totalLines: 6,
    activeEquipments: 28,
    totalEquipments: 30,
    materialBufferHours: 18,
    pendingCAPA: 0,
    onTimeDeliveryRate: 98.2,
    image: '/src/assets/images/factory_electronics_plant_1792815473989.jpg',
    notes: 'Dây chuyền ổn định, năng lực dư 5 nhân sự có thể hỗ trợ điều chuyển.'
  },
  {
    id: 'v-dreamtech',
    code: 'DREAM TECH',
    name: 'Dream Tech Electronics Vietnam',
    location: 'KCN Yên Phong, Bắc Ninh',
    manager: 'Park Min Woo',
    phone: '0222-368-2311',
    status: 'active',
    planPcs: 18000,
    actualPcs: 13000,
    completionRate: 72,
    defectRate: 1.15,
    activeLines: 7,
    totalLines: 8,
    activeEquipments: 36,
    totalEquipments: 40,
    materialBufferHours: 12,
    pendingCAPA: 1,
    onTimeDeliveryRate: 92.4,
    image: '/src/assets/images/smart_assembly_plant_1792815474860.jpg',
    notes: 'Đang tăng tốc ca chiều để bù sản lượng ca sáng do đổi mã hàng.'
  },
  {
    id: 'v-hstec',
    code: 'HSTEC',
    name: 'HSTEC Precision Assembly',
    location: 'KCN VSIP, Hải Phòng',
    manager: 'Vũ Đức Thành',
    phone: '0225-391-4420',
    status: 'warning',
    planPcs: 16000,
    actualPcs: 12500,
    completionRate: 78,
    defectRate: 1.42,
    activeLines: 5,
    totalLines: 6,
    activeEquipments: 22,
    totalEquipments: 25,
    materialBufferHours: 8,
    pendingCAPA: 1,
    onTimeDeliveryRate: 88.0,
    image: '/src/assets/images/logistics_warehouse_hub_1792815474845.jpg',
    notes: 'Thiếu hụt 12 nhân sự lắp ráp do dịch cúm mùa, cần bổ sung ca kíp.'
  },
  {
    id: 'v-ktech',
    code: 'KTECH',
    name: 'K-Tech Global Assembly Corp.',
    location: 'KCN Đồng Văn IV, Hà Nam',
    manager: 'Kim Jae Sung',
    phone: '0226-382-7790',
    status: 'warning',
    planPcs: 20000,
    actualPcs: 12000,
    completionRate: 60,
    defectRate: 2.10,
    activeLines: 6,
    totalLines: 8,
    activeEquipments: 26,
    totalEquipments: 34,
    materialBufferHours: 14,
    pendingCAPA: 2,
    onTimeDeliveryRate: 81.5,
    image: '/src/assets/images/smart_assembly_plant_1792815474860.jpg',
    notes: 'Máy mounter SMT line 3 gặp sự cố kẹt feeder, đang xử lý.'
  },
  {
    id: 'v-hojeongb',
    code: 'HOJEONGB',
    name: 'Hojeong B Precision Vina',
    location: 'KCN Khai Sơn, Thuận Thành',
    manager: 'Lý Quốc Huy',
    phone: '0222-379-5561',
    status: 'active',
    planPcs: 15500,
    actualPcs: 13700,
    completionRate: 88,
    defectRate: 0.72,
    activeLines: 6,
    totalLines: 6,
    activeEquipments: 27,
    totalEquipments: 28,
    materialBufferHours: 24,
    pendingCAPA: 0,
    onTimeDeliveryRate: 97.8,
    image: '/src/assets/images/factory_electronics_plant_1792815473989.jpg',
    notes: 'Hiệu suất ca tốt nhất toàn Group, OEE duy trì trên 91%.'
  },
  {
    id: 'v-hojeongvina',
    code: 'HOJEONG VINA',
    name: 'Hojeong Vina Electronics',
    location: 'KCN Điềm Thụy, Thái Nguyên',
    manager: 'Đặng Ngọc Tuấn',
    phone: '0208-364-1882',
    status: 'warning',
    planPcs: 18000,
    actualPcs: 13700,
    completionRate: 76,
    defectRate: 2.85,
    activeLines: 7,
    totalLines: 8,
    activeEquipments: 30,
    totalEquipments: 35,
    materialBufferHours: 10,
    pendingCAPA: 3,
    onTimeDeliveryRate: 84.1,
    image: '/src/assets/images/smart_assembly_plant_1792815474860.jpg',
    notes: 'Tỷ lệ rework cao do lỗi hàn thiếc sóng (wave soldering bridge).'
  },
  {
    id: 'v-daal',
    code: 'DAAL',
    name: 'DAAL Electronics Co., Ltd.',
    location: 'KCN Châu Sơn, Phủ Lý',
    manager: 'Ngô Doãn Toàn',
    phone: '0226-388-9901',
    status: 'critical',
    planPcs: 18000,
    actualPcs: 8600,
    completionRate: 48,
    defectRate: 3.40,
    activeLines: 4,
    totalLines: 7,
    activeEquipments: 16,
    totalEquipments: 30,
    materialBufferHours: 1.5,
    pendingCAPA: 4,
    onTimeDeliveryRate: 64.0,
    image: '/src/assets/images/logistics_warehouse_hub_1792815474845.jpg',
    notes: 'NGUY CƠ CAO: Thiếu linh kiện IC nguồn TPS54302, 3 line phải tạm dừng.'
  }
];

export const INITIAL_CAUSAL_NODES: CausalNode[] = [
  {
    id: 'node-plan',
    label: 'KẾ HOẠCH SẢN XUẤT',
    category: 'plan',
    impactScore: 0.6,
    status: 'warning',
    bulletPoints: [
      'Kế hoạch hôm nay: 18,000 pcs',
      'Kế hoạch tiếp theo: 22,000 pcs',
      'Độ ổn định kế hoạch: 76%',
      'Thay đổi khẩn cấp: +2 lần/ca'
    ],
    x: 180,
    y: 190
  },
  {
    id: 'node-prebuild',
    label: 'PREBUILD',
    category: 'buffer',
    impactScore: 0.4,
    status: 'warning',
    bulletPoints: [
      'Sản xuất trước để gối đầu',
      'Số lượng Prebuild: 3,200 pcs',
      'Độ bao phủ kế hoạch: 42%',
      'Giải tỏa áp lực đơn hàng: Kém'
    ],
    x: 180,
    y: 390
  },
  {
    id: 'node-material',
    label: 'KHO VẬT LIỆU',
    category: 'material',
    impactScore: 0.9,
    status: 'danger',
    bulletPoints: [
      'Tồn kho an toàn: 1.5h tại DAAL',
      'Thiếu vật liệu: IC nguồn TPS54',
      'Thời gian cung ứng ETA: +4h',
      'Chất lượng vật liệu: Đạt'
    ],
    x: 180,
    y: 590
  },
  {
    id: 'node-hr',
    label: 'NHÂN LỰC',
    category: 'human',
    impactScore: 0.5,
    status: 'warning',
    bulletPoints: [
      'Tổng số nhân công: 420 người',
      'Tay nghề trung bình: Bậc 3/5',
      'Tỷ lệ nghỉ việc ca: 4.8%',
      'Tăng ca dự kiến: 2 giờ'
    ],
    x: 390,
    y: 470
  },
  {
    id: 'node-equipment',
    label: 'THIẾT BỊ',
    category: 'machine',
    impactScore: 0.8,
    status: 'warning',
    bulletPoints: [
      'Hiệu suất OEE toàn Group: 74.2%',
      'Thời gian dừng máy: 142 phút',
      'Bảo trì định kỳ: 92% hoàn thành',
      'Sự cố bất thường: 2 máy SMT'
    ],
    x: 390,
    y: 670
  },
  {
    id: 'node-qc',
    label: 'CHẤT LƯỢNG (QC)',
    category: 'quality',
    impactScore: 0.8,
    status: 'danger',
    bulletPoints: [
      'Tỷ lệ lỗi tổng hợp: 2.15%',
      'Hàng chờ QC: 1,840 pcs',
      'Tiêu chuẩn chất lượng: Class 2',
      'Kiểm tra đầu vào (IQC): Đạt 99%'
    ],
    x: 480,
    y: 200
  },
  {
    id: 'node-rework',
    label: 'REWORK',
    category: 'rework',
    impactScore: 0.6,
    status: 'warning',
    bulletPoints: [
      'Số lượng hàng hỏng: 410 pcs',
      'Số lượng làm lại: 320 pcs',
      'Thời gian rework: 1.8h',
      'Tỷ lệ tái lỗi: 8.5%'
    ],
    x: 690,
    y: 200
  },
  {
    id: 'node-output',
    label: 'SẢN LƯỢNG THỰC TẾ',
    category: 'output',
    impactScore: 0.9,
    status: 'danger',
    bulletPoints: [
      'Sản lượng đạt được: 14,200 pcs (79%)',
      'Tỷ lệ hoàn thành: 78.8%',
      'Năng suất theo giờ: 1,775 pcs/h',
      'Sản lượng còn thiếu: -3,800 pcs'
    ],
    x: 580,
    y: 530
  },
  {
    id: 'node-external',
    label: 'YẾU TỐ BÊN NGOÀI',
    category: 'external',
    impactScore: 0.5,
    status: 'normal',
    bulletPoints: [
      'Thay đổi đơn hàng: Có',
      'Vấn đề logistics đường bộ: Bình thường',
      'Thời tiết: Mưa lớn cục bộ',
      'Quy định pháp lý: Tuân thủ'
    ],
    x: 580,
    y: 710
  },
  {
    id: 'node-delivery',
    label: 'GIAO HÀNG (TO / OTD)',
    category: 'delivery',
    impactScore: 0.8,
    status: 'warning',
    bulletPoints: [
      'Số lượng phải giao: 18,000 pcs',
      'Số lượng đã giao: 12,400 pcs',
      'Tỷ lệ đúng hạn (OTD): 87.2%',
      'Nguy cơ trễ hạn: 3 Transfer Orders'
    ],
    x: 760,
    y: 530
  }
];

export const INITIAL_CAUSAL_EDGES: CausalEdge[] = [
  { from: 'node-plan', to: 'node-prebuild', weight: 0.4, type: 'relation' },
  { from: 'node-plan', to: 'node-qc', weight: 0.6, type: 'relation' },
  { from: 'node-prebuild', to: 'node-hr', weight: 0.4, type: 'positive' },
  { from: 'node-material', to: 'node-hr', weight: 0.5, type: 'relation' },
  { from: 'node-material', to: 'node-equipment', weight: 0.5, type: 'relation' },
  { from: 'node-qc', to: 'node-hr', weight: 0.9, type: 'negative' },
  { from: 'node-qc', to: 'node-rework', weight: 0.8, type: 'negative' },
  { from: 'node-hr', to: 'node-output', weight: 0.9, type: 'positive' },
  { from: 'node-hr', to: 'node-equipment', weight: 0.6, type: 'positive' },
  { from: 'node-equipment', to: 'node-output', weight: 0.8, type: 'positive' },
  { from: 'node-rework', to: 'node-output', weight: 0.6, type: 'negative' },
  { from: 'node-output', to: 'node-delivery', weight: 0.8, type: 'positive' },
  { from: 'node-external', to: 'node-output', weight: 0.5, type: 'negative' },
  { from: 'node-external', to: 'node-delivery', weight: 0.5, type: 'relation' }
];

export const INITIAL_AI_INSIGHTS: AIInsightItem[] = [
  {
    id: 'ai-ins-1',
    rank: 1,
    title: 'Thiếu vật liệu tại DAAL',
    impactScore: 0.82,
    description: 'Làm giảm 32% sản lượng, ảnh hưởng trực tiếp đến nguy cơ trễ giao hàng.',
    rootCause: 'Lô IC nguồn TPS54302 chưa về kho do thủ tục hải quan chậm 4 tiếng.',
    vendorId: 'v-daal',
    dataSource: 'WMS_SYNC & Supplier Tracker',
    confidence: 94,
    proposedAction: 'Điều phối mượn khẩn cấp 2,000 pcs IC từ kho đệm KHV trong 2h tới.',
    approverRole: 'OutsourcingManager'
  },
  {
    id: 'ai-ins-2',
    rank: 2,
    title: 'Thời gian dừng máy tại KTECH',
    impactScore: 0.67,
    description: 'Làm giảm 18% sản lượng do sự cố thiết bị SMT Line 3.',
    rootCause: 'Kẹt feeder và lệch camera căn chỉnh quang học (AOI nozzle alignment).',
    vendorId: 'v-ktech',
    dataSource: 'SCADA_IOT & Machine Logs',
    confidence: 89,
    proposedAction: 'Triệu tập kỹ thuật viên chuyên gia KTECH, thay feeder dự phòng slot #14.',
    approverRole: 'EquipmentTech'
  },
  {
    id: 'ai-ins-3',
    rank: 3,
    title: 'Tỷ lệ rework cao tại HOJEONG VINA',
    impactScore: 0.59,
    description: 'Làm tăng 12% thời gian sản xuất, ảnh hưởng tiến độ giao hàng.',
    rootCause: 'Nhiệt độ bể thiếc hàn sóng dao động lệch chuẩn ±7°C tạo solder bridge.',
    vendorId: 'v-hojeongvina',
    dataSource: 'QC_INSPECTION_LOG',
    confidence: 91,
    proposedAction: 'Hiệu chuẩn lại bộ đo nhiệt PID controller và huấn luyện lại thợ vận hành.',
    approverRole: 'QCOfficer'
  },
  {
    id: 'ai-ins-4',
    rank: 4,
    title: 'Thiếu nhân lực tại HSTEC',
    impactScore: 0.48,
    description: 'Giảm năng suất 15%, cần bổ sung 12 nhân công cho công đoạn lắp ráp.',
    rootCause: 'Dịch cảm cúm mùa khiến 14 công nhân vắng mặt cùng lúc tại ca 1.',
    vendorId: 'v-hstec',
    dataSource: 'HRMS_ROSTER',
    confidence: 88,
    proposedAction: 'Huy động đội tăng cường từ KCN Quế Võ và kéo dài ca 1 thêm 1.5h.',
    approverRole: 'VendorManager'
  },
  {
    id: 'ai-ins-5',
    rank: 5,
    title: 'Kế hoạch thay đổi đột xuất',
    impactScore: 0.71,
    description: 'Gây xáo trộn kế hoạch, tăng thời gian chờ cài đặt máy (setup time).',
    rootCause: 'Khách hàng đẩy sớm lịch giao hàng SKU #A102 thêm 1 ngày.',
    vendorId: 'v-dreamtech',
    dataSource: 'ERP_PLAN_OVERRIDE',
    confidence: 85,
    proposedAction: 'Khóa khung kế hoạch đóng băng (Frozen Window) tối thiểu 24h đối với SKU A102.',
    approverRole: 'Executive'
  },
  {
    id: 'ai-ins-6',
    rank: 6,
    title: 'Prebuild chưa đạt tại DAAL',
    impactScore: 0.63,
    description: 'Độ bao phủ kế hoạch thấp, tăng áp lực sản xuất hiện tại.',
    rootCause: 'Chỉ đạt 42% sản lượng gối đầu ngày hôm trước do thiếu pallet chuyển giao.',
    vendorId: 'v-daal',
    dataSource: 'MES_PREBUILD_RECORD',
    confidence: 87,
    proposedAction: 'Cấp bổ sung 80 khay pallet chống tĩnh điện ESD từ kho trung tâm.',
    approverRole: 'MaterialPlanner'
  }
];

export const INITIAL_AI_ACTIONS: AIActionRecommendation[] = [
  {
    id: 'act-1',
    order: 1,
    text: 'Bổ sung vật liệu cho DAAL trong 2 giờ tới.',
    priority: 'Cao',
    actionType: 'material_replenish',
    relatedVendorId: 'v-daal',
    status: 'pending'
  },
  {
    id: 'act-2',
    order: 2,
    text: 'Điều chuyển 5 nhân công từ KHV sang DAAL.',
    priority: 'Cao',
    actionType: 'workforce_shift',
    relatedVendorId: 'v-khv',
    status: 'pending'
  },
  {
    id: 'act-3',
    order: 3,
    text: 'Rút ngắn thời gian QC, tăng 1 line kiểm tra.',
    priority: 'Trung bình',
    actionType: 'qc_speedup',
    relatedVendorId: 'v-hojeongvina',
    status: 'pending'
  },
  {
    id: 'act-4',
    order: 4,
    text: 'Lên kế hoạch bảo trì thiết bị KTECH ngoài giờ.',
    priority: 'Trung bình',
    actionType: 'equipment_maintenance',
    relatedVendorId: 'v-ktech',
    status: 'pending'
  },
  {
    id: 'act-5',
    order: 5,
    text: 'Tăng Prebuild cho mã hàng A để giảm áp lực.',
    priority: 'Trung bình',
    actionType: 'prebuild_boost',
    relatedVendorId: 'v-dreamtech',
    status: 'pending'
  },
  {
    id: 'act-6',
    order: 6,
    text: 'Theo dõi sát 3 TO có nguy cơ trễ trong 3 ngày tới.',
    priority: 'Thấp',
    actionType: 'to_monitoring',
    relatedVendorId: 'v-hstec',
    status: 'in_progress'
  }
];

export const INITIAL_PRODUCTION_PLANS: ProductionPlan[] = [
  {
    id: 'plan-101',
    date: '2025-06-24',
    shift: 'Ca 1 (08:00 - 16:00)',
    vendorId: 'v-khv',
    lineNo: 'Line SMT 01',
    productCode: 'PCB-MAIN-901',
    productName: 'Bo mạch điều khiển trung tâm v3',
    targetPcs: 4500,
    actualPcs: 3950,
    gapPcs: -550,
    completionRate: 87.7,
    bottleneckReason: 'Bình thường, tiến độ ổn định',
    status: 'on_track',
    dataSource: 'GMES_SYNC',
    isVerified: true,
    verifiedBy: 'Nguyễn Văn Minh',
    updatedAt: '2025-06-24 14:15'
  },
  {
    id: 'plan-102',
    date: '2025-06-24',
    shift: 'Ca 1 (08:00 - 16:00)',
    vendorId: 'v-dreamtech',
    lineNo: 'Line SMT 03',
    productCode: 'SUB-PWR-404',
    productName: 'Mạch cấp nguồn xung DC 24V',
    targetPcs: 5000,
    actualPcs: 3600,
    gapPcs: -1400,
    completionRate: 72.0,
    bottleneckReason: 'Đổi mã khuôn mất 35 phút',
    status: 'at_risk',
    dataSource: 'GMES_SYNC',
    isVerified: true,
    verifiedBy: 'Park Min Woo',
    updatedAt: '2025-06-24 14:10'
  },
  {
    id: 'plan-103',
    date: '2025-06-24',
    shift: 'Ca 1 (08:00 - 16:00)',
    vendorId: 'v-hstec',
    lineNo: 'Line Assy 02',
    productCode: 'BOX-UNIT-108',
    productName: 'Cụm vỏ điều hướng thông minh',
    targetPcs: 4000,
    actualPcs: 3120,
    gapPcs: -880,
    completionRate: 78.0,
    bottleneckReason: 'Thiếu nhân công khâu siết ốc tự động',
    status: 'at_risk',
    dataSource: 'RPA_IMPORT',
    isVerified: false,
    updatedAt: '2025-06-24 13:50'
  },
  {
    id: 'plan-104',
    date: '2025-06-24',
    shift: 'Ca 1 (08:00 - 16:00)',
    vendorId: 'v-ktech',
    lineNo: 'Line SMT 02',
    productCode: 'PCB-RF-202',
    productName: 'Module thu phát sóng RF 5.8GHz',
    targetPcs: 6000,
    actualPcs: 3600,
    gapPcs: -2400,
    completionRate: 60.0,
    bottleneckReason: 'Dừng máy mounter SMT kẹt feeder',
    status: 'delayed',
    dataSource: 'GMES_SYNC',
    isVerified: true,
    verifiedBy: 'Kim Jae Sung',
    updatedAt: '2025-06-24 14:20'
  },
  {
    id: 'plan-105',
    date: '2025-06-24',
    shift: 'Ca 1 (08:00 - 16:00)',
    vendorId: 'v-daal',
    lineNo: 'Line SMT 01',
    productCode: 'BOARD-IOT-88',
    productName: 'Bo mạch kết nối IoT Gateway',
    targetPcs: 5500,
    actualPcs: 2640,
    gapPcs: -2860,
    completionRate: 48.0,
    bottleneckReason: 'Thiếu linh kiện IC nguồn TPS54302',
    status: 'delayed',
    dataSource: 'MANUAL_ENTRY',
    isVerified: true,
    verifiedBy: 'Ngô Doãn Toàn',
    updatedAt: '2025-06-24 14:05'
  }
];

export const INITIAL_QC_INSPECTIONS: QualityInspection[] = [
  {
    id: 'qc-801',
    batchNo: 'LOT-20250624-KHV01',
    vendorId: 'v-khv',
    productCode: 'PCB-MAIN-901',
    stage: 'IPQC',
    sampleSize: 800,
    defectCount: 7,
    defectRate: 0.87,
    majorDefectType: 'Lệch chân linh kiện 0402',
    status: 'passed',
    inspectionTime: '13:40',
    inspectorName: 'Đặng Mai Lan',
    dataSource: 'GMES_SYNC',
    isVerified: true
  },
  {
    id: 'qc-802',
    batchNo: 'LOT-20250624-HJV03',
    vendorId: 'v-hojeongvina',
    productCode: 'BOARD-PWR-77',
    stage: 'FQC',
    sampleSize: 600,
    defectCount: 19,
    defectRate: 3.16,
    majorDefectType: 'Bắc cầu thiếc hàn sóng (Solder Bridge)',
    status: 'capa_open',
    inspectionTime: '13:15',
    inspectorName: 'Phạm Đức Dũng',
    dataSource: 'GMES_SYNC',
    isVerified: true,
    correctiveAction: {
      action: 'Vệ sinh nozzle phun flux, giảm tốc độ băng chuyền hàn sóng từ 1.2m/min xuống 1.0m/min',
      assignee: 'Đặng Ngọc Tuấn (Hojeong Vina)',
      deadline: '2025-06-24 16:30',
      status: 'in_progress'
    }
  },
  {
    id: 'qc-803',
    batchNo: 'LOT-20250624-DAL02',
    vendorId: 'v-daal',
    productCode: 'BOARD-IOT-88',
    stage: 'IQC',
    sampleSize: 500,
    defectCount: 18,
    defectRate: 3.60,
    majorDefectType: 'Oxy hóa chân tiếp xúc Connector mini',
    status: 'capa_open',
    inspectionTime: '11:30',
    inspectorName: 'Trịnh Quang Hải',
    dataSource: 'MANUAL_ENTRY',
    isVerified: true,
    correctiveAction: {
      action: 'Cách ly toàn bộ cuộn linh kiện lô CN-2025-05, lập biên bản trả hàng NCC',
      assignee: 'Ngô Doãn Toàn (DAAL)',
      deadline: '2025-06-24 17:00',
      status: 'open'
    }
  }
];

export const INITIAL_EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-101',
    code: 'SMT-MTR-01',
    name: 'Panasonic NPM-W2 High-Speed Mounter',
    vendorId: 'v-ktech',
    lineNo: 'Line SMT 02',
    category: 'Mounter',
    status: 'breakdown',
    oeePercent: 54.2,
    mtbfHours: 72,
    mttrHours: 2.5,
    lastMaintenanceDate: '2025-06-18',
    nextMaintenanceDate: '2025-06-25',
    currentIncident: {
      issue: 'Feeder slot #14 bị kẹt tape băng tải, camera nhận diện quang học không bắt được góc mounter',
      downtimeMinutes: 75,
      reportedBy: 'Kỹ sư trực line SMT',
      sopGuide: 'SOP-EQ-04: Tháo cụm feeder slot #14, thổi bụi cảm biến quang học bằng khí nén 0.4MPa, lắp lại feeder chuẩn và reset máy.',
      repairStatus: 'in_repair',
      technicianName: 'Vũ Quốc Thái'
    },
    dataSource: 'GMES_SYNC'
  },
  {
    id: 'eq-102',
    code: 'SMT-RFL-01',
    name: 'Heller 1809 MK5 Reflow Oven',
    vendorId: 'v-khv',
    lineNo: 'Line SMT 01',
    category: 'Reflow',
    status: 'running',
    oeePercent: 94.8,
    mtbfHours: 240,
    mttrHours: 0.8,
    lastMaintenanceDate: '2025-06-20',
    nextMaintenanceDate: '2025-07-05',
    dataSource: 'GMES_SYNC'
  },
  {
    id: 'eq-103',
    code: 'AOI-OPT-03',
    name: 'Koh Young Zenith 3D AOI Inspection System',
    vendorId: 'v-hojeongvina',
    lineNo: 'Line SMT 04',
    category: 'AOI',
    status: 'running',
    oeePercent: 78.5,
    mtbfHours: 120,
    mttrHours: 1.4,
    lastMaintenanceDate: '2025-06-15',
    nextMaintenanceDate: '2025-06-28',
    currentIncident: {
      issue: 'Tỷ lệ báo lỗi giả (False Call) tăng lên 1.8%, cần hiệu chỉnh ngưỡng bóng râm góc nghiêng',
      downtimeMinutes: 20,
      reportedBy: 'Trưởng ca QC',
      sopGuide: 'SOP-AOI-09: Tải lại profile chuẩn GOLDEN-BOARD-V3, cân chỉnh độ phơi sáng LED chuông 3 màu.',
      repairStatus: 'technician_assigned',
      technicianName: 'Nguyễn Văn Đạt'
    },
    dataSource: 'GMES_SYNC'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-101',
    code: 'IC-TPS54302',
    name: 'IC Nguồn Buck Converter 28V 3A (TI)',
    category: 'IC Chips',
    vendorId: 'v-daal',
    currentStock: 450,
    minSafetyStock: 2500,
    requiredDailyQty: 3000,
    unit: 'pcs',
    supplier: 'Texas Instruments / Arrow Electronics',
    status: 'critical_shortage',
    urgentRequestStatus: 'pending_po',
    etaHours: 3.5,
    dataSource: 'GMES_SYNC'
  },
  {
    id: 'mat-102',
    code: 'PCB-FR4-4L-V2',
    name: 'Bo mạch in 4 lớp FR4 TG150 V2.1',
    category: 'PCB',
    vendorId: 'v-ktech',
    currentStock: 1200,
    minSafetyStock: 3000,
    requiredDailyQty: 2500,
    unit: 'sheets',
    supplier: 'Meiko Electronics VN',
    status: 'low_risk',
    urgentRequestStatus: 'in_transit',
    etaHours: 6.0,
    dataSource: 'GMES_SYNC'
  },
  {
    id: 'mat-103',
    code: 'CAP-MLCC-10uF',
    name: 'Tụ gốm nhiều lớp SMD 10uF 16V 0603',
    category: 'Capacitor',
    vendorId: 'v-khv',
    currentStock: 45000,
    minSafetyStock: 20000,
    requiredDailyQty: 18000,
    unit: 'pcs',
    supplier: 'Murata Manufacturing',
    status: 'sufficient',
    urgentRequestStatus: 'none',
    dataSource: 'GMES_SYNC'
  }
];

export const INITIAL_KPIS: KPIConfig[] = [
  {
    id: 'kpi-1',
    code: 'KPI-OUT-01',
    name: 'Tỷ lệ hoàn thành kế hoạch sản lượng (Plan Completion Rate)',
    category: 'production',
    targetValue: 90.0,
    unit: '%',
    weightPercent: 30,
    formulaDescription: '(Tổng sản lượng thực tế đạt chuẩn / Tổng sản lượng kế hoạch đã chốt) * 100',
    calculationMethod: 'Sum(Actual Output Pcs) / Sum(Target Plan Pcs) * 100 theo ngày/ca'
  },
  {
    id: 'kpi-2',
    code: 'KPI-QC-01',
    name: 'Tỷ lệ lỗi tổng hợp xuất xưởng (Defect Rate PPM)',
    category: 'quality',
    targetValue: 1.2,
    unit: '%',
    weightPercent: 25,
    formulaDescription: '(Tổng số sản phẩm lỗi tại FQC / Tổng số kiểm tra mẫu) * 100',
    calculationMethod: 'Sum(Defect Count) / Sum(Sample Size) * 100'
  },
  {
    id: 'kpi-3',
    code: 'KPI-EQ-01',
    name: 'Chỉ số hiệu suất thiết bị toàn diện (OEE)',
    category: 'equipment',
    targetValue: 85.0,
    unit: '%',
    weightPercent: 20,
    formulaDescription: 'Khả dụng (A) * Hiệu suất (P) * Chất lượng (Q)',
    calculationMethod: 'Availability * Performance Rate * Quality Rate'
  },
  {
    id: 'kpi-4',
    code: 'KPI-MAT-01',
    name: 'Mức đệm an toàn vật tư (Material Buffer Hours)',
    category: 'material',
    targetValue: 12.0,
    unit: 'giờ',
    weightPercent: 15,
    formulaDescription: 'Tồn kho khả dụng / Nhu cầu tiêu thụ bình quân mỗi giờ',
    calculationMethod: 'Current Stock / Hourly Burn Rate'
  },
  {
    id: 'kpi-5',
    code: 'KPI-COL-01',
    name: 'Chỉ số phối hợp Outsourcing Group & Vendor',
    category: 'collaboration',
    targetValue: 95.0,
    unit: '%',
    weightPercent: 10,
    formulaDescription: 'Tỷ lệ phản hồi & đóng CAPA đúng thời hạn thỏa thuận SLA',
    calculationMethod: 'Closed CAPA On Time / Total Issued CAPA * 100'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-01',
    title: 'Điều phối mượn khẩn cấp 2,000 IC nguồn từ kho KHV sang DAAL',
    category: 'Vật liệu khẩn cấp',
    priority: 'Cao',
    vendorId: 'v-daal',
    assignee: 'Đỗ Thùy Trang',
    deadline: '2025-06-24 16:00',
    status: 'in_progress',
    progressPercent: 60,
    approvalRequired: true,
    approvedBy: 'Trần Thị Hằng'
  },
  {
    id: 'tsk-02',
    title: 'Xử lý kẹt feeder #14 máy Mounter line 2 tại KTECH',
    category: 'Bảo trì thiết bị',
    priority: 'Cao',
    vendorId: 'v-ktech',
    assignee: 'Vũ Quốc Thái',
    deadline: '2025-06-24 15:30',
    status: 'in_progress',
    progressPercent: 40,
    approvalRequired: true
  },
  {
    id: 'tsk-03',
    title: 'Hiệu chuẩn bể hàn sóng và đóng CAPA-HJV-03',
    category: 'Chất lượng QC',
    priority: 'Trung bình',
    vendorId: 'v-hojeongvina',
    assignee: 'Phạm Đức Dũng',
    deadline: '2025-06-24 17:30',
    status: 'pending',
    progressPercent: 20,
    approvalRequired: true
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-1',
    title: 'DAAL: Cạn kiệt vật tư IC-TPS54302',
    description: 'Tồn kho chỉ còn 1.5 giờ sản xuất. 3 dây chuyền đối diện nguy cơ dừng máy.',
    severity: 'critical',
    timestamp: '14:02:15',
    vendorId: 'v-daal',
    sourceModule: 'Kho vật liệu',
    acknowledged: false
  },
  {
    id: 'alt-2',
    title: 'KTECH: Máy Mounter Line 2 dừng quá 60 phút',
    description: 'Thời gian dừng máy vượt ngưỡng cho phép 45 phút. Cần kỹ sư can thiệp.',
    severity: 'critical',
    timestamp: '13:45:00',
    vendorId: 'v-ktech',
    sourceModule: 'Thiết bị',
    acknowledged: true
  },
  {
    id: 'alt-3',
    title: 'HOJEONG VINA: Tỷ lệ lỗi FQC vượt ngưỡng 2.5%',
    description: 'Defect Rate đạt 3.16% do bắc cầu thiếc. Yêu cầu mở hồ sơ CAPA xử lý.',
    severity: 'warning',
    timestamp: '13:18:22',
    vendorId: 'v-hojeongvina',
    sourceModule: 'Chất lượng QC',
    acknowledged: false
  }
];

export const INITIAL_APPROVALS: Approval[] = [
  {
    id: 'appr-01',
    title: 'Đề xuất xuất điều chuyển khẩn 2,000 pcs IC nguồn KHV -> DAAL',
    type: 'MATERIAL_EMERGENCY',
    requester: 'Đỗ Thùy Trang (Material Planner)',
    role: 'MaterialPlanner',
    vendorId: 'v-daal',
    details: 'Mượn 2,000 pcs IC-TPS54302 từ kho đệm KHV (KHV còn 45,000 pcs tồn) để cứu line DAAL.',
    status: 'pending',
    requestedAt: '2025-06-24 14:08'
  },
  {
    id: 'appr-02',
    title: 'Nghiệm thu hoàn tất bảo trì máy SMT KTECH & cho phép chạy lại',
    type: 'EQUIPMENT_SIGNOFF',
    requester: 'Vũ Quốc Thái (Equipment Tech)',
    role: 'EquipmentTech',
    vendorId: 'v-ktech',
    details: 'Đã thay thế feeder slot #14, test 50 board không phát sinh lỗi lệch quang học.',
    status: 'pending',
    requestedAt: '2025-06-24 14:18'
  },
  {
    id: 'appr-03',
    title: 'Phê duyệt đóng hành động khắc phục CAPA-HJV-03',
    type: 'CAPA_CLOSURE',
    requester: 'Phạm Đức Dũng (QC Officer)',
    role: 'QCOfficer',
    vendorId: 'v-hojeongvina',
    details: 'Nhiệt độ bể hàn sóng đã ổn định ở 255°C ± 2°C, tỷ lệ lỗi 100 mẫu FQC giảm về 0.4%.',
    status: 'approved',
    requestedAt: '2025-06-24 13:50',
    reviewedBy: 'Trần Thị Hằng',
    reviewedAt: '2025-06-24 14:00',
    reviewNotes: 'Xác nhận kết quả mẫu đạt chuẩn. Cho phép tiếp tục chạy full công suất.'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationJob[] = [
  {
    id: 'job-gmes',
    name: 'GMES Production REST Connector',
    type: 'GMES_API',
    endpoint: 'https://gmes-api.enterprise.internal/v2/outsourcing/stream',
    authHeaderMasked: 'Bearer ••••••••••••••••8f3a',
    intervalSeconds: 60,
    lastSyncTime: '2025-06-24 14:15:00',
    status: 'CONNECTED',
    recordsSynced: 12480,
    errorCount: 2,
    lastErrorLog: 'Timeout 5000ms at vendor DAAL gateway - retried successfully'
  },
  {
    id: 'job-rpa',
    name: 'RPA Bot Roster & Inspection Scraper',
    type: 'RPA_BOT',
    endpoint: 'rpa://bot-agent-04.internal:9200',
    authHeaderMasked: 'Token ••••••••••••••••bc19',
    intervalSeconds: 300,
    lastSyncTime: '2025-06-24 14:00:00',
    status: 'CONNECTED',
    recordsSynced: 430,
    errorCount: 0
  },
  {
    id: 'job-csv',
    name: 'Manual / Excel Batch File Importer',
    type: 'CSV_SYNC',
    endpoint: 'local://client-stream-ingest',
    authHeaderMasked: 'None (Local Session)',
    intervalSeconds: 0,
    lastSyncTime: '2025-06-24 13:30:00',
    status: 'CONNECTED',
    recordsSynced: 85,
    errorCount: 0
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud-01',
    timestamp: '2025-06-24 14:18:20',
    userId: 'usr-5',
    userName: 'Vũ Quốc Thái',
    role: 'EquipmentTech',
    action: 'UPDATE',
    entityType: 'Equipment',
    entityId: 'eq-101',
    details: 'Cập nhật trạng thái sửa chữa: in_repair -> signoff_pending',
    ipAddress: '10.24.18.52'
  },
  {
    id: 'aud-02',
    timestamp: '2025-06-24 14:08:11',
    userId: 'usr-6',
    userName: 'Đỗ Thùy Trang',
    role: 'MaterialPlanner',
    action: 'CREATE',
    entityType: 'Approval',
    entityId: 'appr-01',
    details: 'Tạo phiếu đề xuất khẩn điều chuyển 2,000 IC-TPS54302',
    ipAddress: '10.24.18.99'
  },
  {
    id: 'aud-03',
    timestamp: '2025-06-24 14:00:02',
    userId: 'usr-2',
    userName: 'Trần Thị Hằng',
    role: 'OutsourcingManager',
    action: 'APPROVE',
    entityType: 'Approval',
    entityId: 'appr-03',
    details: 'Phê duyệt đóng hồ sơ CAPA-HJV-03 cho Hojeong Vina',
    ipAddress: '10.24.16.10'
  }
];
