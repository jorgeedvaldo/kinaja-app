import api from './api';
import { ENDPOINTS } from '../constants/api';

/**
 * Authentication Service
 * Handles register, login, logout, and user profile retrieval.
 */
const authService = {
  /**
   * Register a new client account.
   * @param {Object} data - { name, phone, password, password_confirmation, email? }
   * @returns {Promise<{ user, token }>}
   */
  register: async (data) => {
    const response = await api.post(ENDPOINTS.register, {
      ...data,
      role: 'client',
    });
    return response.data;
  },

  /**
   * Login with phone and password.
   * @param {string} identifier (phone or email)
   * @param {string} password
   * @returns {Promise<{ user, token }>}
   */
  login: async (identifier, password) => {
    const response = await api.post(ENDPOINTS.login, { identifier, password });
    return response.data;
  },

  /**
   * Logout — revoke current token.
   * @returns {Promise<{ message }>}
   */
  logout: async () => {
    const response = await api.post(ENDPOINTS.logout);
    return response.data;
  },

  /**
   * Get authenticated user profile.
   * @returns {Promise<Object>}
   */
  getUser: async () => {
    const response = await api.get(ENDPOINTS.user);
    return response.data;
  },
};

export default authService;
