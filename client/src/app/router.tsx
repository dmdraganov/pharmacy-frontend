import { Outlet, Navigate, createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import PageLayout from '@/app/layouts/PageLayout';
import AdminLayout from '@/app/layouts/AdminLayout';
import { AccountLayout } from '@/widgets/layout/AccountLayout';
import * as pages from '@/pages';
import { ProtectedRoute } from '@/features/auth';
import { BASE_URL } from '@/shared/config/constants';
import { ROUTES } from '@/shared/config/router';

export const routes: RouteObject[] = [
  {
    path: ROUTES.home,
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
        path: ROUTES.catalog,
        element: <pages.CatalogPage />,
      },
      {
        path: ROUTES.catalogSection,
        element: <pages.ProductListPage />,
      },
      {
        path: ROUTES.catalogCategory,
        element: <pages.ProductListPage />,
      },
      {
        path: ROUTES.cart,
        element: <pages.CartPage />,
      },
      {
        path: ROUTES.favorites,
        element: <pages.FavoritesPage />,
      },
      {
        path: ROUTES.delivery,
        element: <pages.DeliveryPage />,
      },
      {
        path: ROUTES.about,
        element: <pages.AboutPage />,
      },
      {
        path: ROUTES.contacts,
        element: <pages.ContactsPage />,
      },
      {
        path: ROUTES.product,
        element: <pages.ProductPage />,
      },
      {
        path: ROUTES.search,
        element: <pages.SearchPage />,
      },
      {
        path: ROUTES.checkout,
        element: <pages.CheckoutPage />,
      },
      {
        path: ROUTES.privacyPolicy,
        element: <pages.PrivacyPolicyPage />,
      },
      {
        path: ROUTES.login,
        element: <pages.LoginPage />,
      },
      {
        path: ROUTES.register,
        element: <pages.RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.account.base,
            element: <AccountLayout />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.account.orders} replace />,
              },
              {
                path: ROUTES.account.orders,
                element: <pages.AccountOrdersPage />,
              },
              {
                path: ROUTES.account.profile,
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
        path: ROUTES.admin.base,
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.admin.dashboard} replace />,
          },
          {
            path: ROUTES.admin.dashboard,
            element: <pages.AdminDashboardPage />,
          },
          {
            path: ROUTES.admin.products,
            element: <pages.AdminProductsPage />,
          },
          {
            path: ROUTES.admin.orders,
            element: <pages.AdminOrdersPage />,
          },
          {
            path: ROUTES.admin.categories,
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
