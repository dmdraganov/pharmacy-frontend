# UI Guide

## General Style

- Минималистичный аптечный стиль
- Чёткая иерархия информации
- Спокойные цвета, высокий контраст текста

## Pagination

- Кнопочная пагинация
- Фиксированное количество карточек на страницу

## Accessibility

- Семантическая разметка

## Глобальная сетка

### Контейнер

```text
max-width: 1280px
margin: 0 auto
horizontal padding:
- desktop: 24px
- tablet: 16px
- mobile: 12px
```

Tailwind:

```tsx
mx-auto max-w-[1280px] px-6 md:px-4 sm:px-3
```

## Вертикальный ритм и отступы

Используется фиксированная шкала отступов.

| Назначение | Размер | Tailwind |
| - | | - |
| XS | 4px | p-1 / gap-1 |
| S | 8px | p-2 / gap-2 |
| M | 12px | p-3 / gap-3 |
| L | 16px | p-4 / gap-4 |
| XL | 24px | p-6 / gap-6 |
| XXL | 32px | p-8 / gap-8 |
| Section | 48px | mt-12 / mb-12 |

❗ Произвольные значения отступов не допускаются без обоснования.

## Типографика

### Иерархия текста

| Элемент | Размер | Вес | Tailwind |
| -- | - | | - |
| H1 | 32px | 600 | text-3xl font-semibold |
| H2 | 24px | 600 | text-xl font-semibold |
| H3 | 20px | 500 | text-lg font-medium |
| Body (default) | 16px | 400 | text-base |
| Secondary text | 14px | 400 | text-sm |
| Small / meta | 12px | 400 | text-xs |
| Price | 20–22px | 600 | text-xl font-semibold |

### Правила

- `text-base` используется для всего основного текста
- `text-sm` — вторичная информация
- `text-xs` — метаданные
- Основной текст **не уменьшается ниже 16px**

### Mobile

- Каталог сворачивается в иконку
- Поиск переносится на вторую строку
- Корзина и избранное всегда видимы

## Footer

```text
Padding-top: 32px
Padding-bottom: 32px
Margin-top: 48px
```

## Карточка товара

### Размеры

```text
Padding: 16px
Border-radius: 12px
Min-height: ~320px
```

### Название

- Ограничение: 2 строки
- Используется line-clamp

### Цена

- Основная цена — визуальный акцент
- Старая цена: text-sm, зачёркнутая, opacity ~0.6

## Ограничения

- Повторяющиеся элементы выносятся в UI-компоненты
- Отступы и размеры должны быть предсказуемыми и единообразными
