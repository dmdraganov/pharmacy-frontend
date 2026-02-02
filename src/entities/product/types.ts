export interface ProductCharacteristic {
  label: string;
  value: string;
}

interface ProductInfo {
  composition?: string[]; // состав / ингредиенты
  usage?: string[]; // как применять / дозировка / инструкции
  indications?: string[]; // для чего предназначен товар
  warnings?: string[]; // противопоказания, побочки, предостережения
  storage?: string[]; // условия хранения
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  sectionId: string;
  categoryId: string;
  price: number;
  oldPrice?: number;

  image: string;

  description?: string[]; // маркетинговое описание
  characteristics?: ProductCharacteristic[];
  isPopular?: boolean;
  isPrescription?: boolean; // только для лекарств
  info?: ProductInfo;
}
