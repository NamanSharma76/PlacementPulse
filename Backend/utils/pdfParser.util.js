const { PDFParse } = require("pdf-parse");

/**
 * Safely extracts raw text from a PDF buffer.
 * @param {Buffer} pdfBuffer - The PDF file buffer.
 * @returns {Promise<string>} The extracted text.
 */
const extractTextFromBuffer = async (pdfBuffer) => {
  if (!pdfBuffer) {
    throw new Error("No PDF buffer provided.");
  }
  
  try {
    const parser = new PDFParse(new Uint8Array(pdfBuffer));
    const result = await parser.getText();
    return result.text || "";
  } catch (error) {
    console.error("❌ PDF text extraction failed:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

module.exports = {
  extractTextFromBuffer,
};
