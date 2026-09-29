import api from '../lib/api';

export const analyticsService = {
    getAdminStats: async () => {
        const response = await api.get('/admin/analytics');
        return response.data;
    }
};
