export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    location,
    message
  } = req.body;

  // Get real user IP from headers
  const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    const realIP = req.headers['x-real-ip'];
    if (realIP) {
      return realIP;
    }
    
    const cfIP = req.headers['cf-connecting-ip'];
    if (cfIP) {
      return cfIP;
    }
    
    return req.socket?.remoteAddress || req.connection?.remoteAddress || 'Unknown';
  };

  const ip = getClientIP(req);

  const telegramMessage = `
📩 New Contact Form Submission

👤 Contact Details:
First Name: ${firstName || "N/A"}
Last Name: ${lastName || "N/A"}
Email: ${email || "N/A"}
Location: ${location || "N/A"}

💬 Message:
${message || "N/A"}

🌐 Technical Info:
IP Address: ${ip}
User Agent: ${req.headers['user-agent'] || 'N/A'}
Timestamp: ${new Date().toLocaleString()}
`;

  try {
    const telegramURL = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: telegramMessage
      })
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return res.status(500).json({ 
      error: "Failed to send message",
      success: false 
    });
  }
}
