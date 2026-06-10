# Data

## Data Sources

- Статические массивы в коде
- Асинхронная загрузка не используется

## Core Entities

### Section

```ts
type Section = {
  id: string;
  name: string;
  categories: Category[];
};
```

### Category

```ts
type Category = {
  id: string;
  name: string;
  sectionId: string;
};
```

### Product

```ts
interface ProductInfo {
  composition?: string[]; // состав / ингредиенты
  usage?: string[]; // как применять / дозировка / инструкции
  indications?: string[]; // для чего предназначен товар
  warnings?: string[]; // противопоказания, побочки, предостережения
  storage?: string[]; // условия хранения
}

type Product = {
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
};

type ProductCharacteristic = {
  label: string;
  value: string;
};
```

### User

```ts
type User = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};
```

### Order

```ts
type OrderStatus =
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'cancelled';

type OrderItem = {
  product: Product;
  quantity: number;
  price: number; // Price at the time of order
};

type Order = {
  id: string;
  date: string; // ISO 8601 format
  status: OrderStatus;
  items: OrderItem[];
  total: number;
};
```

## Relationships

- Section 1 → N Category
- Category 1 → N Product
- Product принадлежит одной категории
- Каталог использует иерархию Section → Category → Product

## Data Rules

- Данные неизменяемы
- Фильтрация и поиск выполняются на клиенте
- Цена со скидкой отображается при наличии oldPrice
- Рецептурность используется только как флаг
