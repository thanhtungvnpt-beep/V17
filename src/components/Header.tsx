import React, { useState } from 'react';
import { 
  Bell, ChevronDown, Shield, CheckCircle2, 
  RefreshCw, Globe, Sparkles, Smartphone, Terminal,
  Check, X
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { INITIAL_USERS } from '../services/mockData';
import { operationsService } from '../services/operationsService';
import { translations } from '../locales/i18n';

interface HeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  activeShift: string;
  onSelectShift: (shift: string) => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  currentUser,
  onSelectUser,
  activeShift,
  onSelectShift,
  selectedDate,
  onSelectDate,
  activeTab,
  onSelectTab,
  unreadAlertsCount
}) => {
  const t = translations[currentLang];
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showShiftDropdown, setShowShiftDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const shifts = [
    'Ca 1 (08:00 - 16:00)',
    'Ca 2 (16:00 - 00:00)',
    'Ca 3 (00:00 - 08:00)'
  ];

  const dates = [
    { label: 'Hôm nay (2025-06-24)', value: '2025-06-24' },
    { label: 'Hôm qua (2025-06-23)', value: '2025-06-23' },
    { label: 'Kế hoạch ngày mai (2025-06-25)', value: '2025-06-25' }
  ];

  return (
    <header className="bg-[#061122] border-b border-[#163359] sticky top-0 z-40 px-3 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Glowing Circuit Brain Logo */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0c2a4d] to-[#06162d] border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] group-hover:border-cyan-300 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all">
              <svg className="w-7 h-7 stroke-cyan-400 fill-none" viewBox="0 0 24 24" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.08A3.5 3.5 0 0 0 4.5 8c0 .35.05.69.15 1A3.5 3.5 0 0 0 3 12c0 1.25.66 2.35 1.65 2.95A3.5 3.5 0 0 0 7 19.5v.08A2.5 2.5 0 0 0 9.5 22h.5a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-.5zM14.5 2a2.5 2.5 0 0 1 2.5 2.5v.08A3.5 3.5 0 0 1 19.5 8c0 .35-.05.69-.15 1A3.5 3.5 0 0 1 21 12c0 1.25-.66 2.35-1.65 2.95A3.5 3.5 0 0 1 17 19.5v.08A2.5 2.5 0 0 1 14.5 22h-.5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M8 8h1M15 8h1M7 12h2M15 12h2M8 16h1M15 16h1" />
                <circle cx="8" cy="8" r="0.8" className="fill-cyan-400" />
                <circle cx="16" cy="8" r="0.8" className="fill-cyan-400" />
                <circle cx="7" cy="12" r="0.8" className="fill-cyan-400" />
                <circle cx="17" cy="12" r="0.8" className="fill-cyan-400" />
                <circle cx="8" cy="16" r="0.8" className="fill-cyan-400" />
                <circle cx="16" cy="16" r="0.8" className="fill-cyan-400" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-lg lg:text-xl font-black tracking-wider text-[#00e5ff] font-sans drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                NEURAL LINK
              </div>
              <div className="text-[11px] font-black tracking-wider text-[#38bdf8] uppercase">
                PRODUCTION CONTROL CENTER
              </div>
              <div className="text-[9.5px] font-bold text-[#7dd3fc]/80 tracking-widest uppercase">
                OUTSOURCING GROUP | AI POWERED
              </div>
            </div>
          </div>
        </div>

        {/* Operational Context Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Box 1: Date Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowShiftDropdown(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#081528] border border-[#1b3d68] hover:border-cyan-500/50 text-white transition-all shadow-inner"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0284c7] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-white" viewBox="0 0 24 24" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <circle cx="8" cy="14" r="1" className="fill-white" />
                  <circle cx="12" cy="14" r="1" className="fill-white" />
                  <circle cx="16" cy="14" r="1" className="fill-white" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <span>Hôm nay</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-xs font-bold text-white font-mono leading-none mt-0.5">
                  {selectedDate} (Tue)
                </div>
              </div>
            </button>
            {showDateDropdown && (
              <div className="absolute left-0 mt-1.5 w-60 bg-[#091526] border border-cyan-800/80 rounded-xl shadow-2xl py-1 z-50">
                {dates.map(d => (
                  <button
                    key={d.value}
                    onClick={() => {
                      onSelectDate(d.value);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-950/50 transition-colors ${selectedDate === d.value ? 'text-cyan-400 font-semibold bg-cyan-950/40' : 'text-slate-300'}`}
                  >
                    <span>{d.label}</span>
                    {selectedDate === d.value && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Box 2: Shift Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowShiftDropdown(!showShiftDropdown);
                setShowDateDropdown(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#081528] border border-[#1b3d68] hover:border-cyan-500/50 text-white transition-all shadow-inner"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0284c7] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-4 h-4 fill-none stroke-white" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <span>Ca hiện tại</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-xs font-bold text-white leading-none mt-0.5">
                  {activeShift}
                </div>
              </div>
            </button>
            {showShiftDropdown && (
              <div className="absolute left-0 mt-1.5 w-64 bg-[#091526] border border-cyan-800/80 rounded-xl shadow-2xl py-1 z-50">
                {shifts.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      onSelectShift(s);
                      setShowShiftDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-950/50 transition-colors ${activeShift === s ? 'text-cyan-400 font-semibold bg-cyan-950/40' : 'text-slate-300'}`}
                  >
                    <span>{s}</span>
                    {activeShift === s && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Box 3: Data Status Indicator */}
          <div className="flex flex-col justify-center px-4 py-1.5 rounded-xl bg-[#081528] border border-[#1b3d68] shadow-inner h-[42px]">
            <span className="text-[10px] text-slate-400 font-medium">Trạng thái dữ liệu</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-[#10b981] text-xs font-bold">Đang cập nhật</span>
            </div>
          </div>
        </div>

        {/* Right Tools & Profile Zone */}
        <div className="flex items-center gap-3">
          {/* Language Selector: VI | EN | KR */}
          <div className="flex items-center px-3 py-1.5 rounded-xl bg-[#081528] border border-[#1b3d68] text-xs font-bold font-mono tracking-wider text-slate-400 gap-1.5 h-[42px]">
            {(['vi', 'en', 'kr'] as Language[]).map((lang, idx) => (
              <React.Fragment key={lang}>
                <button
                  onClick={() => onSelectLang(lang)}
                  className={`uppercase transition-colors ${
                    currentLang === lang
                      ? 'text-white font-black drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]'
                      : 'hover:text-slate-200'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
                {idx < 2 && <span className="text-slate-600">|</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="w-[42px] h-[42px] rounded-full bg-[#081528] border border-[#1b3d68] hover:border-cyan-400/60 text-slate-200 hover:text-white flex items-center justify-center transition-all relative"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-black text-white flex items-center justify-center shadow-[0_0_8px_#e11d48]">
                5
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#091526] border border-cyan-800/80 rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.notifications}</span>
                  </div>
                  <button 
                    onClick={() => {
                      onSelectTab('tasks');
                      setShowNotifications(false);
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {t.viewAll}
                  </button>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40 text-xs">
                    <div className="font-semibold text-rose-300">Khẩn cấp: Thiếu vật liệu DAAL</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">IC-TPS54302 chỉ còn 1.5h sản xuất.</div>
                  </div>
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-xs">
                    <div className="font-semibold text-amber-300">Cảnh báo: Máy KTECH dừng 75p</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Kẹt feeder slot #14 Line SMT 02.</div>
                  </div>
                  <div className="p-2 rounded bg-blue-950/40 border border-blue-800/40 text-xs">
                    <div className="font-semibold text-blue-300">Chờ duyệt: Đóng hồ sơ CAPA Hojeong Vina</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Hiệu chuẩn bể hàn sóng đã hoàn tất.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
              className="w-[42px] h-[42px] rounded-full bg-[#081528] border-2 border-[#0ea5e9] flex items-center justify-center text-cyan-400 hover:border-cyan-300 shadow-[0_0_12px_rgba(14,165,233,0.35)] transition-all"
              title={`${currentUser.name} (${currentUser.role})`}
            >
              <svg className="w-5 h-5 fill-none stroke-cyan-400" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    {t.userRole} & Phân quyền RBAC
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Chuyển đổi góc nhìn phân quyền:
                  </div>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {INITIAL_USERS.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-cyan-950/70 border border-cyan-800/60 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-100">{u.name}</div>
                        <div className="text-[10px] text-cyan-400">{u.role}</div>
                      </div>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onSelectTab('developer');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded text-xs text-amber-400 hover:bg-amber-950/30 flex items-center gap-2"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Mở Quản trị Kỹ thuật (Console)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
