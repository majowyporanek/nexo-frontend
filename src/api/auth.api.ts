import { apiClient } from '../lib/api';

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  
  registerAdmin: async (data: any) => {
    const response = await apiClient.post('/auth/register-admin', data);
    return response.data;
  },

  registerInvited: async (data: any) => {
    const response = await apiClient.post('/auth/register-invited', data);
    return response.data;
  }
};