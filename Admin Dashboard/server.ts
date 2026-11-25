import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BANNER_PATH = path.join(__dirname, 'public/assets/aistudio/IMG_3173_e32561b0.jpeg');

const WELCOME_CAPTION = `👑 *BENZTO2 VIP — iOS VPN & DNS SHOP*
🔥 *មហាប្រូម៉ូសិនពិសេស បញ្ចុះតម្លៃ 50% គ្រប់កញ្ចប់ VPN!*
⭐ *ទំនុកចិត្ត ១០០% • ដំឡើងផ្ទាល់តាម iOS Settings*
━━━━━━━━━━━━━━━
🛡️ *Anti-Ban 100%* — ការពារគណនីហ្គេមដោយសុវត្ថិភាព
⚡ *Low Ping & Smooth* — កាត់បន្ថយ Ping លេងហ្គេមរលូន
🔒 *NextDNS VIP (1 Device)* — បង្កើត Profile ផ្តាច់មុខ
💳 *ACLEDA KHQR* — បង់ប្រាក់រហ័ស & ផ្ញើ File ស្វ័យប្រវត្តិ

📩 ជំនួយសេវាកម្ម៖ https://t.me/paypalsetup
👇 សូមជ្រើសរើសមុខងារខាងក្រោម៖`;

const MAIN_MENU_MARKUP = {
  inline_keyboard: [
    [
      { text: '🛒 ហាងទិញ File VIP', callback_data: 'shop' },
      { text: '🛡️ អំពីសេវាកម្ម', callback_data: 'vpn_info' }
    ],
    [
      { text: '📖 វិធីដំឡើង', callback_data: 'guide' },
      { text: '💳 បង់ប្រាក់ KHQR', callback_data: 'payment' }
    ],
    [
      { text: '💬 ទាក់ទង Admin (@paypalsetup)', url: 'https://t.me/paypalsetup' }
    ]
  ]
};

const DELIVERY_MARKUP = {
  inline_keyboard: [
    [
      { text: '📖 វិធីដំឡើងលម្អិត', callback_data: 'guide' },
      { text: '🛒 ទិញកញ្ចប់ផ្សេង', callback_data: 'shop' }
    ],
    [
      { text: '💬 ទាក់ទង Admin (@paypalsetup)', url: 'https://t.me/paypalsetup' }
    ],
    [
      { text: '🏠 ម៉ឺនុយដើម', callback_data: 'start' }
    ]
  ]
};

const VPN_INFO_TEXT = `🛡️ *សេវាកម្ម BENZTO2 VIP VPN & iOS DNS*
━━━━━━━━━━━━━━━
ប្រព័ន្ធបង្កើនល្បឿនអ៊ីនធឺណិត និងការពារគណនីហ្គេមតាមបច្ចេកវិទ្យា *Encrypted DNS-over-HTTPS (.mobileconfig)* ដំឡើងផ្ទាល់ក្នុង iOS Settings៖

✅ *Anti-Ban 100%:* ផ្លូវតភ្ជាប់ស្អាត និងសុវត្ថិភាពខ្ពស់សម្រាប់គណនីហ្គេម។
⚡ *Low Ping & Smooth:* កាត់បន្ថយ Ping ជួយឱ្យលេងហ្គេមរលូនគ្មានទាក់។
🔋 *Zero Battery Drain:* មិនស៊ីថ្ម មិនក្តៅម៉ាស៊ីន ដូចកម្មវិធី VPN ធម្មតាឡើយ។
🔒 *1 Device VIP Protection:* បង្កើត NextDNS Profile ផ្តាច់មុខសម្រាប់ទូរស័ព្ទ ១ គ្រឿង។
🍏 *iOS Settings Native:* មិនបាច់ប្រើ App ឬ Key រញ៉េរញ៉ៃ ដំឡើងត្រឹម ១០ វិនាទី។

💬 ជំនួយសេវាកម្ម 24/7: https://t.me/paypalsetup`;

const VPN_INFO_MARKUP = {
  inline_keyboard: [
    [
      { text: '🛒 ហាងទិញ File VIP', callback_data: 'shop' },
      { text: '💳 បង់ប្រាក់ KHQR', callback_data: 'payment' }
    ],
    [
      { text: '💬 ទាក់ទង Admin (@paypalsetup)', url: 'https://t.me/paypalsetup' }
    ],
    [
      { text: '⬅️ ម៉ឺនុយដើម', callback_data: 'start' }
    ]
  ]
};

const SHOP_TEXT = `🛒 *ហាង BENZTO2 VIP iOS CONFIG (PROMO 50% OFF)*
🔥 *ឱកាសពិសេស បញ្ចុះតម្លៃ 50% លើគ្រប់កញ្ចប់ VPN!*
━━━━━━━━━━━━━━━
1️⃣ *CONFIG IPHONE VIP — Lifetime (1 Device Only)*
✨ Unique NextDNS Profile • Anti-Share Protection
📦 Dynamic \`.mobileconfig\` | 💵 ~*$10.00*~ ➔ *$5.00 (20,000៛)* 🔥 [-50%]

2️⃣ *CONFIG IPHONE VIP — Smooth + Low Ping*
⚡ ល្បឿនលឿន កាត់បន្ថយ Ping ស្មូតល្អ (Anti-Ban 100%)
📦 iOS \`.mobileconfig\` | 💵 ~*$5.00*~ ➔ *$2.50 (10,000៛)* 🔥 [-50%]

💳 សូមជ្រើសរើសកញ្ចប់ខាងក្រោមដើម្បីបង្កើតវិក្កយបត្រ ACLEDA KHQR៖`;

const SHOP_MARKUP = {
  inline_keyboard: [
    [
      { text: '👑 ទិញ Lifetime 1 Device ($5.00 -50%)', callback_data: 'buy_ios-1device' }
    ],
    [
      { text: '📱 ទិញ iOS Smooth VIP ($2.50 -50%)', callback_data: 'buy_ios-vip' }
    ],
    [
      { text: '💳 បង់ប្រាក់ KHQR', callback_data: 'payment' },
      { text: '📖 វិធីដំឡើង', callback_data: 'guide' }
    ],
    [
      { text: '⬅️ ម៉ឺនុយដើម', callback_data: 'start' }
    ]
  ]
};

const GUIDE_TEXT = `📖 *វិធីដំឡើង File (.mobileconfig):*
━━━━━━━━━━━━━━━
🍏 *iOS (iPhone / iPad):*
1. ចុច Download ឯកសារ \`.mobileconfig\` ដែល Bot ផ្ញើជូន
2. ចូល *Settings* ➔ *Profile Downloaded* (ឬ *General* ➔ *VPN & Device Management*)
3. ចុច *Install* រួចវាយបញ្ចូល Passcode ទូរស័ព្ទ

🤖 *Android:*
1. Download File VPN Config ពី Admin
2. Import ចូល VPN Client រួចចុច Connect

🛡️ រួចរាល់! ចូលលេងហ្គេមដោយរលូន និងសុវត្ថិភាព។`;

const GUIDE_MARKUP = {
  inline_keyboard: [
    [
      { text: '🛒 ហាង VPN VIP', callback_data: 'shop' },
      { text: '💳 បង់ប្រាក់ KHQR', callback_data: 'payment' }
    ],
    [
      { text: '⬅️ ម៉ឺនុយដើម', callback_data: 'start' }
    ]
  ]
};

const PAYMENT_TEXT = `💳 *ព័ត៌មានទូទាត់ប្រាក់តាម BENZTO2 KHQR*
━━━━━━━━━━━━━━━
🏦 ធនាគារ: *ACLEDA Bank*
👤 ឈ្មោះគណនី: *CHHEAN SITRA*
📱 លេខទូរស័ព្ទ: \`012 *** 220\`

📸 *របៀបបង់ប្រាក់ និងទទួល File៖*
1️⃣ ស្កេន QR Code ខាងលើតាម Bakong / ABA / ACLEDA
2️⃣ ផ្ញើរូបភាព Slip ចូលក្នុង Bot នេះផ្ទាល់ ឬទៅកាន់ @paypalsetup
3️⃣ ប្រព័ន្ធនឹងផ្ញើឯកសារ \`.mobileconfig\` ជូនភ្លាមៗ!`;

const PAYMENT_MARKUP = {
  inline_keyboard: [
    [
      { text: '🛒 ហាង VPN VIP', callback_data: 'shop' },
      { text: '📤 ផ្ញើ Slip Admin', url: 'https://t.me/paypalsetup' }
    ],
    [
      { text: '⬅️ ម៉ឺនុយដើម', callback_data: 'start' }
    ]
  ]
};

// Track all recent bot message IDs per chat so cleanup is seamless and complete
const trackedBotMessages = new Map<string, number[]>();
let cachedBannerFileId: string | null = null;
let cachedKhqrFileId: string | null = null;

function rememberBotMessage(chatId: number | string, messageId?: number) {
  if (!messageId) return;
  const key = String(chatId);
  const existing = trackedBotMessages.get(key) || [];
  if (!existing.includes(messageId)) {
    trackedBotMessages.set(key, [...existing.slice(-8), messageId]);
  }
}

async function deleteTelegramMessage(
  botToken: string,
  chatId: number | string,
  messageId?: number
) {
  if (!messageId) return;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId
      })
    });
  } catch {}
}

async function cleanupPreviousBotMessages(
  botToken: string,
  chatId: number | string,
  keepMessageId?: number
) {
  const key = String(chatId);
  const list = trackedBotMessages.get(key) || [];
  const toDelete = list.filter((id) => id !== keepMessageId);
  if (keepMessageId) {
    trackedBotMessages.set(key, [keepMessageId]);
  } else {
    trackedBotMessages.set(key, []);
  }
  await Promise.all(toDelete.map((id) => deleteTelegramMessage(botToken, chatId, id)));
}

async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string,
  replyMarkup?: any,
  parseMode: 'Markdown' | 'HTML' | null = 'Markdown'
) {
  const payload: Record<string, any> = {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
    disable_web_page_preview: true
  };
  if (parseMode) {
    payload.parse_mode = parseMode;
  }

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  let data = await res.json();
  if (!data.ok && parseMode) {
    const fallbackRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.replace(/[*_`]/g, ''),
        reply_markup: replyMarkup,
        disable_web_page_preview: true
      })
    });
    data = await fallbackRes.json();
  }
  if (data.ok && data.result?.message_id) {
    rememberBotMessage(chatId, data.result.message_id);
  }
  return data;
}

async function sendTelegramBannerPhoto(
  botToken: string,
  chatId: number | string,
  caption: string,
  replyMarkup?: any
) {
  if (cachedBannerFileId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: cachedBannerFileId,
          caption,
          parse_mode: 'Markdown',
          reply_markup: replyMarkup
        })
      });
      const data = await res.json();
      if (data.ok) {
        rememberBotMessage(chatId, data.result?.message_id);
        return data;
      }
      cachedBannerFileId = null;
    } catch {
      cachedBannerFileId = null;
    }
  }

  try {
    if (fs.existsSync(BANNER_PATH)) {
      const fileBuffer = fs.readFileSync(BANNER_PATH);
      const formData = new FormData();
      formData.append('chat_id', String(chatId));
      formData.append('photo', new Blob([fileBuffer], { type: 'image/jpeg' }), 'benzto2_vpn_banner.jpg');
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');
      if (replyMarkup) {
        formData.append('reply_markup', JSON.stringify(replyMarkup));
      }

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        const photos = data.result?.photo;
        if (Array.isArray(photos) && photos.length > 0) {
          cachedBannerFileId = photos[photos.length - 1].file_id;
        }
        rememberBotMessage(chatId, data.result?.message_id);
        return data;
      }
    }
  } catch (err) {}
  return sendTelegramMessage(botToken, chatId, caption, replyMarkup);
}

async function sendConfigDocument(
  botToken: string,
  chatId: number | string,
  caption: string,
  replyMarkup?: any
) {
  const filePath = path.join(__dirname, 'public/Benzto2_VIP_Smooth.mobileconfig');
  try {
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const formData = new FormData();
      formData.append('chat_id', String(chatId));
      formData.append('document', new Blob([fileBuffer], { type: 'application/x-apple-aspen-config' }), 'Benzto2_VIP_Smooth.mobileconfig');
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');
      formData.append('disable_content_type_detection', 'true');
      if (replyMarkup) {
        formData.append('reply_markup', JSON.stringify(replyMarkup));
      }

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        rememberBotMessage(chatId, data.result?.message_id);
        return data;
      }
    }
  } catch (err) {}
  return sendTelegramMessage(botToken, chatId, caption, replyMarkup);
}

const NEXTDNS_API_KEY = process.env.NEXTDNS_API_KEY || '7997c42dd26890e640b44b62e671e6667706';
const DATA_STORE_PATH = path.join(__dirname, 'bot_data.json');

interface StoredProfile {
  userId: string;
  username: string;
  profileId: string;
  orderId?: string;
  createdAt: string;
  revoked?: boolean;
}

interface StoredOrder {
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

interface BotDataStore {
  profiles: StoredProfile[];
  orders: StoredOrder[];
  users: Record<string, number>;
}

function loadDataStore(): BotDataStore {
  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const raw = fs.readFileSync(DATA_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        users: parsed.users && typeof parsed.users === 'object' ? parsed.users : {}
      };
    }
  } catch (err) {}
  return { profiles: [], orders: [], users: {} };
}

function saveDataStore(store: BotDataStore) {
  try {
    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {}
}

const botDataStore: BotDataStore = loadDataStore();

function recordTelegramUser(from: any, chatId: number | string) {
  if (!chatId) return;
  const numericChat = Number(chatId);
  if (from?.username) {
    botDataStore.users[`@${String(from.username).toLowerCase()}`] = numericChat;
  }
  if (from?.id) {
    botDataStore.users[String(from.id)] = numericChat;
  }
  saveDataStore(botDataStore);
}

async function createNextDnsProfile(userId: string | number, username?: string): Promise<{ profileId: string; isLive: boolean; error?: string }> {
  try {
    const res = await fetch('https://api.nextdns.io/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': NEXTDNS_API_KEY
      },
      body: JSON.stringify({ name: `Benzto2_VIP_${userId}` })
    });
    const data = await res.json();
    if (res.ok && data?.data?.id) {
      return { profileId: data.data.id, isLive: true };
    }
    return { profileId: `vip_${String(userId).replace(/[^a-zA-Z0-9]/g, '')}`, isLive: false, error: JSON.stringify(data) };
  } catch (err: any) {
    return { profileId: `vip_${String(userId).replace(/[^a-zA-Z0-9]/g, '')}`, isLive: false, error: err?.message };
  }
}

async function revokeNextDnsProfile(target: string): Promise<{ success: boolean; resolvedId: string }> {
  const matched = botDataStore.profiles.find(
    (p) =>
      p.profileId === target ||
      p.userId === target ||
      p.username.toLowerCase() === target.toLowerCase()
  );
  const profileIdToRevoke = matched ? matched.profileId : target;
  try {
    const res = await fetch(`https://api.nextdns.io/profiles/${profileIdToRevoke}`, {
      method: 'DELETE',
      headers: {
        'X-Api-Key': NEXTDNS_API_KEY
      }
    });
    const isLocalFallbackProfile = profileIdToRevoke.startsWith('vip_');
    const success = res.ok || isLocalFallbackProfile;
    if (success && matched) {
      matched.revoked = true;
      saveDataStore(botDataStore);
    }
    return { success, resolvedId: profileIdToRevoke };
  } catch (err) {
    if (matched && profileIdToRevoke.startsWith('vip_')) {
      matched.revoked = true;
      saveDataStore(botDataStore);
      return { success: true, resolvedId: profileIdToRevoke };
    }
    return { success: false, resolvedId: profileIdToRevoke };
  }
}

function escapeXml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateMobileConfigXML(profileId: string, label = '📱 Benzto2 VIP (1 Device Only)'): string {
  const safeProfileId = escapeXml(profileId);
  const safeLabel = escapeXml(label);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>PayloadContent</key>
	<array>
		<dict>
			<key>DNSSettings</key>
			<dict>
				<key>DNSProtocol</key>
				<string>HTTPS</string>
				<key>ServerAddresses</key>
				<array>
					<string>45.90.28.0</string>
					<string>45.90.30.0</string>
				</array>
				<key>ServerURL</key>
				<string>https://dns.nextdns.io/${safeProfileId}/VIP_1Device</string>
			</dict>
			<key>OnDemandRules</key>
			<array>
				<dict>
					<key>Action</key>
					<string>Connect</string>
				</dict>
			</array>
			<key>PayloadDescription</key>
			<string>Low-Latency Gaming &amp; Fast Network DNS (1 Device Only)</string>
			<key>PayloadDisplayName</key>
			<string>${safeLabel}</string>
			<key>PayloadIdentifier</key>
			<string>com.benzto2.dnsSettings.managed.${safeProfileId}</string>
			<key>PayloadOrganization</key>
			<string>Benzto2 VIP</string>
			<key>PayloadType</key>
			<string>com.apple.dnsSettings.managed</string>
			<key>PayloadUUID</key>
			<string>A6C06555-7F82-40CC-9507-2518A95217EA</string>
			<key>PayloadVersion</key>
			<integer>1</integer>
		</dict>
	</array>
	<key>PayloadDescription</key>
	<string>📱 𝗖𝗢𝗡𝗙𝗜𝗚  𝗜𝗣𝗛𝗢𝗡𝗘  𝗩𝗜𝗣 (1 Device Only)
 &gt;&gt; 𝗟𝗢𝗪 𝗣𝗜𝗡𝗚 &amp; 𝗦𝗠𝗢𝗢𝗧𝗛 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 ✅
 𝗔𝗱𝗺𝗶𝗻𝘀 𝗗𝗲𝘃 🧑‍💼
 𝗧𝗲𝗹𝗲 : 𝗽𝗮𝘆𝗽𝗮𝗹𝘀𝗲𝘁𝘂𝗽
 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 𝗮𝗱𝗺𝗶𝗻 ✅</string>
	<key>PayloadDisplayName</key>
	<string>${safeLabel}</string>
	<key>PayloadIdentifier</key>
	<string>com.benzto2.apple-dns-${safeProfileId}</string>
	<key>PayloadOrganization</key>
	<string>Benzto2 VIP</string>
	<key>PayloadScope</key>
	<string>User</string>
	<key>PayloadType</key>
	<string>Configuration</string>
	<key>PayloadUUID</key>
	<string>2F2B145E-24B5-4AAA-ACA1-623E73361AAE</string>
	<key>PayloadVersion</key>
	<integer>1</integer>
</dict>
</plist>`;
}

async function sendDynamicConfigDocument(
  botToken: string,
  chatId: number | string,
  xmlContent: string,
  fileName: string,
  caption: string,
  replyMarkup?: any,
  parseMode: 'HTML' | 'Markdown' | null = 'HTML'
) {
  const trySend = async (mode: 'HTML' | 'Markdown' | null, cap: string) => {
    const formData = new FormData();
    formData.append('chat_id', String(chatId));
    formData.append('document', new Blob([xmlContent], { type: 'application/x-apple-aspen-config' }), fileName);
    formData.append('caption', cap);
    if (mode) {
      formData.append('parse_mode', mode);
    }
    formData.append('disable_content_type_detection', 'true');
    if (replyMarkup) {
      formData.append('reply_markup', JSON.stringify(replyMarkup));
    }

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  };

  try {
    let data = await trySend(parseMode, caption);
    if (!data.ok && parseMode) {
      const plainCaption = caption.replace(/<[^>]+>/g, '');
      data = await trySend(null, plainCaption);
    }
    if (!data.ok) {
      console.error('Telegram sendDocument error:', data);
    }
    // Deliberately do NOT rememberBotMessage for delivered .mobileconfig files
    // so customers never lose their purchased profile when navigating menus.
    return data;
  } catch (err: any) {
    console.error('Telegram sendDocument exception:', err);
    return { ok: false, description: err?.message || 'sendDocument failed' };
  }
}

async function sendTelegramPaymentPhoto(
  botToken: string,
  chatId: number | string,
  caption: string,
  replyMarkup?: any
) {
  const khqrPath = path.join(__dirname, 'public/assets/aistudio/IMG_3205_226e989d.jpeg');
  if (cachedKhqrFileId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: cachedKhqrFileId,
          caption,
          parse_mode: 'Markdown',
          reply_markup: replyMarkup
        })
      });
      const data = await res.json();
      if (data.ok) {
        rememberBotMessage(chatId, data.result?.message_id);
        return data;
      }
      cachedKhqrFileId = null;
    } catch {
      cachedKhqrFileId = null;
    }
  }

  try {
    if (fs.existsSync(khqrPath)) {
      const fileBuffer = fs.readFileSync(khqrPath);
      const formData = new FormData();
      formData.append('chat_id', String(chatId));
      formData.append('photo', new Blob([fileBuffer], { type: 'image/jpeg' }), 'acleda_khqr.jpeg');
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');
      if (replyMarkup) {
        formData.append('reply_markup', JSON.stringify(replyMarkup));
      }

      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        const photos = data.result?.photo;
        if (Array.isArray(photos) && photos.length > 0) {
          cachedKhqrFileId = photos[photos.length - 1].file_id;
        }
        rememberBotMessage(chatId, data.result?.message_id);
        return data;
      }
    }
  } catch (err) {}
  return sendTelegramMessage(botToken, chatId, caption, replyMarkup);
}

async function editTelegramMessageCaption(
  botToken: string,
  chatId: number | string,
  messageId: number,
  caption: string,
  replyMarkup?: any
): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup
      })
    });
    const data = await res.json();
    if (data.ok || (typeof data.description === 'string' && data.description.includes('message is not modified'))) {
      rememberBotMessage(chatId, messageId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function editTelegramMessageText(
  botToken: string,
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: any
): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'Markdown',
        reply_markup: replyMarkup,
        disable_web_page_preview: true
      })
    });
    const data = await res.json();
    if (data.ok || (typeof data.description === 'string' && data.description.includes('message is not modified'))) {
      rememberBotMessage(chatId, messageId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function editTelegramMessageMedia(
  botToken: string,
  chatId: number | string,
  messageId: number,
  photoFileId: string,
  caption: string,
  replyMarkup?: any
): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/editMessageMedia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        media: {
          type: 'photo',
          media: photoFileId,
          caption,
          parse_mode: 'Markdown'
        },
        reply_markup: replyMarkup
      })
    });
    const data = await res.json();
    if (data.ok || (typeof data.description === 'string' && data.description.includes('message is not modified'))) {
      rememberBotMessage(chatId, messageId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function getScreenContent(route: string): { text: string; markup: any; isDocument?: boolean; isKhqrPhoto?: boolean } {
  if (route.startsWith('buy_')) {
    const productNames: Record<string, { name: string; price: string }> = {
      'ios-1device': { name: 'Lifetime (1 Device Only) - NextDNS VIP [PROMO 50%]', price: '$5.00 (20,000៛) 🔥 (តម្លៃដើម $10.00)' },
      'ios-vip': { name: 'CONFIG IPHONE VIP (Smooth + Low Ping) [PROMO 50%]', price: '$2.50 (10,000៛) 🔥 (តម្លៃដើម $5.00)' }
    };
    const modKey = route.replace('buy_', '');
    const product = productNames[modKey];
    if (!product) {
      return { text: SHOP_TEXT, markup: SHOP_MARKUP };
    }

    return {
      text: `🛒 *វិក្កយបត្របញ្ជាទិញ (INVOICE)*
━━━━━━━━━━━━━━━
📦 កញ្ចប់: *${product.name}*
💵 តម្លៃត្រូវទូទាត់: *${product.price}*

🏦 *ព័ត៌មានទូទាត់ BENZTO2 KHQR៖*
• ធនាគារ: *ACLEDA Bank* (CHHEAN SITRA)
• លេខទូរស័ព្ទ: \`012 *** 220\`

📸 *ជំហានបន្ទាប់៖*
ស្កេន KHQR ខាងលើ រួចផ្ញើរូបភាព Slip ចូល Bot នេះផ្ទាល់ ឬផ្ញើជូន @paypalsetup ដើម្បីទទួល File \`.mobileconfig\` ភ្លាមៗ!`,
      markup: {
        inline_keyboard: [
          [
            { text: '📤 ផ្ញើ Slip ជូន Admin (@paypalsetup)', url: 'https://t.me/paypalsetup' }
          ],
          [
            { text: '💳 ព័ត៌មាន KHQR', callback_data: 'payment' },
            { text: '🛒 ត្រឡប់ទៅហាង', callback_data: 'shop' }
          ],
          [
            { text: '⬅️ ម៉ឺនុយដើម', callback_data: 'start' }
          ]
        ]
      },
      isKhqrPhoto: true
    };
  }

  switch (route) {
    case 'vpn_info':
      return { text: VPN_INFO_TEXT, markup: VPN_INFO_MARKUP };
    case 'shop':
      return { text: SHOP_TEXT, markup: SHOP_MARKUP };
    case 'guide':
      return { text: GUIDE_TEXT, markup: GUIDE_MARKUP };
    case 'payment':
      return { text: PAYMENT_TEXT, markup: PAYMENT_MARKUP, isKhqrPhoto: true };
    case 'start':
    default:
      return { text: WELCOME_CAPTION, markup: MAIN_MENU_MARKUP };
  }
}

async function startTelegramPolling() {
  const botToken = process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    await fetch(`https://api.telegram.org/bot${botToken}/setMyDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: `👑 BENZTO2 VIP — សេវាកម្ម VPN & iOS DNS ផ្តាច់មុខ\nទំនុកចិត្ត ១០០% • ដំឡើងផ្ទាល់លើ iOS Settings\n\n• 🛡️ Anti-Ban 100% — ការពារគណនីហ្គេមដោយសុវត្ថិភាពខ្ពស់\n• ⚡ Low Ping & Smooth — បន្ថយ Ping លេងហ្គេមរលូនគ្មានទាក់\n• 🔒 1 Device VIP (NextDNS) — Profile ផ្តាច់មុខប្រឆាំងការចែករំលែក\n• 💳 ACLEDA KHQR — បង់ប្រាក់រហ័ស ទទួល File ស្វ័យប្រវត្តិ\n\n📩 ជំនួយសេវាកម្ម 24/7: @paypalsetup\n👇 ចុចប៊ូតុង Start ខាងក្រោមដើម្បីចូលទិញ!`
      })
    });
    await fetch(`https://api.telegram.org/bot${botToken}/setMyShortDescription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        short_description: '👑 BENZTO2 VIP iOS Config (.mobileconfig) • Anti-Ban 100% & Low Ping • Admin: @paypalsetup'
      })
    });
    await fetch(`https://api.telegram.org/bot${botToken}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commands: [
          { command: 'start', description: 'ម៉ឺនុយដើម (Start Menu)' },
          { command: 'shop', description: 'ហាងទិញ File VIP' },
          { command: 'vpn', description: 'ព័ត៌មានអំពី VPN' },
          { command: 'guide', description: 'វិធីដំឡើង File' },
          { command: 'payment', description: 'វិធីបង់ប្រាក់ KHQR' },
          { command: 'myid', description: 'មើលលេខ Chat ID របស់អ្នក' }
        ]
      })
    });
  } catch (e) {}

  let lastUpdateId = 0;

  const pollLoop = async () => {
    while (true) {
      try {
        const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId}&timeout=20`;
        const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
        const data = await res.json();

        if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
          for (const update of data.result) {
            lastUpdateId = update.update_id + 1;

            if (update.callback_query) {
              const callbackQuery = update.callback_query;
              const chatId = callbackQuery.message?.chat?.id;
              const currentMsgId = callbackQuery.message?.message_id;
              const isPhotoMessage = Boolean(callbackQuery.message?.photo);
              const isDocumentMessage = Boolean(callbackQuery.message?.document);
              const dataQuery = callbackQuery.data || 'start';

              fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ callback_query_id: callbackQuery.id })
              }).catch(() => {});

              if (!chatId || !currentMsgId) continue;
              recordTelegramUser(callbackQuery.from, chatId);

              if (dataQuery === 'buy_ios-1device' || dataQuery === 'buy_ios-vip') {
                const catalog: Record<string, { modId: string; name: string; usd: number; khr: number }> = {
                  'ios-1device': { modId: 'mod-ios-1device', name: 'CONFIG IPHONE VIP (Lifetime - 1 Device) [PROMO 50%]', usd: 5.0, khr: 20000 },
                  'ios-vip': { modId: 'mod-ios-vip', name: 'CONFIG IPHONE VIP (Smooth + Low Ping) [PROMO 50%]', usd: 2.5, khr: 10000 }
                };
                const modKey = dataQuery.replace('buy_', '');
                const item = catalog[modKey];
                const fromUser = callbackQuery.from || {};
                const customerName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(' ') || 'Telegram Buyer';
                const customerTelegram = fromUser.username ? `@${fromUser.username}` : `ID:${fromUser.id || chatId}`;

                const newOrder: StoredOrder = {
                  id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                  modId: item.modId,
                  modName: item.name,
                  customerName,
                  customerTelegram,
                  customerChatId: chatId,
                  amountUSD: item.usd,
                  amountKHR: item.khr,
                  paymentMethod: 'KHQR',
                  status: 'pending',
                  createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                };
                botDataStore.orders.unshift(newOrder);
                saveDataStore(botDataStore);
              }

              const screen = getScreenContent(dataQuery);
              const { text, markup, isDocument, isKhqrPhoto } = screen;

              if (isDocument) {
                const sent = await sendConfigDocument(botToken, chatId, text, markup);
                const newMsgId = sent?.result?.message_id;
                if (!isDocumentMessage) await deleteTelegramMessage(botToken, chatId, currentMsgId);
                await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
              } else if (isKhqrPhoto) {
                let updatedMedia = false;
                if (isPhotoMessage && cachedKhqrFileId) {
                  updatedMedia = await editTelegramMessageMedia(botToken, chatId, currentMsgId, cachedKhqrFileId, text, markup);
                }
                if (updatedMedia) {
                  await cleanupPreviousBotMessages(botToken, chatId, currentMsgId);
                } else {
                  const sent = await sendTelegramPaymentPhoto(botToken, chatId, text, markup);
                  const newMsgId = sent?.result?.message_id;
                  if (!isDocumentMessage) await deleteTelegramMessage(botToken, chatId, currentMsgId);
                  await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
                }
              } else {
                let updatedInPlace = false;
                if (isPhotoMessage && cachedBannerFileId && (dataQuery === 'start' || dataQuery === 'shop' || dataQuery === 'vpn_info' || dataQuery === 'guide')) {
                  updatedInPlace = await editTelegramMessageMedia(botToken, chatId, currentMsgId, cachedBannerFileId, text, markup);
                }
                if (!updatedInPlace && isPhotoMessage) {
                  updatedInPlace = await editTelegramMessageCaption(botToken, chatId, currentMsgId, text, markup);
                } else if (!updatedInPlace && !isDocumentMessage && dataQuery !== 'start') {
                  updatedInPlace = await editTelegramMessageText(botToken, chatId, currentMsgId, text, markup);
                }

                if (updatedInPlace) {
                  await cleanupPreviousBotMessages(botToken, chatId, currentMsgId);
                } else {
                  const sent = await sendTelegramBannerPhoto(botToken, chatId, text, markup);
                  const newMsgId = sent?.result?.message_id;
                  if (!isDocumentMessage) await deleteTelegramMessage(botToken, chatId, currentMsgId);
                  await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
                }
              }
            }

          if (update.message) {
            recordTelegramUser(update.message.from, update.message.chat.id);
          }

          if (update.message && update.message.photo) {
            const chatId = update.message.chat.id;
            const photos = update.message.photo;
            const largestPhoto = photos[photos.length - 1];
            const receiptUrl = largestPhoto?.file_id ? `/api/telegram-file/${largestPhoto.file_id}` : undefined;
            const fromUser = update.message.from || {};
            const customerName = [fromUser.first_name, fromUser.last_name].filter(Boolean).join(' ') || 'Telegram Buyer';
            const customerTelegram = fromUser.username ? `@${fromUser.username}` : `ID:${fromUser.id || chatId}`;

            let targetOrder = botDataStore.orders.find(
              (o) => String(o.customerChatId) === String(chatId) && o.status === 'pending'
            );

            if (targetOrder) {
              if (receiptUrl) targetOrder.receiptImage = receiptUrl;
            } else {
              targetOrder = {
                id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                modId: 'mod-ios-1device',
                modName: '📱 CONFIG IPHONE VIP (Lifetime - 1 Device)',
                customerName,
                customerTelegram,
                customerChatId: chatId,
                amountUSD: 10.0,
                amountKHR: 40000,
                paymentMethod: 'KHQR',
                status: 'pending',
                createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                receiptImage: receiptUrl
              };
              botDataStore.orders.unshift(targetOrder);
            }
            saveDataStore(botDataStore);

            const sent = await sendTelegramMessage(
              botToken,
              chatId,
              `📸 *បានទទួលវិក្កយបត្រ (Slip) រួចរាល់!*

🧾 លេខកូដបញ្ជាទិញ: \`${targetOrder.id}\`
🆔 Chat ID របស់អ្នក: \`${chatId}\`

⏳ Admin កំពុងផ្ទៀងផ្ទាត់ការទូទាត់ប្រាក់ សូមរង់ចាំបន្តិច File \`.mobileconfig\` នឹងផ្ញើជូនដោយស្វ័យប្រវត្តិភ្លាមៗបន្ទាប់ពីយល់ព្រម!`,
              MAIN_MENU_MARKUP
            );
            const newMsgId = sent?.result?.message_id;
            await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
          }

          if (update.message && update.message.document) {
            const doc = update.message.document;
            const fileName = doc.file_name || '';
            const chatId = update.message.chat.id;
            if (fileName.toLowerCase().endsWith('.mobileconfig')) {
              try {
                const getFileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${doc.file_id}`);
                const fileData = await getFileRes.json();
                if (fileData.ok && fileData.result?.file_path) {
                  const filePath = fileData.result.file_path;
                  const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
                  const dlRes = await fetch(downloadUrl);
                  const arrayBuf = await dlRes.arrayBuffer();
                  const savePath = path.join(__dirname, 'public/Benzto2_VIP_Smooth.mobileconfig');
                  fs.writeFileSync(savePath, Buffer.from(arrayBuf));

                  const sent = await sendTelegramMessage(
                    botToken,
                    chatId,
                    `✅ *បានអាប់ដេត File iOS Config ថ្មីដោយជោគជ័យ!*\n📁 \`${fileName}\` ត្រូវបានរក្សាទុកនិងរួចរាល់សម្រាប់ផ្ញើជូនអតិថិជន។\n\n💬 ជំនួយ៖ https://t.me/paypalsetup`,
                    MAIN_MENU_MARKUP
                  );
                  const newMsgId = sent?.result?.message_id;
                  await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
                }
              } catch (err) {
                const sent = await sendTelegramMessage(botToken, chatId, `❌ បរាជ័យក្នុងការអាប់ដេត File: ${err}`, MAIN_MENU_MARKUP);
                const newMsgId = sent?.result?.message_id;
                await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
              }
            }
          }

          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const rawText = update.message.text.trim();
            const text = rawText.toLowerCase();

            let sentResult: any = null;

            if (text.startsWith('/revoke')) {
              const parts = rawText.split(' ');
              const target = parts[1];
              if (!target) {
                sentResult = await sendTelegramMessage(botToken, chatId, `⚠️ *ការប្រើប្រាស់:* \`/revoke <profile_id_or_user_id>\``, MAIN_MENU_MARKUP);
              } else {
                const { success, resolvedId } = await revokeNextDnsProfile(target);
                const msg = success
                  ? `✅ *បាន Revoke Profile \`${resolvedId}\` ជោគជ័យ!* (Device នោះនឹងបាត់សិទ្ធិប្រើប្រាស់ DNS ភ្លាមៗ)`
                  : `❌ រកមិនឃើញ Profile ឬបរាជ័យក្នុងការ Revoke: \`${resolvedId}\``;
                sentResult = await sendTelegramMessage(botToken, chatId, msg, MAIN_MENU_MARKUP);
              }
            } else if (text.startsWith('/myid')) {
              const fromUser = update.message.from || {};
              const uname = fromUser.username ? `@${fromUser.username}` : 'N/A';
              sentResult = await sendTelegramMessage(
                botToken,
                chatId,
                `🆔 *ព័ត៌មាន Telegram របស់អ្នក:*\n• Chat ID: \`${chatId}\`\n• Username: ${uname}`,
                MAIN_MENU_MARKUP
              );
            } else if (text.startsWith('/start') || text.includes('ចាប់ផ្តើម')) {
              sentResult = await sendTelegramBannerPhoto(botToken, chatId, WELCOME_CAPTION, MAIN_MENU_MARKUP);
            } else if (text.startsWith('/vpn') || text.includes('vpn')) {
              sentResult = await sendTelegramBannerPhoto(botToken, chatId, VPN_INFO_TEXT, VPN_INFO_MARKUP);
            } else if (text.startsWith('/shop') || text.includes('ហាង')) {
              sentResult = await sendTelegramBannerPhoto(botToken, chatId, SHOP_TEXT, SHOP_MARKUP);
            } else if (text.startsWith('/guide') || text.includes('ដំឡើង')) {
              sentResult = await sendTelegramBannerPhoto(botToken, chatId, GUIDE_TEXT, GUIDE_MARKUP);
            } else if (text.startsWith('/payment') || text.includes('បង់ប្រាក់') || text.includes('khqr')) {
              sentResult = await sendTelegramPaymentPhoto(botToken, chatId, PAYMENT_TEXT, PAYMENT_MARKUP);
            } else {
              sentResult = await sendTelegramBannerPhoto(botToken, chatId, WELCOME_CAPTION, MAIN_MENU_MARKUP);
            }

            const newMsgId = sentResult?.result?.message_id;
            await cleanupPreviousBotMessages(botToken, chatId, newMsgId);
          }
        }
      }
      } catch (err) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }
  };

  pollLoop();
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/telegram-file/:fileId', async (req, res) => {
    try {
      const botToken = process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
      const { fileId } = req.params;
      const metaRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`);
      const meta = await metaRes.json();
      if (!meta.ok || !meta.result?.file_path) {
        return res.status(404).send('File not found');
      }
      const fileUrl = `https://api.telegram.org/file/bot${botToken}/${meta.result.file_path}`;
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) {
        return res.status(502).send('Failed to fetch Telegram file');
      }
      const contentType = fileRes.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      const buf = Buffer.from(await fileRes.arrayBuffer());
      res.send(buf);
    } catch {
      res.status(500).send('Error proxying Telegram file');
    }
  });

  app.get('/api/orders', (req, res) => {
    const knownUsersMap = new Map<string, string>();
    for (const [key, cid] of Object.entries(botDataStore.users)) {
      const cidStr = String(cid);
      const existingLabel = knownUsersMap.get(cidStr);
      if (!existingLabel || key.startsWith('@')) {
        knownUsersMap.set(cidStr, key.startsWith('@') ? `${key} (${cidStr})` : `User ${cidStr}`);
      }
    }
    const knownUsers = Array.from(knownUsersMap.entries()).map(([chatId, label]) => ({
      chatId,
      label
    }));
    res.json({
      orders: botDataStore.orders,
      profiles: botDataStore.profiles,
      knownUsers
    });
  });

  app.post('/api/orders/approve', async (req, res) => {
    try {
      const {
        orderId,
        modId,
        modName,
        customerName,
        customerTelegram,
        customerChatId,
        botToken: reqBotToken
      } = req.body;

      const botToken = reqBotToken || process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
      const existingOrder = botDataStore.orders.find((o) => o.id === orderId);

      const resolvedModId = modId || existingOrder?.modId || 'mod-ios-1device';
      const resolvedModName = modName || existingOrder?.modName || 'CONFIG IPHONE VIP';
      const resolvedUsername = customerTelegram || existingOrder?.customerTelegram || 'customer';

      let resolvedChatId: string | number | undefined =
        customerChatId ||
        existingOrder?.customerChatId ||
        botDataStore.users[String(resolvedUsername).toLowerCase()];

      if (!resolvedChatId && /^\d+$/.test(String(resolvedUsername))) {
        resolvedChatId = String(resolvedUsername);
      }

      const isNextDnsOneDevice =
        resolvedModId === 'mod-ios-1device' ||
        resolvedModId === 'ios-1device' ||
        resolvedModName.toLowerCase().includes('1 device') ||
        resolvedModName.toLowerCase().includes('nextdns');

      let profileId = '';
      let xmlContent = '';
      let fileName = 'Benzto2_VIP_Smooth.mobileconfig';

      if (isNextDnsOneDevice) {
        const userIdentifier = resolvedChatId || resolvedUsername.replace(/^@/, '') || orderId;
        const dnsRes = await createNextDnsProfile(userIdentifier, resolvedUsername);
        profileId = dnsRes.profileId;
        fileName = 'Benzto2_VIP_1Device.mobileconfig';
        xmlContent = generateMobileConfigXML(profileId, '📱 Benzto2 VIP (1 Device Only)');

        botDataStore.profiles.unshift({
          userId: String(userIdentifier),
          username: resolvedUsername,
          profileId,
          orderId,
          createdAt: new Date().toISOString()
        });
      } else {
        const templatePath = path.join(__dirname, 'public/Benzto2_VIP_Smooth.mobileconfig');
        if (fs.existsSync(templatePath)) {
          xmlContent = fs.readFileSync(templatePath, 'utf-8');
        } else {
          xmlContent = generateMobileConfigXML(`smooth_${orderId}`, resolvedModName);
        }
        if (resolvedModId === 'mod-1') fileName = 'Benzto2_VIP_VPN_Bypass.mobileconfig';
        else if (resolvedModId === 'mod-2') fileName = 'Aimlock_V1.1_VPN_Benzto2.mobileconfig';
        else if (resolvedModId === 'mod-3') fileName = 'Benzto2_Pro_VPN_Gaming.mobileconfig';
        else fileName = 'Benzto2_VIP_Smooth.mobileconfig';
      }

      let telegramSent = false;
      let telegramError: string | undefined;

      if (resolvedChatId) {
        const strippedModName = resolvedModName
          .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]+/u, '')
          .trim() || resolvedModName;
        const safeModName = escapeHtml(strippedModName);
        const safeFileName = escapeHtml(fileName);
        const safeProfileId = escapeHtml(profileId);

        const deliveryCaption = isNextDnsOneDevice
          ? `✅ <b>ការទូទាត់ត្រូវបានអនុម័ត! (APPROVED)</b>
━━━━━━━━━━━━━━━
📦 <b>កញ្ចប់:</b> ${safeModName}
🆔 <b>Profile ID:</b> <code>${safeProfileId}</code>
🔒 <b>សិទ្ធិប្រើប្រាស់:</b> 1 Device Only (Anti-Share)

🍏 <b>របៀបដំឡើងលើ iOS (iPhone / iPad):</b>
<b>១.</b> ចុច Download ឯកសារខាងលើ (<code>${safeFileName}</code>)
<b>២.</b> បើក <b>Settings</b> ➔ <b>Profile Downloaded</b> <i>(ឬ General ➔ VPN &amp; Device Management)</i>
<b>៣.</b> ចុច <b>Install</b> រួចវាយបញ្ចូល Passcode ទូរស័ព្ទ
<b>៤.</b> រួចរាល់! ប្រព័ន្ធ Anti-Ban &amp; Low Ping ដំណើរការភ្លាម ⚡

⚠️ <i>ហាមចែករំលែក File ទៅម៉ាស៊ីនផ្សេង ប្រព័ន្ធនឹងបិទ Profile ស្វ័យប្រវត្តិ។</i>
💬 <b>ជំនួយអតិថិជន:</b> <a href="https://t.me/paypalsetup">@paypalsetup</a>`
          : `✅ <b>ការទូទាត់ត្រូវបានអនុម័ត! (APPROVED)</b>
━━━━━━━━━━━━━━━
📦 <b>កញ្ចប់:</b> ${safeModName}
📄 <b>ឯកសារ:</b> <code>${safeFileName}</code>

🍏 <b>របៀបដំឡើងលើ iOS (iPhone / iPad):</b>
<b>១.</b> ចុច Download ឯកសារខាងលើ (<code>${safeFileName}</code>)
<b>២.</b> បើក <b>Settings</b> ➔ <b>Profile Downloaded</b> ➔ ចុច <b>Install</b>
<b>៣.</b> បើកហ្គេមលេងដោយរលូន ស្មូតល្អ ⚡

💬 <b>ជំនួយអតិថិជន:</b> <a href="https://t.me/paypalsetup">@paypalsetup</a>`;

        const tgResult = await sendDynamicConfigDocument(
          botToken,
          resolvedChatId,
          xmlContent,
          fileName,
          deliveryCaption,
          DELIVERY_MARKUP,
          'HTML'
        );
        telegramSent = Boolean(tgResult?.ok);
        if (telegramSent) {
          await cleanupPreviousBotMessages(botToken, resolvedChatId);
        } else {
          telegramError = tgResult?.description || 'Telegram API rejected sendDocument';
        }
      } else {
        telegramError = 'គ្មាន Telegram Chat ID របស់អតិថិជនទេ (សូមឱ្យអតិថិជនចុច /start ឬ /myid ក្នុង @Benzto2_VIP_Bot ជាមុនសិន)';
      }

      if (existingOrder) {
        existingOrder.status = 'completed';
        existingOrder.customerChatId = resolvedChatId || existingOrder.customerChatId;
        existingOrder.nextDnsProfileId = profileId || undefined;
        existingOrder.generatedFileName = fileName;
      }
      saveDataStore(botDataStore);

      res.json({
        ok: true,
        orderId,
        fileName,
        xmlContent,
        profileId: profileId || undefined,
        telegramSent,
        telegramChatId: resolvedChatId || null,
        telegramError
      });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error?.message || 'Failed to approve order' });
    }
  });

  app.post('/api/orders/reject', (req, res) => {
    const { orderId } = req.body;
    const existingOrder = botDataStore.orders.find((o) => o.id === orderId);
    if (existingOrder) {
      existingOrder.status = 'rejected';
      saveDataStore(botDataStore);
    }
    res.json({ ok: true });
  });

  app.post('/api/orders/resend', async (req, res) => {
    try {
      const { orderId, customerChatId, botToken: reqBotToken } = req.body;
      const botToken = reqBotToken || process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
      const existingOrder = botDataStore.orders.find((o) => o.id === orderId);
      const chatId = customerChatId || existingOrder?.customerChatId;
      if (!chatId) {
        return res.status(400).json({ ok: false, error: 'គ្មាន Telegram Chat ID សម្រាប់ផ្ញើឡើងវិញទេ។' });
      }
      const modId = existingOrder?.modId || 'mod-ios-1device';
      const modName = existingOrder?.modName || 'CONFIG IPHONE VIP';
      const profileId = existingOrder?.nextDnsProfileId || `vip_${String(chatId)}`;
      const isNextDnsOneDevice = modId === 'mod-ios-1device' || modName.toLowerCase().includes('1 device');
      const fileName = existingOrder?.generatedFileName || (isNextDnsOneDevice ? 'Benzto2_VIP_1Device.mobileconfig' : 'Benzto2_VIP_Smooth.mobileconfig');

      let xmlContent = '';
      if (isNextDnsOneDevice) {
        xmlContent = generateMobileConfigXML(profileId, '📱 Benzto2 VIP (1 Device Only)');
      } else {
        const templatePath = path.join(__dirname, 'public/Benzto2_VIP_Smooth.mobileconfig');
        xmlContent = fs.existsSync(templatePath)
          ? fs.readFileSync(templatePath, 'utf-8')
          : generateMobileConfigXML(`smooth_${orderId}`, modName);
      }

      const safeFileName = escapeHtml(fileName);
      const safeModName = escapeHtml(modName.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]+/u, '').trim() || modName);
      const caption = `🔁 <b>ផ្ញើ File ជូនម្តងទៀត (Re-delivery)</b>\n━━━━━━━━━━━━━━━\n📦 <b>កញ្ចប់:</b> ${safeModName}\n📄 <b>ឯកសារ:</b> <code>${safeFileName}</code>\n\n💬 ជំនួយ: <a href="https://t.me/paypalsetup">@paypalsetup</a>`;

      const tgResult = await sendDynamicConfigDocument(botToken, chatId, xmlContent, fileName, caption, DELIVERY_MARKUP, 'HTML');
      if (!tgResult?.ok) {
        return res.status(502).json({ ok: false, error: tgResult?.description || 'Telegram sendDocument failed' });
      }
      res.json({ ok: true, fileName, chatId });
    } catch (error: any) {
      res.status(500).json({ ok: false, error: error?.message || 'Resend failed' });
    }
  });

  app.post('/api/profiles/revoke', async (req, res) => {
    const { target } = req.body;
    if (!target) return res.status(400).json({ ok: false, error: 'Target required' });
    const result = await revokeNextDnsProfile(String(target));
    res.json({ ok: result.success, ...result });
  });

  app.post('/api/bot-test', async (req, res) => {
    try {
      const botToken = req.body?.botToken || process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const data = await tgRes.json();
      if (data.ok) {
        return res.json({ ok: true, bot: data.result });
      }
      res.status(400).json({ ok: false, error: data.description || 'Invalid bot token' });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || 'Connection failed' });
    }
  });

  app.post('/api/bot-config', async (req, res) => {
    try {
      const { botToken: reqToken, supportUsername, botName } = req.body || {};
      const botToken = reqToken || process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
      if (supportUsername || botName) {
        await fetch(`https://api.telegram.org/bot${botToken}/setMyShortDescription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            short_description: `${botName || '👑 BENZTO2 VIP'} • iOS .mobileconfig • Admin: ${supportUsername || '@paypalsetup'}`.slice(0, 120)
          })
        }).catch(() => {});
      }
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || 'Failed to update bot config' });
    }
  });

  app.post('/api/broadcast', async (req, res) => {
    try {
      const { message, targetChatId, botToken: reqToken } = req.body || {};
      if (!message || !String(message).trim()) {
        return res.status(400).json({ ok: false, error: 'សូមបញ្ចូលខ្លឹមសារសារជាមុនសិន' });
      }
      const botToken = reqToken || process.env.BOT_TOKEN || '9266268191:AAFWVqTir1X5p_yk1o08LevBYwDfPO_NUf8';
      const uniqueChatIds = targetChatId
        ? [String(targetChatId)]
        : Array.from(new Set(Object.values(botDataStore.users).map((id) => String(id))));

      let sentCount = 0;
      let failedCount = 0;
      for (const cid of uniqueChatIds) {
        const tgRes = await sendTelegramMessage(botToken, cid, String(message), MAIN_MENU_MARKUP);
        if (tgRes?.ok) sentCount++;
        else failedCount++;
      }

      res.json({
        ok: true,
        sentCount,
        failedCount,
        totalRecipients: uniqueChatIds.length
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, error: err?.message || 'Broadcast failed' });
    }
  });

  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, type, language } = req.body;
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [prompt],
        config: {
          systemInstruction: 'You are a professional Telegram bot copywriter for Benzto2 VPN & Mods.',
          temperature: 0.7,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed' });
    }
  });

  app.post('/api/ai/bot-reply', async (req, res) => {
    try {
      const { userMessage, gameContext } = req.body;
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [userMessage],
        config: {
          systemInstruction: `You are an automated support bot for Benzto2 VPN & Mods (@paypalsetup).`,
          temperature: 0.5,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      res.status(500).json({ reply: 'សូមអភ័យទោស សូមទាក់ទង Admin: @paypalsetup 🙏' });
    }
  });

  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT || 3000);
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Benzto2 VPN Bot running on http://localhost:${PORT}`);
    startTelegramPolling();
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
