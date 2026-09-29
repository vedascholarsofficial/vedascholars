const fs = require('fs');
const PDFParser = require("pdf2json");

const parseResume = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        
        pdfParser.on("pdfParser_dataError", errData => {
            console.error("Veda Scholars Engine: Native PDF parse error safely caught.", errData.parserError);
            resolve("[Engine Diagnostic Bypass] The uploaded PDF template uses proprietary or restricted formatting blocking native text extraction. Our systems will default to manual profiling.");
        });

        pdfParser.on("pdfParser_dataReady", pdfData => {
            try {
                const text = pdfParser.getRawTextContent() || "";
                const cleanedText = text.replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim();
                
                // If it successfully extracts, but yields nothing useful, default to bypass.
                if (cleanedText.length < 50) {
                     resolve("[Engine Diagnostic Bypass] The uploaded PDF template uses proprietary or restricted formatting blocking native text extraction.");
                } else {
                     resolve(cleanedText);
                }
            } catch (error) {
                resolve("[Engine Diagnostic Bypass] The uploaded PDF template uses proprietary or restricted formatting blocking native text extraction.");
            }
        });

        pdfParser.loadPDF(filePath);
    });
};

module.exports = { parseResume };
