import { apiClient } from './apiClient';

export const projectsService = {
  getProjects: async (params = {}) => {
    const res = await apiClient.get('/projects', params);
    return res.data;
  },

  getProjectById: async (id) => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data;
  },

  createProject: async (data) => {
    const res = await apiClient.post('/projects', data);
    return res.data;
  },

  updateProject: async (id, data) => {
    const res = await apiClient.put(`/projects/${id}`, data);
    return res.data;
  },

  deleteProject: async (id) => {
    const res = await apiClient.delete(`/projects/${id}`);
    return res.message;
  },
};
