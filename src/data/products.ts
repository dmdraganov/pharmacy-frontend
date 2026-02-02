import type { Product } from '@/entities/product';
import { medicines } from './products/products-medicines';
import { supplements } from './products/products-supplements';
import { medicalDevices } from './products/products-medical-devices';
import { personalCare } from './products/products-personal-care';
import { motherAndBaby } from './products/products-mother-baby';
import { beauty } from './products/products-beauty';
import { optics } from './products/products-optics';

export const products: Product[] = [
  ...medicines,
  ...supplements,
  ...medicalDevices,
  ...personalCare,
  ...motherAndBaby,
  ...beauty,
  ...optics,
];