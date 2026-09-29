import api from '../lib/api';

export const applicationService = {
  // Protected Endpoint: Apply to a job (Student only)
  applyToJob: async (jobId: string) => {
    const response = await api.post('/applications', { jobId });
    return response.data;
  },

  // Protected Endpoint: Retrieve applications for the logged-in user
  getUserApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  }
};
