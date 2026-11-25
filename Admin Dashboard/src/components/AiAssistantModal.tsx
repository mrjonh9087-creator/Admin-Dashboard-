import React, { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'សួស្តី! ខ្ញុំអាចជួយសរសេរអត្ថបទផ្សព្វផ្សាយ ការពិពណ៌នាកញ្ចប់ .mobileconfig ឬគំនិតទីផ្សារសម្រាប់ Telegram Bot របស់អ្នក។ តើអ្នកចង់ឱ្យជួយអ្វីថ្ងៃនេះ?'
    }
  ]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt('');
    setConversation(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          type: 'general',
          language: 'kh'
        })
      });
      const data = await res.json();
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: data.result || 'សូមអភ័យទោស មានបញ្ហាបន្តិចបន្តួចក្នុងការបង្កើតចម្លើយ។'
      }]);
    } catch {
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: 'សូមអភ័យទោស មិនអាចតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ AI បានទេ។'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#111827] border border-white/[0.12] rounded-2xl max-w-lg w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#090d16] px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>AI Copywriter Copilot</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-slate-950 font-medium rounded-br-none'
                    : 'bg-[#090d16] text-slate-200 rounded-bl-none border border-white/[0.08]'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-sky-400 text-xs bg-[#090d16] border border-white/[0.08] px-4 py-3 rounded-2xl w-fit">
              <div className="w-3 h-3 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span>កំពុងសរសេរចម្លើយ...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAsk} className="p-3 bg-[#090d16] border-t border-white/[0.08] flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="សរសេរសំណួរ ឬប្រធានបទដែលចង់ឱ្យជួយសរសេរ..."
            className="flex-1 bg-[#111827] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
