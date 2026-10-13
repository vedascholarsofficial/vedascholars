const { generateResponse } = require('../services/aiService');
const User = require('../models/User');
const Chat = require('../models/Chat');
const { calculateResumeScore } = require('../services/resumeScoringService');
const { isObjectId } = require('../utils/validation');

const MAX_MESSAGE_LENGTH = 4000;
// Only the most recent turns are sent to the model, which bounds token use
// per request no matter how long a conversation grows.
const MAX_HISTORY_MESSAGES = 20;

const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user.id })
            .select('_id title updatedAt')
            .sort({ updatedAt: -1 });
        res.status(200).json(chats);
    } catch (error) {
        console.error("getAllChats Error: ", error);
        res.status(500).json({ message: 'Server error retrieving historical chat threads.' });
    }
};

const getChatById = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Chat history block not found.' });
        const chat = await Chat.findOne({ _id: req.params.id, user: req.user.id });
        if (!chat) return res.status(404).json({ message: 'Chat history block not found.' });
        res.status(200).json(chat);
    } catch (error) {
        console.error("getChatById Error: ", error);
        res.status(500).json({ message: 'Server error parsing local chat sequence.' });
    }
};

const renameChat = async (req, res) => {
    try {
        const { title } = req.body;
        if (typeof title !== 'string' || !title.trim() || title.length > 100) {
            return res.status(400).json({ message: 'Please provide a title of up to 100 characters.' });
        }
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'Access denied mapping chat node.' });

        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title: title.trim() },
            { returnDocument: 'after', runValidators: true }
        );
        if (!chat) return res.status(404).json({ message: 'Access denied mapping chat node.' });

        res.status(200).json(chat);
    } catch (error) {
        console.error("renameChat Error: ", error);
        res.status(500).json({ message: 'Server error editing thread name.' });
    }
};

const deleteChat = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) return res.status(404).json({ message: 'No exact conversational tuple found to eradicate.' });
        const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!chat) return res.status(404).json({ message: 'No exact conversational tuple found to eradicate.' });

        res.status(200).json({ message: 'Memory permanently wiped.' });
    } catch (error) {
        console.error("deleteChat Error: ", error);
        res.status(500).json({ message: 'Server error destroying database entry.' });
    }
};

// Main Generative Engine
const chatWithBot = async (req, res) => {
    try {
        const { message, chatId } = req.body;
        
        if (typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ message: "No prompt block provided to VedaBot." });
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({ message: `Messages are limited to ${MAX_MESSAGE_LENGTH} characters.` });
        }
        if (chatId !== undefined && chatId !== null && !isObjectId(chatId)) {
            return res.status(404).json({ message: 'Historic mapping not found.' });
        }

        const user = await User.findById(req.user.id);
        const scoreData = calculateResumeScore(user?.resumeData || {});
        const context = {
            skills: user?.resumeData?.skills || [],
            experience: user?.resumeData?.experience || [],
            projects: user?.resumeData?.projects || [],
            score: scoreData.score
        };

        let chat;
        let historyArray = [];

        // Determine if thread exists or should be natively initialized
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, user: req.user.id });
            if (!chat) return res.status(404).json({ message: 'Historic mapping not found.' });
            historyArray = chat.messages
                .slice(-MAX_HISTORY_MESSAGES)
                .map(m => ({ role: m.role, text: m.text }));
        } else {
            // New conversation creates a dynamic title explicitly bounded to the physical string size limit.
            chat = new Chat({
                user: req.user.id,
                title: message.length > 30 ? message.substring(0, 30) + '...' : message,
                messages: []
            });
        }

        // Generate response via Gemini explicitly transmitting full history array natively
        const aiResponse = await generateResponse(message, historyArray, context);

        // Append explicit constraints to document array and sync with DB directly
        chat.messages.push({ role: 'user', text: message });
        chat.messages.push({ role: 'assistant', text: aiResponse });
        await chat.save();
        
        res.status(200).json({
            reply: aiResponse,
            chatId: chat._id
        });
    } catch (error) {
        console.error("chatWithBot Controller Error: ", error.name);
        const unavailable = error.code === 'AI_NOT_CONFIGURED';
        res.status(unavailable ? 503 : 500).json({
            message: unavailable ? 'VedaBot is not available right now.' : 'VedaBot could not answer just now. Please try again.',
        });
    }
};

module.exports = {
    getAllChats,
    getChatById,
    renameChat,
    deleteChat,
    chatWithBot
};
