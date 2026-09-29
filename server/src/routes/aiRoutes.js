const express = require('express');
const router = express.Router();
const { chatWithBot, getAllChats, getChatById, renameChat, deleteChat } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/chat', protect, chatWithBot); // Handles both generating new threads and appending to existing ids.
router.get('/chats', protect, getAllChats);
router.get('/chats/:id', protect, getChatById);
router.put('/chats/:id/rename', protect, renameChat);
router.delete('/chats/:id', protect, deleteChat);

module.exports = router;
