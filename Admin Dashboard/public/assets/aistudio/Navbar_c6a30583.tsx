import React from 'react';
import { Bot, Sparkles, DollarSign, Globe, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: 'USD' | 'KHR';
  setCurrency: (c: 'USD' | 'KHR') => void;
  onOpenAiModal: () => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenAiModal,
  onOpenSimulator
}) => {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'mods', label: '🎮 Game Mods' },
    { id: 'licenses', label: '🔑 License Keys' },
    { id: 'orders', label: '💳 Orders & Payments' },
    { id: 'botconfig', label: '🤖 Bot Settings' },
    { id: 'broadcast', label: '📢 Broadcast' },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:h-16 gap-3">
          
          {/* Logo & Bot Status */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src="/assets/aistudio/IMG_1928_acf6f505.jpeg"
                  alt="Benzto2 Logo"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/20"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h1 className="text-white font-bold tracking-wide text-sm sm:text-base truncate">Benzto2 ModStore</h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 mr-1 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Telegram Game Mod Automation</p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {/* Telegram Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition shadow-lg shadow-sky-600/20"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Test Bot</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium transition shadow-lg shadow-purple-600/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="hidden xs:inline">AI Copilot</span>
            </button>

            {/* Currency Toggle */}
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'KHR' : 'USD')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <DollarSign className="w-3 h-3 text-cyan-400" />
              <span>{currency === 'USD' ? '$' : '៛'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
