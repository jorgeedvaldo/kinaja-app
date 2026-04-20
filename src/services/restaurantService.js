import api from './api';
import { ENDPOINTS } from '../constants/api';

/**
 * Restaurant Service
 * List restaurants, get details, and list products.
 */
const restaurantService = {
  /**
   * List all open restaurants.
   * @returns {Promise<Array>}
   */
  getAll: async (categoryId = null) => {
    const params = categoryId ? `?category_id=${categoryId}` : '';
    const response = await api.get(`${ENDPOINTS.restaurants}${params}`);
    return response.data?.data || response.data || [];
  },

  /**
   * Get a single restaurant with its details.
   * @param {number} id
   * @returns {Promise<Object>}
   */
  getById: async (id) => {
    const response = await api.get(ENDPOINTS.restaurantDetail(id));
    return response.data?.data || response.data;
  },

  /**
   * Get all products for a specific restaurant.
   * @param {number} id
   * @returns {Promise<Array>}
   */
  getProducts: async (id) => {
    const response = await api.get(ENDPOINTS.restaurantProducts(id));
    return response.data?.data || response.data || [];
  },
};

export default restaurantService;
