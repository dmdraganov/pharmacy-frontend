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
- `/checkout` – оформление заказа
- `/privacy-policy` – политика конфиденциальности
- `/admin/dashboard` – дашборд
- `/admin/products` – управление товарами
- `/admin/orders` – управление заказами
- `/admin/categories` – управление категориями

## Navigation Rules

- Пустая корзина → кнопка перехода на главную
- Пустое избранное → кнопка перехода на главную
- Каталог открывается как отдельная страница
- Навигация доступна из header
