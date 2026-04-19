import api from './api';
import { ENDPOINTS } from '../constants/api';

/**
 * Category Service
 */
const categoryService = {
  /**
   * List all categories.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    const response = await api.get(ENDPOINTS.categories);
    return response.data?.data || response.data || [];
  },
};

export default categoryService;
