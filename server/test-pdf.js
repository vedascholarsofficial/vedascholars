const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');
const testFile = path.join(__dirname, 'test.pdf');

// Create a mock PDF file just to test library sanity
const pdfData = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 53 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello Veda Scholars!) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000222 00000 n \n0000000326 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n414\n%%EOF', 'utf-8');

fs.writeFileSync(testFile, pdfData);

async function run() {
    try {
        const dataBuffer = fs.readFileSync(testFile);
        const data = await pdf(dataBuffer);
        console.log("SUCCESS:", data.text);
    } catch (e) {
        console.error("PDF PARSE FAILED INTERNALLY:", e);
    }
}
run();
