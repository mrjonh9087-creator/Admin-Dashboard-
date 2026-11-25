import React, { useState } from 'react';
import { GameMod } from '../types';
import {
  Plus,
  Sparkles,
  Search,
  Trash2,
  Edit3,
  Check,
  FileCode2,
  X,
  Loader2,
  AlertCircle,
  Flame
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface ModsTabProps {
  mods: GameMod[];
  setMods: React.Dispatch<React.SetStateAction<GameMod[]>>;
  currency: 'USD' | 'KHR';
}

const DEFAULT_BANNER_IMAGE = '/assets/aistudio/IMG_3173_e32561b0.jpeg';

export const ModsTab: React.FC<ModsTabProps> = ({ mods, setMods, currency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<GameMod | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [gameCategory, setGameCategory] = useState<'MLBB' | 'PUBG' | 'Free Fire' | 'ROV' | 'Genshin' | 'Other'>('Free Fire');
  const [version, setVersion] = useState('v2.4');
  const [priceUSD, setPriceUSD] = useState(5.0);
  const [priceKHR, setPriceKHR] = useState(20000);
  const [duration, setDuration] = useState<'1 Day' | '7 Days' | '30 Days' | 'Lifetime'>('Lifetime');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState(
    'ANTI-BAN 100%\nLow Ping & Smooth Performance\niOS Settings Direct Install\nInstant Telegram .mobileconfig Delivery'
  );
  const [image, setImage] = useState(DEFAULT_BANNER_IMAGE);
  const [stockKeys, setStockKeys] = useState(50);
  const [downloadUrl, setDownloadUrl] = useState('/Benzto2_VIP_Smooth.mobileconfig');
  const [fileName, setFileName] = useState('Benzto2_VIP_Smooth.mobileconfig');

  const [originalPriceUSD, setOriginalPriceUSD] = useState<number | undefined>(undefined);
  const [originalPriceKHR, setOriginalPriceKHR] = useState<number | undefined>(undefined);
  const [discountPercent, setDiscountPercent] = useState<number | undefined>(undefined);

  // AI Generator modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLanguage, setAiLanguage] = useState<'kh' | 'en'>('kh');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredMods = mods.filter((mod) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mod.fileName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || mod.gameCategory === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApply50PercentPromo = () => {
    setMods((prevMods) =>
      prevMods.map((m) => {
        const origUSD = m.originalPriceUSD || m.priceUSD;
        const origKHR = m.originalPriceKHR || m.priceKHR;
        const newUSD = Math.round(origUSD * 0.5 * 100) / 100;
        const newKHR = Math.round((origKHR * 0.5) / 500) * 500;
        const baseName = m.name.replace(/\s*\[PROMO 50%\]/g, '');
        return {
          ...m,
          name: `${baseName} [PROMO 50%]`,
          priceUSD: newUSD,
          priceKHR: newKHR,
          originalPriceUSD: origUSD,
          originalPriceKHR: origKHR,
          discountPercent: 50
        };
      })
    );
  };

  const handleResetRegularPrices = () => {
    setMods((prevMods) =>
      prevMods.map((m) => {
        const origUSD = m.originalPriceUSD || m.priceUSD;
        const origKHR = m.originalPriceKHR || m.priceKHR;
        return {
          ...m,
          name: m.name.replace(/\s*\[PROMO 50%\]/g, ''),
          priceUSD: origUSD,
          priceKHR: origKHR,
          originalPriceUSD: undefined,
          originalPriceKHR: undefined,
          discountPercent: undefined
        };
      })
    );
  };

  const handleOpenAdd = () => {
    setEditingMod(null);
    setName('');
    setGameCategory('Free Fire');
    setVersion('v2.4');
    setPriceUSD(5.0);
    setPriceKHR(20000);
    setOriginalPriceUSD(undefined);
    setOriginalPriceKHR(undefined);
    setDiscountPercent(undefined);
    setDuration('Lifetime');
    setDescription('');
    setFeaturesText(
      'ANTI-BAN 100%\nLow Ping & Smooth Performance\niOS Settings Direct Install\nInstant Telegram .mobileconfig Delivery'
    );
    setImage(DEFAULT_BANNER_IMAGE);
    setStockKeys(50);
    setDownloadUrl('/Benzto2_VIP_Smooth.mobileconfig');
    setFileName('Benzto2_VIP_Smooth.mobileconfig');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mod: GameMod) => {
    setEditingMod(mod);
    setName(mod.name);
    setGameCategory(mod.gameCategory);
    setVersion(mod.version);
    setPriceUSD(mod.priceUSD);
    setPriceKHR(mod.priceKHR);
    setOriginalPriceUSD(mod.originalPriceUSD);
    setOriginalPriceKHR(mod.originalPriceKHR);
    setDiscountPercent(mod.discountPercent);
    setDuration(mod.duration);
    setDescription(mod.description);
    setFeaturesText(mod.features.join('\n'));
    setImage(mod.image || DEFAULT_BANNER_IMAGE);
    setStockKeys(mod.stockKeys ?? 50);
    setDownloadUrl(mod.downloadUrl || '');
    setFileName(mod.fileName || '');
    setIsModalOpen(true);
  };

  const handleSaveMod = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText.split('\n').filter((f) => f.trim() !== '');
    const resolvedImage = image.trim() || DEFAULT_BANNER_IMAGE;

    if (editingMod) {
      setMods(
        mods.map((m) =>
          m.id === editingMod.id
            ? {
                ...m,
                name,
                gameCategory,
                version,
                priceUSD: Number.isFinite(priceUSD) ? priceUSD : 0,
                priceKHR: Number.isFinite(priceKHR) ? priceKHR : 0,
                originalPriceUSD,
                originalPriceKHR,
                discountPercent,
                duration,
                description,
                features,
                image: resolvedImage,
                stockKeys: Number.isFinite(stockKeys) ? stockKeys : 0,
                downloadUrl,
                fileName
              }
            : m
        )
      );
    } else {
      const newMod: GameMod = {
        id: `mod-${Date.now()}`,
        name,
        gameCategory,
        version,
        priceUSD: Number.isFinite(priceUSD) ? priceUSD : 0,
        priceKHR: Number.isFinite(priceKHR) ? priceKHR : 0,
        originalPriceUSD,
        originalPriceKHR,
        discountPercent,
        duration,
        description,
        features,
        image: resolvedImage,
        downloadsCount: 0,
        stockKeys: Number.isFinite(stockKeys) ? stockKeys : 0,
        isHot: false,
        downloadUrl,
        fileName,
        fileSize: '4.2 KB'
      };
      setMods([newMod, ...mods]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setMods(mods.filter((m) => m.id !== id));
    setConfirmDeleteId(null);
  };

  const handleGenerateAiDescription = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a professional iOS VPN & DNS .mobileconfig profile description for: ${aiPrompt}`,
          type: 'description',
          language: aiLanguage
        })
      });
      const data = await res.json();
      if (data.result) {
        setDescription(data.result);
        setIsAiModalOpen(false);
      } else {
        setAiError(data.error || 'មិនអាចបង្កើតការពិពណ៌នាដោយ AI បានទេ។');
      }
    } catch {
      setAiError('មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់សេវាកម្ម AI។');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">កញ្ចប់ iOS .mobileconfig Catalog</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            គ្រប់គ្រងផលិតផល VPN / NextDNS Profile និងតម្លៃសម្រាប់លក់ក្នុង Telegram Bot
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែមកញ្ចប់ថ្មី</span>
        </button>
      </div>

      {/* 50% Flash Sale Promotion Bar */}
      <div className="lcd-card-amber rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-sky-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>យុទ្ធនាការប្រូម៉ូសិន 50% លើគ្រប់ VPN (Promotion 50% Active)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-300 border border-rose-500/40">
                -50% ALL VPN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              បានបញ្ចុះតម្លៃ 50% លើគ្រប់កញ្ចប់ VPN ទាំងអស់ (Lifetime: $5.00 / 20,000៛ | Smooth VIP: $2.50 / 10,000៛)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleApply50PercentPromo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs transition-colors shadow-[0_0_14px_rgba(244,63,94,0.4)]"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>អនុវត្ត 50% គ្រប់កញ្ចប់</span>
          </button>
          <button
            type="button"
            onClick={handleResetRegularPrices}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white font-semibold text-xs transition-colors"
          >
            <span>តម្លៃដើមវិញ</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="lcd-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="ស្វែងរកឈ្មោះកញ្ចប់ ឬ .mobileconfig..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070b14] border border-sky-400/20 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#070b14] border border-sky-400/20 overflow-x-auto">
          {['All', 'Free Fire', 'MLBB', 'PUBG', 'ROV', 'Genshin'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.45)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMods.length === 0 ? (
          <div className="col-span-full lcd-card rounded-2xl py-14 text-center text-sm text-slate-400">
            មិនមានកញ្ចប់ត្រូវនឹងការស្វែងរកទេ
          </div>
        ) : (
          filteredMods.map((mod) => (
            <div
              key={mod.id}
              className="lcd-card rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                {/* Clean visual thumbnail */}
                <div className="relative h-44 overflow-hidden bg-[#090d16] border-b border-white/[0.08]">
                  <img
                    src={mod.image || DEFAULT_BANNER_IMAGE}
                    alt={mod.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== window.location.origin + DEFAULT_BANNER_IMAGE) {
                        img.src = DEFAULT_BANNER_IMAGE;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  
                  {/* Promo Badge */}
                  {((mod.discountPercent && mod.discountPercent > 0) || (mod.originalPriceUSD && mod.originalPriceUSD > mod.priceUSD)) && (
                    <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[11px] shadow-[0_0_12px_rgba(244,63,94,0.6)] border border-rose-300/40">
                      <Flame className="w-3.5 h-3.5" />
                      <span>PROMO -50%</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                    <span className="font-medium text-sky-400">
                      {mod.gameCategory} · {mod.version}
                    </span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {mod.duration} · ស្តុក {mod.stockKeys}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug mb-1.5 flex items-center gap-1.5">
                    <span className="truncate">{mod.name}</span>
                    <VerifiedBadge size="xs" title="Official Benzto2 Profile" />
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {mod.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {mod.fileName && (
                    <div className="bg-[#090d16] px-3 py-2 rounded-xl border border-white/[0.08] flex items-center gap-2 text-xs text-slate-300 font-mono truncate">
                      <FileCode2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{mod.fileName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer / Price & Actions */}
              <div className="px-5 py-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <div>
                  {mod.originalPriceUSD && mod.originalPriceUSD > mod.priceUSD ? (
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                          {currency === 'USD'
                            ? `$${mod.priceUSD.toFixed(2)}`
                            : `${mod.priceKHR.toLocaleString()} ៛`}
                        </span>
                        <span className="text-[10px] font-black text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono">
                          -50%
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 line-through font-mono tabular-nums">
                        {currency === 'USD'
                          ? `$${mod.originalPriceUSD.toFixed(2)}`
                          : `${(mod.originalPriceKHR || mod.originalPriceUSD * 4000).toLocaleString()} ៛`}
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-white font-mono tabular-nums">
                      {currency === 'USD'
                        ? `$${mod.priceUSD.toFixed(2)}`
                        : `${mod.priceKHR.toLocaleString()} ៛`}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                    {mod.downloadsCount} ដំឡើង
                  </div>
                </div>

                {confirmDeleteId === mod.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDelete(mod.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold transition-colors"
                    >
                      លុបច្បាស់
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-medium transition-colors"
                    >
                      ទេ
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(mod)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
                      title="កែសម្រួល"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(mod.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors"
                      title="លុប"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Mod Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111827] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white">
                {editingMod ? 'កែសម្រួលកញ្ចប់ .mobileconfig' : 'បន្ថែមកញ្ចប់ .mobileconfig ថ្មី'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMod} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ឈ្មោះកញ្ចប់</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ឧ. Lifetime (1 Device Only) - NextDNS VIP"
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ប្រភេទ (Category)</label>
                  <select
                    value={gameCategory}
                    onChange={(e) => setGameCategory(e.target.value as GameMod['gameCategory'])}
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Free Fire">Free Fire / Gaming DNS</option>
                    <option value="MLBB">Mobile Legends (MLBB)</option>
                    <option value="PUBG">PUBG Mobile</option>
                    <option value="ROV">ROV (Arena of Valor)</option>
                    <option value="Genshin">Genshin Impact</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ជំនាន់ (Version)</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v2.4"
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">តម្លៃ ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">តម្លៃ (KHR ៛)</label>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={priceKHR}
                    onChange={(e) => setPriceKHR(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">រយៈពេលប្រើប្រាស់</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as GameMod['duration'])}
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="1 Day">1 Day</option>
                    <option value="7 Days">7 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ចំនួនស្តុក (Stock)</label>
                  <input
                    type="number"
                    min="0"
                    value={stockKeys}
                    onChange={(e) => setStockKeys(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono tabular-nums focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ទីតាំងឯកសារ (.mobileconfig Path)</label>
                  <input
                    type="text"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="/Benzto2_VIP_Smooth.mobileconfig"
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">ឈ្មោះ File (.mobileconfig)</label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Benzto2_VIP_Smooth.mobileconfig"
                    className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">រូបភាព Banner (Image URL)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">ការពិពណ៌នា (Description)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAiError(null);
                      setIsAiModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>បង្កើតដោយ AI</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ពិពណ៌នាលម្អិតពីមុខងារ iOS VPN / DNS..."
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  លក្ខណៈពិសេស (មួយបន្ទាត់មួយ)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-colors"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  រក្សាទុកកញ្ចប់
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>AI Description Generator</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {aiError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  ព័ត៌មានសង្ខេបអំពីកញ្ចប់ .mobileconfig
                </label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="ឧ. NextDNS VIP 1 Device Low Ping សម្រាប់ iPhone"
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">ភាសា (Language)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiLanguage('kh')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      aiLanguage === 'kh'
                        ? 'bg-sky-500 border-sky-500 text-slate-950'
                        : 'bg-[#090d16] border-white/[0.1] text-slate-300 hover:text-white'
                    }`}
                  >
                    ភាសាខ្មែរ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiLanguage('en')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      aiLanguage === 'en'
                        ? 'bg-sky-500 border-sky-500 text-slate-950'
                        : 'bg-[#090d16] border-white/[0.1] text-slate-300 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  disabled={isGenerating || !aiPrompt.trim()}
                  onClick={handleGenerateAiDescription}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold disabled:opacity-50 inline-flex items-center gap-2 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>កំពុងបង្កើត...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>បង្កើតដោយ AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
