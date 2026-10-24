import React, { useState } from 'react';
import { 
  CheckSquare, Bell, UserCheck, CheckCircle2, 
  AlertTriangle, Clock, ShieldAlert, X, Check, Filter, Search
} from 'lucide-react';
import { Task, Alert, Approval, Vendor, UserProfile, Language } from '../../types';
import { operationsService } from '../../services/operationsService';
import { translations } from '../../locales/i18n';

interface TasksAndApprovalsModuleProps {
  tasks: Task[];
  alerts: Alert[];
  approvals: Approval[];
  vendors: Vendor[];
  currentLang: Language;
  currentUser: UserProfile;
}

export const TasksAndApprovalsModule: React.FC<TasksAndApprovalsModuleProps> = ({
  tasks,
  alerts,
  approvals,
  vendors,
  currentLang,
  currentUser
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<'approvals' | 'tasks' | 'alerts'>('approvals');
  const [reviewModal, setReviewModal] = useState<Approval | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const canApprove = currentUser.role === 'Executive' || currentUser.role === 'OutsourcingManager' || currentUser.role === 'Admin';

  const handleResolveApproval = (decision: 'approved' | 'rejected') => {
    if (!reviewModal) return;
    operationsService.resolveApproval(reviewModal.id, decision, decisionNotes);
    setNotification(`Đã ${decision === 'approved' ? 'phê duyệt' : 'từ chối'} đề xuất: "${reviewModal.title}"`);
    setReviewModal(null);
    setDecisionNotes('');
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

      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090f1d] border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <span>Nhiệm vụ, Cảnh báo & Quyết định Phê duyệt (Tasks & Approvals)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Trung tâm kiểm soát phê duyệt cấp phép, điều chuyển vật tư khẩn cấp và danh sách công việc ưu tiên trong ngày.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Chờ phê duyệt</span>
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 flex items-center justify-center text-[10px] font-mono">
              {approvals.filter(a => a.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Nhiệm vụ điều hành</span>
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-mono">
              {tasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Cảnh báo hệ thống</span>
            <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-300 flex items-center justify-center text-[10px] font-mono">
              {alerts.filter(a => !a.acknowledged).length}
            </span>
          </button>
        </div>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'approvals' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {approvals.map(approval => {
              const vendor = vendors.find(v => v.id === approval.vendorId);
              return (
                <div
                  key={approval.id}
                  className={`rounded-2xl bg-[#090f1d] border p-4 space-y-3 flex flex-col justify-between ${
                    approval.status === 'pending'
                      ? 'border-cyan-500/60 ring-1 ring-cyan-500/20'
                      : 'border-slate-800 opacity-80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                        {approval.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        approval.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : approval.status === 'rejected'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                      }`}>
                        {approval.status === 'approved' ? 'Đã duyệt' : approval.status === 'rejected' ? 'Đã từ chối' : 'Chờ phê duyệt'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {approval.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {approval.details}
                    </p>

                    <div className="pt-2 text-[10px] text-slate-400 space-y-0.5 border-t border-slate-800/60">
                      <div>Người đề xuất: <span className="text-slate-200">{approval.requester}</span></div>
                      <div>Nhà máy liên quan: <span className="text-cyan-300 font-semibold">{vendor?.code || approval.vendorId}</span></div>
                      <div>Thời gian gửi: <span className="font-mono text-slate-400">{approval.requestedAt}</span></div>
                    </div>

                    {approval.reviewNotes && (
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                        <span className="text-cyan-400 font-semibold">Ý kiến phê duyệt ({approval.reviewedBy}): </span>
                        {approval.reviewNotes}
                      </div>
                    )}
                  </div>

                  {approval.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                      {canApprove ? (
                        <button
                          onClick={() => setReviewModal(approval)}
                          className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
                        >
                          Xem xét & Phê duyệt
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic text-center w-full">
                          Chỉ Quản lý Ban / Lãnh đạo có quyền phê duyệt
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="rounded-2xl bg-[#090f1d] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3.5">Tiêu đề nhiệm vụ</th>
                  <th className="py-3 px-3">Hạng mục</th>
                  <th className="py-3 px-3">Mức độ ưu tiên</th>
                  <th className="py-3 px-3">Nhà máy</th>
                  <th className="py-3 px-3">Người thực hiện</th>
                  <th className="py-3 px-3">Hạn hoàn thành</th>
                  <th className="py-3 px-3">Tiến độ</th>
                  <th className="py-3 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map(t => {
                  const vendor = vendors.find(v => v.id === t.vendorId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-white">
                        {t.title}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {t.category}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          t.priority === 'Cao'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : t.priority === 'Trung bình'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-cyan-300">
                        {vendor ? vendor.code : t.vendorId}
                      </td>
                      <td className="py-3 px-3 text-slate-200">
                        {t.assignee}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">
                        {t.deadline}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${t.progressPercent}%` }} />
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">{t.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => operationsService.toggleTaskStatus(t.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            t.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          {t.status === 'completed' ? '✓ Đã xong' : 'Đang xử lý'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-2.5">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl bg-[#090f1d] border flex items-center justify-between gap-3 ${
                alert.severity === 'critical'
                  ? 'border-rose-900/80'
                  : alert.severity === 'warning'
                  ? 'border-amber-900/80'
                  : 'border-slate-800'
              } ${alert.acknowledged ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  alert.severity === 'critical' ? 'bg-rose-600/20 text-rose-400' : 'bg-amber-600/20 text-amber-400'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{alert.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{alert.description}</p>
                </div>
              </div>

              {!alert.acknowledged && (
                <button
                  onClick={() => operationsService.acknowledgeAlert(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap"
                >
                  Xác nhận đã xem
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <span>Xét duyệt đề xuất điều hành</span>
              </h3>
              <button onClick={() => setReviewModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-white mb-1">{reviewModal.title}</div>
                <div className="text-slate-300">{reviewModal.details}</div>
                <div className="text-slate-400 mt-2 text-[10px]">Người gửi: {reviewModal.requester}</div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ý kiến chỉ đạo / Quyết định *</label>
                <textarea
                  rows={3}
                  placeholder="Ghi rõ điều kiện phê duyệt hoặc lý do từ chối..."
                  value={decisionNotes}
                  onChange={e => setDecisionNotes(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-400 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleResolveApproval('rejected')}
                className="px-4 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold"
              >
                Từ chối
              </button>
              <button
                onClick={() => handleResolveApproval('approved')}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Phê duyệt đề xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
