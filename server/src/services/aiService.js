const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateResponse = async (prompt, historyArray = [], context) => {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
             throw new Error("GEMINI_API_KEY is missing or invalid in the .env configurations.");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const systemPrompt = `
You are VedaBot, an expert career mentor.

User Profile:
Skills: ${context.skills && context.skills.length > 0 ? context.skills.join(", ") : 'None listed'}
Experience Count: ${context.experience ? context.experience.length : 0}
Projects Count: ${context.projects ? context.projects.length : 0}
Resume Score: ${context.score || 0}/100

Give personalized, actionable advice.
`;

        const model = genAI.getGenerativeModel({ 
             model: "gemini-flash-latest",
             systemInstruction: systemPrompt 
        });

        const geminiHistory = historyArray.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const chatSession = model.startChat({
             history: geminiHistory,
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Service Generation Error: ", error);
        throw new Error(error.message || "VedaBot is currently offline. Please check Node logs.");
    }
};

module.exports = { generateResponse };
