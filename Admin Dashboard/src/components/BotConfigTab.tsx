import React, { useState, useEffect } from 'react';
import { BotConfig } from '../types';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import {
  db,
  auth,
  emailToAdminDocId,
  handleFirestoreError,
  OperationType,
  SUPER_ADMIN_EMAIL
} from '../firebase';
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Key,
  MessageSquare,
  Globe,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  UserPlus,
  Trash2,
  Clock
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface BotConfigTabProps {
  botConfig: BotConfig;
  setBotConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  isSuperAdmin?: boolean;
  currentAdminEmail?: string;
}

interface AdminRecord {
  id: string;
  email: string;
  role: 'super_admin' | 'admin';
  addedByEmail: string;
}

interface LoginAuditRecord {
  id: string;
  email: string;
  displayName: string;
  status: 'granted' | 'denied';
  createdAt?: { toDate?: () => Date } | null;
}

export const BotConfigTab: React.FC<BotConfigTabProps> = ({
  botConfig,
  setBotConfig,
  isSuperAdmin = false,
  currentAdminEmail = ''
}) => {
  const [formData, setFormData] = useState<BotConfig>(botConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    status: 'idle' | 'success' | 'error';
    detail?: string;
  }>({ status: 'idle' });

  // Admin Gmail Access Control & Audit state
  const [adminsList, setAdminsList] = useState<AdminRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<LoginAuditRecord[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminStatusMsg, setAdminStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isSuperAdmin || !auth.currentUser) return;

    const adminsUnsub = onSnapshot(
      collection(db, 'authorizedAdmins'),
      (snapshot) => {
        const list: AdminRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            email: String(data.email || ''),
            role: data.role === 'super_admin' ? 'super_admin' : 'admin',
            addedByEmail: String(data.addedByEmail || '')
          };
        });
        setAdminsList(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'authorizedAdmins');
      }
    );

    const auditsQuery = query(
      collection(db, 'loginAudits'),
      orderBy('createdAt', 'desc'),
      limit(8)
    );
    const auditsUnsub = onSnapshot(
      auditsQuery,
      (snapshot) => {
        const logs: LoginAuditRecord[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            email: String(data.email || ''),
            displayName: String(data.displayName || ''),
            status: data.status === 'denied' ? 'denied' : 'granted',
            createdAt: data.createdAt || null
          };
        });
        setAuditLogs(logs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'loginAudits');
      }
    );

    return () => {
      adminsUnsub();
      auditsUnsub();
    };
  }, [isSuperAdmin]);

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newAdminEmail.trim().toLowerCase();
    if (!cleaned || !cleaned.includes('@')) {
      setAdminStatusMsg({ type: 'error', text: 'សូមបញ្ចូលអាសយដ្ឋាន Gmail ឱ្យបានត្រឹមត្រូវ។' });
      return;
    }
    if (cleaned.length > 254) {
      setAdminStatusMsg({ type: 'error', text: 'អាសយដ្ឋានអ៊ីមែលវែងពេក។' });
      return;
    }
    if (!auth.currentUser) return;

    setIsAddingAdmin(true);
    setAdminStatusMsg(null);
    const adminDocId = emailToAdminDocId(cleaned);
    try {
      await setDoc(doc(db, 'authorizedAdmins', adminDocId), {
        email: cleaned,
        role: cleaned === SUPER_ADMIN_EMAIL ? 'super_admin' : 'admin',
        addedByUid: auth.currentUser.uid,
        addedByEmail: auth.currentUser.email || SUPER_ADMIN_EMAIL,
        createdAt: serverTimestamp()
      });
      setNewAdminEmail('');
      setAdminStatusMsg({
        type: 'success',
        text: `បានអនុញ្ញាតសិទ្ធិ Admin ជូនគណនី ${cleaned} រួចរាល់!`
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `authorizedAdmins/${adminDocId}`);
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (admin: AdminRecord) => {
    if (admin.email.toLowerCase() === SUPER_ADMIN_EMAIL) return;
    try {
      await deleteDoc(doc(db, 'authorizedAdmins', admin.id));
      setAdminStatusMsg({
        type: 'success',
        text: `បានដកសិទ្ធិ Admin ពីគណនី ${admin.email} រួចរាល់។`
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `authorizedAdmins/${admin.id}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    setBotConfig(formData);

    try {
      const res = await fetch('/api/bot-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: formData.botToken,
          botName: formData.botName,
          supportUsername: formData.supportUsername
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSaveMessage({
          type: 'success',
          text: 'បានរក្សាទុកការកំណត់ និងធ្វើសមកាលកម្ម Short Description ទៅ Telegram Bot រួចរាល់!'
        });
      } else {
        setSaveMessage({
          type: 'error',
          text: data.error || 'បានរក្សាទុកក្នុងផ្ទាំងគ្រប់គ្រង ប៉ុន្តែមិនអាច Sync ទៅ Telegram API បានទេ។'
        });
      }
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'មានបញ្ហាក្នុងការតភ្ជាប់ទៅ Server API។'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult({ status: 'idle' });

    try {
      const res = await fetch('/api/bot-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: formData.botToken })
      });
      const data = await res.json();
      if (res.ok && data.ok && data.bot) {
        setConnectionResult({
          status: 'success',
          detail: `តភ្ជាប់ជោគជ័យ: @${data.bot.username} (ID: ${data.bot.id})`
        });
      } else {
        setConnectionResult({
          status: 'error',
          detail: data.error || 'មិនអាចតភ្ជាប់ទៅ Telegram Bot API បានទេ'
        });
      }
    } catch {
      setConnectionResult({
        status: 'error',
        detail: 'បរាជ័យក្នុងការហៅ /api/bot-test'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">ការកំណត់ Telegram Bot & KHQR</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          គ្រប់គ្រង Bot Token, Welcome Message, និងព័ត៌មានទូទាត់ ACLEDA KHQR
        </p>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm font-medium flex items-center gap-2.5 ${
            saveMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bot Credentials */}
        <div className="lcd-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Key className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Telegram Bot Credentials</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Bot Token</label>
              <input
                type="text"
                name="botToken"
                value={formData.botToken}
                onChange={handleChange}
                required
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Bot Username</label>
              <input
                type="text"
                name="botUsername"
                value={formData.botUsername}
                onChange={handleChange}
                required
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">ឈ្មោះ Bot (Bot Name)</label>
              <input
                type="text"
                name="botName"
                value={formData.botName}
                onChange={handleChange}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Support Telegram</label>
              <input
                type="text"
                name="supportUsername"
                value={formData.supportUsername}
                onChange={handleChange}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Channel Update</label>
              <input
                type="text"
                name="channelUsername"
                value={formData.channelUsername}
                onChange={handleChange}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Welcome Message & Automation */}
        <div className="lcd-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Welcome Message & Auto-Delivery</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Welcome Message (/start)</label>
            <textarea
              name="welcomeMessage"
              rows={4}
              value={formData.welcomeMessage}
              onChange={handleChange}
              className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-[#090d16] border border-white/[0.08] cursor-pointer hover:border-white/20 transition-colors">
              <input
                type="checkbox"
                name="autoDelivery"
                checked={formData.autoDelivery}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-white/20 text-sky-500 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-semibold text-white">Auto-Delivery .mobileconfig</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ផ្ញើឯកសារ .mobileconfig ដោយស្វ័យប្រវត្តិពេល Admin ចុចយល់ព្រម
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl bg-[#090d16] border border-white/[0.08] cursor-pointer hover:border-white/20 transition-colors">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-white/20 text-sky-500 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-semibold text-white">Bot Maintenance Mode</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ផ្អាកការបញ្ជាទិញបណ្តោះអាសន្នដើម្បីជួសជុលប្រព័ន្ធ
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* KHQR Payment Gateway */}
        <div className="lcd-card-emerald rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">ACLEDA KHQR Payment Gateway</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">KHQR Account / Phone</label>
              <input
                type="text"
                name="khqrMerchantId"
                value={formData.khqrMerchantId}
                onChange={handleChange}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">ឈ្មោះគណនី (Merchant Name)</label>
              <input
                type="text"
                name="khqrName"
                value={formData.khqrName}
                onChange={handleChange}
                className="w-full bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Live Telegram API Connection Test */}
        <div className="lcd-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">សាកល្បងតភ្ជាប់ Telegram Bot API (getMe)</h4>
            <p className="text-xs text-slate-400">
              ផ្ទៀងផ្ទាត់ស្ថានភាព Bot Token ផ្ទាល់ជាមួយ Telegram Server
            </p>
            {connectionResult.status === 'success' && (
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{connectionResult.detail}</span>
              </div>
            )}
            {connectionResult.status === 'error' && (
              <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{connectionResult.detail}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isTestingConnection}
            onClick={handleTestConnection}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {isTestingConnection ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>កំពុងសាកល្បង...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test Telegram API</span>
              </>
            )}
          </button>
        </div>

        {/* Update iOS Config Info */}
        <div className="lcd-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Update iOS Config (.mobileconfig) តាម Bot</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              អ្នកអាចផ្ញើឯកសារ .mobileconfig ថ្មីផ្ទាល់ចូលទៅក្នុង @Benzto2_VIP_Bot ក្នុង Telegram នោះប្រព័ន្ធនឹងធ្វើការ Update ស្វ័យប្រវត្តិដោយមិនបាច់កែកូដឡើយ។
            </p>
          </div>
          <a
            href="https://t.me/Benzto2_VIP_Bot"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sky-400 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>បើក @Benzto2_VIP_Bot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>រក្សាទុកការផ្លាស់ប្តូរ</span>
          </button>
        </div>
      </form>

      {/* Admin Gmail Access Control & Login Audit Trail */}
      <div className="lcd-card rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">សិទ្ធិចូលប្រើ Admin តាម Google (Gmail)</h3>
            <VerifiedBadge size="xs" title="Firebase Protected" />
          </div>
          <span className="text-xs font-mono text-slate-400">
            គណនីបច្ចុប្បន្ន: {currentAdminEmail || SUPER_ADMIN_EMAIL}
          </span>
        </div>

        {isSuperAdmin ? (
          <>
            {adminStatusMsg && (
              <div
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                  adminStatusMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {adminStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{adminStatusMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAddAdminEmail} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="បន្ថែម Gmail អ្នកគ្រប់គ្រងផ្សេងទៀត (ឧ. partner@gmail.com)..."
                className="flex-1 bg-[#090d16] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={isAddingAdmin}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {isAddingAdmin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5 text-sky-400" />}
                <span>បន្ថែម Admin Gmail</span>
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Whitelist Column */}
              <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300">បញ្ជី Gmail ដែលមានសិទ្ធិចូល</div>
                <div className="divide-y divide-white/[0.06]">
                  <div className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{SUPER_ADMIN_EMAIL}</span>
                        <VerifiedBadge size="xs" title="Super Admin" />
                      </div>
                      <div className="text-[11px] text-emerald-400">Super Admin (Owner)</div>
                    </div>
                  </div>
                  {adminsList
                    .filter((a) => a.email.toLowerCase() !== SUPER_ADMIN_EMAIL)
                    .map((admin) => (
                      <div key={admin.id} className="py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-mono text-slate-200 truncate">{admin.email}</div>
                          <div className="text-[11px] text-slate-500">Admin</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAdmin(admin)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="ដកសិទ្ធិ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Recent Login Audits Column */}
              <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>ប្រវត្តិការចូលប្រើថ្មីៗ (Login Audit)</span>
                </div>
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-slate-500">មិនទាន់មានទិន្នន័យចូលប្រើនៅឡើយទេ។</p>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-mono text-slate-200 truncate">{log.email}</div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {log.displayName}
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-mono font-medium shrink-0 ${
                            log.status === 'granted' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {log.status === 'granted' ? 'Granted' : 'Denied'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400 leading-relaxed">
            អ្នកកំពុងប្រើប្រាស់គណនី Admin ដែលបានអនុញ្ញាត។ មានតែ Super Admin ({SUPER_ADMIN_EMAIL}) ប៉ុណ្ណោះទើបអាចបន្ថែម ឬដកសិទ្ធិ Admin Gmail ផ្សេងទៀតបាន។
          </p>
        )}
      </div>
    </div>
  );
};
