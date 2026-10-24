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
    <header className="bg-[#080e1a] border-b border-slate-800/80 sticky top-0 z-40 px-3 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-indigo-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 transition-all">
              <svg className="w-6 h-6 stroke-cyan-400 fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a9 9 0 0 0-9 9c0 3.87 2.45 7.17 5.89 8.41.45.08.61-.2.61-.43v-1.52c-2.48.54-3-1.2-3-1.2-.41-1.04-1-1.32-1-1.32-.81-.55.06-.54.06-.54.9.06 1.37.93 1.37.93.8 1.37 2.1 1 2.61.76.08-.58.31-1 .57-1.23-1.98-.23-4.06-.99-4.06-4.41 0-.98.35-1.78.93-2.41-.09-.23-.4-1.14.09-2.38 0 0 .76-.24 2.48.92A8.65 8.65 0 0 1 12 6.8c.77 0 1.54.1 2.27.3 1.72-1.16 2.48-.92 2.48-.92.49 1.24.18 2.15.09 2.38.58.63.93 1.43.93 2.41 0 3.43-2.09 4.18-4.08 4.4.32.28.61.83.61 1.67v2.48c0 .24.16.52.62.43A9.01 9.01 0 0 0 21 11a9 9 0 0 0-9-9z" />
                <circle cx="12" cy="12" r="3" className="fill-cyan-400/30" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base lg:text-lg font-black tracking-wider text-white font-mono">
                  NEURAL LINK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  V17
                </span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider flex items-center gap-1.5">
                <span className="text-cyan-400 font-semibold">{t.appSubtitle}</span>
                <span className="text-slate-600">|</span>
                <span className="hidden sm:inline text-slate-400">{t.groupSubtitle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Context Controls */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 text-xs">
          {/* Date Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowShiftDropdown(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-slate-200 transition-colors"
            >
              <span className="text-slate-400">{t.today}:</span>
              <span className="font-medium text-cyan-300 font-mono">{selectedDate} (Tue)</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showDateDropdown && (
              <div className="absolute left-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                {dates.map(d => (
                  <button
                    key={d.value}
                    onClick={() => {
                      onSelectDate(d.value);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${selectedDate === d.value ? 'text-cyan-400 font-semibold bg-slate-800/50' : 'text-slate-300'}`}
                  >
                    <span>{d.label}</span>
                    {selectedDate === d.value && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shift Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowShiftDropdown(!showShiftDropdown);
                setShowDateDropdown(false);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-slate-600 text-slate-200 transition-colors"
            >
              <span className="text-slate-400">{t.currentShift}:</span>
              <span className="font-medium text-cyan-300">{activeShift.split(' ')[0]} {activeShift.split(' ')[1]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {showShiftDropdown && (
              <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                {shifts.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      onSelectShift(s);
                      setShowShiftDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${activeShift === s ? 'text-cyan-400 font-semibold bg-slate-800/50' : 'text-slate-300'}`}
                  >
                    <span>{s}</span>
                    {activeShift === s && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-emerald-900/40 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-400">{t.dataStatus}:</span>
            <span className="text-emerald-400 font-medium">{t.updating}</span>
          </div>
        </div>

        {/* Right Tools & Profile Zone */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Quick Mobile Mode Toggle */}
          <button
            onClick={() => onSelectTab(activeTab === 'mobile' ? 'overview' : 'mobile')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              activeTab === 'mobile'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
            title="Giao diện hiện trường Mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.navMobile}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700 p-0.5 text-xs font-mono">
            {(['vi', 'en', 'kr'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => onSelectLang(lang)}
                className={`px-2 py-1 rounded text-[11px] font-semibold uppercase transition-colors ${
                  currentLang === lang
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
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
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                {currentUser.name.split(' ').slice(-1)[0][0]}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-semibold text-slate-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-400 leading-tight">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
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
