export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    location,
    message,
    userIP
  } = req.body;

  const ip = userIP || "Not captured";

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
