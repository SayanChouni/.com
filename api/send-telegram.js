// api/send-telegram.js

const axios = require('axios');

// Vercel Environment Variables থেকে আপনার গোপন তথ্যগুলো আসবে
// এই কোডটি GitHub-এ থাকলেও আপনার টোকেন নিরাপদ থাকবে
const { BOT_TOKEN, CHAT_ID } = process.env;

module.exports = async (req, res) => {
    // শুধুমাত্র POST request গ্রহণ করা হবে
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const data = req.body;

        const name = data.name || 'N/A';
        const telegramUsername = data.telegram || 'N/A';
        const mobile = data.mobile || '(not provided)';
        const messageContent = data.message || 'N/A';

        // টেলিগ্রামের জন্য মেসেজ ফরম্যাট করা
        let message = `📬 *New Message from Portfolio*\n\n`;
        message += `*Name:* ${name}\n`;
        message += `*Telegram:* ${telegramUsername}\n`;
        message += `*Mobile:* ${mobile}\n`;
        message += `*Message:*\n${messageContent}`;

        const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // axios ব্যবহার করে মেসেজ পাঠানো
        await axios.post(telegramApiUrl, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
        });

        // সফল হলে success রেসপন্স পাঠানো
        res.status(200).json({ status: 'success', message: 'Message sent successfully!' });

    } catch (error) {
        console.error("Error sending message:", error);
        // কোনো সমস্যা হলে error রেসপন্স পাঠানো
        res.status(500).json({ status: 'error', message: 'Something went wrong.' });
    }
};