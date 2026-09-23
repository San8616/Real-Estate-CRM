import { apiClient } from './apiClient';

export const buildingsService = {
  getBuildings: async (params = {}) => {
    const res = await apiClient.get('/buildings', params);
    return res.data;
  },

  getBuildingById: async (id) => {
    const res = await apiClient.get(`/buildings/${id}`);
    return res.data;
  },

  createBuilding: async (data) => {
    const res = await apiClient.post('/buildings', data);
    return res.data;
  },

  updateBuilding: async (id, data) => {
    const res = await apiClient.put(`/buildings/${id}`, data);
    return res.data;
  },

  deleteBuilding: async (id) => {
    const res = await apiClient.delete(`/buildings/${id}`);
    return res.message;
  },
};
