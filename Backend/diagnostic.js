const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");

async function runDiagnostic() {
  console.log("🔍 STARTING BACKEND APPLICATION AUDIT & HEALTH DIAGNOSTIC\n");
  let passed = true;

  // 1. Environment & Config Audit
  console.log("--------------------------------------------------");
  console.log("📦 1. ENVIRONMENT & CONFIGURATION CHECK");
  console.log("--------------------------------------------------");
  const criticalVars = [
    { name: "PORT", critical: true },
    { name: "MONGO_URI", critical: true },
    { name: "JWT_SECRET", critical: true },
    { name: "JWT_REFRESH_SECRET", critical: true },
    { name: "CLOUDINARY_CLOUD_NAME", critical: true },
    { name: "CLOUDINARY_API_KEY", critical: true },
    { name: "CLOUDINARY_API_SECRET", critical: true },
    { name: "BREVO_API_KEY", critical: false },
    { name: "SENDER_EMAIL", critical: false },
    { name: "CLIENT_URL", critical: true },
    { name: "UNIVERSITY_DOMAIN", critical: false }
  ];

  criticalVars.forEach(v => {
    const val = process.env[v.name];
    if (!val) {
      if (v.critical) {
        console.error(`❌ [CRITICAL] Environment variable ${v.name} is missing!`);
        passed = false;
      } else {
        console.warn(`⚠️ [WARNING] Optional environment variable ${v.name} is missing.`);
      }
    } else if (val.includes("your_") || val.includes("_here")) {
      if (v.critical) {
        console.error(`❌ [CRITICAL] Environment variable ${v.name} still has a placeholder value: "${val}"`);
        passed = false;
      } else {
        console.warn(`⚠️ [INFO] Optional environment variable ${v.name} has placeholder: "${val}" (Application will run in fallback/mock mode)`);
      }
    } else {
      console.log(`✅ ${v.name} is set to a valid non-placeholder value.`);
    }
  });

  // 2. Database Connection Audit
  console.log("\n--------------------------------------------------");
  console.log("🗄️ 2. DATABASE CONNECTION (MONGODB) CHECK");
  console.log("--------------------------------------------------");
  if (!process.env.MONGO_URI) {
    console.error("❌ Skipped: MONGO_URI is missing.");
    passed = false;
  } else {
    try {
      console.log("Connecting to MongoDB cluster...");
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB Connection Successful!");
      await mongoose.disconnect();
      console.log("MongoDB disconnected cleanly.");
    } catch (err) {
      console.error("❌ MongoDB Connection Failed:", err.message);
      passed = false;
    }
  }

  // 3. Email Utility check
  console.log("\n--------------------------------------------------");
  console.log("📧 3. EMAIL & BREVO INTEGRATION CHECK");
  console.log("--------------------------------------------------");
  try {
    const { sendEmail } = require("./utils/email.util");
    console.log("Email utility loaded successfully.");
    console.log("Testing email utility mock/console logging fallback...");
    const testResult = await sendEmail({
      to: "test@example.com",
      subject: "Diagnostic Verification Test",
      html: "<h1>123456</h1><p>Test verification</p>"
    });
    if (testResult && testResult.messageId) {
      console.log("✅ Email utility behaves correctly under current environment configuration.");
    } else {
      console.error("❌ Email utility failed to return a messageId.");
      passed = false;
    }
  } catch (err) {
    console.error("❌ Failed to load or run email utility:", err);
    passed = false;
  }

  // 4. Server & Routes compilation check
  console.log("\n--------------------------------------------------");
  console.log("🚀 4. SERVER & CORE ROUTES COMPILE CHECK");
  console.log("--------------------------------------------------");
  try {
    console.log("Loading route handlers and controllers...");
    const authRoutes = require("./routes/auth.routes");
    const studentRoutes = require("./routes/student.routes");
    const jobRoutes = require("./routes/job.routes");
    const applicationRoutes = require("./routes/application.routes");
    const adminRoutes = require("./routes/admin.routes");
    console.log("✅ All route controllers compiled and resolved successfully!");
  } catch (err) {
    console.error("❌ Routing compilation failed. There is a syntax/module loading error:", err);
    passed = false;
  }

  console.log("\n==================================================");
  if (passed) {
    console.log("🎉 AUDIT RESULT: PASSED! Backend is fully operational.");
    process.exit(0);
  } else {
    console.error("🚨 AUDIT RESULT: FAILED! Please resolve the errors listed above.");
    process.exit(1);
  }
}

runDiagnostic();
