import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Telegram Bot Long Polling worker optimized for Direct File Sales (.mobileconfig / MediaFire)
async function startTelegramPolling() {
  const botToken = process.env.BOT_TOKEN || '9132595573:AAF1VKL08wofbySw0Z4W8BZkwPfUCgKePxU';
  
  // Clear any existing Webhook so getUpdates polling can receive messages
  try {
    const deleteRes = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    const deleteData = await deleteRes.json();
    console.log('🗑️ Telegram deleteWebhook result:', deleteData);
  } catch (e) {
    console.error('Failed to clear webhook:', e);
  }

  let lastUpdateId = 0;
  console.log('🤖 Starting Benzto2 File-Sale Telegram Bot Polling service...');

  setInterval(async () => {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId}&timeout=2`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && data.result && data.result.length > 0) {
        for (const update of data.result) {
          lastUpdateId = update.update_id + 1;

          // Handle inline keyboard button clicks (callback_query)
          if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const chatId = callbackQuery.message.chat.id;
            const dataQuery = callbackQuery.data;
            const username = callbackQuery.from?.username || 'User';

            console.log(`[Telegram Polling] Callback query from @${username}: ${dataQuery}`);

            let replyText = '';
            let replyMarkup: any = undefined;

            if (dataQuery === 'shop') {
              replyText = `🎮 *ហាង Benzto2 iOS Profiles & DNS File:*\n\n1️⃣ *Aimlock V1.1 iOS DNS Profile* (.mobileconfig)\n📦 ទំហំ: 13.4 MB | 💵 តម្លៃ: $5.00 (20,000៛)\n📥 [ចុចទីនេះដើម្បីទាញយក File](https://www.mediafire.com/file/aimlock_v1.1_benzto2.mobileconfig)\n\n2️⃣ *Drag Headshot VIP Profile* (.mobileconfig)\n📦 ទំហំ: 15.8 MB | 💵 តម្លៃ: $7.50 (30,000៛)\n📥 [ចុចទីនេះដើម្បីទាញយក File](https://www.mediafire.com/file/drag_headshot_benzto2.mobileconfig)\n\n💳 *វិធីទូទាត់ប្រាក់:*\nស្កេន KHQR ABA ឈ្មោះ **BENZTO2 GAMING SHOP** ហើយផ្ញើ Slip មកទីនេះ Admin នឹងផ្ញើ File ជូនភ្លាមៗ!`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "💳 វិធីបង់ប្រាក់ KHQR", callback_data: "payment" },
                    { text: "📖 វិធីតម្លើង Profile", callback_data: "guide" }
                  ],
                  [
                    { text: "⬅️ ត្រឡប់ទៅដើមវិញ", callback_data: "start" }
                  ]
                ]
              };
            } else if (dataQuery === 'guide') {
              replyText = `📖 *វិធីតម្លើង iOS DNS / Aimlock Profile:*\n\n1️⃣ ចុច Link MediaFire ដើម្បី Download File \`.mobileconfig\`\n2️⃣ ចូលទៅកាន់ **Settings** (ការកំណត់) -> **Profile Downloaded**\n3️⃣ ចុច **Install** និងបញ្ចូល Passcode របស់ទូរស័ព្ទ\n4️⃣ រួចរាល់! ចូលលេងហ្គេមដោយរលូន 🛡️`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 ទៅកាន់ហាង File", callback_data: "shop" },
                    { text: "⬅️ ត្រឡប់ទៅដើមវិញ", callback_data: "start" }
                  ]
                ]
              };
            } else if (dataQuery === 'payment') {
              replyText = `💳 *ព័ត៌មានទូទាត់ប្រាក់ qua KHQR:*\n\n🏦 ធនាគារ: ABA Bank\n👤 ឈ្មោះ: **BENZTO2 GAMING SHOP**\n🔢 លេខគណនី: \`000 123 456\`\n\n📸 បន្ទាប់ពីស្កេនបង់ប្រាក់រួច សូមផ្ញើ Slip មកទីនេះ Admin នឹងផ្ញើ File ជូនភ្លាមៗ!`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 ទៅកាន់ហាង File", callback_data: "shop" },
                    { text: "💬 ទាក់ទង Admin", url: "https://t.me/Benzto2_Support" }
                  ]
                ]
              };
            } else if (dataQuery === 'start') {
              replyText = `🚀 *សូមស្វាគមន៍មកកាន់ Benzto2 VIP File Store!* 🎮\n\nហាងលក់ iOS DNS Profiles និង Aimlock Files លេខ១ នៅកម្ពុជាដោយ Benzto2 ផ្ទាល់ (ទាញយក File ដំឡើងផ្ទាល់មិនបាច់ប្រើ Key)!\n\n✨ ជ្រើសរើសមុខងារខាងក្រោម៖`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 ហាងទំនិញ (Shop)", callback_data: "shop" },
                    { text: "📖 វិធីតម្លើង Profile", callback_data: "guide" }
                  ],
                  [
                    { text: "💳 វិធីទូទាត់ KHQR", callback_data: "payment" },
                    { text: "💬 ទំនាក់ទំនង Admin", url: "https://t.me/Benzto2_Support" }
                  ]
                ]
              };
            }

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: replyText,
                parse_mode: 'Markdown',
                reply_markup: replyMarkup
              })
            });

            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackQuery.id })
            });
          }

          // Handle incoming text messages
          if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text.trim();
            const username = update.message.from?.username || 'User';

            console.log(`[Telegram Polling] Message from @${username} (Chat ID: ${chatId}): ${text}`);

            let replyText = '';
            let replyMarkup: any = undefined;

            if (text.startsWith('/start') || text.includes('ចាប់ផ្តើម')) {
              replyText = `🚀 *សូមស្វាគមន៍មកកាន់ Benzto2 VIP File Store!* 🎮\n\nហាងលក់ iOS DNS Profiles និង Aimlock Files លេខ១ នៅកម្ពុជាដោយ Benzto2 ផ្ទាល់ (ទាញយក File ដំឡើងផ្ទាល់មិនបាច់ប្រើ Key)!\n\n✨ ជ្រើសរើសមុខងារខាងក្រោម៖`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 ហាងទំនិញ (Shop)", callback_data: "shop" },
                    { text: "📖 វិធីតម្លើង Profile", callback_data: "guide" }
                  ],
                  [
                    { text: "💳 វិធីទូទាត់ KHQR", callback_data: "payment" },
                    { text: "💬 ទំនាក់ទំនង Admin", url: "https://t.me/Benzto2_Support" }
                  ]
                ]
              };
            } else if (text.startsWith('/shop') || text.includes('ហាង')) {
              replyText = `🎮 *ហាង Benzto2 iOS Profiles & DNS File:*\n\n1️⃣ *Aimlock V1.1 iOS DNS Profile* (.mobileconfig)\n📦 ទំហំ: 13.4 MB | 💵 តម្លៃ: $5.00 (20,000៛)\n📥 [ចុចទីនេះដើម្បីទាញយក File](https://www.mediafire.com/file/aimlock_v1.1_benzto2.mobileconfig)\n\n2️⃣ *Drag Headshot VIP Profile* (.mobileconfig)\n📦 ទំហំ: 15.8 MB | 💵 តម្លៃ: $7.50 (30,000៛)\n📥 [ចុចទីនេះដើម្បីទាញយក File](https://www.mediafire.com/file/drag_headshot_benzto2.mobileconfig)\n\n💳 *វិធីទូទាត់ប្រាក់:*\nស្កេន KHQR ABA ឈ្មោះ **BENZTO2 GAMING SHOP** ហើយផ្ញើ Slip មកទីនេះ Admin នឹងផ្ញើ File ជូនភ្លាមៗ!`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "💳 វិធីបង់ប្រាក់ KHQR", callback_data: "payment" },
                    { text: "📖 វិធីតម្លើង Profile", callback_data: "guide" }
                  ],
                  [
                    { text: "⬅️ ត្រឡប់ទៅដើមវិញ", callback_data: "start" }
                  ]
                ]
              };
            } else if (text.startsWith('/guide') || text.includes('តម្លើង')) {
              replyText = `📖 *វិធីតម្លើង iOS DNS / Aimlock Profile:*\n\n1️⃣ ចុច Link MediaFire ដើម្បី Download File \`.mobileconfig\`\n2️⃣ ចូលទៅកាន់ **Settings** (ការកំណត់) -> **Profile Downloaded**\n3️⃣ ចុច **Install** និងបញ្ចូល Passcode របស់ទូរស័ព្ទ\n4️⃣ រួចរាល់! ចូលលេងហ្គេមដោយរលូន 🛡️`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 ទៅកាន់ហាង File", callback_data: "shop" },
                    { text: "⬅️ ត្រឡប់ទៅដើមវិញ", callback_data: "start" }
                  ]
                ]
              };
            } else {
              replyText = `🤖 សួស្តី @${username}! Benzto2 File Store បានទទួលសាររបស់អ្នកហើយ។ ចុចប៊ូតុងខាងក្រោមដើម្បីទាញយក Profile៖`;
              replyMarkup = {
                inline_keyboard: [
                  [
                    { text: "🛒 ហាងទំនិញ (Shop)", callback_data: "shop" }
                  ]
                ]
              };
            }

            const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: replyText,
                parse_mode: 'Markdown',
                reply_markup: replyMarkup
              })
            });
            const sendData = await sendRes.json();
            console.log('[Telegram Polling] Send message response:', sendData);
          }
        }
      }
    } catch (err) {
      // Silent catch for polling network hiccups
    }
  }, 2500);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Google Gen AI
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Endpoint for generating Mod Descriptions & Telegram Marketing Captions
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, type, language } = req.body;
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const model = 'gemini-2.5-flash';
      let systemInstruction = 'You are an expert gaming community manager and Telegram bot copywriter specializing in mobile and PC game mods (like Mobile Legends, PUBG Mobile, Free Fire, ROV, Genshin Impact). Write engaging, hype-filled, clear content with emojis.';
      
      if (type === 'description') {
        systemInstruction += ` Write a detailed, exciting Mod feature description in ${language === 'kh' ? 'ភាសាខ្មែរ' : 'English'}. Include features like ESP, Aimbot, Menu Mod, Anti-Ban status, and installation guide.`;
      } else if (type === 'broadcast') {
        systemInstruction += ` Write a high-converting Telegram broadcast message in ${language === 'kh' ? 'ភាសាខ្មែរ' : 'English'}.`;
      } else {
        systemInstruction += ` Write a helpful response in ${language === 'kh' ? 'ភាសាខ្មែរ' : 'English'}.`;
      }

      const response = await ai.models.generateContent({
        model,
        contents: [prompt],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI content' });
    }
  });

  // AI Chat Bot Auto-Reply simulator for Telegram
  app.post('/api/ai/bot-reply', async (req, res) => {
    try {
      const { userMessage, gameContext } = req.body;
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const model = 'gemini-2.5-flash';
      const systemInstruction = `You are an automated Telegram customer support bot for Benzto2 File Store. You assist gamers with buying iOS DNS profiles, aimlock configuration files (.mobileconfig), getting download links, checking installation instructions, and troubleshooting. Be polite, concise, use emojis, and reply in Khmer or English matching the user's language. Available games context: ${JSON.stringify(gameContext || [])}`;

      const response = await ai.models.generateContent({
        model,
        contents: [userMessage],
        config: {
          systemInstruction,
          temperature: 0.5,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error('Bot AI Reply Error:', error);
      res.status(500).json({ reply: 'សូមអភ័យទោស បញ្ហាប្រព័ន្ធបណ្តោះអាសន្ន។ សូមទំនាក់ទំនង Admin ផ្ទាល់ 🙏' });
    }
  });

  // Setup Vite middleware for frontend development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Benzto2 File Bot Hub running on http://localhost:${PORT}`);
    startTelegramPolling();
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
