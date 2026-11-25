export interface GameMod {
  id: string;
  name: string;
  gameCategory: 'MLBB' | 'PUBG' | 'Free Fire' | 'ROV' | 'Genshin' | 'Other';
  version: string;
  priceUSD: number;
  priceKHR: number; // e.g. 40000 riels
  duration: '1 Day' | '7 Days' | '30 Days' | 'Lifetime';
  description: string;
  features: string[];
  image: string;
  isHot?: boolean;
  downloadsCount: number;
  stockKeys: number;
  downloadUrl?: string; // MediaFire or .mobileconfig link
  profileType?: 'dns' | 'vpn' | 'aimlock' | 'app';
  fileName?: string;
  fileSize?: string;
}

export interface LicenseKey {
  id: string;
  modId: string;
  modName: string;
  keyString: string;
  customerTelegram: string;
  customerName: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
  expiresAt: string;
  deviceHWID?: string;
}

export interface Order {
  id: string;
  modId: string;
  modName: string;
  customerName: string;
  customerTelegram: string;
  amountUSD: number;
  amountKHR: number;
  paymentMethod: 'ABA PayWay' | 'KHQR' | 'TrueMoney' | 'Crypto (USDT)';
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  receiptImage?: string;
  licenseKeyAssigned?: string;
}

export interface BotConfig {
  botToken: string;
  botUsername: string;
  botName: string;
  welcomeMessage: string;
  supportUsername: string;
  channelUsername: string;
  autoDelivery: boolean;
  maintenanceMode: boolean;
  khqrMerchantId: string;
  khqrName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  type?: 'text' | 'inline_keyboard' | 'product_card' | 'invoice';
  payload?: any;
}
