import React, { useState } from 'react';
import { LicenseKey, GameMod } from '../types';
import { Key, Search, Plus, Copy, Check, RefreshCw, Trash2, Smartphone, ShieldAlert } from 'lucide-react';

interface LicensesTabProps {
  licenses: LicenseKey[];
  setLicenses: React.Dispatch<React.SetStateAction<LicenseKey[]>>;
  mods: GameMod[];
}

export const LicensesTab: React.FC<LicensesTabProps> = ({ licenses, setLicenses, mods }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New key form
  const [selectedModId, setSelectedModId] = useState(mods[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerTelegram, setCustomerTelegram] = useState('');
  const [durationDays, setDurationDays] = useState(30);

  const filteredLicenses = licenses.filter(key => {
    const matchesSearch = key.keyString.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          key.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          key.customerTelegram.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyKey = (keyString: string, id: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const mod = mods.find(m => m.id === selectedModId);
    if (!mod) return;

    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomStr2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKeyString = `${mod.gameCategory}-VIP-${randomStr}-${randomStr2}`;

    const now = new Date();
    const expires = new Date();
    expires.setDate(now.getDate() + durationDays);

    const newKey: LicenseKey = {
      id: `key-${Date.now()}`,
      modId: mod.id,
      modName: mod.name,
      keyString: newKeyString,
      customerTelegram: customerTelegram.startsWith('@') ? customerTelegram : `@${customerTelegram}`,
      customerName: customerName || 'VIP Customer',
      status: 'active',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      expiresAt: expires.toISOString().replace('T', ' ').substring(0, 16),
      deviceHWID: 'Not Bound Yet'
    };

    setLicenses([newKey, ...licenses]);
    setIsModalOpen(false);
    setCustomerName('');
    setCustomerTelegram('');
  };

  const handleRevoke = (id: string) => {
    setLicenses(licenses.map(l => l.id === id ? { ...l, status: 'revoked' } : l));
  };

  const handleDelete = (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុប License Key នេះមែនទេ?')) {
      setLicenses(licenses.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">🔑 គ្រប់គ្រង License Keys</h2>
          <p className="text-sm text-slate-400">បង្កើត និងគ្រប់គ្រង Key សម្រាប់ផ្ដល់ជូនអតិថិជនប្រើប្រាស់ Mod Game</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើត Key ថ្មី</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/85 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរក Key, ឈ្មោះ ឬ Telegram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {['all', 'active', 'expired', 'revoked'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">License Key</th>
                <th className="px-4 py-3">Mod Game</th>
                <th className="px-4 py-3">អតិថិជន (Telegram)</th>
                <th className="px-4 py-3">កាលបរិច្ឆេទផុតកំណត់</th>
                <th className="px-4 py-3">Device HWID</th>
                <th className="px-4 py-3">ស្ថានភាព</th>
                <th className="px-4 py-3 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLicenses.map((key) => (
                <tr key={key.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {key.keyString}
                      </span>
                      <button
                        onClick={() => handleCopyKey(key.keyString, key.id)}
                        className="text-slate-400 hover:text-white p-1 rounded"
                        title="ចម្លង Key"
                      >
                        {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-white max-w-[180px] truncate">{key.modName}</td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{key.customerName}</div>
                    <div className="text-xs text-sky-400">{key.customerTelegram}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    <div>បង្កើត: {key.createdAt}</div>
                    <div className="text-amber-400/90 font-medium">หมด: {key.expiresAt}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {key.deviceHWID || 'Not Bound'}
                  </td>
                  <td className="px-4 py-3">
                    {key.status === 'active' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    )}
                    {key.status === 'expired' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Expired
                      </span>
                    )}
                    {key.status === 'revoked' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {key.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-medium transition"
                        >
                          បិទ (Revoke)
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        title="លុប"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">🔑 បង្កើត License Key ថ្មី</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ជ្រើសរើស Game Mod</label>
                <select
                  value={selectedModId}
                  onChange={(e) => setSelectedModId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  {mods.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (${m.priceUSD})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ឈ្មោះអតិថិជន (Customer Name)</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ឧ. Sok Dara"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Telegram Handle (@username)</label>
                <input
                  type="text"
                  required
                  value={customerTelegram}
                  onChange={(e) => setCustomerTelegram(e.target.value)}
                  placeholder="@dara_gamer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">រយៈពេល (Duration in Days)</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={1}>1 ថ្ងៃ (1 Day)</option>
                  <option value={7}>7 ថ្ងៃ (7 Days)</option>
                  <option value={30}>30 ថ្ងៃ (1 Month)</option>
                  <option value={365}>1 ឆ្នាំ (Lifetime / 365 Days)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  បង្កើត Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
