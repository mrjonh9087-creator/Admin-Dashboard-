export interface GameMod {
  id: string;
  name: string;
  gameCategory: 'MLBB' | 'PUBG' | 'Free Fire' | 'ROV' | 'Genshin' | 'Other';
  version: string;
  priceUSD: number;
  priceKHR: number; // e.g. 20000 riels
  originalPriceUSD?: number;
  originalPriceKHR?: number;
  discountPercent?: number;
  duration: '1 Day' | '7 Days' | '30 Days' | 'Lifetime';
  description: string;
  features: string[];
  image: string;
  isHot?: boolean;
  downloadsCount: number;
  stockDownloads?: number;
  stockKeys?: number;
  downloadUrl: string; // MediaFire or .mobileconfig link
  fileName: string;
  fileSize: string;
}

export interface SoldFileRecord {
  id: string;
  modId: string;
  modName: string;
  downloadUrl: string;
  fileName: string;
  customerTelegram: string;
  customerName: string;
  customerChatId?: string | number;
  nextDnsProfileId?: string;
  status: 'delivered' | 'pending';
  createdAt: string;
}

export interface Order {
  id: string;
  modId: string;
  modName: string;
  customerName: string;
  customerTelegram: string;
  customerChatId?: string | number;
  amountUSD: number;
  amountKHR: number;
  paymentMethod: 'ABA PayWay' | 'KHQR' | 'TrueMoney' | 'Crypto (USDT)';
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  receiptImage?: string;
  downloadUrlAssigned?: string;
  nextDnsProfileId?: string;
  generatedFileName?: string;
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
  image?: string;
  timestamp: string;
  type?: 'text' | 'inline_keyboard' | 'product_card' | 'invoice';
  payload?: any;
}

export interface KnownTelegramUser {
  chatId: string;
  label: string;
}

export interface NextDnsProfile {
  userId: string;
  username: string;
  profileId: string;
  orderId?: string;
  createdAt: string;
  revoked?: boolean;
}

