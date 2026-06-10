### architecture.md

# Architecture

## Project Type

Frontend-only SPA без backend и API, полностью на статических данных.

Проект используется как учебный пример для колледжа, построен с **production-подобной архитектурой**.

## Purpose

Создать интернет-аптеку с имитацией реальной бизнес-логики: каталог товаров, корзина, избранное, поиск, страницы информации.

## Technology Stack

- **React** ^19.2.0
- **TypeScript** ~5.9.3
- **react-router-dom** ^7.12.0
- **Vite + Rolldown** 7.2.5
- **Tailwind CSS** ^4.1.18

## Architectural Style

**Feature-Sliced Design (FSD):**

- строгое разделение ответственности;
- переиспользуемые компоненты;
- чистый поток данных;
- правильное управление состоянием.

## High-level Structure

```
src/
├─ app/          # Инициализация приложения, роутинг, провайдеры
├─ pages/        # Страницы приложения (Home, Catalog, About)
├─ widgets/      # Композитные UI-блоки (Header, Sidebar)
├─ features/     # Фичи: бизнес-функционал (catalog, cart, favorites, search)
├─ entities/     # Доменные сущности (product, section)
├─ shared/       # UI-kit, hooks, utils, helpers
└─ data/         # Статические массивы данных
```

## Layer Responsibilities

| Layer        | Responsibility                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| **app**      | Инициализация приложения: роутинг, глобальные провайдеры, конфигурация контекстов                        |
| **pages**    | Полноценные страницы, собранные из **widgets** и **features**                                            |
| **widgets**  | Композитные UI-блоки, собранные из **features** и **entities**; переиспользуемые на нескольких страницах |
| **features** | Пользовательские сценарии, бизнес-логика, действия (например: добавление в корзину, поиск товаров)       |
| **entities** | Модели данных, типы, сущности приложения, внутренняя бизнес-логика                                       |
| **shared**   | UI-компоненты, утилиты, хуки, функции без бизнес-логики; не зависят от features и entities               |
| **data**     | Статические данные (JSON, массивы объектов), используются через entities и features                      |

## Data Flow

```
data/ → entities → features → widgets → pages → app
```

- Данные **неизменяемы**; state-modifying операции проходят через **features**.
- Взаимодействие между слоями только через публичные интерфейсы (actions, hooks, модели).

## State Management

| Type             | Purpose                    | Tools                                          |
| ---------------- | -------------------------- | ---------------------------------------------- |
| **Global state** | Корзина, избранное, регион | React Context API                              |
| **Local state**  | Состояние компонентов      | useState                                       |
| **Persistence**  | Данные между сессиями      | localStorage (доступ только через shared слой) |

## Routing

- SPA routing через **react-router-dom**
- SEO-дружественные URL
- Lazy loading страниц (`React.lazy`)
- Предзагрузка критических маршрутов

## Architectural Rules

1. Слои могут импортировать только «нижние» слои:
   - pages → widgets → features → entities → shared → data
2. **Feature → Feature** импорты запрещены. Взаимодействие только через публичные API.
3. **Shared** не зависит от **features** и **entities**.
4. **Entities** не зависят от UI и pages.
5. **localStorage** доступен только через shared utils/hooks.
6. Все данные строго типизированы с помощью TypeScript.
7. Каждая фича должна быть изолирована, чтобы её можно было переиспользовать на другой странице без изменений.

## Naming Conventions

- **Фичи:** `features/{featureName}/ui`, `features/{featureName}/model`
- **Сущности:** `entities/{entityName}`
- **Виджеты:** `widgets/{widgetName}`
- **Компоненты общего назначения:** `shared/ui`, `shared/hooks`, `shared/lib`
- **Данные:** `data/{dataset}.ts`

## Summary

Проект построен по **FSD**, обеспечивая:

- Чистую архитектуру с разделением ответственности;
- Изоляцию фич и переиспользуемость компонентов;
- Строгий поток данных и управление состоянием;
- Легкость масштабирования и тестирования.

---

### constraints.md

# Constraints

## Technical Constraints

- Backend отсутствует
- API отсутствует
- База данных отсутствует
- GraphQL, REST, RPC запрещены
- State managers (Redux, Zustand и т.д.) запрещены
- UI-библиотеки (MUI, Ant, Chakra и т.д.) запрещены

### Typescript

- Использование interface приоритетнее, чем type
- Не использовать React.FC для типизации компонентов

### React

- Компоненты - стрелочные функции
- По возможности использовать export default

## Functional Constraints

- Нельзя оформлять реальные заказы
- Нет онлайн-оплаты
- Нет реальной доставки
- Нет авторизации и аккаунтов
- Пользователь всегда гость
- Регион не влияет на цены и наличие

## Architectural Constraints

- Только Feature-based архитектура
- Строгие границы между слоями
- Один источник правды для данных
- Отсутствие дублирования логики

## Non-functional Constraints

- Производительность имеет приоритет
- Lazy load страниц обязателен
- SEO ограничен возможностями SPA
- Поддержка базовой доступности (a11y)

---

### data.md

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

---

### routes.md

# Routes

## Routing Type

Client-side SPA routing

## Routes List

- `/` — главная страница
- `/catalog` — страница выбора разделов
- `/catalog/:section` — список товаров раздела
- `/catalog/:section/:category` — список товаров категории
- `/cart` — корзина
- `/favorites` — избранное
- `/delivery` — доставка и оплата
- `/about` — страница "О нас"
- `/contacts` — страница "Контакты"
- `/product/:id` — страница товара
- `/search` – страница поиска
- `/account` – личный кабинет

## Navigation Rules

- Пустая корзина → кнопка перехода на главную
- Пустое избранное → кнопка перехода на главную
- Каталог открывается как отдельная страница
- Навигация доступна из header

---

### ui-guide.md

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

---

### README.md

# Интернет-аптека (Frontend)

Учебный проект интернет-аптеки, реализованный на React.  
Проект выполнен для колледжа, но с ориентацией на аккуратную, понятную и масштабируемую структуру, приближенную к реальным продуктам.

## Описание проекта

Приложение представляет собой клиентскую часть интернет-аптеки с каталогом товаров, корзиной и избранным.  
Все данные хранятся локально в коде и не загружаются с сервера.

Проект не предназначен для реального оформления заказов и оплаты — это демонстрационное приложение.

## Основные возможности

- Просмотр популярных товаров, акций и скидок на главной странице
- Страница каталога для выбора категорий и подкатегорий
- Страница товаров с фильтрацией, поиском и пагинацией
- Карточки товаров с ценой, скидкой и пометкой рецептурности
- Добавление товаров в корзину и избранное
- Сохранение корзины и избранного между перезагрузками
- Выбор региона (как UI-элемент)
- Страницы корзины, избранного и доставки
- Личный кабинет для просмотра истории заказов

## Ограничения проекта

- Пользователь всегда является гостем
- Авторизация отсутствует; личный кабинет реализован с использованием статических mock-данных
- Оформление реальных заказов не реализовано
- Онлайн-оплата и доставка отсутствуют
- Приложение работает только в рамках РФ (логически)

## Пользовательский интерфейс

- Header с логотипом, каталогом, поиском, корзиной и избранным
- Footer с контактной и информационной информацией
- Адаптивный интерфейс для desktop и mobile
- Понятные пустые состояния (корзина, избранное)

## Цель проекта

- Отработка навыков разработки SPA на React
- Практика работы с архитектурой Feature-based
- Создание структурированного и поддерживаемого фронтенд-проекта
- Демонстрация навыков проектирования UI и UX

## Статус

Проект является учебным и может быть расширен или доработан в будущем (например, добавлением backend).
