import { ApiError, apiRequest } from './apiClient';
import { getProductById } from './productsApi';
import type { Order, OrderStatus } from '@/entities/order';

interface ApiOrderItem {
  product_id: string;
  quantity: number;
  price: number | string;
}

interface ApiOrder {
  id: string;
  user_id?: string;
  user?: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone?: string | null;
  } | null;
  status_id: number;
  delivery_method_id?: number;
  delivery_method_code?: 'pickup' | 'delivery';
  payment_method_id?: number;
  payment_method_code?: 'online' | 'on_receipt';
  pharmacy_id?: number | string | null;
  delivery_city?: string | null;
  delivery_street?: string | null;
  delivery_house?: string | null;
  delivery_apartment?: string | null;
  total_amount: number | string;
  created_at?: string | null;
  items?: ApiOrderItem[];
}

export interface CreateOrderPayload {
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'online' | 'on-receipt';
  pharmacyId?: string | null;
  deliveryAddress?: {
    city: string;
    street: string;
    house: string;
    apartment: string;
  } | null;
  items: Array<{ productId: string; quantity: number }>;
}

const STATUS_BY_ID: Record<number, OrderStatus> = {
  1: 'new',
  2: 'processing',
  3: 'shipping',
  4: 'delivered',
  5: 'completed',
  6: 'cancelled',
};

const STATUS_ID_BY_STATUS: Record<OrderStatus, number> = {
  new: 1,
  processing: 2,
  shipping: 3,
  delivered: 4,
  completed: 5,
  cancelled: 6,
};

const mapOrder = async (
  order: ApiOrder,
  productCache?: Map<string, Awaited<ReturnType<typeof getProductById>>>
): Promise<Order> => {
  const items = await Promise.all(
    (order.items || []).map(async (item) => {
      const product =
        productCache?.get(item.product_id) ||
        (await getProductById(item.product_id));
      return {
        product,
        quantity: item.quantity,
        price: Number(item.price),
      };
    })
  );

  const deliveryMethod = order.delivery_method_code || 'delivery';
  const deliveryAddress =
    deliveryMethod === 'delivery'
      ? {
          city: order.delivery_city || '',
          street: order.delivery_street || '',
          house: order.delivery_house || '',
          apartment: order.delivery_apartment || '',
        }
      : null;

  return {
    id: order.id,
    userId: order.user?.id || order.user_id || '',
    customer: order.user
      ? {
          id: order.user.id,
          firstName: order.user.first_name || '',
          lastName: order.user.last_name || '',
          phone: order.user.phone || '',
          email: order.user.email,
        }
      : null,
    date: order.created_at || new Date().toISOString(),
    status: STATUS_BY_ID[order.status_id] || 'new',
    items,
    total: Number(order.total_amount),
    deliveryMethod,
    deliveryInfo:
      deliveryMethod === 'pickup'
        ? `Аптека #${order.pharmacy_id || ''}`
        : [
            order.delivery_city,
            order.delivery_street,
            order.delivery_house && `д. ${order.delivery_house}`,
            order.delivery_apartment && `кв. ${order.delivery_apartment}`,
          ]
            .filter(Boolean)
            .join(', '),
    deliveryAddress,
    paymentMethod:
      order.payment_method_code === 'on_receipt' ? 'on-receipt' : 'online',
  };
};

const mapOrders = async (orders: ApiOrder[]): Promise<Order[]> => {
  const productIds = Array.from(
    new Set(
      orders.flatMap((order) =>
        (order.items || []).map((item) => item.product_id)
      )
    )
  );

  const products = await Promise.all(
    productIds.map(
      async (productId) => [productId, await getProductById(productId)] as const
    )
  );
  const productCache = new Map(products);

  return Promise.all(orders.map((order) => mapOrder(order, productCache)));
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await apiRequest<ApiOrder[]>('/orders', {
    params: { per_page: 100 },
  }).catch((error) => {
    if (error instanceof ApiError && error.status === 401) {
      return { data: [], message: 'Unauthenticated' };
    }

    throw error;
  });
  return mapOrders(response.data);
};

export const getAdminOrders = async (): Promise<Order[]> => {
  const response = await apiRequest<ApiOrder[]>('/admin/orders', {
    params: { per_page: 100 },
  });
  return mapOrders(response.data);
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const response = await apiRequest<ApiOrder>('/orders', {
    method: 'POST',
    body: {
      delivery_method_code: payload.deliveryMethod,
      payment_method_code:
        payload.paymentMethod === 'on-receipt' ? 'on_receipt' : 'online',
      pharmacy_id: payload.pharmacyId ? Number(payload.pharmacyId) : null,
      delivery_country: null,
      delivery_city: payload.deliveryAddress?.city || null,
      delivery_street: payload.deliveryAddress?.street || null,
      delivery_house: payload.deliveryAddress?.house || null,
      delivery_apartment: payload.deliveryAddress?.apartment || null,
      delivery_postal_code: null,
      items: payload.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    },
  });

  return mapOrder(response.data);
};

export const cancelOrder = async (orderId: string): Promise<Order> => {
  const response = await apiRequest<ApiOrder>(`/orders/${orderId}/cancel`, {
    method: 'POST',
  });
  return mapOrder(response.data);
};

export const updateAdminOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  const response = await apiRequest<ApiOrder>(
    `/admin/orders/${orderId}/status`,
    {
      method: 'PATCH',
      body: { status_id: STATUS_ID_BY_STATUS[status] },
    }
  );
  return mapOrder(response.data);
};
