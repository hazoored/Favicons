export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const {
    firstName,
    lastName,
    email,
    location,
    message
  } = req.body;

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "Unknown";

  const telegramMessage = `
📩 New Contact Form Submission

First Name: ${firstName || "N/A"}
Last Name: ${lastName || "N/A"}
Email: ${email || "N/A"}
Location: ${location || "N/A"}

Message:
${message || "N/A"}

IP Address: ${ip}
`;

  const telegramURL = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(telegramURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text: telegramMessage
      })
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send Telegram message" });
  }
}
