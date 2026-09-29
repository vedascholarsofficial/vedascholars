require('dotenv').config();
const fs = require('fs');
async function run() {
    try {
        const req = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY);
        const res = await req.json();
        fs.writeFileSync('models.json', JSON.stringify(res, null, 2));
    } catch(e) {
        console.error(e);
    }
}
run();
