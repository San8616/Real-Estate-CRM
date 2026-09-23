import { apiClient } from './apiClient';

export const bookingsService = {
  getBookings: async (params = {}) => {
    const res = await apiClient.get('/bookings', params);
    return res.data;
  },

  getBookingById: async (id) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },

  createBooking: async (data) => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },

  updateBooking: async (id, data) => {
    const res = await apiClient.put(`/bookings/${id}`, data);
    return res.data;
  },

  deleteBooking: async (id) => {
    const res = await apiClient.delete(`/bookings/${id}`);
    return res.message;
  },

  bulkDeleteBookings: async (ids) => {
    const res = await apiClient.post('/bookings/bulk-delete', { ids });
    return res.message;
  },
};
