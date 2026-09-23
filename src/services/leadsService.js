import { apiClient } from './apiClient';

export const leadsService = {
  getLeads: async (params = {}) => {
    const res = await apiClient.get('/leads', params);
    return res.data;
  },

  getLeadById: async (id) => {
    const res = await apiClient.get(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data) => {
    const res = await apiClient.post('/leads', data);
    return res.data;
  },

  updateLead: async (id, data) => {
    const res = await apiClient.put(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id) => {
    const res = await apiClient.delete(`/leads/${id}`);
    return res.message;
  },

  bulkDeleteLeads: async (ids) => {
    const res = await apiClient.post('/leads/bulk-delete', { ids });
    return res.message;
  },
};
