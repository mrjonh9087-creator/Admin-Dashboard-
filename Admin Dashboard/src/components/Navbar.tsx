import React from 'react';
import { VerifiedBadge } from './VerifiedBadge';
import {
  LayoutDashboard,
  CreditCard,
  ShieldCheck,
  Package,
  Bot,
  Megaphone,
  Menu,
  X,
  Sparkles,
  Smartphone,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface AdminUserSummary {
  displayName: string;
  email: string;
  photoURL?: string | null;
  isSuperAdmin: boolean;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
  activeProfilesCount: number;
  currency: 'USD' | 'KHR';
  setCurrency: (c: 'USD' | 'KHR') => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenAiModal: () => void;
  adminUser?: AdminUserSummary | null;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  activeProfilesCount,
  currency,
  setCurrency,
  mobileOpen,
  setMobileOpen,
  onOpenAiModal,
  adminUser,
  onSignOut
}) => {
  const navItems = [
    { id: 'dashboard', label: 'ទិដ្ឋភាពទូទៅ', sublabel: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'ការបញ្ជាទិញ & KHQR', sublabel: 'Orders', icon: CreditCard, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'files', label: 'NextDNS & ឯកសារ', sublabel: 'Profiles & Revoke', icon: ShieldCheck, badge: activeProfilesCount > 0 ? activeProfilesCount : undefined },
    { id: 'mods', label: 'កញ្ចប់ .mobileconfig', sublabel: 'Catalog', icon: Package },
    { id: 'botconfig', label: 'ការកំណត់ Bot', sublabel: 'Bot & KHQR', icon: Bot },
    { id: 'broadcast', label: 'ផ្សព្វផ្សាយសារ', sublabel: 'Broadcast', icon: Megaphone },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const sidebarBody = (
    <div className="flex flex-col h-full bg-[#0b1120] border-r border-cyan-400/20 shadow-[4px_0_24px_-10px_rgba(14,165,233,0.22)] select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-cyan-400/15 shrink-0 relative">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/assets/aistudio/IMG_1928_acf6f505_acf6f505.jpeg"
            alt="Benzto2 VIP"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-xl object-cover border border-cyan-400/40 shadow-[0_0_12px_rgba(56,189,248,0.3)] shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-bold text-white tracking-tight truncate whitespace-nowrap">
                Benzto2 Console
              </span>
              <VerifiedBadge size="sm" title="Verified Benzto2 Official Console" />
            </div>
            <div className="text-[11px] font-mono text-cyan-400/80 truncate">
              @Benzto2_VIP_Bot
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                isActive
                  ? 'bg-sky-500/15 text-cyan-300 font-semibold border border-cyan-400/25 shadow-[0_0_16px_rgba(14,165,233,0.18)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-300 to-blue-500 shadow-[0_0_10px_#38bdf8]" />
              )}
              <span className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="text-sm truncate whitespace-nowrap">{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span
                  className={`text-xs font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                    item.id === 'orders'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-400/20'
                      : 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Controls & Authenticated User Footer */}
      <div className="p-4 border-t border-white/[0.08] space-y-3 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>រូបិយប័ណ្ណ (Currency)</span>
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[#090d16] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-colors whitespace-nowrap ${
                currency === 'USD' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD $
            </button>
            <button
              type="button"
              onClick={() => setCurrency('KHR')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-colors whitespace-nowrap ${
                currency === 'KHR' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              KHR ៛
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onOpenAiModal();
            setMobileOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>AI Copywriter</span>
        </button>

        {adminUser && (
          <div className="pt-2.5 border-t border-cyan-400/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {adminUser.photoURL ? (
                <img
                  src={adminUser.photoURL}
                  alt={adminUser.displayName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-cyan-400/40 shadow-[0_0_10px_rgba(56,189,248,0.28)] shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                  {adminUser.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs font-semibold text-white truncate">
                    {adminUser.displayName}
                  </span>
                  <VerifiedBadge size="xs" title="Verified Admin" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  {adminUser.email}
                </div>
              </div>
            </div>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title="ចាកចេញ (Sign Out)"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarBody}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            {sidebarBody}
          </div>
        </div>
      )}
    </>
  );
};

interface TopBarProps {
  activeTab: string;
  onOpenMobileNav: () => void;
  onOpenSimulator: () => void;
}

const TAB_LABELS: Record<string, string> = {
  dashboard: 'ទិដ្ឋភាពទូទៅ (Overview)',
  orders: 'ការបញ្ជាទិញ & KHQR',
  files: 'NextDNS Profiles & ឯកសារ',
  mods: 'កញ្ចប់ .mobileconfig',
  botconfig: 'ការកំណត់ Bot',
  broadcast: 'ផ្សព្វផ្សាយសារ'
};

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onOpenMobileNav,
  onOpenSimulator
}) => {
  return (
    <header className="h-16 bg-[#0b1120]/90 backdrop-blur-md border-b border-cyan-400/20 shadow-[0_4px_24px_-12px_rgba(14,165,233,0.3)] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-8">
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 font-semibold whitespace-nowrap">
            <span>Benzto2 VIP</span>
            <VerifiedBadge size="sm" title="Official Verified Store" />
          </span>
          <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:inline shrink-0" />
          <span className="font-semibold text-cyan-300 truncate whitespace-nowrap">
            {TAB_LABELS[activeTab] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right: Single Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 text-xs font-bold shadow-[0_0_18px_rgba(56,189,248,0.35)] transition-all whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-4 h-4" />
          <span>សាកល្បង Telegram Bot</span>
        </button>
      </div>
    </header>
  );
};
