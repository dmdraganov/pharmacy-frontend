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
