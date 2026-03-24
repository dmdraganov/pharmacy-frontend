export const STORAGE_KEYS = {
  USER_PROFILE: 'pharmacy_user_profile',
  CART: 'pharmacy_cart',
  CART_SELECTION: 'pharmacy_cart_selection',
  FAVORITES: 'pharmacy_favorites',
  REGION: 'pharmacy_region',
  ORDERS: 'pharmacy_orders',
};

export const ROUTER_PATHS = {
  home: '/',
  catalog: '/catalog',
  cart: '/cart',
  favorites: '/favorites',
  delivery: '/delivery',
  about: '/about',
  contacts: '/contacts',
  product: '/product/:id',
  search: '/search',
  checkout: '/checkout',
  privacyPolicy: '/privacy-policy',
  login: '/login',
  register: '/register',
  account: {
    base: '/account',
    orders: '/account/orders',
    profile: '/account/profile',
  },
  admin: {
    base: '/admin',
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    orders: '/admin/orders',
    categories: '/admin/categories',
  },
};

export const BASE_URL = import.meta.env.VITE_BASE_URL || '/';
