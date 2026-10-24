import { 
  Vendor, ProductionPlan, QualityInspection, Equipment, 
  Material, KPIConfig, Task, Alert, Approval, IntegrationJob, 
  AuditEvent, UserProfile, UserRole 
} from '../types';
import { 
  INITIAL_VENDORS, INITIAL_PRODUCTION_PLANS, INITIAL_QC_INSPECTIONS, 
  INITIAL_EQUIPMENTS, INITIAL_MATERIALS, INITIAL_KPIS, 
  INITIAL_TASKS, INITIAL_ALERTS, INITIAL_APPROVALS, 
  INITIAL_INTEGRATIONS, INITIAL_AUDIT_EVENTS, INITIAL_USERS 
} from './mockData';

class OperationsStore {
  vendors: Vendor[] = [...INITIAL_VENDORS];
  plans: ProductionPlan[] = [...INITIAL_PRODUCTION_PLANS];
  qcInspections: QualityInspection[] = [...INITIAL_QC_INSPECTIONS];
  equipments: Equipment[] = [...INITIAL_EQUIPMENTS];
  materials: Material[] = [...INITIAL_MATERIALS];
  kpis: KPIConfig[] = [...INITIAL_KPIS];
  tasks: Task[] = [...INITIAL_TASKS];
  alerts: Alert[] = [...INITIAL_ALERTS];
  approvals: Approval[] = [...INITIAL_APPROVALS];
  integrations: IntegrationJob[] = [...INITIAL_INTEGRATIONS];
  auditLogs: AuditEvent[] = [...INITIAL_AUDIT_EVENTS];
  currentUser: UserProfile = INITIAL_USERS[0]; // Default: Executive

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    this.addAuditLog('CONFIG_CHANGE', 'UserSession', user.id, `Đổi vai trò phiên làm việc sang: ${user.name} (${user.role})`);
    this.notify();
  }

  addAuditLog(action: AuditEvent['action'], entityType: string, entityId: string, details: string) {
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      role: this.currentUser.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '10.24.18.52'
    };
    this.auditLogs = [newLog, ...this.auditLogs];
  }

  // Production Plan
  addProductionPlan(data: Omit<ProductionPlan, 'id' | 'gapPcs' | 'completionRate' | 'updatedAt' | 'isVerified'>) {
    // Validation
    if (!data.vendorId || !data.productCode || !data.productName) {
      throw new Error('Vui lòng điền đầy đủ Nhà cung cấp, Mã sản phẩm và Tên sản phẩm.');
    }
    if (data.targetPcs <= 0) {
      throw new Error('Sản lượng mục tiêu phải lớn hơn 0.');
    }
    if (data.actualPcs < 0) {
      throw new Error('Sản lượng thực tế không được là số âm.');
    }

    // Duplicate check
    const existing = this.plans.find(
      p => p.date === data.date && p.shift === data.shift && p.vendorId === data.vendorId && p.productCode === data.productCode
    );
    if (existing) {
      throw new Error(`Đã tồn tại bản ghi kế hoạch cho mã hàng ${data.productCode} tại ca này.`);
    }

    const gapPcs = data.actualPcs - data.targetPcs;
    const completionRate = Math.round((data.actualPcs / data.targetPcs) * 1000) / 10;
    const newPlan: ProductionPlan = {
      ...data,
      id: `plan-${Date.now()}`,
      gapPcs,
      completionRate,
      status: completionRate >= 90 ? 'on_track' : completionRate >= 70 ? 'at_risk' : 'delayed',
      isVerified: this.currentUser.role === 'Executive' || this.currentUser.role === 'OutsourcingManager',
      updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    this.plans = [newPlan, ...this.plans];
    this.addAuditLog('CREATE', 'ProductionPlan', newPlan.id, `Tạo kế hoạch sản xuất ${newPlan.productCode} (${newPlan.actualPcs}/${newPlan.targetPcs} pcs)`);
    this.notify();
    return newPlan;
  }

  verifyProductionPlan(planId: string) {
    this.plans = this.plans.map(p => {
      if (p.id === planId) {
        return { ...p, isVerified: true, verifiedBy: this.currentUser.name };
      }
      return p;
    });
    this.addAuditLog('APPROVE', 'ProductionPlan', planId, `Xác minh tính hợp lệ dữ liệu sản lượng`);
    this.notify();
  }

  // Quality Inspection
  addQualityInspection(inspection: Omit<QualityInspection, 'id' | 'defectRate' | 'isVerified'>) {
    if (inspection.sampleSize <= 0) throw new Error('Cỡ mẫu kiểm tra phải lớn hơn 0.');
    if (inspection.defectCount < 0) throw new Error('Số lỗi không hợp lệ.');
    if (inspection.defectCount > inspection.sampleSize) throw new Error('Số lỗi không thể vượt quá cỡ mẫu kiểm tra.');

    const defectRate = Math.round((inspection.defectCount / inspection.sampleSize) * 10000) / 100;
    const newInspection: QualityInspection = {
      ...inspection,
      id: `qc-${Date.now()}`,
      defectRate,
      isVerified: true
    };
    this.qcInspections = [newInspection, ...this.qcInspections];
    this.addAuditLog('CREATE', 'QualityInspection', newInspection.id, `Ghi nhận kiểm tra ${newInspection.batchNo} (${defectRate}% lỗi)`);
    this.notify();
    return newInspection;
  }

  closeCAPA(inspectionId: string, approvalNotes?: string) {
    this.qcInspections = this.qcInspections.map(qc => {
      if (qc.id === inspectionId && qc.correctiveAction) {
        return {
          ...qc,
          status: 'passed',
          correctiveAction: {
            ...qc.correctiveAction,
            status: 'verified_closed',
            approvedBy: this.currentUser.name,
            closedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          }
        };
      }
      return qc;
    });
    this.addAuditLog('APPROVE', 'CAPA', inspectionId, `Nghiệm thu đóng hồ sơ CAPA chất lượng: ${approvalNotes || 'Đạt tiêu chuẩn'}`);
    this.notify();
  }

  // Equipment Incident & Signoff
  reportEquipmentIncident(equipmentId: string, issue: string, sopGuide: string) {
    this.equipments = this.equipments.map(eq => {
      if (eq.id === equipmentId) {
        return {
          ...eq,
          status: 'breakdown',
          currentIncident: {
            issue,
            downtimeMinutes: 0,
            reportedBy: this.currentUser.name,
            sopGuide,
            repairStatus: 'reported'
          }
        };
      }
      return eq;
    });
    this.addAuditLog('CREATE', 'EquipmentIncident', equipmentId, `Báo cáo sự cố dừng máy: ${issue}`);
    this.notify();
  }

  signoffEquipmentRepair(equipmentId: string, authorizedNotes: string) {
    this.equipments = this.equipments.map(eq => {
      if (eq.id === equipmentId && eq.currentIncident) {
        return {
          ...eq,
          status: 'running',
          currentIncident: {
            ...eq.currentIncident,
            repairStatus: 'resolved',
            authorizedSignoffBy: `${this.currentUser.name} (${this.currentUser.role})`
          }
        };
      }
      return eq;
    });
    this.addAuditLog('APPROVE', 'EquipmentRepair', equipmentId, `Ký duyệt cho phép thiết bị tái vận hành: ${authorizedNotes}`);
    this.notify();
  }

  // Material Urgent Replenish
  requestMaterialReplenish(materialId: string, urgentQty: number, notes: string) {
    const mat = this.materials.find(m => m.id === materialId);
    if (!mat) return;

    this.materials = this.materials.map(m => {
      if (m.id === materialId) {
        return { ...m, urgentRequestStatus: 'pending_po', etaHours: 2.0 };
      }
      return m;
    });

    // Create approval item
    const newApproval: Approval = {
      id: `appr-${Date.now()}`,
      title: `Yêu cầu cấp phát khẩn cấp ${urgentQty} ${mat.unit} ${mat.code}`,
      type: 'MATERIAL_EMERGENCY',
      requester: `${this.currentUser.name} (${this.currentUser.role})`,
      role: this.currentUser.role,
      vendorId: mat.vendorId,
      details: `${mat.name} - Ghi chú: ${notes}. Cần bù đệm an toàn.`,
      status: 'pending',
      requestedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    this.approvals = [newApproval, ...this.approvals];
    this.addAuditLog('CREATE', 'Approval', newApproval.id, `Đề xuất cấp vật liệu khẩn ${mat.code}`);
    this.notify();
  }

  // Approvals
  resolveApproval(approvalId: string, decision: 'approved' | 'rejected', notes: string) {
    this.approvals = this.approvals.map(app => {
      if (app.id === approvalId) {
        return {
          ...app,
          status: decision,
          reviewedBy: this.currentUser.name,
          reviewedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          reviewNotes: notes
        };
      }
      return app;
    });

    const appr = this.approvals.find(a => a.id === approvalId);
    if (appr && decision === 'approved') {
      if (appr.type === 'MATERIAL_EMERGENCY') {
        // Update material stock if replenishment approved
        this.materials = this.materials.map(m => {
          if (m.vendorId === appr.vendorId) {
            return { ...m, currentStock: m.currentStock + 2000, status: 'sufficient', urgentRequestStatus: 'delivered' };
          }
          return m;
        });
      }
    }

    this.addAuditLog(decision === 'approved' ? 'APPROVE' : 'REJECT', 'Approval', approvalId, `Phê duyệt ${appr?.title || approvalId}: ${decision} - ${notes}`);
    this.notify();
  }

  // Tasks
  toggleTaskStatus(taskId: string) {
    this.tasks = this.tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        const progress = nextStatus === 'completed' ? 100 : 50;
        return { ...t, status: nextStatus, progressPercent: progress };
      }
      return t;
    });
    this.notify();
  }

  createTaskFromAIAction(title: string, priority: 'Cao' | 'Trung bình' | 'Thấp', vendorId: string) {
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title,
      category: 'Đề xuất AI vận hành',
      priority,
      vendorId,
      assignee: this.currentUser.name,
      deadline: 'Hôm nay 17:00',
      status: 'in_progress',
      progressPercent: 10,
      approvalRequired: priority === 'Cao'
    };
    this.tasks = [newTask, ...this.tasks];
    this.addAuditLog('CREATE', 'Task', newTask.id, `Tạo nhiệm vụ từ khuyến nghị AI: ${title}`);
    this.notify();
    return newTask;
  }

  // Acknowledge Alert
  acknowledgeAlert(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a);
    this.notify();
  }
}

export const operationsService = new OperationsStore();
