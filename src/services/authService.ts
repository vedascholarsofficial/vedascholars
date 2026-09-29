import api from '../lib/api';

export const authService = {
  // Step 1: Register User
  registerUser: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Step 2: Verify OTP
  verifyOTP: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  // Step 3: Login User
  loginUser: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  }
};
