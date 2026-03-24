import { Outlet, Navigate, createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import PageLayout from '@/app/layouts/PageLayout';
import AdminLayout from '@/app/layouts/AdminLayout';
import { AccountLayout } from '@/widgets/layout/AccountLayout';
import * as pages from '@/pages';
import { ProtectedRoute } from '@/features/auth';
import { BASE_URL } from '@/shared/config/constants';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PageLayout>
        <Outlet />
      </PageLayout>
    ),
    children: [
      {
        index: true,
        element: <pages.HomePage />,
      },
      {
        path: 'catalog',
        element: <pages.CatalogPage />,
      },
      {
        path: 'catalog/:section',
        element: <pages.ProductListPage />,
      },
      {
        path: 'catalog/:section/:category',
        element: <pages.ProductListPage />,
      },
      {
        path: 'cart',
        element: <pages.CartPage />,
      },
      {
        path: 'favorites',
        element: <pages.FavoritesPage />,
      },
      {
        path: 'delivery',
        element: <pages.DeliveryPage />,
      },
      {
        path: 'about',
        element: <pages.AboutPage />,
      },
      {
        path: 'contacts',
        element: <pages.ContactsPage />,
      },
      {
        path: 'product/:id',
        element: <pages.ProductPage />,
      },
      {
        path: 'search',
        element: <pages.SearchPage />,
      },
      {
        path: 'checkout',
        element: <pages.CheckoutPage />,
      },
      {
        path: 'privacy-policy',
        element: <pages.PrivacyPolicyPage />,
      },
      {
        path: 'login',
        element: <pages.LoginPage />,
      },
      {
        path: 'register',
        element: <pages.RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'account',
            element: <AccountLayout />,
            children: [
              {
                index: true,
                element: <Navigate to='orders' replace />,
              },
              {
                path: 'orders',
                element: <pages.AccountOrdersPage />,
              },
              {
                path: 'profile',
                element: <pages.AccountProfilePage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: '/admin',
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          {
            index: true,
            element: <Navigate to='dashboard' replace />,
          },
          {
            path: 'dashboard',
            element: <pages.AdminDashboardPage />,
          },
          {
            path: 'products',
            element: <pages.AdminProductsPage />,
          },
          {
            path: 'orders',
            element: <pages.AdminOrdersPage />,
          },
          {
            path: 'categories',
            element: <pages.AdminCategoriesPage />,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: BASE_URL,
});

export default router;
