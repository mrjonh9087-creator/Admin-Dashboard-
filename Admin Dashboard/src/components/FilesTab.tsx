import React, { useState } from 'react';
import { SoldFileRecord, GameMod, NextDnsProfile } from '../types';
import {
  Search,
  Plus,
  Copy,
  Check,
  Trash2,
  FileText,
  ShieldBan,
  ShieldCheck,
  X
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface FilesTabProps {
  soldFiles: SoldFileRecord[];
  setSoldFiles: React.Dispatch<React.SetStateAction<SoldFileRecord[]>>;
  mods: GameMod[];
  profiles: NextDnsProfile[];
  onRevokeProfile: (target: string) => void | Promise<void>;
  revokingTarget?: string | null;
}

export const FilesTab: React.FC<FilesTabProps> = ({
  soldFiles,
  setSoldFiles,
  mods,
  profiles,
  onRevokeProfile,
  revokingTarget
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'profiles' | 'files'>('profiles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [manualRevokeId, setManualRevokeId] = useState('');

  const [selectedModId, setSelectedModId] = useState(mods[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerTelegram, setCustomerTelegram] = useState('');

  const filteredProfiles = profiles.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      p.profileId.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.userId.toLowerCase().includes(q)
    );
  });

  const filteredFiles = soldFiles.filter((item) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      item.fileName.toLowerCase().includes(q) ||
      item.modName.toLowerCase().includes(q) ||
      item.customerName.toLowerCase().includes(q) ||
      item.customerTelegram.toLowerCase().includes(q)
    );
  });

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const mod = mods.find((m) => m.id === selectedModId);
    if (!mod) return;

    const newRecord: SoldFileRecord = {
      id: `file-rec-${Date.now()}`,
      modId: mod.id,
      modName: mod.name,
      downloadUrl: mod.downloadUrl,
      fileName: mod.fileName,
      customerTelegram: customerTelegram.startsWith('@') ? customerTelegram : `@${customerTelegram}`,
      customerName: customerName || 'VIP Customer',
      status: 'delivered',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setSoldFiles([newRecord, ...soldFiles]);
    setIsModalOpen(false);
    setCustomerName('');
    setCustomerTelegram('');
  };

  const handleManualRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRevokeId.trim()) return;
    await onRevokeProfile(manualRevokeId.trim());
    setManualRevokeId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">NextDNS Profiles & ប្រវត្តិផ្ញើ .mobileconfig</h2>
          <p className="text-xs text-slate-400 mt-1">
            គ្រប់គ្រង Profile ផ្តាច់មុខ ១ ឧបករណ៍ និង Revoke ភ្លាមៗបើរកឃើញការចែករំលែក (Anti-Share Protection)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>កត់ត្រា File ថ្មី</span>
        </button>
      </div>

      {/* Quick Anti-Share Revoke Bar */}
      <form
        onSubmit={handleManualRevoke}
        className="lcd-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-white">បិទសិទ្ធិ Profile ភ្លាមៗ (Anti-Share Revoke):</span>{' '}
          <span className="text-slate-400">វាយបញ្ចូល Profile ID ឬ Telegram User ID ដើម្បីផ្តាច់ DNS ពីម៉ាស៊ីនភ្ញៀវ</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={manualRevokeId}
            onChange={(e) => setManualRevokeId(e.target.value)}
            placeholder="Profile ID ឬ User ID..."
            className="bg-[#070b14] border border-sky-400/20 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 w-52"
          />
          <button
            type="submit"
            disabled={!manualRevokeId.trim() || Boolean(revokingTarget)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <ShieldBan className="w-3.5 h-3.5" />
            <span>Revoke DNS</span>
          </button>
        </div>
      </form>

      {/* Toolbar: Search + Segmented View Switch */}
      <div className="lcd-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរក Profile ID, User ID ឬ File..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070b14] border border-sky-400/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-[#070b14] border border-sky-400/20 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('profiles')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              viewMode === 'profiles'
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NextDNS Profiles ({profiles.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('files')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              viewMode === 'files'
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.45)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ឯកសារបានផ្ញើ ({soldFiles.length})
          </button>
        </div>
      </div>

      {/* Table Area */}
      {viewMode === 'profiles' ? (
        <div className="lcd-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs font-medium text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th className="px-5 py-3.5">NextDNS Profile ID</th>
                  <th className="px-4 py-3.5">User ID / Telegram</th>
                  <th className="px-4 py-3.5">Order ID</th>
                  <th className="px-4 py-3.5">កាលបរិច្ឆេទបង្កើត</th>
                  <th className="px-4 py-3.5">ស្ថានភាព</th>
                  <th className="px-5 py-3.5 text-right">Anti-Share Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredProfiles.map((prof, idx) => (
                  <tr key={`${prof.profileId}-${prof.orderId || idx}-${prof.createdAt || idx}`} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-sky-400">
                      <div className="flex items-center gap-2">
                        <span>{prof.profileId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(prof.profileId, prof.profileId)}
                          className="text-slate-500 hover:text-white"
                          title="Copy Profile ID"
                        >
                          {copiedId === prof.profileId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-200">
                      {prof.username} <span className="text-slate-500">({prof.userId})</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400 tabular-nums">
                      {prof.orderId || '—'}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400 tabular-nums">
                      {prof.createdAt.replace('T', ' ').substring(0, 16)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {prof.revoked ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
                          <ShieldBan className="w-3.5 h-3.5" />
                          <span>Revoked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Active · 1 Device</span>
                          <VerifiedBadge size="xs" title="Verified Profile" />
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      {!prof.revoked ? (
                        <button
                          type="button"
                          disabled={revokingTarget === prof.profileId}
                          onClick={() => onRevokeProfile(prof.profileId)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold transition-colors"
                        >
                          <ShieldBan className="w-3.5 h-3.5" />
                          <span>{revokingTarget === prof.profileId ? 'កំពុងបិទ...' : 'Revoke Access'}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-slate-500">Disabled</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                      មិនទាន់មាន NextDNS Profile នៅឡើយទេ — អនុម័តការបញ្ជាទិញ Lifetime 1 Device ដើម្បីបង្កើត Profile ស្វ័យប្រវត្តិ។
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="lcd-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs font-medium text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th className="px-5 py-3.5">ឈ្មោះឯកសារ (.mobileconfig)</th>
                  <th className="px-4 py-3.5">កញ្ចប់</th>
                  <th className="px-4 py-3.5">អតិថិជន</th>
                  <th className="px-4 py-3.5">កាលបរិច្ឆេទ</th>
                  <th className="px-4 py-3.5">ស្ថានភាព</th>
                  <th className="px-5 py-3.5 text-right">លុប</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredFiles.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-sky-400">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-200 max-w-[200px] truncate">{item.modName}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-semibold text-white">{item.customerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.customerTelegram}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-400 tabular-nums">{item.createdAt}</td>
                    <td className="px-4 py-3.5 text-xs font-medium text-emerald-400 whitespace-nowrap">
                      Delivered
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSoldFiles(soldFiles.filter((f) => f.id !== item.id))}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="លុបប្រវត្តិ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredFiles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                      មិនមានទិន្នន័យឯកសារទេ។
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual File Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#111827] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">កត់ត្រាការផ្ញើ File .mobileconfig</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">ជ្រើសរើសកញ្ចប់</label>
                <select
                  value={selectedModId}
                  onChange={(e) => setSelectedModId(e.target.value)}
                  className="w-full bg-[#090d16] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                >
                  {mods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fileName} (${m.priceUSD})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">ឈ្មោះអតិថិជន</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ឧ. Sok Dara"
                  className="w-full bg-[#090d16] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Telegram (@username)</label>
                <input
                  type="text"
                  required
                  value={customerTelegram}
                  onChange={(e) => setCustomerTelegram(e.target.value)}
                  placeholder="@dara_gamer"
                  className="w-full bg-[#090d16] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-xs font-semibold"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold"
                >
                  រក្សាទុក
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
