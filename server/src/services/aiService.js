const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getConfig } = require('../config/env');

const generateResponse = async (prompt, historyArray = [], context) => {
    try {
        if (!getConfig().geminiEnabled) {
             const notConfigured = new Error('GEMINI_API_KEY is not configured.');
             notConfigured.code = 'AI_NOT_CONFIGURED';
             throw notConfigured;
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
        if (error.code !== 'AI_NOT_CONFIGURED') console.error("AI Service Generation Error: ", error.name);
        throw error;
    }
};

module.exports = { generateResponse };
