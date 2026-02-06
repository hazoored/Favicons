export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { name, email, message } = req.body;

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const text = `
📩 New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

IP Address: ${ip}
`;

  const telegramUrl = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`;

  await fetch(telegramUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TG_CHAT_ID,
      text
    })
  });

  res.status(200).json({ success: true });
}
