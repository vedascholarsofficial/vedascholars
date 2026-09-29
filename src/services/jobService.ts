import api from '../lib/api';

export const jobService = {
  getAllJobs: async () => {
    const response = await api.get(`/jobs`);
    return response.data;
  },

  getAdminJobs: async () => {
    const response = await api.get(`/jobs/admin/all`);
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  applyToJob: async (jobId: string) => {
    const response = await api.post(`/jobs/apply/${jobId}`);
    return response.data;
  },

  createJob: async (jobData: any) => {
    const response = await api.post(`/jobs/create`, jobData);
    return response.data;
  },

  getRecruiterJobs: async () => {
    const response = await api.get(`/jobs/recruiter`);
    return response.data;
  },

  approveJob: async (id: string) => {
    const response = await api.put(`/jobs/${id}/approve`);
    return response.data;
  },

  rejectJob: async (id: string) => {
    const response = await api.put(`/jobs/${id}/reject`);
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id: string, jobData: any) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  }
};
