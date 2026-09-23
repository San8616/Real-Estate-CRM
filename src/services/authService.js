import { apiClient } from './apiClient';

export const authService = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('estateflow_crm_token', res.data.token);
      localStorage.setItem('estateflow_crm_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('estateflow_crm_token');
      localStorage.removeItem('estateflow_crm_user');
    }
  },
};
