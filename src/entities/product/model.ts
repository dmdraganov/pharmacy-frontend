export interface ProductCharacteristic {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  sectionId: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  isPrescription: boolean;
  image: string;
  description: string[];
  composition: string[];
  indications: string[];
  contraindications?: string[];
  sideEffects?: string[];
  dosage: string[];
  storage: string[];
  characteristics: ProductCharacteristic[];
}
