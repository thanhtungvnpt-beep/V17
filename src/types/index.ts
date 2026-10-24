export type Language = 'vi' | 'en' | 'kr';

export type UserRole = 
  | 'Executive'
  | 'OutsourcingManager'
  | 'VendorManager'
  | 'QCOfficer'
  | 'EquipmentTech'
  | 'MaterialPlanner'
  | 'Admin'
  | 'ITDeveloper';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  vendorId?: string; // If vendor-specific
}

export type DataSource = 'GMES_SYNC' | 'RPA_IMPORT' | 'MANUAL_ENTRY' | 'CSV_UPLOAD';

export interface Vendor {
  id: string;
  code: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  status: 'active' | 'warning' | 'critical' | 'no_data';
  planPcs: number;
  actualPcs: number;
  completionRate: number; // e.g. 85
  defectRate: number; // e.g. 1.2
  activeLines: number;
  totalLines: number;
  activeEquipments: number;
  totalEquipments: number;
  materialBufferHours: number;
  pendingCAPA: number;
  onTimeDeliveryRate: number; // e.g. 94.5%
  image: string;
  notes?: string;
}

export interface ProductionPlan {
  id: string;
  date: string;
  shift: 'Ca 1 (08:00 - 16:00)' | 'Ca 2 (16:00 - 00:00)' | 'Ca 3 (00:00 - 08:00)';
  vendorId: string;
  lineNo: string;
  productCode: string;
  productName: string;
  targetPcs: number;
  actualPcs: number;
  gapPcs: number;
  completionRate: number;
  bottleneckReason?: string;
  status: 'on_track' | 'at_risk' | 'delayed';
  dataSource: DataSource;
  isVerified: boolean;
  verifiedBy?: string;
  updatedAt: string;
}

export interface QualityInspection {
  id: string;
  batchNo: string;
  vendorId: string;
  productCode: string;
  stage: 'IQC' | 'IPQC' | 'FQC' | 'OQA';
  sampleSize: number;
  defectCount: number;
  defectRate: number;
  majorDefectType: string;
  status: 'passed' | 'review' | 'rejected' | 'capa_open';
  inspectionTime: string;
  inspectorName: string;
  dataSource: DataSource;
  isVerified: boolean;
  correctiveAction?: {
    action: string;
    assignee: string;
    deadline: string;
    status: 'open' | 'in_progress' | 'verified_closed';
    approvedBy?: string;
    closedAt?: string;
  };
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  vendorId: string;
  lineNo: string;
  category: 'SMT' | 'Mounter' | 'Reflow' | 'AOI' | 'Test Station' | 'Packaging';
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  oeePercent: number;
  mtbfHours: number; // Mean time between failures
  mttrHours: number; // Mean time to repair
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  currentIncident?: {
    issue: string;
    downtimeMinutes: number;
    reportedBy: string;
    sopGuide: string;
    repairStatus: 'reported' | 'technician_assigned' | 'in_repair' | 'signoff_pending' | 'resolved';
    technicianName?: string;
    authorizedSignoffBy?: string;
  };
  dataSource: DataSource;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  category: 'PCB' | 'IC Chips' | 'Capacitor' | 'Resistor' | 'Connector' | 'Housing';
  vendorId: string;
  currentStock: number;
  minSafetyStock: number;
  requiredDailyQty: number;
  unit: string;
  supplier: string;
  status: 'sufficient' | 'low_risk' | 'critical_shortage';
  urgentRequestStatus?: 'none' | 'pending_po' | 'in_transit' | 'delivered';
  etaHours?: number;
  dataSource: DataSource;
}

export interface KPIConfig {
  id: string;
  code: string;
  name: string;
  category: 'production' | 'quality' | 'equipment' | 'material' | 'collaboration';
  targetValue: number;
  unit: string;
  weightPercent: number;
  formulaDescription: string;
  calculationMethod: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  vendorId: string;
  assignee: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progressPercent: number;
  approvalRequired: boolean;
  approvedBy?: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  vendorId?: string;
  sourceModule: string;
  acknowledged: boolean;
}

export interface Approval {
  id: string;
  title: string;
  type: 'CAPA_CLOSURE' | 'PLAN_OVERRIDE' | 'EQUIPMENT_SIGNOFF' | 'MATERIAL_EMERGENCY' | 'DATA_CORRECTION';
  requester: string;
  role: string;
  vendorId: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface IntegrationJob {
  id: string;
  name: string;
  type: 'GMES_API' | 'RPA_BOT' | 'CSV_SYNC';
  endpoint: string;
  authHeaderMasked: string;
  intervalSeconds: number;
  lastSyncTime?: string;
  status: 'NOT_CONFIGURED' | 'TESTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  recordsSynced: number;
  errorCount: number;
  lastErrorLog?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'SYNC' | 'CONFIG_CHANGE';
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface CausalNode {
  id: string;
  label: string;
  category: string;
  impactScore: number;
  status: 'good' | 'warning' | 'danger' | 'normal';
  bulletPoints: string[];
  x: number;
  y: number;
}

export interface CausalEdge {
  from: string;
  to: string;
  weight: number;
  type: 'positive' | 'negative' | 'relation';
}

export interface AIInsightItem {
  id: string;
  rank: number;
  title: string;
  impactScore: number;
  description: string;
  rootCause: string;
  vendorId: string;
  dataSource: string;
  confidence: number;
  proposedAction: string;
  approverRole: string;
}

export interface AIActionRecommendation {
  id: string;
  order: number;
  text: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  actionType: 'material_replenish' | 'workforce_shift' | 'qc_speedup' | 'equipment_maintenance' | 'prebuild_boost' | 'to_monitoring';
  relatedVendorId: string;
  status: 'pending' | 'in_progress' | 'executed';
}
