export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  oldPrice?: number;
  isPrescription: boolean;
  image: string;
}
