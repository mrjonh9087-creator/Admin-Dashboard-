import React, { useState } from 'react';
import { VerifiedBadge } from './VerifiedBadge';
import {
  GameMod,
  SoldFileRecord,
  Order,
  KnownTelegramUser,
  NextDnsProfile
} from '../types';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  ArrowUpRight,
  ShieldBan,
  Download,
  Loader2,
  Flame
} from 'lucide-react';

interface DashboardTabProps {
  mods: GameMod[];
  soldFiles: SoldFileRecord[];
  orders: Order[];
  profiles: NextDnsProfile[];
  knownUsers?: KnownTelegramUser[];
  currency: 'USD' | 'KHR';
  onApproveOrder: (orderId: string, overrideChatId?: string) => void | Promise<void>;
  onRejectOrder: (orderId: string) => void;
  onRevokeProfile: (target: string) => void | Promise<void>;
  approvingOrderId?: string | null;
  revokingTarget?: string | null;
  setActiveTab: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  mods,
  soldFiles,
  orders,
  profiles,
  knownUsers = [],
  currency,
  onApproveOrder,
  onRejectOrder,
  onRevokeProfile,
  approvingOrderId,
  revokingTarget,
  setActiveTab
}) => {
  const [chatIdOverrides, setChatIdOverrides] = useState<Record<string, string>>({});
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenueUSD = completedOrders.reduce((sum, o) => sum + o.amountUSD, 0);
  const totalRevenueKHR = completedOrders.reduce((sum, o) => sum + o.amountKHR, 0);
  const activeProfilesCount = profiles.filter((p) => !p.revoked).length;

  // Build product revenue breakdown for clean visual bar chart
  const lifetimeCount = completedOrders.filter((o) =>
    o.modId === 'mod-ios-1device' || o.modName.toLowerCase().includes('1 device')
  ).length;
  const smoothCount = Math.max(0, completedOrders.length - lifetimeCount);
  const maxBar = Math.max(1, lifetimeCount, smoothCount, pendingOrders.length);

  return (
    <div className="space-y-6">
      {/* 50% Active Promotion Notification Strip */}
      <div className="lcd-card-amber rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-sky-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>យុទ្ធនាការប្រូម៉ូសិន 50% លើគ្រប់ VPN (Flash Promo 50% Active)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-300 border border-rose-500/40">
                -50% ALL VPN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              កំពុងបញ្ចុះតម្លៃ 50% លើគ្រប់កញ្ចប់ iOS VPN & NextDNS (Lifetime: $5.00 | Smooth VIP: $2.50) និង Sync ជាមួយ @Benzto2_VIP_Bot រួចរាល់!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('mods')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs transition-colors shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
        >
          <span>គ្រប់គ្រងតម្លៃ VPN</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4-Column LCD KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="lcd-card rounded-2xl p-5">
          <div className="text-xs font-medium text-cyan-300/80">ចំណូលសរុប (Completed Revenue)</div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums lcd-readout">
            {currency === 'USD'
              ? `$${totalRevenueUSD.toFixed(2)}`
              : `${totalRevenueKHR.toLocaleString()} ៛`}
          </div>
          <div className="mt-2 text-xs text-slate-400 tabular-nums">
            {completedOrders.length} ប្រតិបត្តិការជោគជ័យ
          </div>
        </div>

        <div className="lcd-card lcd-card-amber rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-300/85">រង់ចាំអនុម័ត (Pending KHQR)</span>
            {pendingOrders.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-0.5 whitespace-nowrap"
              >
                <span>ពិនិត្យ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-300 font-mono tabular-nums lcd-readout-amber">
            {pendingOrders.length}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            ត្រូវផ្ទៀងផ្ទាត់ Slip មុនផ្ញើ .mobileconfig
          </div>
        </div>

        <div className="lcd-card lcd-card-emerald rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-300/85">NextDNS Profiles សកម្ម</span>
            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-0.5 whitespace-nowrap"
            >
              <span>គ្រប់គ្រង</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-300 font-mono tabular-nums lcd-readout-emerald">
            {activeProfilesCount}
          </div>
          <div className="mt-2 text-xs text-slate-400 tabular-nums">
            {profiles.length} Profiles សរុប · {soldFiles.length} Files បានផ្ញើ
          </div>
        </div>

        <div className="lcd-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-300/80">អ្នកប្រើ Bot ផ្ទាល់ (Synced Users)</span>
            <VerifiedBadge size="xs" title="Telegram Bot Connected" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-cyan-300 font-mono tabular-nums lcd-readout">
            {knownUsers.length}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-mono truncate">
            @Benzto2_VIP_Bot · Polling Active
          </div>
        </div>
      </div>

      {/* Main Split: Pending Queue + Analytics / Banner Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Orders Operations Table */}
        <div className="xl:col-span-8 lcd-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-cyan-400/15 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">ការបញ្ជាទិញថ្មីៗ និងការអនុម័តភ្លាមៗ</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                ចុច «យល់ព្រម» ដើម្បីបង្កើត Profile, Download .mobileconfig និងផ្ញើទៅ Telegram ស្វ័យប្រវត្តិ
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 whitespace-nowrap shrink-0"
            >
              មើលទាំងអស់ ({orders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-xs font-medium text-slate-400 border-b border-white/[0.06]">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-4 py-3">អតិថិជន / Chat ID</th>
                  <th className="px-4 py-3">កញ្ចប់</th>
                  <th className="px-4 py-3 text-right">តម្លៃ</th>
                  <th className="px-4 py-3">ស្ថានភាព</th>
                  <th className="px-5 py-3 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {orders.slice(0, 6).map((order) => {
                  const isApproving = approvingOrderId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-mono text-xs font-semibold text-sky-400 tabular-nums">
                          {order.id}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 tabular-nums">
                          {order.createdAt}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <div className="font-semibold text-white text-sm">{order.customerName}</div>
                        <div className="text-xs text-slate-400 font-mono">{order.customerTelegram}</div>
                        {order.customerChatId ? (
                          <div className="text-[11px] font-mono text-emerald-400 mt-1 tabular-nums">
                            Telegram ID: {order.customerChatId}
                          </div>
                        ) : order.status === 'pending' ? (
                          <div className="mt-1.5 space-y-1">
                            {knownUsers.length > 0 && (
                              <select
                                value={chatIdOverrides[order.id] || ''}
                                onChange={(e) =>
                                  setChatIdOverrides((prev) => ({ ...prev, [order.id]: e.target.value }))
                                }
                                className="w-40 bg-[#090d16] border border-white/[0.12] rounded-lg px-2 py-1 text-[11px] font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                              >
                                <option value="">ជ្រើសអ្នកប្រើ Bot</option>
                                {knownUsers.map((u) => (
                                  <option key={u.chatId} value={u.chatId}>
                                    {u.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            <input
                              type="text"
                              placeholder="Chat ID (ឧ. 8974773472)"
                              value={chatIdOverrides[order.id] || ''}
                              onChange={(e) =>
                                setChatIdOverrides((prev) => ({ ...prev, [order.id]: e.target.value }))
                              }
                              className="w-40 bg-[#090d16] border border-white/[0.12] rounded-lg px-2 py-1 text-[11px] font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 block"
                            />
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-3.5 align-top">
                        <div className="text-xs font-medium text-slate-200 max-w-[180px] truncate">
                          {order.modName}
                        </div>
                        {order.receiptImage && (
                          <button
                            type="button"
                            onClick={() => setSelectedReceipt(order.receiptImage || null)}
                            className="mt-1 inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            <span>មើល Slip KHQR</span>
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-3.5 align-top text-right font-mono text-xs font-bold text-white tabular-nums whitespace-nowrap">
                        {currency === 'USD'
                          ? `$${order.amountUSD.toFixed(2)}`
                          : `${order.amountKHR.toLocaleString()} ៛`}
                      </td>

                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        {order.status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>បានផ្ញើ File</span>
                          </span>
                        )}
                        {order.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>រង់ចាំអនុម័ត</span>
                          </span>
                        )}
                        {order.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>បដិសេធ</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 align-top text-right whitespace-nowrap">
                        {order.status === 'pending' ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isApproving}
                              onClick={() => onApproveOrder(order.id, chatIdOverrides[order.id])}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
                            >
                              {isApproving ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              <span>{isApproving ? 'កំពុងផ្ញើ...' : 'យល់ព្រម'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={isApproving}
                              onClick={() => onRejectOrder(order.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>បដិសេធ</span>
                            </button>
                          </div>
                        ) : order.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                            <VerifiedBadge size="xs" title="Verified & Delivered" />
                            <span>
                              {order.nextDnsProfileId ? `ID: ${order.nextDnsProfileId}` : order.generatedFileName || '.mobileconfig'}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                      មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ — សូមសាកល្បងបញ្ជាទិញក្នុង @Benzto2_VIP_Bot
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 cols: Analytics + NextDNS Anti-Share + Store Banner */}
        <div className="xl:col-span-4 space-y-6">
          {/* Distribution Breakdown */}
          <div className="lcd-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">ស្ថិតិកញ្ចប់លក់ដាច់ (Sales Mix)</h3>
              <span className="text-xs font-mono text-cyan-300/80 tabular-nums">
                {orders.length} Orders
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300">Lifetime 1 Device ($10)</span>
                  <span className="font-mono font-semibold text-white tabular-nums">{lifetimeCount}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(8, (lifetimeCount / maxBar) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300">iOS Smooth VIP ($5)</span>
                  <span className="font-mono font-semibold text-white tabular-nums">{smoothCount}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(52,211,153,0.45)] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(8, (smoothCount / maxBar) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-slate-300">រង់ចាំអនុម័ត (Pending)</span>
                  <span className="font-mono font-semibold text-amber-400 tabular-nums">{pendingOrders.length}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.45)] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(6, (pendingOrders.length / maxBar) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live NextDNS Anti-Share Profiles */}
          <div className="lcd-card lcd-card-emerald rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">NextDNS Anti-Share</h3>
              <button
                type="button"
                onClick={() => setActiveTab('files')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                ទាំងអស់
              </button>
            </div>

            {profiles.length > 0 ? (
              <div className="divide-y divide-white/[0.06]">
                {profiles.slice(0, 4).map((prof, idx) => (
                  <div key={`${prof.profileId}-${prof.orderId || idx}-${prof.createdAt || idx}`} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-semibold text-white truncate">
                        {prof.profileId}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {prof.username} · {prof.revoked ? 'Revoked' : 'Active (1 Device)'}
                      </div>
                    </div>
                    {!prof.revoked ? (
                      <button
                        type="button"
                        disabled={revokingTarget === prof.profileId}
                        onClick={() => onRevokeProfile(prof.profileId)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/12 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold transition-colors shrink-0"
                      >
                        <ShieldBan className="w-3 h-3" />
                        <span>{revokingTarget === prof.profileId ? '...' : 'Revoke'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-rose-400 shrink-0">Disabled</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">
                មិនទាន់មាន NextDNS Profile ដែលបានបង្កើតនៅឡើយទេ។
              </p>
            )}
          </div>

          {/* Official Payment KHQR & Brand Assets Card */}
          <div className="lcd-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 border-b border-cyan-400/15">
              <button
                type="button"
                onClick={() => setSelectedReceipt('/assets/aistudio/IMG_3205_226e989d.jpeg')}
                className="col-span-5 relative bg-[#090d16] border-r border-cyan-400/15 group overflow-hidden text-left"
                title="ចុចដើម្បីពង្រីក KHQR"
              >
                <img
                  src="/assets/aistudio/IMG_3205_226e989d.jpeg"
                  alt="Benzto2 KHQR"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-2.5 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white">BENZTO2 KHQR</span>
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </button>
              <div className="col-span-7 relative bg-[#090d16] overflow-hidden">
                <img
                  src="/assets/aistudio/IMG_3173_e32561b0.jpeg"
                  alt="Benzto2 VIP Official Banner"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>
            </div>

            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">ACLEDA KHQR Payment</span>
                  <VerifiedBadge size="xs" title="Official Verified Merchant" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  CHHEAN SITRA · 012 *** 220
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedReceipt('/assets/aistudio/IMG_3205_226e989d.jpeg')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-semibold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>KHQR</span>
                </button>
                <a
                  href="/Benzto2_VIP_Smooth.mobileconfig"
                  download
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slip Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#111827] border border-white/[0.1] rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">វិក្កយបត្រទូទាត់ប្រាក់ (KHQR Slip)</h3>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#090d16] border border-white/[0.08] flex items-center justify-center max-h-[420px]">
              <img
                src={selectedReceipt}
                alt="Payment Slip"
                referrerPolicy="no-referrer"
                className="max-h-[400px] object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors"
            >
              បិទផ្ទាំងនេះ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
