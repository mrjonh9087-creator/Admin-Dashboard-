/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  emailToAdminDocId,
  handleFirestoreError,
  OperationType,
  SUPER_ADMIN_EMAIL
} from './firebase';
import { initialGameMods, initialSoldFiles, initialOrders, initialBotConfig } from './data/mockData';
import {
  GameMod,
  SoldFileRecord,
  Order,
  BotConfig,
  KnownTelegramUser,
  NextDnsProfile
} from './types';
import { Sidebar, TopBar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { ModsTab } from './components/ModsTab';
import { FilesTab } from './components/FilesTab';
import { OrdersTab } from './components/OrdersTab';
import { BotConfigTab } from './components/BotConfigTab';
import { BroadcastTab } from './components/BroadcastTab';
import { BotSimulatorModal } from './components/BotSimulatorModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginScreen } from './components/LoginScreen';
import { CheckCircle2, AlertTriangle, X, Loader2 } from 'lucide-react';

function buildFallbackMobileConfigXml(modName: string, idTag: string): string {
  const safeId = idTag.replace(/[^a-zA-Z0-9_-]/g, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>PayloadContent</key>
\t<array>
\t\t<dict>
\t\t\t<key>DNSSettings</key>
\t\t\t<dict>
\t\t\t\t<key>DNSProtocol</key>
\t\t\t\t<string>HTTPS</string>
\t\t\t\t<key>ServerAddresses</key>
\t\t\t\t<array>
\t\t\t\t\t<string>45.90.28.0</string>
\t\t\t\t\t<string>45.90.30.0</string>
\t\t\t\t</array>
\t\t\t\t<key>ServerURL</key>
\t\t\t\t<string>https://dns.nextdns.io/${safeId}/VIP_1Device</string>
\t\t\t</dict>
\t\t\t<key>OnDemandRules</key>
\t\t\t<array>
\t\t\t\t<dict>
\t\t\t\t\t<key>Action</key>
\t\t\t\t\t<string>Connect</string>
\t\t\t\t</dict>
\t\t\t</array>
\t\t\t<key>PayloadDescription</key>
\t\t\t<string>Low-Latency Gaming &amp; Fast Network DNS</string>
\t\t\t<key>PayloadDisplayName</key>
\t\t\t<string>${modName}</string>
\t\t\t<key>PayloadIdentifier</key>
\t\t\t<string>com.benzto2.dnsSettings.managed.${safeId}</string>
\t\t\t<key>PayloadOrganization</key>
\t\t\t<string>Benzto2 VIP</string>
\t\t\t<key>PayloadType</key>
\t\t\t<string>com.apple.dnsSettings.managed</string>
\t\t\t<key>PayloadUUID</key>
\t\t\t<string>A6C06555-7F82-40CC-9507-2518A95217EA</string>
\t\t\t<key>PayloadVersion</key>
\t\t\t<integer>1</integer>
\t\t</dict>
\t</array>
\t<key>PayloadDescription</key>
\t<string>Benzto2 VIP iOS Smooth &amp; Low Ping Profile</string>
\t<key>PayloadDisplayName</key>
\t<string>${modName}</string>
\t<key>PayloadIdentifier</key>
\t<string>com.benzto2.apple-dns-${safeId}</string>
\t<key>PayloadOrganization</key>
\t<string>Benzto2 VIP</string>
\t<key>PayloadScope</key>
\t<string>User</string>
\t<key>PayloadType</key>
\t<string>Configuration</string>
\t<key>PayloadUUID</key>
\t<string>2F2B145E-24B5-4AAA-ACA1-623E73361AAE</string>
\t<key>PayloadVersion</key>
\t<integer>1</integer>
</dict>
</plist>`;
}

export function triggerBlobDownload(xmlContent: string, fileName: string) {
  const blob = new Blob([xmlContent], { type: 'application/x-apple-aspen-config' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
}

function formatAuthErrorKhmer(err: any): string {
  const code = String(err?.code || '');
  if (code === 'auth/popup-closed-by-user') {
    return 'អ្នកបានបិទផ្ទាំងចូលគណនី Google មុនពេលបញ្ចប់។ សូមព្យាយាមម្តងទៀត។';
  }
  if (code === 'auth/popup-blocked') {
    return 'Browser បានបិទផ្ទាំង Popup។ សូមអនុញ្ញាត Popup សម្រាប់គេហទំព័រនេះជាមុនសិន។';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Domain នេះមិនទាន់ត្រូវបានអនុញ្ញាតក្នុង Firebase Authentication ទេ។';
  }
  if (code === 'auth/network-request-failed') {
    return 'មានបញ្ហាការតភ្ជាប់អ៊ីនធឺណិត សូមពិនិត្យបណ្តាញរបស់អ្នកម្តងទៀត។';
  }
  return err?.message || 'មិនអាចចូលប្រើដោយគណនី Google បានទេ។';
}

export default function App() {
  // Authentication state
  const [authReady, setAuthReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);
  const auditedUidRef = useRef<string | null>(null);

  // Dashboard navigation & display state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Main state
  const [mods, setMods] = useState<GameMod[]>(initialGameMods);
  const [soldFiles, setSoldFiles] = useState<SoldFileRecord[]>(initialSoldFiles);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [profiles, setProfiles] = useState<NextDnsProfile[]>([]);
  const [knownUsers, setKnownUsers] = useState<KnownTelegramUser[]>([]);
  const [botConfig, setBotConfig] = useState<BotConfig>(initialBotConfig);

  const [approvingOrderId, setApprovingOrderId] = useState<string | null>(null);
  const [resendingOrderId, setResendingOrderId] = useState<string | null>(null);
  const [revokingTarget, setRevokingTarget] = useState<string | null>(null);

  const [approvalBanner, setApprovalBanner] = useState<{
    type: 'success' | 'warning';
    title: string;
    detail: string;
  } | null>(null);

  // Modals
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Firebase Auth listener + Firestore user profile & admin allowlist check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFirebaseUser(null);
        setIsAuthorizedAdmin(false);
        setDeniedEmail(null);
        auditedUidRef.current = null;
        setAuthReady(true);
        return;
      }

      const email = (user.email || '').trim().toLowerCase();
      if (!email || !user.emailVerified) {
        setFirebaseUser(user);
        setIsAuthorizedAdmin(false);
        setDeniedEmail(email || 'Unverified Account');
        setAuthReady(true);
        return;
      }

      const displayName = (user.displayName || email.split('@')[0] || 'Admin').slice(0, 120);
      const safePhotoUrl = user.photoURL ? user.photoURL.slice(0, 500) : '';

      // 1. Sync user profile in Firestore (/users/{uid})
      const userDocRef = doc(db, 'users', user.uid);
      try {
        const existingSnap = await getDoc(userDocRef);
        if (!existingSnap.exists()) {
          const payload: Record<string, unknown> = {
            uid: user.uid,
            email,
            displayName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          if (safePhotoUrl) payload.photoURL = safePhotoUrl;
          await setDoc(userDocRef, payload);
        } else {
          const updatePayload: Record<string, unknown> = {
            displayName,
            updatedAt: serverTimestamp()
          };
          if (safePhotoUrl) updatePayload.photoURL = safePhotoUrl;
          await updateDoc(userDocRef, updatePayload);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      // 2. Check Admin authorization (Super Admin OR allowlisted in /authorizedAdmins)
      let authorized = email === SUPER_ADMIN_EMAIL;
      if (!authorized) {
        const adminDocId = emailToAdminDocId(email);
        try {
          const adminSnap = await getDoc(doc(db, 'authorizedAdmins', adminDocId));
          if (adminSnap.exists() && String(adminSnap.data()?.email || '').toLowerCase() === email) {
            authorized = true;
          }
        } catch {
          // Non-allowlisted user hits permission-denied on non-existent doc -> treat as unauthorized
          authorized = false;
        }
      }

      // 3. Record login audit event once per signed-in session
      if (auditedUidRef.current !== user.uid) {
        auditedUidRef.current = user.uid;
        const auditId = `audit_${user.uid}_${Date.now()}`;
        try {
          await setDoc(doc(db, 'loginAudits', auditId), {
            uid: user.uid,
            email,
            displayName,
            status: authorized ? 'granted' : 'denied',
            createdAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `loginAudits/${auditId}`);
        }
      }

      setFirebaseUser(user);
      setIsAuthorizedAdmin(authorized);
      setDeniedEmail(authorized ? null : email);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(formatAuthErrorKhmer(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signOut(auth);
      setMobileNavOpen(false);
    } catch (err) {
      setAuthError(formatAuthErrorKhmer(err));
    } finally {
      setAuthLoading(false);
    }
  };

  // Sync live Telegram orders, profiles, and users from backend ONLY when authenticated
  const syncLiveOrders = useCallback(async () => {
    if (!authReady || !firebaseUser || !isAuthorizedAdmin) return;
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.knownUsers)) {
        setKnownUsers(data.knownUsers);
      }
      if (Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
      }
      if (Array.isArray(data.orders) && data.orders.length > 0) {
        setOrders((prev) => {
          const liveIds = new Set(data.orders.map((o: Order) => o.id));
          const remainingLocal = prev.filter((o) => !liveIds.has(o.id));
          return [...data.orders, ...remainingLocal];
        });
      }
    } catch {}
  }, [authReady, firebaseUser, isAuthorizedAdmin]);

  useEffect(() => {
    if (!authReady || !firebaseUser || !isAuthorizedAdmin) return;
    syncLiveOrders();
    const timer = setInterval(syncLiveOrders, 5000);
    return () => clearInterval(timer);
  }, [authReady, firebaseUser, isAuthorizedAdmin, syncLiveOrders]);

  // Order approval handler: generates .mobileconfig Blob download + calls Telegram Bot API sendDocument
  const handleApproveOrder = async (orderId: string, overrideChatId?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === 'completed' || approvingOrderId) return;

    setApprovingOrderId(orderId);
    const mod = mods.find((m) => m.id === order.modId);
    const fallbackFileName = mod?.fileName || 'Benzto2_VIP_Smooth.mobileconfig';
    const targetChatId = overrideChatId?.trim() || order.customerChatId;

    let finalFileName = fallbackFileName;
    let finalXml = '';
    let profileId: string | undefined;
    let telegramSent = false;
    let telegramError: string | undefined;

    try {
      const res = await fetch('/api/orders/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          modId: order.modId,
          modName: order.modName,
          customerName: order.customerName,
          customerTelegram: order.customerTelegram,
          customerChatId: targetChatId,
          botToken: botConfig.botToken
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        finalFileName = data.fileName || fallbackFileName;
        finalXml = data.xmlContent || buildFallbackMobileConfigXml(order.modName, order.id);
        profileId = data.profileId;
        telegramSent = Boolean(data.telegramSent);
        telegramError = data.telegramError;
      } else {
        finalXml = buildFallbackMobileConfigXml(order.modName, order.id);
        telegramError = data.error || 'Server approval failed';
      }
    } catch (err: any) {
      finalXml = buildFallbackMobileConfigXml(order.modName, order.id);
      telegramError = err?.message || 'Network error';
    }

    // 1. Generate & download real .mobileconfig file via JavaScript Blob immediately
    triggerBlobDownload(finalXml, finalFileName);

    // 2. Update local dashboard state
    const blobDownloadUrl = mod?.downloadUrl || `/${finalFileName}`;
    const now = new Date();
    const newRecord: SoldFileRecord = {
      id: `file-rec-${Date.now()}`,
      modId: order.modId,
      modName: order.modName,
      downloadUrl: blobDownloadUrl,
      fileName: finalFileName,
      customerTelegram: order.customerTelegram,
      customerName: order.customerName,
      customerChatId: targetChatId,
      nextDnsProfileId: profileId,
      status: 'delivered',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16)
    };

    setSoldFiles((prev) => [newRecord, ...prev]);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              customerChatId: targetChatId || o.customerChatId,
              downloadUrlAssigned: blobDownloadUrl,
              nextDnsProfileId: profileId,
              generatedFileName: finalFileName
            }
          : o
      )
    );

    await syncLiveOrders();

    setApprovalBanner({
      type: telegramSent ? 'success' : 'warning',
      title: telegramSent
        ? `បានបង្កើត File "${finalFileName}" និងផ្ញើទៅ Telegram ជោគជ័យ!`
        : `បានបង្កើត & Download File "${finalFileName}" ចូលម៉ាស៊ីនរួចរាល់!`,
      detail: telegramSent
        ? `បានផ្ញើតាម Telegram sendDocument ទៅកាន់ Chat ID: ${targetChatId}${profileId ? ` · NextDNS ID: ${profileId}` : ''}`
        : `ចំណាំ Telegram: ${telegramError || 'មិនទាន់មាន Chat ID របស់អតិថិជនទេ — សូមបញ្ចូល Chat ID ឬឱ្យអតិថិជនចុច /start ក្នុង Bot ផ្ទាល់។'}`
    });

    setApprovingOrderId(null);
  };

  const handleRejectOrder = async (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'rejected' } : o)));
    try {
      await fetch('/api/orders/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
    } catch {}
  };

  const handleResendOrder = async (order: Order, overrideChatId?: string) => {
    const targetChatId = overrideChatId?.trim() || order.customerChatId;
    setResendingOrderId(order.id);
    try {
      const res = await fetch('/api/orders/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customerChatId: targetChatId,
          botToken: botConfig.botToken
        })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setApprovalBanner({
          type: 'success',
          title: `បានផ្ញើ File "${data.fileName}" ជូនអតិថិជនម្តងទៀតជោគជ័យ!`,
          detail: `Chat ID: ${data.chatId} · វិក្កយបត្រ #${order.id}`
        });
      } else {
        setApprovalBanner({
          type: 'warning',
          title: 'មិនអាចផ្ញើ File ឡើងវិញបានទេ',
          detail: data.error || 'សូមពិនិត្យ Chat ID របស់អតិថិជនម្តងទៀត។'
        });
      }
    } catch {
      setApprovalBanner({
        type: 'warning',
        title: 'មានបញ្ហាក្នុងការផ្ញើ File ឡើងវិញ',
        detail: 'មិនអាចតភ្ជាប់ទៅកាន់ Server API បានទេ។'
      });
    } finally {
      setResendingOrderId(null);
    }
  };

  const handleRevokeProfile = async (target: string) => {
    const trimmed = target.trim();
    if (!trimmed) return;
    setRevokingTarget(trimmed);
    try {
      const res = await fetch('/api/profiles/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: trimmed })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setProfiles((prev) =>
          prev.map((p) =>
            p.profileId === trimmed ||
            p.userId === trimmed ||
            p.username.toLowerCase() === trimmed.toLowerCase()
              ? { ...p, revoked: true }
              : p
          )
        );
        await syncLiveOrders();
        setApprovalBanner({
          type: 'success',
          title: `បានដកសិទ្ធិ (Revoke) NextDNS Profile "${trimmed}" រួចរាល់!`,
          detail: data.message || 'គណនីនេះត្រូវបានបិទសិទ្ធិប្រើប្រាស់ក្នុងប្រព័ន្ធ។'
        });
      } else {
        setApprovalBanner({
          type: 'warning',
          title: `មិនអាចដកសិទ្ធិ "${trimmed}" បានទេ`,
          detail: data.message || data.error || 'រកមិនឃើញ Profile ឬ @username នេះក្នុងប្រព័ន្ធទេ។'
        });
      }
    } catch {
      setApprovalBanner({
        type: 'warning',
        title: 'មានបញ្ហាក្នុងការដកសិទ្ធិ Profile',
        detail: 'មិនអាចតភ្ជាប់ទៅកាន់ Server API បានទេ។'
      });
    } finally {
      setRevokingTarget(null);
    }
  };

  const handleDownloadOrderFile = (order: Order) => {
    const fileName =
      order.generatedFileName ||
      mods.find((m) => m.id === order.modId)?.fileName ||
      'Benzto2_VIP_Smooth.mobileconfig';
    const xml = buildFallbackMobileConfigXml(order.modName, order.nextDnsProfileId || order.id);
    triggerBlobDownload(xml, fileName);
  };

  // Loading state while Firebase Auth resolves initial session
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
          <p className="text-xs font-medium text-slate-400">
            កំពុងផ្ទៀងផ្ទាត់សម័យប្រើប្រាស់...
          </p>
        </div>
      </div>
    );
  }

  // Gate Admin Dashboard behind verified Google / Gmail authentication & allowlist
  if (!firebaseUser || !isAuthorizedAdmin) {
    return (
      <LoginScreen
        onGoogleLogin={handleGoogleLogin}
        onSwitchAccount={handleSignOut}
        isLoading={authLoading}
        error={authError}
        deniedEmail={deniedEmail}
      />
    );
  }

  const isSuperAdmin = (firebaseUser.email || '').trim().toLowerCase() === SUPER_ADMIN_EMAIL;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const activeProfilesCount = profiles.filter((p) => !p.revoked).length;

  return (
    <div className="min-h-screen lcd-ambient-bg text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex">
      {/* Persistent SaaS Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        activeProfilesCount={activeProfilesCount}
        currency={currency}
        setCurrency={setCurrency}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        adminUser={{
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL,
          isSuperAdmin
        }}
        onSignOut={handleSignOut}
      />

      {/* Right Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeTab={activeTab}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
          {approvalBanner && (
            <div
              className={`mb-6 p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                approvalBanner.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {approvalBanner.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">{approvalBanner.title}</div>
                  <div className="text-xs opacity-90 mt-0.5">{approvalBanner.detail}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApprovalBanner(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab
              mods={mods}
              soldFiles={soldFiles}
              orders={orders}
              profiles={profiles}
              knownUsers={knownUsers}
              currency={currency}
              onApproveOrder={handleApproveOrder}
              onRejectOrder={handleRejectOrder}
              onRevokeProfile={handleRevokeProfile}
              approvingOrderId={approvingOrderId}
              revokingTarget={revokingTarget}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'mods' && (
            <ModsTab mods={mods} setMods={setMods} currency={currency} />
          )}

          {activeTab === 'files' && (
            <FilesTab
              soldFiles={soldFiles}
              setSoldFiles={setSoldFiles}
              mods={mods}
              profiles={profiles}
              onRevokeProfile={handleRevokeProfile}
              revokingTarget={revokingTarget}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              knownUsers={knownUsers}
              onApproveOrder={handleApproveOrder}
              onRejectOrder={handleRejectOrder}
              onResendOrder={handleResendOrder}
              onDownloadOrderFile={handleDownloadOrderFile}
              approvingOrderId={approvingOrderId}
              resendingOrderId={resendingOrderId}
              currency={currency}
            />
          )}

          {activeTab === 'botconfig' && (
            <BotConfigTab
              botConfig={botConfig}
              setBotConfig={setBotConfig}
              isSuperAdmin={isSuperAdmin}
              currentAdminEmail={firebaseUser.email || ''}
            />
          )}

          {activeTab === 'broadcast' && <BroadcastTab knownUsers={knownUsers} />}
        </main>
      </div>

      {/* Telegram Bot Chat Simulator Modal */}
      <BotSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        botConfig={botConfig}
        mods={mods}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
