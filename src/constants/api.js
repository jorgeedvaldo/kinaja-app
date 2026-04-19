/**
 * API Configuration and Endpoint Map
 */

// Change this to your backend URL
export const API_BASE_URL = 'https://kinaja.toolpdf.org/api';

export const ENDPOINTS = {
  // Auth
  register: '/register',
  login: '/login',
  logout: '/logout',
  user: '/user',

  // Restaurants
  restaurants: '/restaurants',
  restaurantDetail: (id) => `/restaurants/${id}`,
  restaurantProducts: (id) => `/restaurants/${id}/products`,

  // Categories
  categories: '/categories',

  // Products
  products: '/products',
  productDetail: (id) => `/products/${id}`,

  // Orders
  orders: '/orders',
  orderDetail: (id) => `/orders/${id}`,
  orderStatus: (id) => `/orders/${id}/status`,
  orderCancel: (id) => `/orders/${id}/cancel`,
};

export default { API_BASE_URL, ENDPOINTS };
