import React, { useState } from 'react';
import { BotConfig, GameMod, ChatMessage } from '../types';
import { Send, X, QrCode, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BotSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  botConfig: BotConfig;
  mods: GameMod[];
}

export const BotSimulatorModal: React.FC<BotSimulatorModalProps> = ({
  isOpen,
  onClose,
  botConfig,
  mods
}) => {
  if (!isOpen) return null;

  const conciseWelcome = `👑 *BENZTO2 VIP — iOS VPN & DNS SHOP*
⭐ *ទំនុកចិត្ត ១០០% • ដំឡើងផ្ទាល់តាម iOS Settings*
━━━━━━━━━━━━━━━
🛡️ *Anti-Ban 100%* — ការពារគណនីហ្គេមដោយសុវត្ថិភាព
⚡ *Low Ping & Smooth* — កាត់បន្ថយ Ping លេងហ្គេមរលូន
🔒 *NextDNS VIP (1 Device)* — បង្កើត Profile ផ្តាច់មុខ
💳 *ACLEDA KHQR* — បង់ប្រាក់រហ័ស & ផ្ញើ File ស្វ័យប្រវត្តិ

📩 ជំនួយសេវាកម្ម៖ https://t.me/paypalsetup
👇 សូមជ្រើសរើសមុខងារខាងក្រោម៖`;

  const createWelcomeMessage = (): ChatMessage => ({
    id: 'bot-screen',
    sender: 'bot',
    image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
    text: conciseWelcome,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'inline_keyboard'
  });

  const [activeScreen, setActiveScreen] = useState<string>('start');
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModForBuy, setSelectedModForBuy] = useState<GameMod | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'qr' | 'success'>('idle');

  const handleNavigateMenu = (menuKey: 'start' | 'shop' | 'vpn' | 'guide' | 'payment' | 'myfile') => {
    setPaymentStep('idle');
    setSelectedModForBuy(null);
    setActiveScreen(menuKey);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (menuKey === 'start') {
      setMessages([createWelcomeMessage()]);
      return;
    }

    if (menuKey === 'shop') {
      setMessages([
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
          text: '🛒 *ហាង BENZTO2 VPN & MODS*\n\nសូមជ្រើសរើសកញ្ចប់ File VPN Bypass ឬ Mods ខាងក្រោម៖',
          timestamp: nowTime,
          type: 'product_card'
        }
      ]);
      return;
    }

    if (menuKey === 'vpn') {
      setMessages([
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
          text: `🛡️ *សេវាកម្ម BENZTO2 VPN BYPASS & MODS*\n\n✅ *Anti-Ban 100%* — ការពារគណនីសុវត្ថិភាពខ្ពស់\n⚡ *Lag-Free* — បន្ថយ Ping លេងហ្គេមមិនទាក់\n🎯 *Aimlock & Bypass* — ដំណើរការត្រូវគ្នា 100%\n📱 *iOS & Android* — ប្រើបានគ្រប់ទូរស័ព្ទដៃ\n\n💬 ទាក់ទងទិញ៖ ${botConfig.supportUsername}`,
          timestamp: nowTime,
          type: 'inline_keyboard'
        }
      ]);
      return;
    }

    if (menuKey === 'guide') {
      setMessages([
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
          text: `📖 *វិធីដំឡើង .mobileconfig លើ iPhone / iPad:*\n\n1️⃣ បើកឯកសារ .mobileconfig ដែល Bot ផ្ញើជូន រួចចុច Allow\n2️⃣ ចូល *Settings → General → VPN & Device Management*\n3️⃣ ចុចលើ *Benzto2 VIP* → *Install* ដើម្បីដំណើរការ\n\n🛡️ រួចរាល់! ប្រព័ន្ធនឹងការពារ និងកាត់បន្ថយ Ping ស្វ័យប្រវត្តិ។`,
          timestamp: nowTime,
          type: 'inline_keyboard'
        }
      ]);
      return;
    }

    if (menuKey === 'payment') {
      setMessages([
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3205_226e989d.jpeg',
          text: `💳 *ព័ត៌មានទូទាត់ប្រាក់តាម BENZTO2 KHQR*\n━━━━━━━━━━━━━━━\n🏦 ធនាគារ: *ACLEDA Bank*\n👤 ឈ្មោះគណនី: *CHHEAN SITRA*\n📱 លេខទូរស័ព្ទ: \`012 *** 220\`\n\n📸 *របៀបបង់ប្រាក់ និងទទួល File៖*\n1️⃣ ស្កេន QR Code ខាងលើតាម Bakong / ABA / ACLEDA\n2️⃣ ផ្ញើរូបភាព Slip មកក្នុង Bot នេះផ្ទាល់ ឬ @paypalsetup\n3️⃣ ទទួលឯកសារ \`.mobileconfig\` ភ្លាមៗ!`,
          timestamp: nowTime,
          type: 'inline_keyboard'
        }
      ]);
      return;
    }

    if (menuKey === 'myfile') {
      setMessages([
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
          text: '📂 ឯកសារ .mobileconfig ដែលបានទិញរួច:\n\n1️⃣ Benzto2_VIP_1Device.mobileconfig\n✅ ស្ថានភាព: បានផ្ញើជូនរួចរាល់',
          timestamp: nowTime,
          type: 'inline_keyboard'
        }
      ]);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');

    const lower = text.trim().toLowerCase();
    if (lower === '/start') return handleNavigateMenu('start');
    if (lower === '/shop' || lower === 'shop') return handleNavigateMenu('shop');
    if (lower === '/vpn' || lower === 'vpn') return handleNavigateMenu('vpn');
    if (lower === '/guide' || lower === 'guide') return handleNavigateMenu('guide');
    if (lower === '/payment' || lower === 'payment') return handleNavigateMenu('payment');
    if (lower === 'myfile') return handleNavigateMenu('myfile');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([userMsg]);
    setActiveScreen('ai-chat');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/bot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          gameContext: mods
        })
      });
      const data = await res.json();
      setMessages([
        userMsg,
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
          text: data.reply || 'សូមអរគុណ! សូមទាក់ទង Admin: @paypalsetup',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'inline_keyboard'
        }
      ]);
    } catch {
      setMessages([
        userMsg,
        {
          id: 'bot-screen',
          sender: 'bot',
          image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
          text: 'សូមទាក់ទង Admin: @paypalsetup 🙏',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'inline_keyboard'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectModToBuy = (mod: GameMod) => {
    setSelectedModForBuy(mod);
    setPaymentStep('qr');
    setActiveScreen('checkout');
    setMessages([
      {
        id: 'bot-screen',
        sender: 'bot',
        image: '/assets/aistudio/IMG_3205_226e989d.jpeg',
        text: `🛒 *វិក្កយបត្របញ្ជាទិញ (INVOICE)*\n━━━━━━━━━━━━━━━\n📦 កញ្ចប់: *${mod.name}*\n💵 តម្លៃត្រូវទូទាត់: *$${mod.priceUSD.toFixed(2)} (${mod.priceKHR.toLocaleString()} ៛)*\n\n👇 សូមស្កេន BENZTO2 KHQR ខាងលើ រួចផ្ញើ Slip៖`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSimulatePaymentDone = () => {
    if (!selectedModForBuy) return;
    setPaymentStep('success');
    setActiveScreen('success');

    setMessages([
      {
        id: 'bot-screen',
        sender: 'bot',
        image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
        text: `🎉 បង់ប្រាក់ជោគជ័យ!\n\n📄 ឯកសារ .mobileconfig ត្រូវបានបង្កើត & ផ្ញើជូនដោយស្វ័យប្រវត្តិ៖\n📁 \`${selectedModForBuy.fileName}\`\n\nអរគុណសម្រាប់ការគាំទ្រ Benzto2 VIP ❤️`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'inline_keyboard'
      }
    ]);
    setSelectedModForBuy(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-[#111827] border border-white/[0.12] rounded-2xl max-w-md w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        
        {/* Telegram Header */}
        <div className="bg-[#090d16] px-4 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/aistudio/IMG_1928_acf6f505_acf6f505.jpeg"
              alt="Benzto2 Bot"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <div>
              <h3 className="text-white font-bold text-sm">{botConfig.botName}</h3>
              <p className="text-xs text-slate-400 font-mono">{botConfig.botUsername}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0e1621] bg-opacity-95">
          
          <div className="text-center my-1">
            <span className="text-[10px] bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Concise & Professional Bot UI
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl overflow-hidden text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-br-none font-sans'
                        : 'bg-[#182533] text-slate-100 rounded-bl-none border border-slate-800 font-sans'
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Benzto2 VPN Banner"
                        referrerPolicy="no-referrer"
                        className="w-full h-auto object-cover border-b border-slate-700/60"
                      />
                    )}
                    <div className="px-4 py-3">
                      <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">{msg.text}</p>
                      
                      {/* Inline Keyboard Simulation */}
                      {msg.type === 'inline_keyboard' && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleNavigateMenu('shop')}
                              className="py-2 px-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-xl text-[11px] font-bold border border-sky-500/30 transition text-center"
                            >
                              🛒 ទិញ File VPN
                            </button>
                            <button
                              onClick={() => handleNavigateMenu('vpn')}
                              className="py-2 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-[11px] font-bold border border-amber-500/30 transition text-center"
                            >
                              🛡️ អំពីសេវាកម្ម VPN
                            </button>
                            <button
                              onClick={() => handleNavigateMenu('guide')}
                              className="py-2 px-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl text-[11px] font-bold border border-indigo-500/30 transition text-center"
                            >
                              📖 វិធីដំឡើង File
                            </button>
                            <button
                              onClick={() => handleNavigateMenu('payment')}
                              className="py-2 px-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-[11px] font-bold border border-emerald-500/30 transition text-center"
                            >
                              💳 វិធីបង់ប្រាក់ KHQR
                            </button>
                          </div>
                          <a
                            href="https://t.me/paypalsetup"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 px-3 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 rounded-xl text-[11px] font-bold border border-cyan-500/30 transition flex items-center justify-center space-x-1.5"
                          >
                            <span>💬 ទាក់ទង Admin (@paypalsetup)</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {activeScreen !== 'start' && (
                            <button
                              onClick={() => handleNavigateMenu('start')}
                              className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-bold border border-slate-700 transition text-center"
                            >
                              ⬅️ ត្រឡប់ទៅម៉ឺនុយដើម
                            </button>
                          )}
                        </div>
                      )}

                      {/* Product Card Simulation */}
                      {msg.type === 'product_card' && (
                        <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60">
                          {mods.slice(0, 3).map((mod) => (
                            <div key={mod.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate">{mod.fileName}</div>
                                <div className="text-[11px] flex items-center gap-1.5 flex-wrap mt-0.5">
                                  <span className="text-emerald-400 font-bold font-mono">
                                    ${mod.priceUSD.toFixed(2)} ({mod.priceKHR.toLocaleString()} ៛)
                                  </span>
                                  {mod.originalPriceUSD && mod.originalPriceUSD > mod.priceUSD && (
                                    <span className="text-slate-500 line-through text-[10px] font-mono">
                                      ${mod.originalPriceUSD.toFixed(2)}
                                    </span>
                                  )}
                                  {((mod.discountPercent && mod.discountPercent > 0) || (mod.originalPriceUSD && mod.originalPriceUSD > mod.priceUSD)) && (
                                    <span className="px-1.5 py-0.5 rounded bg-rose-500/25 text-rose-300 text-[9px] font-black border border-rose-500/40 leading-none">
                                      -50%
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleSelectModToBuy(mod)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex-shrink-0"
                              >
                                🛒 ទិញ File
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleNavigateMenu('start')}
                            className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition text-center mt-2"
                          >
                            ⬅️ ត្រឡប់ទៅម៉ឺនុយដើម
                          </button>
                        </div>
                      )}

                      <span className="text-[10px] text-slate-400 mt-1.5 block text-right">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* KHQR Simulator Box if paymentStep === 'qr' */}
              {paymentStep === 'qr' && selectedModForBuy && (
                <div className="bg-[#090d16] border border-white/[0.12] rounded-2xl p-4 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                      <QrCode className="w-4 h-4" />
                      <span>BENZTO2 KHQR CHECKOUT</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white tabular-nums">
                      ${selectedModForBuy.priceUSD.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ធនាគារ</span>
                      <span className="text-white font-semibold">ACLEDA Bank</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ឈ្មោះគណនី</span>
                      <span className="text-sky-400 font-mono font-semibold">CHHEAN SITRA</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">លេខទូរស័ព្ទ</span>
                      <span className="text-white font-mono">012 *** 220</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                      <span className="text-slate-400">ទឹកប្រាក់</span>
                      <span className="font-bold text-emerald-400 font-mono tabular-nums">
                        ${selectedModForBuy.priceUSD.toFixed(2)} ({selectedModForBuy.priceKHR.toLocaleString()} ៛)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleSimulatePaymentDone}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
                    >
                      ✅ បង់ប្រាក់រួច (Simulate Success)
                    </button>
                    <button
                      onClick={() => handleNavigateMenu('shop')}
                      className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition"
                    >
                      ⬅️ ត្រឡប់ទៅហាងវិញ
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs bg-[#182533] px-3 py-2 rounded-xl w-fit">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span>Bot កំពុងរៀបចំ...</span>
            </div>
          )}

        </div>

        {/* Telegram Chat Input */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center space-x-2">
          <button
            onClick={() => handleNavigateMenu('start')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold transition"
            title="Send /start"
          >
            /start
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="សួរអំពី VPN ឬសរសេរសារទៅកាន់ Bot..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
