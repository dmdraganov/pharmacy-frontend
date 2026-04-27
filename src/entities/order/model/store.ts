import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order } from '@/entities/order';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { products } from '@/shared/api/mocks/products';

// Helper to find a product by its slug.
const findProduct = (slug: string) => {
  const product = products.find((p) => p.id === slug);
  if (!product) {
    throw new Error(`Mock product with id ${slug} not found!`);
  }
  return product;
};

const initialOrders: Order[] = [
  {
    id: 'ORDER-1026',
    userId: '2', // user@example.com
    date: '2024-07-22T10:00:00Z',
    status: 'new',
    items: [
      {
        product: findProduct('theraflu'),
        quantity: 1,
        price: 450,
      },
    ],
    total: 450,
    deliveryMethod: 'pickup',
    deliveryInfo: 'Аптека №1',
    deliveryAddress: null,
    paymentMethod: 'online',
  },
  {
    id: 'ORDER-1025',
    userId: '2', // user@example.com
    date: '2024-07-21T14:30:00Z',
    status: 'processing',
    items: [
      {
        product: findProduct('nurofen-200-mg'),
        quantity: 2,
        price: 260,
      },
      {
        product: findProduct('paracetamol-500-mg'),
        quantity: 1,
        price: 115,
      },
    ],
    total: 635,
    deliveryMethod: 'delivery',
    deliveryInfo: 'г. Москва, ул. Ленина, д. 1, кв. 5',
    deliveryAddress: {
      city: 'Москва',
      street: 'ул. Ленина',
      house: '1',
      apartment: '5',
    },
    paymentMethod: 'online',
  },
  {
    id: 'ORDER-1024',
    userId: '1', // admin@example.com
    date: '2024-06-15T10:05:00Z',
    status: 'completed',
    items: [
      {
        product: findProduct('loperamid'),
        quantity: 1,
        price: 95,
      },
    ],
    total: 95,
    deliveryMethod: 'pickup',
    deliveryInfo: 'Аптека №2',
    deliveryAddress: null,
    paymentMethod: 'on-receipt',
  },
];

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  cancelOrder: (orderId: string) => Promise<void>;
  confirmOrder: (orderId: string) => Promise<void>;
  shipOrder: (orderId: string) => Promise<void>;
  _seedInitialOrders: () => void;
}

const sleep = (delay = 500) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      updateOrder: (updatedOrder) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          ),
        })),
      cancelOrder: async (orderId: string) => {
        await sleep();
        const { orders, updateOrder } = get();
        const orderToUpdate = orders.find((o) => o.id === orderId);
        if (!orderToUpdate) throw new Error('Order not found');
        if (orderToUpdate.status !== 'new')
          throw new Error('Only new orders can be cancelled');
        updateOrder({ ...orderToUpdate, status: 'cancelled' });
      },
      confirmOrder: async (orderId: string) => {
        await sleep();
        const { orders, updateOrder } = get();
        const orderToUpdate = orders.find((o) => o.id === orderId);
        if (!orderToUpdate) throw new Error('Order not found');
        if (orderToUpdate.status !== 'new')
          throw new Error('Only new orders can be confirmed');
        updateOrder({ ...orderToUpdate, status: 'processing' });
      },
      shipOrder: async (orderId: string) => {
        await sleep();
        const { orders, updateOrder } = get();
        const orderToUpdate = orders.find((o) => o.id === orderId);
        if (!orderToUpdate) throw new Error('Order not found');
        if (orderToUpdate.status !== 'processing')
          throw new Error('Only orders in process can be shipped');
        updateOrder({ ...orderToUpdate, status: 'shipping' });
      },
      _seedInitialOrders: () => {
        const { orders } = get();
        if (orders.length === 0) {
          set({ orders: initialOrders });
        }
      },
    }),
    {
      name: STORAGE_KEYS.ORDERS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
