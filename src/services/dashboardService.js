import { apiClient } from './apiClient';

export const dashboardService = {
  getStats: async () => {
    const res = await apiClient.get('/dashboard/stats');
    return res.data;
  },

  getRecentActivity: async () => {
    const res = await apiClient.get('/dashboard/recent-activity');
    return res.data;
  },
};
