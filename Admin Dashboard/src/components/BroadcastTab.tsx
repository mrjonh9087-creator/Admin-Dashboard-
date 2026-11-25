import React, { useState } from 'react';
import { KnownTelegramUser } from '../types';
import {
  Sparkles,
  Send,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Users,
  Flame
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface BroadcastTabProps {
  knownUsers?: KnownTelegramUser[];
}

export const BroadcastTab: React.FC<BroadcastTabProps> = ({ knownUsers = [] }) => {
  const [message, setMessage] = useState('');
  const [targetChatId, setTargetChatId] = useState<string>('ALL');
  const [customChatId, setCustomChatId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [resultBanner, setResultBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    setResultBanner(null);

    const resolvedTarget =
      targetChatId === 'CUSTOM'
        ? customChatId.trim()
        : targetChatId === 'ALL'
          ? undefined
          : targetChatId;

    if (targetChatId === 'CUSTOM' && !resolvedTarget) {
      setIsSending(false);
      setResultBanner({ type: 'error', text: 'សូមបញ្ចូល Telegram Chat ID គោលដៅជាមុនសិន។' });
      return;
    }

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          targetChatId: resolvedTarget
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.totalRecipients === 0) {
          setResultBanner({
            type: 'error',
            text: 'មិនទាន់មាន Chat ID អ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធនៅឡើយទេ (សូមឱ្យអតិថិជនចុច /start ក្នុង Bot ជាមុនសិន ឬជ្រើសរើសបញ្ចូល Chat ID ផ្ទាល់)។'
          });
        } else {
          setResultBanner({
            type: 'success',
            text: `បានផ្ញើសារជោគជ័យចំនួន ${data.sentCount} / ${data.totalRecipients} នាក់${
              data.failedCount > 0 ? ` (បរាជ័យ ${data.failedCount})` : ''
            }។`
          });
          if (data.sentCount > 0) {
            setMessage('');
          }
        }
      } else {
        setResultBanner({
          type: 'error',
          text: data.error || 'មិនអាចផ្ញើសារ Broadcast ទៅ Telegram បានទេ។'
        });
      }
    } catch {
      setResultBanner({
        type: 'error',
        text: 'មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Server API។'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateAiCaption = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create an engaging Telegram broadcast message in Khmer for Benzto2 VIP iOS VPN & .mobileconfig shop: ${aiPrompt}`,
          type: 'broadcast',
          language: 'kh'
        })
      });
      const data = await res.json();
      if (data.result) {
        setMessage(data.result);
        setIsAiModalOpen(false);
      } else {
        setAiError(data.error || 'មិនអាចបង្កើតសារដោយ AI បានទេ។');
      }
    } catch {
      setAiError('មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់សេវាកម្ម AI។');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">ផ្សព្វផ្សាយសារ (Telegram Broadcast)</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            ផ្ញើសារប្រកាស Update ឬប្រូម៉ូសិនផ្ទាល់ទៅកាន់អតិថិជនតាម @Benzto2_VIP_Bot
          </p>
        </div>
        <div className="lcd-card inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-mono tabular-nums self-start">
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>{knownUsers.length} អតិថិជនបានភ្ជាប់</span>
          <VerifiedBadge size="xs" title="Verified Bot Subscribers" />
        </div>
      </div>

      {resultBanner && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2.5 ${
            resultBanner.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {resultBanner.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{resultBanner.text}</span>
        </div>
      )}

      <div className="lcd-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Megaphone className="w-4 h-4 text-sky-400" />
            <span>បង្កើតសារ Broadcast ថ្មី</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMessage(`🔥 *មហាប្រូម៉ូសិនពិសេស 50% OFF ពី BENZTO2 VIP iOS VPN!* 🚀
━━━━━━━━━━━━━━━━━━━━━
ដំណឹងល្អសម្រាប់បងប្អូនទាំងអស់គ្នា! ឥឡូវនេះគ្រប់កញ្ចប់ iOS VPN & DNS .mobileconfig បញ្ចុះតម្លៃពិសេស 50% ភ្លាមៗ៖

👑 *1. CONFIG IPHONE VIP — Lifetime (1 Device Only)*
• Unique NextDNS Profile • Anti-Share Protection
• 💵 តម្លៃពិសេស: *$5.00 (20,000៛)* (តម្លៃដើម ~*$10.00*~) 🔥 [-50%]

📱 *2. CONFIG IPHONE VIP — Smooth + Low Ping*
• ល្បឿនលឿន កាត់បន្ថយ Ping ស្មូតល្អ • Anti-Ban 100%
• 💵 តម្លៃពិសេស: *$2.50 (10,000៛)* (តម្លៃដើម ~*$5.00*~) 🔥 [-50%]

⚡ *ដំឡើងងាយស្រួល:* ត្រឹម ១០ វិនាទីតាម iOS Settings មិនបាច់ប្រើ App!
💳 *ទូទាត់រហ័ស:* ACLEDA KHQR ផ្ញើ File ស្វ័យប្រវត្តិ។

👉 ចុចបញ្ជាទិញឥឡូវនេះតាម Bot: @Benzto2_VIP_Bot
💬 ជំនួយសេវាកម្ម 24/7: @paypalsetup`);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 hover:from-rose-500/30 hover:to-amber-500/30 text-rose-300 hover:text-white text-xs font-semibold border border-rose-500/30 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>គំរូសារប្រូម៉ូសិន 50%</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAiError(null);
                setIsAiModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-sky-400 text-xs font-semibold border border-white/[0.08] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Copywriter</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              គោលដៅអ្នកទទួល (Target Recipients)
            </label>
            <select
              value={targetChatId}
              onChange={(e) => setTargetChatId(e.target.value)}
              className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">
                អតិថិជនទាំងអស់ដែលបានភ្ជាប់ Bot ({knownUsers.length} នាក់)
              </option>
              {knownUsers.map((u) => (
                <option key={u.chatId} value={u.chatId}>
                  ផ្ញើជូនតែ: {u.label}
                </option>
              ))}
              <option value="CUSTOM">បញ្ចូល Telegram Chat ID ដោយផ្ទាល់...</option>
            </select>
          </div>

          {targetChatId === 'CUSTOM' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Telegram Chat ID គោលដៅ
              </label>
              <input
                type="text"
                value={customChatId}
                onChange={(e) => setCustomChatId(e.target.value)}
                placeholder="ឧ. 123456789"
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              ខ្លឹមសារសារ (គាំទ្រ Telegram Markdown)
            </label>
            <textarea
              rows={6}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ដំណឹងល្អ! កញ្ចប់ Benzto2 VIP .mobileconfig ជំនាន់ថ្មីបាន Update រួចរាល់ — Ping ទាប Smooth 100%..."
              className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 leading-relaxed"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              គាំទ្រទម្រង់ Markdown ដូចជា *Bold*, _Italic_, និង `Code`។
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm disabled:opacity-50 transition-colors"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>កំពុងផ្ញើទៅ Telegram...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ផ្ញើ Broadcast ឥឡូវនេះ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111827] border border-white/[0.12] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>AI Broadcast Generator</span>
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
                  តើអ្នកចង់ប្រកាសអ្វី? (ឧ. បញ្ចុះតម្លៃ 30% ថ្ងៃនេះ)
                </label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="ឧ. Update NextDNS VIP ថ្មី និងបញ្ចុះតម្លៃពិសេស"
                  className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
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
                  onClick={handleGenerateAiCaption}
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
                      <span>បង្កើត Caption</span>
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
