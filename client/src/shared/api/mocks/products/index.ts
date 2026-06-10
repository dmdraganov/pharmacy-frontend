import type { Product } from '@/entities/product';
import { medicines } from './products-medicines';
import { supplements } from './products-supplements';
import { medicalDevices } from './products-medical-devices';
import { personalCare } from './products-personal-care';
import { motherAndBaby } from './products-mother-baby';
import { beauty } from './products-beauty';
import { optics } from './products-optics';

export const products: Product[] = [
  ...medicines,
  ...supplements,
  ...medicalDevices,
  ...personalCare,
  ...motherAndBaby,
  ...beauty,
  ...optics,
];
