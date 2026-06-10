export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  catalogSection: '/catalog/:section',
  catalogCategory: '/catalog/:section/:category',
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
} as const;

export const buildLink = {
  catalogSection: (section: string) =>
    ROUTES.catalogSection.replace(':section', section),
  catalogCategory: (section: string, category: string) =>
    ROUTES.catalogCategory
      .replace(':section', section)
      .replace(':category', category),
  product: (id: string | number) => ROUTES.product.replace(':id', String(id)),
} as const;
