import api from '../lib/api';

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserRole: async (userId: string, targetRole: string) => {
    const response = await api.put(`/admin/users/${userId}`, { role: targetRole });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }
};
