import type { Order } from '@/entities/order';
import { products } from './products';

// Helper to find a product by its slug.
const findProduct = (slug: string) => {
  const product = products.find((p) => p.id === slug);
  if (!product) {
    throw new Error(`Mock product with id ${slug} not found!`);
  }
  return product;
};

export const orders: Order[] = [
  {
    id: 'ORDER-1025',
    date: '2024-07-21T14:30:00Z',
    status: 'shipping',
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
  },
  {
    id: 'ORDER-1024',
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
  },
  {
    id: 'ORDER-1023',
    date: '2024-05-30T18:45:00Z',
    status: 'completed',
    items: [
      {
        product: findProduct('smekta'),
        quantity: 3,
        price: 180,
      },
      {
        product: findProduct('citramon-p'),
        quantity: 2,
        price: 120,
      },
    ],
    total: 780,
  },
  {
    id: 'ORDER-1022',
    date: '2024-04-11T09:12:00Z',
    status: 'cancelled',
    items: [
      {
        product: findProduct('geviskon-limon'),
        quantity: 1,
        price: 380,
      },
    ],
    total: 380,
  },
];
