import { GameMod, SoldFileRecord, Order, BotConfig } from '../types';

export const initialBotConfig: BotConfig = {
  botToken: '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8',
  botUsername: '@Benzto2_VIP_Bot',
  botName: '👑 Benzto2 VIP VPN & Mods',
  welcomeMessage: `👑 *BENZTO2 VIP — iOS VPN & DNS SHOP*
🔥 *មហាប្រូម៉ូសិនពិសេស បញ្ចុះតម្លៃ 50% គ្រប់កញ្ចប់ VPN!*
⭐ *ទំនុកចិត្ត ១០០% • ដំឡើងផ្ទាល់តាម iOS Settings*
━━━━━━━━━━━━━━━
🛡️ *Anti-Ban 100%* — ការពារគណនីហ្គេមដោយសុវត្ថិភាព
⚡ *Low Ping & Smooth* — កាត់បន្ថយ Ping លេងហ្គេមរលូន
🔒 *NextDNS VIP (1 Device)* — បង្កើត Profile ផ្តាច់មុខ
💳 *ACLEDA KHQR* — បង់ប្រាក់រហ័ស & ផ្ញើ File ស្វ័យប្រវត្តិ

📩 ជំនួយសេវាកម្ម៖ https://t.me/paypalsetup
👇 សូមជ្រើសរើសមុខងារខាងក្រោម៖`,
  supportUsername: '@paypalsetup',
  channelUsername: '@Benzto2_Channel',
  autoDelivery: true,
  maintenanceMode: false,
  khqrMerchantId: '012 *** 220 (ACLEDA)',
  khqrName: 'CHHEAN SITRA'
};

export const initialGameMods: GameMod[] = [
  {
    id: 'mod-ios-1device',
    name: '📱 CONFIG IPHONE VIP (Lifetime - 1 Device) [PROMO 50%]',
    gameCategory: 'Other',
    version: 'v5.0 NextDNS',
    priceUSD: 5.00,
    priceKHR: 20000,
    originalPriceUSD: 10.00,
    originalPriceKHR: 40000,
    discountPercent: 50,
    duration: 'Lifetime',
    description: '🔥 មហាប្រូម៉ូសិន 50% ពិសេស! ឯកសារ .mobileconfig ផ្តាច់មុខ (1 Device Only) បង្កើត Profile ផ្ទាល់ខ្លួនតាម NextDNS API អាច Revoke បានបើចែករំលែកលើស ១ គ្រឿង។',
    features: [
      '🔥 PROMOTION 50% OFF (សល់ត្រឹម $5.00 / 20,000៛)',
      'Unique NextDNS Profile (1 Device Only)',
      'Lifetime VIP Low Ping + Smooth',
      'Anti-Share Protection (/revoke)',
      'Auto-Generated .mobileconfig'
    ],
    image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
    isHot: true,
    downloadsCount: 4180,
    stockDownloads: 999,
    downloadUrl: '/Benzto2_VIP_1Device.mobileconfig',
    fileName: 'Benzto2_VIP_1Device.mobileconfig',
    fileSize: '2.1 KB'
  },
  {
    id: 'mod-ios-vip',
    name: '📱 CONFIG IPHONE VIP (Smooth + Low Ping) [PROMO 50%]',
    gameCategory: 'Other',
    version: 'v4.0 iOS VIP',
    priceUSD: 2.50,
    priceKHR: 10000,
    originalPriceUSD: 5.00,
    originalPriceKHR: 20000,
    discountPercent: 50,
    duration: '30 Days',
    description: '🔥 មហាប្រូម៉ូសិន 50% ពិសេស! ឯកសារ .mobileconfig ផ្លូវការសម្រាប់ iOS (iPhone / iPad) បន្ថយ Ping ស្មូតលឿន Anti-Ban 100% ដំឡើងផ្ទាល់។',
    features: [
      '🔥 PROMOTION 50% OFF (សល់ត្រឹម $2.50 / 10,000៛)',
      'iOS Configuration Profile (.mobileconfig)',
      'Smooth + Low Ping (គ្មានទាក់)',
      'Anti-Ban 100% សុវត្ថិភាពខ្ពស់',
      'ដំឡើងងាយៗតាម Settings'
    ],
    image: '/assets/aistudio/IMG_3173_e32561b0.jpeg',
    isHot: true,
    downloadsCount: 3120,
    stockDownloads: 999,
    downloadUrl: '/Benzto2_VIP_Smooth.mobileconfig',
    fileName: 'Benzto2_VIP_Smooth.mobileconfig',
    fileSize: '2.1 KB'
  }
];

export const initialSoldFiles: SoldFileRecord[] = [
  {
    id: 'file-rec-1',
    modId: 'mod-ios-1device',
    modName: 'CONFIG IPHONE VIP (Lifetime - 1 Device)',
    downloadUrl: '/Benzto2_VIP_1Device.mobileconfig',
    fileName: 'Benzto2_VIP_1Device.mobileconfig',
    customerTelegram: '@dara_gamer99',
    customerName: 'Dara Gaming',
    nextDnsProfileId: 'vip_dara99',
    status: 'delivered',
    createdAt: '2026-11-24 18:10'
  },
  {
    id: 'file-rec-2',
    modId: 'mod-ios-vip',
    modName: 'CONFIG IPHONE VIP (Smooth + Low Ping)',
    downloadUrl: '/Benzto2_VIP_Smooth.mobileconfig',
    fileName: 'Benzto2_VIP_Smooth.mobileconfig',
    customerTelegram: '@sreynoch_kh',
    customerName: 'Srey Noch',
    status: 'delivered',
    createdAt: '2026-11-24 19:25'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-9821',
    modId: 'mod-ios-1device',
    modName: 'CONFIG IPHONE VIP (Lifetime - 1 Device)',
    customerName: 'Dara Gaming',
    customerTelegram: '@dara_gamer99',
    amountUSD: 10.00,
    amountKHR: 40000,
    paymentMethod: 'KHQR',
    status: 'completed',
    createdAt: '2026-11-24 18:10',
    receiptImage: '/assets/aistudio/IMG_3205_226e989d.jpeg',
    downloadUrlAssigned: '/Benzto2_VIP_1Device.mobileconfig',
    nextDnsProfileId: 'vip_dara99',
    generatedFileName: 'Benzto2_VIP_1Device.mobileconfig'
  },
  {
    id: 'ORD-9822',
    modId: 'mod-ios-vip',
    modName: 'CONFIG IPHONE VIP (Smooth + Low Ping)',
    customerName: 'Srey Noch',
    customerTelegram: '@sreynoch_kh',
    amountUSD: 5.00,
    amountKHR: 20000,
    paymentMethod: 'KHQR',
    status: 'completed',
    createdAt: '2026-11-24 19:25',
    receiptImage: '/assets/aistudio/IMG_3205_226e989d.jpeg',
    downloadUrlAssigned: '/Benzto2_VIP_Smooth.mobileconfig',
    generatedFileName: 'Benzto2_VIP_Smooth.mobileconfig'
  },
  {
    id: 'ORD-9825',
    modId: 'mod-ios-1device',
    modName: 'CONFIG IPHONE VIP (Lifetime - 1 Device)',
    customerName: 'Vibol Dev (Demo)',
    customerTelegram: '@vibol_dev',
    amountUSD: 10.00,
    amountKHR: 40000,
    paymentMethod: 'KHQR',
    status: 'pending',
    createdAt: '2026-11-24 20:12',
    receiptImage: '/assets/aistudio/IMG_3205_226e989d.jpeg'
  }
];
