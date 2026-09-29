import api from '../lib/api';

export const userService = {
  getUserProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateUserProfile: async (profileData: any) => {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  getResumeData: async () => {
    const response = await api.get('/user/resume');
    return response.data;
  },

  saveResumeData: async (resumeData: any) => {
    const response = await api.post('/user/resume', { resumeData });
    return response.data;
  },

  getResumeScore: async () => {
    const response = await api.get('/user/resume/score');
    return response.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/user/resume/upload', formData);
    return response.data;
  }
};
