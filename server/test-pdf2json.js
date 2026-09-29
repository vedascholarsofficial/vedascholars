const fs = require('fs');
const PDFParser = require("pdf2json");
const path = require('path');

const testFile = path.join(__dirname, 'test2.pdf');

const parseResumeAsync = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1); // 1 = raw text content
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const raw = pdfParser.getRawTextContent();
            try {
                 const cleanedText = raw.replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim();
                 resolve(cleanedText);
            } catch (e) {
                 resolve(raw);
            }
        });
        pdfParser.loadPDF(filePath);
    });
}

parseResumeAsync(testFile)
  .then(text => console.log("SUCCESS TEXT OUT:", text))
  .catch(err => console.error("FAILED OUT:", err));
