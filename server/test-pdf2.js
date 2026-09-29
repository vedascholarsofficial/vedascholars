const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const testFile = path.join(__dirname, 'test2.pdf');

async function run() {
    try {
        console.log("Reading test2.pdf...");
        const dataBuffer = fs.readFileSync(testFile);
        console.log("Buffer size:", dataBuffer.length);
        console.log("Calling pdf(dataBuffer)...");
        const data = await pdf(dataBuffer).catch(err => {
            console.error("INSIDE CATCH:", err);
            throw err;
        });
        console.log("SUCCESS length:", data.text.length);
    } catch (e) {
        console.error("CAUGHT EXCEPTION:");
        console.error(e.message);
        console.error(e.stack);
    }
}
run();
