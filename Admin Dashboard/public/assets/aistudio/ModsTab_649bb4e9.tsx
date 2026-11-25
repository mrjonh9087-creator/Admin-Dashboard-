import React, { useState } from 'react';
import { GameMod } from '../types';
import { Plus, Sparkles, Search, Trash2, Edit3, ShieldAlert, Download, Key, Check } from 'lucide-react';

interface ModsTabProps {
  mods: GameMod[];
  setMods: React.Dispatch<React.SetStateAction<GameMod[]>>;
  currency: 'USD' | 'KHR';
}

export const ModsTab: React.FC<ModsTabProps> = ({ mods, setMods, currency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMod, setEditingMod] = useState<GameMod | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [gameCategory, setGameCategory] = useState<'MLBB' | 'PUBG' | 'Free Fire' | 'ROV' | 'Genshin' | 'Other'>('MLBB');
  const [version, setVersion] = useState('v1.0.0');
  const [priceUSD, setPriceUSD] = useState(5.00);
  const [priceKHR, setPriceKHR] = useState(20000);
  const [duration, setDuration] = useState<'1 Day' | '7 Days' | '30 Days' | 'Lifetime'>('30 Days');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('ESP Map\nAimbot\nAnti-Ban');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60');
  const [stockKeys, setStockKeys] = useState(50);

  // AI Generator modal state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLanguage, setAiLanguage] = useState<'kh' | 'en'>('kh');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredMods = mods.filter(mod => {
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || mod.gameCategory === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingMod(null);
    setName('');
    setGameCategory('MLBB');
    setVersion('v1.0.0');
    setPriceUSD(5.00);
    setPriceKHR(20000);
    setDuration('30 Days');
    setDescription('');
    setFeaturesText('ESP Map\nAimbot\nAnti-Ban 99%');
    setImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60');
    setStockKeys(50);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mod: GameMod) => {
    setEditingMod(mod);
    setName(mod.name);
    setGameCategory(mod.gameCategory);
    setVersion(mod.version);
    setPriceUSD(mod.priceUSD);
    setPriceKHR(mod.priceKHR);
    setDuration(mod.duration);
    setDescription(mod.description);
    setFeaturesText(mod.features.join('\n'));
    setImage(mod.image);
    setStockKeys(mod.stockKeys);
    setIsModalOpen(true);
  };

  const handleSaveMod = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText.split('\n').filter(f => f.trim() !== '');

    if (editingMod) {
      setMods(mods.map(m => m.id === editingMod.id ? {
        ...m,
        name,
        gameCategory,
        version,
        priceUSD,
        priceKHR,
        duration,
        description,
        features,
        image,
        stockKeys
      } : m));
    } else {
      const newMod: GameMod = {
        id: `mod-${Date.now()}`,
        name,
        gameCategory,
        version,
        priceUSD,
        priceKHR,
        duration,
        description,
        features,
        image,
        downloadsCount: 0,
        stockKeys,
        isHot: true
      };
      setMods([newMod, ...mods]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុប Mod នេះមែនទេ?')) {
      setMods(mods.filter(m => m.id !== id));
    }
  };

  const handleGenerateAiDescription = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a professional game mod selling description and feature list for: ${aiPrompt}`,
          type: 'description',
          language: aiLanguage
        })
      });
      const data = await res.json();
      if (data.result) {
        setDescription(data.result);
        setIsAiModalOpen(false);
      } else {
        alert('Failed to generate AI description');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">🎮 គ្រប់គ្រង Game Mods</h2>
          <p className="text-sm text-slate-400">បន្ថែម កែសម្រួល និងកំណត់តម្លៃ Mod សម្រាប់ Telegram Bot របស់អ្នក</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>បន្ថែម Mod ថ្មី</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/85 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ស្វែងរកឈ្មោះ Mod..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'MLBB', 'PUBG', 'Free Fire', 'ROV', 'Genshin'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMods.map((mod) => (
          <div key={mod.id} className="bg-slate-900/85 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-cyan-500/40 transition group">
            <div>
              {/* Image banner */}
              <div className="relative h-44 overflow-hidden bg-slate-800">
                <img src={mod.image} alt={mod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/90 text-slate-950 backdrop-blur">
                    {mod.gameCategory}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-cyan-400 border border-cyan-500/30 backdrop-blur">
                    {mod.version}
                  </span>
                </div>
                {mod.isHot && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                    🔥 HOT
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur">
                    ⏱️ {mod.duration}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    📦 ស្តុក: {mod.stockKeys} Keys
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition">{mod.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{mod.description}</p>
                
                <div className="space-y-1.5 mb-4">
                  {mod.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-cyan-400 mr-2 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / Price & Actions */}
            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-auto">
              <div>
                <div className="text-lg font-extrabold text-cyan-400">
                  {currency === 'USD' ? `$${mod.priceUSD.toFixed(2)}` : `${mod.priceKHR.toLocaleString()} ៛`}
                </div>
                <div className="text-xs text-slate-500">{mod.downloadsCount} downloads</div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(mod)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="កែសម្រួល"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(mod.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                  title="លុប"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Mod Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingMod ? '✏️ កែសម្រួល Game Mod' : '➕ បន្ថែម Game Mod ថ្មី'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMod} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ឈ្មោះ Mod</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ឧ. MLBB VIP ESP v9.2"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ប្រភេទហ្គេម (Category)</label>
                  <select
                    value={gameCategory}
                    onChange={(e: any) => setGameCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="MLBB">Mobile Legends (MLBB)</option>
                    <option value="PUBG">PUBG Mobile</option>
                    <option value="Free Fire">Free Fire Max</option>
                    <option value="ROV">ROV (Arena of Valor)</option>
                    <option value="Genshin">Genshin Impact</option>
                    <option value="Other">Other Game</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ជំនាន់ (Version)</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0.0"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">តម្លៃ ($ USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(parseFloat(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">តម្លៃ (KHR ៛)</label>
                  <input
                    type="number"
                    step="1000"
                    value={priceKHR}
                    onChange={(e) => setPriceKHR(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">រយៈពេលប្រើប្រាស់ (Duration)</label>
                  <select
                    value={duration}
                    onChange={(e: any) => setDuration(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1 Day">1 Day</option>
                    <option value="7 Days">7 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="Lifetime">Lifetime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ចំនួន Key ក្នុងស្តុក (Stock)</label>
                  <input
                    type="number"
                    value={stockKeys}
                    onChange={(e) => setStockKeys(parseInt(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">តំណរូបភាព (Image URL)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">ពិពណ៌នា Mod (Description)</label>
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Generate Description</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ពិពណ៌នាលម្អិតពីមុខងារ Mod..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">មុខងារសំខាន់ៗ (Features - មួយបន្ទាត់មួយ)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-cyan-500/20"
                >
                  រក្សាទុក Mod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-purple-400 font-bold">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>AI Mod Description Generator</span>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">តើអ្នកចង់បង្កើត Mod អ្វី? (បញ្ចូលព័ត៌មានសង្ខេប)</label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="ឧ. MLBB Mod Menu ESP Map ធំទូលាយ Anti-Ban 99%"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ភាសា (Language)</label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setAiLanguage('kh')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      aiLanguage === 'kh' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    🇰🇭 ភាសាខ្មែរ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiLanguage('en')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      aiLanguage === 'en' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAiDescription}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
