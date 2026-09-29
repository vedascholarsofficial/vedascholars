import api from '../lib/api';

export const aiService = {
  getChats: async () => {
    const response = await api.get('/ai/chats');
    return response.data;
  },

  getChatById: async (id: string) => {
    const response = await api.get(`/ai/chats/${id}`);
    return response.data;
  },

  sendMessage: async (message: string, chatId?: string | null) => {
    const response = await api.post('/ai/chat', { message, chatId });
    return response.data;
  },

  renameChat: async (id: string, title: string) => {
    const response = await api.put(`/ai/chats/${id}/rename`, { title });
    return response.data;
  },

  deleteChat: async (id: string) => {
    const response = await api.delete(`/ai/chats/${id}`);
    return response.data;
  }
};
