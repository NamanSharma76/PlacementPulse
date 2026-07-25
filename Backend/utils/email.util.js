const { BrevoClient } = require("@getbrevo/brevo");

const hasValidApiKey = process.env.BREVO_API_KEY && 
                       process.env.BREVO_API_KEY !== 'your_brevo_api_key_here' && 
                       process.env.BREVO_API_KEY.trim() !== '';

let client = null;
if (hasValidApiKey) {
  client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
  });
}

const sendEmail = async ({ to, subject, html, text }) => {
  // Always log the email details to the console for development debugging
  console.log(`\n📬 ========================================`);
  console.log(`📧 Outgoing Email to: ${to}`);
  console.log(`   Subject: ${subject}`);
  
  // Extract OTP if present in HTML
  const otpMatch = html ? html.match(/<h1[^>]*>([A-Za-z0-9\s]{4,8})<\/h1>/) : null;
  if (otpMatch) {
    console.log(`🔑 Extracted OTP: ${otpMatch[1].trim()}`);
  }
  
  // Extract activation/reset URLs if present
  const urlMatch = html ? html.match(/href="([^"]+)"/) : null;
  if (urlMatch) {
    console.log(`🔗 Extracted URL: ${urlMatch[1]}`);
  }
  console.log(`===========================================\n`);

  if (!hasValidApiKey) {
    console.warn("⚠️ BREVO_API_KEY is not configured or has placeholder value. Email not sent via Brevo (printed to console above instead).");
    return { messageId: "mocked-email-id-for-dev" };
  }

  try {
    const data = await client.transactionalEmails.sendTransacEmail({
      sender: { name: "Placement Cell", email: process.env.SENDER_EMAIL || "placements@college.edu" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    });
    console.log("📧 Email sent via Brevo:", data.messageId);
    return data;
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
};

module.exports = { sendEmail };
