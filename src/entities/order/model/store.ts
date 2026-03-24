import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order } from '@/entities/order';
import { STORAGE_KEYS } from '@/shared/config/constants';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
    }),
    {
      name: STORAGE_KEYS.ORDERS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
