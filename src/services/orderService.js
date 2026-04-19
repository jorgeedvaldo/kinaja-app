import api from './api';
import { ENDPOINTS } from '../constants/api';

/**
 * Order Service
 * Create, list, view, and cancel orders.
 */
const orderService = {
  /**
   * Place a new order.
   * @param {Object} data - { restaurant_id, delivery_fee, items: [{ product_id, quantity, notes? }] }
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post(ENDPOINTS.orders, data);
    return response.data?.data || response.data;
  },

  /**
   * List all orders for the authenticated user.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get(ENDPOINTS.orders);
    return response.data?.data || response.data || [];
  },

  /**
   * Get a single order with details.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(ENDPOINTS.orderDetail(id));
    return response.data?.data || response.data;
  },

  /**
   * Cancel an order.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  cancel: async (id) => {
    const response = await api.patch(ENDPOINTS.orderCancel(id));
    return response.data;
  },
};

export default orderService;
