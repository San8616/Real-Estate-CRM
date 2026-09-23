import { apiClient } from './apiClient';

export const unitsService = {
  getUnits: async (params = {}) => {
    const res = await apiClient.get('/units', params);
    return res;
  },

  getAvailableUnits: async () => {
    const res = await apiClient.get('/units/available');
    return res.data;
  },

  getUnitById: async (id) => {
    const res = await apiClient.get(`/units/${id}`);
    return res.data;
  },

  createUnit: async (data) => {
    const res = await apiClient.post('/units', data);
    return res.data;
  },

  updateUnit: async (id, data) => {
    const res = await apiClient.put(`/units/${id}`, data);
    return res.data;
  },

  deleteUnit: async (id) => {
    const res = await apiClient.delete(`/units/${id}`);
    return res.message;
  },
};
