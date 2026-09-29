import api from '../lib/api';

export const universityService = {
    getDashboardData: async () => {
        const response = await api.get('/universities/dashboard');
        return response.data;
    },

    getAllUniversities: async () => {
        const response = await api.get('/universities');
        return response.data;
    },

    getUniversityById: async (id: string) => {
        const response = await api.get(`/universities/${id}`);
        return response.data;
    },

    matchUniversities: async () => {
        const response = await api.get('/universities/match');
        return response.data;
    },

    createUniversity: async (data: any) => {
        const response = await api.post('/universities', data);
        return response.data;
    },

    updateUniversity: async (id: string, data: any) => {
        const response = await api.put(`/universities/${id}`, data);
        return response.data;
    },

    deleteUniversity: async (id: string) => {
        const response = await api.delete(`/universities/${id}`);
        return response.data;
    }
};

