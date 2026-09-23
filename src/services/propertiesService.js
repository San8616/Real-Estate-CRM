import { apiClient } from './apiClient';

export const propertiesService = {
  getProperties: async (params = {}) => {
    const res = await apiClient.get('/properties', params);
    return res.data;
  },

  getPropertyById: async (id) => {
    const res = await apiClient.get(`/properties/${id}`);
    return res.data;
  },

  createProperty: async (data) => {
    const res = await apiClient.post('/properties', data);
    return res.data;
  },

  updateProperty: async (id, data) => {
    const res = await apiClient.put(`/properties/${id}`, data);
    return res.data;
  },

  deleteProperty: async (id) => {
    const res = await apiClient.delete(`/properties/${id}`);
    return res.message;
  },

  bulkDeleteProperties: async (ids) => {
    const res = await apiClient.post('/properties/bulk-delete', { ids });
    return res.message;
  },
};
