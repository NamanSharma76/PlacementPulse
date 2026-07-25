const https = require("https");
const path = require("path");
const { extractTextFromBuffer } = require("../utils/pdfParser.util");

const SAMPLE_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const fetchPdfBuffer = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download PDF: Status ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
};

async function runTest() {
  console.log("📥 Downloading sample PDF...");
  try {
    const pdfBuffer = await fetchPdfBuffer(SAMPLE_PDF_URL);
    console.log(`✅ PDF downloaded successfully (${pdfBuffer.length} bytes).`);
    
    console.log("⚙️ Parsing PDF buffer...");
    const extractedText = await extractTextFromBuffer(pdfBuffer);
    
    console.log("\n================ Extracted Text ================");
    console.log(extractedText.trim());
    console.log("================================================\n");
    
    if (extractedText.includes("Dummy PDF file")) {
      console.log("🎉 SUCCESS: PDF parsed correctly and expected text was found!");
      process.exit(0);
    } else {
      console.warn("⚠️ Text extracted, but did not match expected dummy text.");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
}

runTest();
