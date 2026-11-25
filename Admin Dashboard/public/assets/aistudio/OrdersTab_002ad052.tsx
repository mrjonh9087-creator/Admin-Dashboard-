import React, { useState } from 'react';
import { Order, LicenseKey, GameMod } from '../types';
import { ShoppingCart, CheckCircle2, Clock, XCircle, Eye, Check, X, Shield, ExternalLink } from 'lucide-react';

interface OrdersTabProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  licenses: LicenseKey[];
  setLicenses: React.Dispatch<React.SetStateAction<LicenseKey[]>>;
  mods: GameMod[];
  currency: 'USD' | 'KHR';
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  setOrders,
  licenses,
  setLicenses,
  mods,
  currency
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  const handleApprove = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status === 'completed') return;

    // Find mod for category
    const mod = mods.find(m => m.id === order.modId);
    const cat = mod ? mod.gameCategory : 'VIP';

    // Generate license key automatically
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomStr2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKeyString = `${cat}-VIP-${randomStr}-${randomStr2}`;

    const now = new Date();
    const expires = new Date();
    expires.setDate(now.getDate() + 30);

    const newKey: LicenseKey = {
      id: `key-${Date.now()}`,
      modId: order.modId,
      modName: order.modName,
      keyString: newKeyString,
      customerTelegram: order.customerTelegram,
      customerName: order.customerName,
      status: 'active',
      createdAt: now.toISOString().replace('T', ' ').substring(0, 16),
      expiresAt: expires.toISOString().replace('T', ' ').substring(0, 16),
      deviceHWID: 'Pending Device Activation'
    };

    setLicenses([newKey, ...licenses]);
    setOrders(orders.map(o => o.id === orderId ? {
      ...o,
      status: 'completed',
      licenseKeyAssigned: newKeyString
    } : o));
  };

  const handleReject = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">💳 គ្រប់គ្រងការបញ្ជាទិញ & ការទូទាត់ (Orders & KHQR)</h2>
          <p className="text-sm text-slate-400">ផ្ទៀងផ្ទាត់វិក្កយបត្រ KHQR / ABA PayWay និងបញ្ចេញ License Key ជូនអតិថិជនស្វ័យប្រវត្តិ</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/85 p-3 rounded-2xl border border-slate-800">
        {['all', 'pending', 'completed', 'rejected'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              filterStatus === st
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/85 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">អតិថិជន (Telegram)</th>
                <th className="px-4 py-3">Mod Game</th>
                <th className="px-4 py-3">ទឹកប្រាក់</th>
                <th className="px-4 py-3">វិធីសាស្ត្រទូទាត់</th>
                <th className="px-4 py-3">វិក្កយបត្រ Slip</th>
                <th className="px-4 py-3">ស្ថានភាព</th>
                <th className="px-4 py-3 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-mono text-xs text-cyan-400 font-bold">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{order.customerName}</div>
                    <div className="text-xs text-sky-400">{order.customerTelegram}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200 max-w-[180px] truncate">{order.modName}</td>
                  <td className="px-4 py-3 font-extrabold text-emerald-400">
                    {currency === 'USD' ? `$${order.amountUSD.toFixed(2)}` : `${order.amountKHR.toLocaleString()} ៛`}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.receiptImage ? (
                      <button
                        onClick={() => setSelectedReceipt(order.receiptImage || null)}
                        className="flex items-center space-x-1 text-xs text-cyan-400 hover:underline bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>មើល Slip</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">គ្មាន Slip</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {order.status === 'completed' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> បានទូទាត់
                      </span>
                    )}
                    {order.status === 'pending' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3 mr-1" /> រង់ចាំផ្ទៀងផ្ទាត់
                      </span>
                    )}
                    {order.status === 'rejected' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3 h-3 mr-1" /> បដិសេធ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {order.status === 'pending' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow flex items-center space-x-1 transition"
                        >
                          <Check className="w-3 h-3" />
                          <span>យល់ព្រម & ចេញ Key</span>
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow flex items-center space-x-1 transition"
                        >
                          <X className="w-3 h-3" />
                          <span>បដិសេធ</span>
                        </button>
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-cyan-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {order.licenseKeyAssigned || 'Completed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">📸 វិក្កយបត្រទូទាត់ប្រាក់ (Payment Slip)</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="rounded-xl overflow-hidden bg-slate-800 border border-slate-700 mb-4 max-h-[400px] flex items-center justify-center">
              <img src={selectedReceipt} alt="Payment Receipt" className="max-h-[380px] object-contain" />
            </div>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
            >
              បិទ 창
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
