import { GameMod, LicenseKey, Order, BotConfig } from '../types';

export const initialBotConfig: BotConfig = {
  botToken: '9132595573:AAF1VKL08wofbySw0Z4W8BZkwPfUCgKePxU',
  botUsername: '@Benzto2_VIP_Bot',
  botName: '👑 Benzto2 VIP Mod Bot',
  welcomeMessage: `🚀សូមស្វាគមន៍មកកាន់ Benzto2 VIP Mod Bot! 🎮\n\nហាងលក់ Mod Game និង iOS DNS Profiles លេខ១ នៅកម្ពុជាដោយ Benzto2 ផ្ទាល់ ទំនុកចិត្តខ្ពស់ សុវត្ថិភាព Anti-Ban 99%!\n\n✨ ជ្រើសរើសមុខទំនិញខាងក្រោមដើម្បីចាប់ផ្តើមទិញ៖`,
  supportUsername: '@Benzto2_Support',
  channelUsername: '@Benzto2_Channel',
  autoDelivery: true,
  maintenanceMode: false,
  khqrMerchantId: 'khqr@ababank',
  khqrName: 'BENZTO2 GAMING SHOP'
};

export const initialGameMods: GameMod[] = [
  {
    id: 'mod-1',
    name: 'Aimlock V1.1 iOS DNS Profile (Benzto2)',
    gameCategory: 'Free Fire',
    version: 'v1.1',
    priceUSD: 5.00,
    priceKHR: 20000,
    duration: '30 Days',
    description: 'BENZTO2 VIP 🇻🇳 iOS DNS Configuration Profile. ធានា Anti-Ban 100%, Aimlock 100%, ដំណើរការលើ IOS-15 ដល់ IOS-17 យ៉ាងរលូន។',
    features: ['ANTI-BAN 100% 🇻🇳', 'AIMLOCK 100% 🎯', 'iOS 15 + iOS 17 Support ⚡', 'Direct MediaFire .mobileconfig', 'No Jailbreak Required'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    isHot: true,
    downloadsCount: 1840,
    stockKeys: 50,
    downloadUrl: 'https://www.mediafire.com/file/aimlock_v1.1_benzto2.mobileconfig',
    profileType: 'dns',
    fileName: 'Aimlock_V1.1_Benzto2.mobileconfig',
    fileSize: '13.4 MB'
  },
  {
    id: 'mod-2',
    name: 'Drag Headshot VIP iOS Profile (Benzto2)',
    gameCategory: 'Free Fire',
    version: 'v2.0',
    priceUSD: 7.50,
    priceKHR: 30000,
    duration: '30 Days',
    description: 'BENZTO2 iOS ⚙️ Drag Headshot & Sensi Profile. ជួយអូសក្បាលស្រួល ស្ទើរគ្រប់កាំភ្លើង មិនរអាក់រអួល។',
    features: ['BENZTO2 iOS Sensi Profile ⚙️', 'Aimlock + FPS Boost 🇻🇳', 'Sensi + DragHz + Anti-Ban 🛡️', 'MediaFire Direct Download'],
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&auto=format&fit=crop&q=60',
    isHot: true,
    downloadsCount: 1420,
    stockKeys: 35,
    downloadUrl: 'https://www.mediafire.com/file/drag_headshot_benzto2.mobileconfig',
    profileType: 'aimlock',
    fileName: 'Drag_Headshot_VIP.mobileconfig',
    fileSize: '15.8 MB'
  },
  {
    id: 'mod-3',
    name: 'Aimlock V1.7 NO-RECALL Pro Profile',
    gameCategory: 'PUBG',
    version: 'v1.7',
    priceUSD: 10.00,
    priceKHR: 40000,
    duration: '30 Days',
    description: 'Aimlock V1.7 NO-RECALL iOS DNS Profile សម្រាប់ PUBG Mobile និង Free Fire Max ធានាស្មៀនដៃស្ងាត់ល្អ។',
    features: ['No Recall 90%', 'Aimlock V1.7 Pro 🇻🇳', '120Hz iOS Support', 'DNS Settings Safe Bypass'],
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60',
    isHot: false,
    downloadsCount: 950,
    stockKeys: 20,
    downloadUrl: 'https://www.mediafire.com/file/aimlock_v1.7_norecall.mobileconfig',
    profileType: 'dns',
    fileName: 'Aimlock_V1.7_NoRecall.mobileconfig',
    fileSize: '18.2 MB'
  }
];

export const initialLicenseKeys: LicenseKey[] = [
  {
    id: 'key-1',
    modId: 'mod-1',
    modName: 'MLBB VIP ESP + Skin Injector v9.2',
    keyString: 'MLBB-VIP-89F2-K991-X77A',
    customerTelegram: '@dara_gamer99',
    customerName: 'Dara Gaming',
    status: 'active',
    createdAt: '2026-11-20 14:32',
    expiresAt: '2026-12-20 14:32',
    deviceHWID: 'ANDROID-8892A-XYZ'
  },
  {
    id: 'key-2',
    modId: 'mod-2',
    modName: 'PUBG Mobile 64-Bit ESP & Aimbot Pro',
    keyString: 'PUBG-PRO-33E1-M229-B44C',
    customerTelegram: '@sreynoch_kh',
    customerName: 'Srey Noch',
    status: 'active',
    createdAt: '2026-11-21 09:15',
    expiresAt: '2026-12-21 09:15',
    deviceHWID: 'ANDROID-4431B-LMN'
  },
  {
    id: 'key-3',
    modId: 'mod-4',
    modName: 'Free Fire Max Auto Headshot & ESP',
    keyString: 'FF-MAX-55T8-P112-Z88Q',
    customerTelegram: '@vitou_pro',
    customerName: 'Vitou Official',
    status: 'expired',
    createdAt: '2026-10-15 18:40',
    expiresAt: '2026-11-15 18:40',
    deviceHWID: 'ANDROID-9912C-QWE'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-9821',
    modId: 'mod-1',
    modName: 'MLBB VIP ESP + Skin Injector v9.2',
    customerName: 'Dara Gaming',
    customerTelegram: '@dara_gamer99',
    amountUSD: 5.00,
    amountKHR: 20000,
    paymentMethod: 'ABA PayWay',
    status: 'completed',
    createdAt: '2026-11-24 18:10',
    receiptImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=60',
    licenseKeyAssigned: 'MLBB-VIP-89F2-K991-X77A'
  },
  {
    id: 'ORD-9822',
    modId: 'mod-2',
    modName: 'PUBG Mobile 64-Bit ESP & Aimbot Pro',
    customerName: 'Srey Noch',
    customerTelegram: '@sreynoch_kh',
    amountUSD: 10.00,
    amountKHR: 40000,
    paymentMethod: 'KHQR',
    status: 'completed',
    createdAt: '2026-11-24 19:25',
    receiptImage: 'https://images.unsplash.com/photo-1556742049-0a67d55362ad?w=400&auto=format&fit=crop&q=60',
    licenseKeyAssigned: 'PUBG-PRO-33E1-M229-B44C'
  },
  {
    id: 'ORD-9825',
    modId: 'mod-4',
    modName: 'Free Fire Max Auto Headshot & ESP',
    customerName: 'Vibol Dev',
    customerTelegram: '@vibol_dev',
    amountUSD: 4.00,
    amountKHR: 16000,
    paymentMethod: 'ABA PayWay',
    status: 'pending',
    createdAt: '2026-11-24 20:12',
    receiptImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&auto=format&fit=crop&q=60'
  }
];
