# Data

## Data Sources
- Статические массивы в коде
- Асинхронная загрузка не используется

## Core Entities

### Category

```ts
type Category = {
  id: string
  name: string
  subcategories: Subcategory[]
}
```

### Subcategory

```ts
type Subcategory = {
  id: string
  name: string
  categoryId: string
}
```

### Product

```ts
type Product = {
  id: string
  name: string
  brand: string
  categoryId: string
  subcategoryId: string
  price: number
  oldPrice?: number
  isPrescription: boolean
  image: string
}
```

## Relationships

- Category 1 → N Subcategory
- Subcategory 1 → N Product
- Product принадлежит одной подкатегории
- Каталог использует иерархию Category → Subcategory → Product

## Data Rules

- Данные неизменяемы
- Фильтрация и поиск выполняются на клиенте
- Цена со скидкой отображается при наличии oldPrice
- Рецептурность используется только как флаг
