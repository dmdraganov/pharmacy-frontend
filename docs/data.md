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
type Product = {
  id: string;
  name: string;
  brand: string;
  sectionId: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  isPrescription: boolean;
  image: string;
  description: string[]; //массив абзацев
  composition: string[]; //массив абзацев
  indications: string[]; //массив абзацев
  contraindications?: string[]; //массив абзацев
  sideEffects?: string[]; //массив элементов списка
  dosage: string[]; //массив абзацев
  storage: string[]; //массив абзацев
  characteristics: ProductCharacteristic[];
};

type ProductCharacteristic = {
  label: string;
  value: string;
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
