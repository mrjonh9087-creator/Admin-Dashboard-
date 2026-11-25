import React, { useState } from 'react';
import { Order, KnownTelegramUser } from '../types';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  Download,
  Loader2,
  Search,
  Send,
  QrCode
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface OrdersTabProps {
  orders: Order[];
  knownUsers?: KnownTelegramUser[];
  onApproveOrder: (orderId: string, overrideChatId?: string) => void | Promise<void>;
  onRejectOrder: (orderId: string) => void;
  onResendOrder: (order: Order, overrideChatId?: string) => void | Promise<void>;
  onDownloadOrderFile: (order: Order) => void;
  approvingOrderId: string | null;
  resendingOrderId?: string | null;
  currency: 'USD' | 'KHR';
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  knownUsers = [],
  onApproveOrder,
  onRejectOrder,
  onResendOrder,
  onDownloadOrderFile,
  approvingOrderId,
  resendingOrderId,
  currency
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [chatIdOverrides, setChatIdOverrides] = useState<Record<string, string>>({});

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerTelegram.toLowerCase().includes(q) ||
      o.modName.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">ការបញ្ជាទិញ & ការផ្ទៀងផ្ទាត់ KHQR</h2>
          <p className="text-xs text-slate-400 mt-1">
            ផ្ទៀងផ្ទាត់វិក្កយបត្រ ACLEDA KHQR បង្កើត .mobileconfig និងផ្ញើទៅ Telegram Chat ដោយផ្ទាល់
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedReceipt('/assets/aistudio/IMG_3205_226e989d.jpeg')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-white/[0.06] border border-white/[0.1] text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4 text-sky-400" />
          <span>មើល BENZTO2 KHQR</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="lcd-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="ស្វែងរក Order ID, ឈ្មោះ ឬ Telegram..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#070b14] border border-sky-400/20 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="inline-flex items-center p-1 rounded-xl bg-[#070b14] border border-sky-400/20 self-start sm:self-auto">
          {[
            { id: 'all', label: 'ទាំងអស់' },
            { id: 'pending', label: 'រង់ចាំ' },
            { id: 'completed', label: 'បានទូទាត់' },
            { id: 'rejected', label: 'បដិសេធ' }
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                filterStatus === st.id
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.45)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Ledger Table */}
      <div className="lcd-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-xs font-medium text-slate-400 border-b border-white/[0.08]">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">អតិថិជន & Chat ID</th>
                <th className="px-4 py-3.5">កញ្ចប់ .mobileconfig</th>
                <th className="px-4 py-3.5 text-right">ទឹកប្រាក់</th>
                <th className="px-4 py-3.5">វិក្កយបត្រ Slip</th>
                <th className="px-4 py-3.5">ស្ថានភាព</th>
                <th className="px-5 py-3.5 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredOrders.map((order) => {
                const isApproving = approvingOrderId === order.id;
                const isResending = resendingOrderId === order.id;
                return (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 align-top">
                      <div className="font-mono text-xs font-bold text-sky-400 tabular-nums">{order.id}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5 tabular-nums">{order.createdAt}</div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-xs font-mono text-slate-400">{order.customerTelegram}</div>
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
                              className="w-44 bg-[#090d16] border border-white/[0.12] rounded-lg px-2 py-1 text-[11px] font-mono text-sky-300 focus:outline-none focus:border-sky-500"
                            >
                              <option value="">-- ជ្រើសអ្នកប្រើ Bot --</option>
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
                            className="w-44 bg-[#090d16] border border-white/[0.12] rounded-lg px-2 py-1 text-[11px] font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 block"
                          />
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">Demo Order</div>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="text-xs font-medium text-slate-200 max-w-[210px] truncate">{order.modName}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{order.paymentMethod}</div>
                    </td>

                    <td className="px-4 py-4 align-top text-right font-mono text-xs font-bold text-white tabular-nums whitespace-nowrap">
                      {currency === 'USD'
                        ? `$${order.amountUSD.toFixed(2)}`
                        : `${order.amountKHR.toLocaleString()} ៛`}
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      {order.receiptImage ? (
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(order.receiptImage || null)}
                          className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>មើល Slip</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">រង់ចាំ Slip</span>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top whitespace-nowrap">
                      {order.status === 'completed' && (
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>បានទូទាត់</span>
                            <VerifiedBadge size="xs" title="Verified Paid" />
                          </span>
                          {order.nextDnsProfileId && (
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {order.nextDnsProfileId}
                            </div>
                          )}
                        </div>
                      )}
                      {order.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>រង់ចាំផ្ទៀងផ្ទាត់</span>
                        </span>
                      )}
                      {order.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>បដិសេធ</span>
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
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
                            <span>{isApproving ? 'កំពុងបង្កើត...' : 'យល់ព្រម & ផ្ញើ File'}</span>
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
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onDownloadOrderFile(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-mono font-medium transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-sky-400" />
                            <span>.mobileconfig</span>
                          </button>
                          {order.customerChatId && (
                            <button
                              type="button"
                              disabled={isResending}
                              onClick={() => onResendOrder(order)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-semibold transition-colors"
                              title="ផ្ញើទៅ Telegram ម្តងទៀត"
                            >
                              {isResending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                              <span>ផ្ញើម្តងទៀត</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Rejected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                    រកមិនឃើញការបញ្ជាទិញដែលត្រូវគ្នាទេ។
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt / Official KHQR Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="lcd-card rounded-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>
                  {selectedReceipt.includes('IMG_3205')
                    ? 'BENZTO2 Official KHQR'
                    : 'វិក្កយបត្រទូទាត់ប្រាក់ (Payment Slip)'}
                </span>
                {selectedReceipt.includes('IMG_3205') && (
                  <VerifiedBadge size="sm" title="Verified Merchant" />
                )}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#090d16] border border-white/[0.08] flex items-center justify-center max-h-[440px]">
              <img
                src={selectedReceipt}
                alt="Payment Receipt"
                referrerPolicy="no-referrer"
                className="max-h-[420px] w-full object-contain"
              />
            </div>
            {selectedReceipt.includes('IMG_3205') && (
              <div className="bg-[#090d16] border border-white/[0.08] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">ACLEDA Bank</span>
                <span className="font-mono text-white font-semibold">CHHEAN SITRA · 012 *** 220</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {selectedReceipt.includes('IMG_3205') && (
                <a
                  href={selectedReceipt}
                  download="Benzto2_KHQR.jpeg"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយក KHQR</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors"
              >
                បិទផ្ទាំងនេះ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
