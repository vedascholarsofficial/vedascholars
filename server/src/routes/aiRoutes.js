const express = require('express');
const { chatWithBot, getAllChats, getChatById, renameChat, deleteChat } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

module.exports = (limiters) => {
    const router = express.Router();

    router.post('/chat', protect, limiters.ai, chatWithBot); // Handles both generating new threads and appending to existing ids.
    router.get('/chats', protect, getAllChats);
    router.get('/chats/:id', protect, getChatById);
    router.put('/chats/:id/rename', protect, renameChat);
    router.delete('/chats/:id', protect, deleteChat);

    return router;
};
