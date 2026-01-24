# Architecture

## Project Type
Frontend-only SPA

## Purpose
Учебный проект для колледжа с качественной, production-подобной архитектурой.  
Проект представляет интернет-аптеку без backend, API и серверной логики.

## Technology Stack
- React ^19.2.0
- TypeScript ~5.9.3
- react-router-dom ^7.12.0
- Vite + Rolldown 7.2.5
- Tailwind CSS ^4.1.18

## Architectural Style
Feature-based архитектура со строгими границами ответственности.

## High-level Structure
- `app/` — инициализация приложения, роутинг, провайдеры
- `features/` — бизнес-функциональность (catalog, cart, favorites, search)
- `entities/` — доменные сущности (product, category)
- `shared/` — переиспользуемые компоненты, утилиты, UI
- `data/` — статические массивы данных

## Layer Responsibilities
- app: сборка приложения, маршруты, глобальные провайдеры
- features: пользовательские сценарии и бизнес-логика
- entities: модели данных и логика сущностей
- shared: UI-kit, hooks, helpers без бизнес-логики
- data: источники данных (статические)

## Data Flow
Static data (data/)  
→ entity models  
→ feature logic  
→ UI components  

Данные неизменяемы, передаются вниз по дереву компонентов.

## State Management
- React Context API — глобальное состояние (корзина, избранное, регион)
- useState — локальные состояния компонентов
- localStorage — персист корзины и избранного

## Routing
- SPA routing через react-router-dom
- SEO-читаемые URL
- Lazy loading страниц
- Preload критических маршрутов

## Architectural Rules
- Feature не может напрямую импортировать другой feature
- Shared не зависит от features и entities
- Entities не зависят от UI
- Нет прямого доступа к localStorage вне shared-слоя
- Все данные типизированы