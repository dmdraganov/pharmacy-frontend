# Routes

## Routing Type

Client-side SPA routing

## Routes List

- `/` — главная страница
- `/catalog/:category` — список товаров категории
- `/catalog/:category/:subcategory` — список товаров подкатегории
- `/cart` — корзина
- `/favorites` — избранное
- `/delivery` — доставка и оплата
- `/product/:id` — страница товара
- `/search/` – страница поиска

## Navigation Rules

- Пустая корзина → кнопка перехода на главную
- Пустое избранное → кнопка перехода на главную
- Каталог открывается отдельным экраном
- Навигация доступна из header
